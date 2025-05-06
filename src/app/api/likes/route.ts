import { neon as database } from '@neondatabase/serverless';

const url: string | undefined = process.env.DATABASE_URL;
const sql = url ? database(url) : null;

const LOG_PREFIX = '[Likes]';

function validateSlug(slug: unknown): string {
  try {
    if (typeof slug !== 'string') {
      console.error(
        `${LOG_PREFIX} Error: Invalid slug format - received type '${typeof slug}'`,
      );
      throw new Error('Invalid slug format: must be a string');
    }

    const cleaned = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (cleaned.length === 0) {
      console.error(`${LOG_PREFIX} Error: Empty slug after sanitization`);
      throw new Error('Invalid slug: cannot be empty');
    }

    if (cleaned.length > 255) {
      console.error(
        `${LOG_PREFIX} Error: Slug exceeds maximum length (${cleaned.length} > 255)`,
      );
      throw new Error('Invalid slug: exceeds maximum length of 255 characters');
    }

    return cleaned;
  } catch (error) {
    if (error instanceof Error) {
      throw error; // Re-throw validation errors with clear messages
    }
    console.error(
      `${LOG_PREFIX} Error: Unexpected error during slug validation`,
    );
    throw new Error('Invalid slug: validation failed');
  }
}

function formatResponse(data: object, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

type LikeRow = { count: number };

async function handleHead(slug: string): Promise<Response> {
  if (!sql) {
    console.error(`${LOG_PREFIX} Error: Database connection unavailable`);
    throw new Error(
      'Database connection unavailable: Neon client not initialized',
    );
  }
  try {
    const result = await sql`SELECT 1 FROM likes WHERE slug = ${slug} LIMIT 1;`;
    return new Response(null, { status: result.length > 0 ? 200 : 404 });
  } catch (error) {
    console.error(
      `${LOG_PREFIX} Error: Failed to check existence for slug '${slug}'`,
      error,
    );
    throw new Error(`Failed to check existence for slug '${slug}'`);
  }
}

async function handleGet(slug: string): Promise<Response> {
  if (!sql) {
    console.error(`${LOG_PREFIX} Error: Database connection unavailable`);
    throw new Error(
      'Database connection unavailable: Neon client not initialized',
    );
  }
  try {
    const result =
      (await sql`SELECT count FROM likes WHERE slug = ${slug} LIMIT 1;`) as LikeRow[];
    const count =
      result.length && result[0].count !== undefined ? result[0].count : 0;
    return formatResponse({ slug, count });
  } catch (error) {
    console.error(
      `${LOG_PREFIX} Error: Failed to get like count for slug '${slug}'`,
      error,
    );
    throw new Error(`Failed to get like count for slug '${slug}'`);
  }
}

async function handlePost(slug: string): Promise<Response> {
  if (!sql) {
    console.error(`${LOG_PREFIX} Error: Database connection unavailable`);
    throw new Error(
      'Database connection unavailable: Neon client not initialized',
    );
  }
  try {
    const result = (await sql`
      INSERT INTO likes (slug, count)
      VALUES (${slug}, 1)
      ON CONFLICT (slug)
      DO UPDATE SET count = likes.count + 1
      RETURNING count;
    `) as LikeRow[];

    if (!result[0]?.count) {
      console.error(
        `${LOG_PREFIX} Error: Failed to update count for slug '${slug}'`,
      );
      throw new Error(`Failed to update like count for slug '${slug}'`);
    }

    return formatResponse({ slug, count: result[0].count });
  } catch (error) {
    console.error(
      `${LOG_PREFIX} Error: Failed to add like for slug '${slug}'`,
      error,
    );
    throw new Error(`Failed to add like for slug '${slug}'`);
  }
}

type RequestBody = {
  slug: string;
};

async function handler(req: Request): Promise<Response> {
  try {
    if (!sql) {
      console.error(`${LOG_PREFIX} Error: Database connection unavailable`);
      return formatResponse({ error: 'Database connection unavailable' }, 503);
    }

    const { searchParams } = new URL(req.url);
    let slug: unknown;

    const allowedMethods = ['HEAD', 'GET', 'POST'];
    if (!allowedMethods.includes(req.method)) {
      console.error(`${LOG_PREFIX} Error: Invalid method '${req.method}'`);
      return formatResponse({ error: 'Method not allowed' }, 405);
    }

    if (req.method === 'GET' || req.method === 'HEAD') {
      slug = searchParams.get('slug');
    } else if (req.method === 'POST') {
      if (req.headers.get('Content-Type') !== 'application/json') {
        console.error(`${LOG_PREFIX} Error: Invalid Content-Type header`);
        return formatResponse({ error: 'Invalid Content-Type' }, 400);
      }
      const body: unknown = await req.json();
      if (
        typeof body !== 'object' ||
        body === null ||
        !('slug' in body) ||
        typeof (body as RequestBody).slug !== 'string'
      ) {
        console.error(`${LOG_PREFIX} Error: Invalid request body structure`);
        return formatResponse({ error: 'Invalid request body' }, 400);
      }
      slug = (body as RequestBody).slug;
    }

    const validatedSlug = validateSlug(slug);

    const handlers: { [key: string]: (slug: string) => Promise<Response> } = {
      HEAD: handleHead,
      GET: handleGet,
      POST: handlePost,
    };
    return handlers[req.method](validatedSlug);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`${LOG_PREFIX} Error: ${message}`);
    return formatResponse(
      { error: message },
      error instanceof Error && message.includes('Invalid') ? 400 : 500,
    );
  }
}

export { handler as HEAD, handler as GET, handler as POST };
