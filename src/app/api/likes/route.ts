import { neon as database } from '@neondatabase/serverless';

const url: string | undefined = process.env.DATABASE_URL;
const sql = url ? database(url) : null;

const res = (data: object, status: number = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const validateSlug = (slug: unknown): string => {
  if (typeof slug !== 'string') {
    throw new Error('Invalid slug');
  }
  const cleaned = slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (
    cleaned.length === 0 ||
    cleaned.length > 255 ||
    !/^[a-z0-9_-]+$/.test(cleaned)
  ) {
    throw new Error('Invalid slug');
  }
  return cleaned;
};

type LikeRow = { count: number };

const getCount = async (slug: string): Promise<number> => {
  if (!sql) {
    console.error('[No database connection]');
    throw new Error('No database connection');
  }
  const result =
    (await sql`SELECT count FROM likes WHERE slug = ${slug} LIMIT 1;`) as LikeRow[];
  return result.length && result[0].count !== undefined ? result[0].count : 0;
};

const handlePost = async (slug: string): Promise<Response> => {
  if (!sql) {
    console.error('[No database connection]');
    throw new Error('No database connection');
  }
  const result = (await sql`
    INSERT INTO likes (slug, count)
    VALUES (${slug}, 1)
    ON CONFLICT (slug)
    DO UPDATE SET count = likes.count + 1
    RETURNING count;
  `) as LikeRow[];
  const count = result[0]?.count ?? (await getCount(slug));
  return res({ slug, count });
};

const handleGet = async (slug: string): Promise<Response> => {
  const count = await getCount(slug);
  return res({ slug, count });
};

const handleHead = async (slug: string): Promise<Response> => {
  const count = await getCount(slug);
  return new Response(null, { status: count > 0 ? 200 : 404 });
};

type RequestBody = {
  slug: string;
};

const handler = async (req: Request): Promise<Response> => {
  try {
    if (!sql) {
      console.error('[No database connection]');
      return res({ error: 'No database connection' }, 503);
    }

    const { searchParams } = new URL(req.url);
    let slug: unknown;

    if (req.method === 'GET' || req.method === 'HEAD') {
      slug = searchParams.get('slug');
    } else if (req.method === 'POST') {
      if (req.headers.get('Content-Type') !== 'application/json') {
        return res({ error: 'Invalid Content-Type' }, 400);
      }
      const body: unknown = await req.json();
      if (typeof body !== 'object' || body === null || !('slug' in body)) {
        return res({ error: 'Invalid request body' }, 400);
      }
      slug = (body as RequestBody).slug;
    } else {
      return res({ error: 'Method not allowed' }, 405);
    }

    const validatedSlug = validateSlug(slug);

    if (req.method === 'GET') return handleGet(validatedSlug);
    if (req.method === 'POST') return handlePost(validatedSlug);
    if (req.method === 'HEAD') return handleHead(validatedSlug);

    return res({ error: 'Method not allowed' }, 405);
  } catch (error) {
    console.error('[Unknown API error]:', error);
    return res({ error: 'Unknown error' }, 500);
  }
};

export { handler as GET, handler as POST, handler as HEAD };
