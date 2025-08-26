import { neon as database } from '@neondatabase/serverless';

const sql = process.env.DATABASE_URL
  ? database(process.env.DATABASE_URL)
  : null;

function validateSlug(slug: unknown): string {
  if (typeof slug !== 'string' || !slug.trim()) {
    throw new Error('Invalid slug');
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

  if (method === 'GET' || method === 'HEAD') {
    const slug = new URL(req.url).searchParams.get('slug');

    return { method, slug: validateSlug(slug) };
  }

  if (method === 'POST') {
    if (req.headers.get('Content-Type') !== 'application/json') {
      throw new Error('Invalid Content-Type');
    }

    const body = await req.json();

    if (typeof body !== 'object' || !body.slug) {
      throw new Error('Invalid body');
    }

    return { method, slug: validateSlug(body.slug) };
  }

  throw new Error('Method not allowed');
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
    const count = result.length ? result[0].count : 0;

    return new Response(JSON.stringify({ slug, count }), {
      headers: { 'Content-Type': 'application/json' },
    });
  },

  POST: async (slug: string) => {
    const result = await sql!`
      INSERT INTO likes (slug, count)
      VALUES (${slug}, 1)
      ON CONFLICT (slug)
      DO UPDATE SET count = likes.count + 1
      RETURNING count;
    `;

    return new Response(JSON.stringify({ slug, count: result[0].count }), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};

async function handler(req: Request): Promise<Response> {
  try {
    if (!sql) {
      throw new Error('Database unavailable');
    }

    const { method, slug } = await parseRequest(req);

    if (!(method in routes)) {
      throw new Error('Method not allowed');
    }

    return await routes[method as keyof typeof routes](slug);
  } catch (err) {
    const e = err instanceof Error ? err.message : 'Unknown error';

    return new Response(JSON.stringify({ error: e }), {
      status: e.includes('Invalid') || e.includes('Method') ? 400 : 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export { handler as HEAD, handler as GET, handler as POST };
