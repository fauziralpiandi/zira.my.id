import { neon as database } from '@neondatabase/serverless';

/**
 * Error messages and status codes for API responses.
 * Maps internal keys to user-friendly messages and HTTP status codes.
 * Used by AppError to keep responses consistent and safe.
 */
const LOGGING = {
  'Database not configured': {
    message: 'Service unavailable, database not configured',
    status: 503,
  },
  'Invalid Content-Type': {
    message: 'Content-Type must be application/json',
    status: 415,
  },
  'Method not allowed': {
    message: 'HTTP method not supported',
    status: 405,
  },
  'Invalid slug': {
    message: 'Valid slug required (non-empty string, max 255 characters)',
    status: 400,
  },
  'Failed to fetch count': {
    message: 'Unable to retrieve count',
    status: 500,
  },
  'Failed to update count': {
    message: 'Unable to update count',
    status: 500,
  },
} as const;

type KnownErrorKey = keyof typeof LOGGING;

/**
 * Custom error for API failures, tied to LOGGING keys.
 * Ensures every error has a user-friendly message and correct status code.
 * @example
 * throw new AppError('Invalid slug'); // Triggers 400 with message
 */
class AppError extends Error {
  public status: number;
  public key: KnownErrorKey;

  constructor(key: KnownErrorKey) {
    super(key);
    this.key = key;
    this.status = LOGGING[key].status;
  }
}

// Database setup
const url: string | undefined = process.env.DATABASE_URL;
const sql = url ? database(url) : null;

/**
 * Builds a JSON response with proper headers.
 * Used for all API responses to keep format consistent.
 * @param data - The payload to send (e.g., { slug, count } or { error }).
 * @param status - HTTP status code (defaults to 200).
 * @returns A Response object ready for the client.
 */
const jsonResponse = (data: object, status: number = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

/**
 * Checks if a slug is valid for a blog post.
 * A valid slug is a non-empty string, max 255 chars, to prevent bad inputs.
 * @param s - The slug to validate.
 * @returns True if valid, false otherwise.
 */
const isValidSlug = (s: unknown): s is string =>
  typeof s === 'string' && s.trim() !== '' && s.length <= 255;

/**
 * Fetches the like count for a blog post by slug.
 * Talks to Neon DB to get the count, returns 0 if slug doesn't exist.
 * @param slug - The blog post identifier (e.g., "my-first-post").
 * @returns The number of likes.
 * @throws AppError if DB is down or query fails.
 */
const getCount = async (slug: string): Promise<number> => {
  if (!sql) throw new AppError('Database not configured');
  try {
    const result =
      await sql`SELECT count FROM likes WHERE slug = ${slug} LIMIT 1;`;
    return result.length && result[0].count !== undefined ? result[0].count : 0;
  } catch {
    throw new AppError('Failed to fetch count');
  }
};

/**
 * Handles GET requests to fetch like count for a blog post.
 * Returns the slug and its like count as JSON.
 * @param slug - The blog post identifier.
 * @returns JSON response like { slug: "my-post", count: 42 }.
 * @throws AppError if fetching count fails.
 */
const handleGet = async (slug: string): Promise<Response> => {
  const count = await getCount(slug);
  return jsonResponse({ slug, count });
};

/**
 * Handles POST requests to increment like count for a blog post.
 * Creates a new entry or updates existing count in DB.
 * @param slug - The blog post identifier.
 * @returns JSON response with updated { slug, count }.
 * @throws AppError if DB update fails.
 */
const handlePost = async (slug: string): Promise<Response> => {
  if (!sql) throw new AppError('Database not configured');
  try {
    const result = await sql`
      INSERT INTO likes (slug, count)
      VALUES (${slug}, 1)
      ON CONFLICT (slug)
      DO UPDATE SET count = likes.count + 1
      RETURNING count;
    `;
    const count = result[0]?.count ?? (await getCount(slug));
    return jsonResponse({ slug, count });
  } catch {
    throw new AppError('Failed to update count');
  }
};

/**
 * Handles HEAD requests to check if a blog post has likes.
 * Quick way to see if a slug exists without fetching data.
 * @param slug - The blog post identifier.
 * @returns Empty response with status 200 (exists) or 404 (not found).
 * @throws AppError if DB check fails.
 */
const handleHead = async (slug: string): Promise<Response> => {
  const count = await getCount(slug);
  return new Response(null, { status: count > 0 ? 200 : 404 });
};

type RequestBody = {
  slug: string;
};

/**
 * Main API handler for blog likes.
 * Routes GET, POST, HEAD requests to manage like counts for blog posts.
 * Validates inputs, handles errors, and logs issues for debugging.
 * @param req - Incoming HTTP request.
 * @returns JSON response with like data or error message.
 * @example
 * GET /?slug=my-post -> { slug: "my-post", count: 42 }
 * POST / { slug: "my-post" } -> { slug: "my-post", count: 43 }
 * HEAD /?slug=my-post -> 200 or 404
 */
const handler = async (req: Request): Promise<Response> => {
  try {
    if (!sql) throw new AppError('Database not configured');

    const { searchParams } = new URL(req.url);
    let slug: unknown;

    if (req.method === 'GET' || req.method === 'HEAD') {
      slug = searchParams.get('slug');
    } else if (req.method === 'POST') {
      if (req.headers.get('Content-Type') !== 'application/json') {
        throw new AppError('Invalid Content-Type');
      }
      const body: unknown = await req.json();
      if (typeof body !== 'object' || body === null || !('slug' in body)) {
        throw new AppError('Invalid slug');
      }
      slug = (body as RequestBody).slug;
    } else {
      throw new AppError('Method not allowed');
    }

    if (!isValidSlug(slug)) {
      throw new AppError('Invalid slug');
    }

    const trimmedSlug = slug.trim();

    if (req.method === 'GET') return handleGet(trimmedSlug);
    if (req.method === 'POST') return handlePost(trimmedSlug);
    if (req.method === 'HEAD') return handleHead(trimmedSlug);

    throw new AppError('Method not allowed');
  } catch (error: unknown) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error:', error);
      if (error instanceof Error) console.error(error.stack);
    } else {
      console.error(`[ERROR] ${new Date().toISOString()}: ${String(error)}`);
    }
    if (error instanceof AppError) {
      return jsonResponse({ error: LOGGING[error.key].message }, error.status);
    }
    return jsonResponse({ error: 'Something went wrong' }, 500);
  }
};

export { handler as GET, handler as POST, handler as HEAD };
