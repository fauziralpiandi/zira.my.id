import { neon } from '@neondatabase/serverless';

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

function validateSlug(slug: unknown): string {
  if (typeof slug !== 'string' || !slug.trim()) {
    throw new Error('Invalid slug');
  }

  const cleaned = slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!cleaned || cleaned.length > 255) {
    throw new Error('Invalid slug');
  }

  return cleaned;
}

async function handler(req: Request): Promise<Response> {
  try {
    if (!sql) {
      throw new Error('Database unavailable');
    }

    const { method } = req;
    const { searchParams } = new URL(req.url);

    let slug: unknown;

    if (method === 'GET' || method === 'HEAD') {
      slug = searchParams.get('slug');
    } else if (method === 'POST') {
      if (req.headers.get('Content-Type') !== 'application/json') {
        throw new Error('Invalid Content-Type');
      }

      const body = await req.json();

      if (typeof body !== 'object' || !body.slug) {
        throw new Error('Invalid body');
      }

      slug = body.slug;
    } else {
      throw new Error('Method not allowed');
    }

    const validatedSlug = validateSlug(slug);

    let result;

    if (method === 'HEAD') {
      result =
        await sql`SELECT 1 FROM likes WHERE slug = ${validatedSlug} LIMIT 1;`;

      return new Response(null, { status: result.length ? 200 : 404 });
    }

    if (method === 'GET') {
      result =
        await sql`SELECT count FROM likes WHERE slug = ${validatedSlug} LIMIT 1;`;

      const count = result.length ? result[0].count : 0;

      return new Response(JSON.stringify({ slug: validatedSlug, count }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    result = await sql`
      INSERT INTO likes (slug, count)
      VALUES (${validatedSlug}, 1)
      ON CONFLICT (slug)
      DO UPDATE SET count = likes.count + 1
      RETURNING count;
    `;

    const count = result[0].count;

    return new Response(JSON.stringify({ slug: validatedSlug, count }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const e = error instanceof Error ? error.message : 'Unknown error';

    return new Response(JSON.stringify({ error: e }), {
      status: e.includes('Invalid') || e.includes('Method') ? 400 : 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export { handler as HEAD, handler as GET, handler as POST };
