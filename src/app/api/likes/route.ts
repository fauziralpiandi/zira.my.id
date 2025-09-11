import { neon as database } from '@neondatabase/serverless';

const sql = process.env.DATABASE_URL
  ? database(process.env.DATABASE_URL)
  : null;

function validateSlug(slug: string | null | undefined): string {
  if (!slug || typeof slug !== 'string' || !slug.trim()) {
    throw new Error('Slug is required');
  }

  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function parseRequest(
  req: Request,
): Promise<{ method: string; slug: string }> {
  const { method } = req;
  const allowedMethods = ['GET', 'HEAD', 'POST'];

  if (!allowedMethods.includes(method)) {
    throw new Error('Method not allowed');
  }

  if (method === 'GET' || method === 'HEAD') {
    const slug = new URL(req.url).searchParams.get('slug');

    return { method, slug: validateSlug(slug) };
  }

  if (req.headers.get('Content-Type') !== 'application/json') {
    throw new Error('Invalid Content-Type');
  }

  const body = await req.json();

  if (!body || typeof body !== 'object' || !body.slug) {
    throw new Error('Invalid body');
  }

  return { method, slug: validateSlug(body.slug) };
}

const routes = {
  HEAD: async (slug: string) => {
    const result =
      await sql!`SELECT 1 FROM likes WHERE slug = ${slug} LIMIT 1;`;

    return new Response(null, { status: result.length ? 200 : 404 });
  },

  GET: async (slug: string) => {
    const result =
      await sql!`SELECT count FROM likes WHERE slug = ${slug} LIMIT 1;`;
    const count = result.length ? Number(result[0].count) || 0 : 0;

    return Response.json(
      { slug, count, success: true },
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      },
    );
  },

  POST: async (slug: string) => {
    const result = await sql!`
      INSERT INTO likes (slug, count)
      VALUES (${slug}, 1)
      ON CONFLICT (slug)
      DO UPDATE SET count = likes.count + 1
      RETURNING count;
    `;

    const count = Number(result[0].count) || 1;

    return Response.json(
      { slug, count, success: true },
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      },
    );
  },
};

async function handler(req: Request): Promise<Response> {
  try {
    if (!sql) {
      return new Response('Database connection failed', { status: 500 });
    }

    const { method, slug } = await parseRequest(req);

    return await routes[method as keyof typeof routes](slug);
  } catch (error) {
    const e = error instanceof Error ? error.message : 'Unknown error';
    const status =
      e.includes('Invalid') || e.includes('Method') || e.includes('slug')
        ? 400
        : 500;

    return new Response(e, { status });
  }
}

export { handler as HEAD, handler as GET, handler as POST };
