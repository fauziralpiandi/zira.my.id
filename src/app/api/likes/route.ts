import { neon as database } from '@neondatabase/serverless';

const url: string | undefined = process.env.DATABASE_URL;
const sql = url ? database(url) : null;

const LOG_PREFIX = '[Likes API]';

const validateSlug = (slug: unknown): string => {
  if (typeof slug !== 'string') {
    throw new Error('Invalid slug');
  }
  const cleaned = slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (cleaned.length === 0 || cleaned.length > 255) {
    throw new Error('Invalid slug');
  }
  return cleaned;
};

const res = (data: object, status: number = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

type LikeRow = { count: number };

const handleHead = async (slug: string): Promise<Response> => {
  if (!sql) {
    console.error(`${LOG_PREFIX} No database connection available`);
    throw new Error('No database connection');
  }
  const result = await sql`SELECT 1 FROM likes WHERE slug = ${slug} LIMIT 1;`;
  return new Response(null, { status: result.length > 0 ? 200 : 404 });
};

const handleGet = async (slug: string): Promise<Response> => {
  if (!sql) {
    console.error(`${LOG_PREFIX} No database connection available`);
    throw new Error('No database connection');
  }
  const result =
    (await sql`SELECT count FROM likes WHERE slug = ${slug} LIMIT 1;`) as LikeRow[];
  const count =
    result.length && result[0].count !== undefined ? result[0].count : 0;
  return res({ slug, count });
};

const handlePost = async (slug: string): Promise<Response> => {
  if (!sql) {
    console.error(`${LOG_PREFIX} No database connection available`);
    throw new Error('No database connection');
  }
  const result = (await sql`
    INSERT INTO likes (slug, count)
    VALUES (${slug}, 1)
    ON CONFLICT (slug)
    DO UPDATE SET count = likes.count + 1
    RETURNING count;
  `) as LikeRow[];
  if (!result[0]?.count) {
    console.error(`${LOG_PREFIX} Failed to update count (${slug})`);
    throw new Error('Failed to update count');
  }
  return res({ slug, count: result[0].count });
};

type RequestBody = {
  slug: string;
};

const handler = async (req: Request): Promise<Response> => {
  try {
    if (!sql) {
      console.error(`${LOG_PREFIX} No database connection available`);
      return res({ error: 'No database connection' }, 503);
    }

    const { searchParams } = new URL(req.url);
    let slug: unknown;

    const allowedMethods = ['HEAD', 'GET', 'POST'];
    if (!allowedMethods.includes(req.method)) {
      console.error(`${LOG_PREFIX} Invalid method (${req.method})`);
      return res({ error: 'Method not allowed' }, 405);
    }

    if (req.method === 'GET' || req.method === 'HEAD') {
      slug = searchParams.get('slug');
    } else if (req.method === 'POST') {
      if (req.headers.get('Content-Type') !== 'application/json') {
        console.error(`${LOG_PREFIX} Invalid Content-Type`);
        return res({ error: 'Invalid Content-Type' }, 400);
      }
      const body: unknown = await req.json();
      if (
        typeof body !== 'object' ||
        body === null ||
        !('slug' in body) ||
        typeof (body as RequestBody).slug !== 'string'
      ) {
        console.error(`${LOG_PREFIX} Invalid request body`);
        return res({ error: 'Invalid request body' }, 400);
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
    return res(
      { error: message },
      error instanceof Error && message.includes('Invalid') ? 400 : 500
    );
  }
};

export { handler as HEAD, handler as GET, handler as POST };
