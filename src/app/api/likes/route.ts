import { neon as db } from '@neondatabase/serverless';

const databaseUrl: string | undefined = process.env.DATABASE_URL;
const sql = databaseUrl ? db(databaseUrl) : null;

/**
 * Crafts a JSON response with finesse.
 * @param {object} data - Payload to serialize.
 * @param {number} [status=200] - HTTP status code, defaults to 200.
 * @returns {Response} A polished Response object.
 */
const jsonResponse = (data: object, status: number = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

/**
 * Fetches the like count for a slug with precision.
 * @param {string} slug - The identifier to query.
 * @returns {Promise<number>} The count, or 0 if absent.
 * @throws {Error} If the database falters or isn't configured.
 */
const getCount = async (slug: string): Promise<number> => {
  if (!sql) {
    console.warn('Database URL not provided, cannot fetch count');
    throw new Error('Database not configured');
  }
  const result =
    await sql`SELECT count FROM likes WHERE slug = ${slug} LIMIT 1;`;
  return result.length && result[0].count !== undefined ? result[0].count : 0;
};

/**
 * Retrieves the count for a slug, served with grace.
 * @param {string} slug - The slug to inspect.
 * @returns {Promise<Response>} JSON response with slug and count.
 */
const handleGet = async (slug: string): Promise<Response> => {
  try {
    const count = await getCount(slug);
    return jsonResponse({ slug, count });
  } catch (error) {
    console.error('Error handling GET request:', error);
    return jsonResponse(
      { error: 'Failed to get count', details: (error as Error).message },
      500
    );
  }
};

/**
 * Increments or initializes a slug’s count, elegantly.
 * @param {string} slug - The slug to update.
 * @returns {Promise<Response>} JSON response with updated slug and count.
 */
const handlePost = async (slug: string): Promise<Response> => {
  try {
    if (!sql) {
      console.warn('Database URL not provided, cannot update count');
      throw new Error('Database not configured');
    }
    const result = await sql`
      INSERT INTO likes (slug, count)
      VALUES (${slug}, 1)
      ON CONFLICT (slug)
      DO UPDATE SET count = likes.count + 1
      RETURNING count;
    `;
    const count = result[0]?.count ?? (await getCount(slug));
    return jsonResponse({ slug, count });
  } catch (error) {
    console.error('Error handling POST request:', error);
    return jsonResponse(
      { error: 'Failed to update count', details: (error as Error).message },
      500
    );
  }
};

/**
 * Checks a slug’s existence with a subtle nod.
 * @param {string} slug - The slug to probe.
 * @returns {Promise<Response>} 200 if exists, 404 if not.
 */
const handleHead = async (slug: string): Promise<Response> => {
  try {
    const count = await getCount(slug);
    return new Response(null, { status: count > 0 ? 200 : 404 });
  } catch (error) {
    console.error('Error handling HEAD request:', error);
    return new Response(null, { status: 500 });
  }
};

/**
 * Orchestrates request handling with poise.
 * @param {Request} req - Incoming HTTP request.
 * @returns {Promise<Response>} A tailored response.
 */
const handler = async (req: Request): Promise<Response> => {
  try {
    if (!sql) {
      console.warn('Database URL not provided, API is non-functional');
      return jsonResponse(
        { error: 'Service unavailable, database not configured' },
        503
      );
    }

    const { searchParams } = new URL(req.url);
    let slug: string | null;

    if (req.method === 'GET' || req.method === 'HEAD') {
      slug = searchParams.get('slug');
    } else if (req.method === 'POST') {
      if (req.headers.get('Content-Type') !== 'application/json') {
        return jsonResponse(
          { error: 'Content-Type must be application/json' },
          415
        );
      }
      const body = await req.json();
      slug = body?.slug;
    } else {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    if (
      !slug ||
      typeof slug !== 'string' ||
      slug.trim() === '' ||
      slug.length > 255
    ) {
      return jsonResponse(
        {
          error:
            'Valid slug is required (non-empty string, max 255 characters)',
        },
        400
      );
    }

    const trimmedSlug = slug.trim();

    if (req.method === 'GET') return handleGet(trimmedSlug);
    if (req.method === 'POST') return handlePost(trimmedSlug);
    if (req.method === 'HEAD') return handleHead(trimmedSlug);

    return jsonResponse({ error: 'Method not allowed' }, 405);
  } catch (error) {
    console.error('Error handling request:', error);
    return jsonResponse(
      { error: 'Internal Server Error', details: (error as Error).message },
      500
    );
  }
};

export { handler as GET, handler as POST, handler as HEAD };
