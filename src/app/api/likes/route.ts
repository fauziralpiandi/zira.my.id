import { neon as db } from '@neondatabase/serverless';

const sql = db(process.env.DATABASE_URL!);

const jsonResponse = (data: object, status: number = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const getCount = async (slug: string): Promise<number> => {
  try {
    const result =
      await sql`SELECT count FROM likes WHERE slug = ${slug} LIMIT 1;`;
    return result[0]?.count || 0;
  } catch (error) {
    console.error('Error fetching count:', error);
    return 0;
  }
};

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

const handlePost = async (slug: string): Promise<Response> => {
  try {
    await sql`
      INSERT INTO likes (slug, count)
      VALUES (${slug}, 1)
      ON CONFLICT (slug)
      DO UPDATE SET count = likes.count + 1;
    `;
    const count = await getCount(slug);
    return jsonResponse({ slug, count });
  } catch (error) {
    console.error('Error handling POST request:', error);
    return jsonResponse(
      { error: 'Failed to update count', details: (error as Error).message },
      500
    );
  }
};

const handleHead = async (slug: string): Promise<Response> => {
  try {
    const count = await getCount(slug);
    return new Response(null, { status: count > 0 ? 200 : 404 });
  } catch (error) {
    console.error('Error handling HEAD request:', error);
    return new Response(null, { status: 500 });
  }
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { searchParams } = new URL(req.url);
    const slug =
      req.method === 'GET' || req.method === 'HEAD'
        ? searchParams.get('slug')
        : (await req.json())?.slug;

    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return jsonResponse({ error: 'Valid slug is required' }, 400);
    }

    if (req.method === 'GET') return handleGet(slug);
    if (req.method === 'POST') return handlePost(slug);
    if (req.method === 'HEAD') return handleHead(slug);

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
