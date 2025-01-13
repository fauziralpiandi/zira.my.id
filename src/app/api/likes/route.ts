import { sql } from '@vercel/postgres';

const getCount = async (slug: string): Promise<number> => {
  const result = await sql`SELECT count FROM likes WHERE slug = ${slug};`;
  return result.rows[0]?.count || 0;
};

const jsonResponse = (data: object, status: number = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const handleGet = async (slug: string): Promise<Response> => {
  const count = await getCount(slug);
  return jsonResponse({ slug, count });
};

const handlePost = async (slug: string): Promise<Response> => {
  await sql`
    INSERT INTO likes (slug, count)
    VALUES (${slug}, 1)
    ON CONFLICT (slug)
    DO UPDATE SET count = likes.count + 1;
  `;

  const count = await getCount(slug);
  return jsonResponse({ slug, count });
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { searchParams } = new URL(req.url);
    const slug =
      req.method === 'GET'
        ? searchParams.get('slug')
        : (await req.json())?.slug;

    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return jsonResponse({ error: 'Valid slug is required' }, 400);
    }

    if (req.method === 'GET') return handleGet(slug);
    if (req.method === 'POST') return handlePost(slug);

    return jsonResponse({ error: 'Method not allowed' }, 405);
  } catch (error) {
    return jsonResponse(
      { error: 'Internal Server Error', details: (error as Error).message },
      500
    );
  }
};

export { handler as GET, handler as POST };
