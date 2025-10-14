import { type NextRequest, NextResponse } from 'next/server';
import { neon as database } from '@neondatabase/serverless';

const sql = database(process.env.DATABASE_URL!);
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'no-store',
};

function validateSlug(slug: string | null): string {
  if (!slug || !slug.trim()) {
    throw new Error('Invalid slug');
  }

  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const slug = validateSlug(req.nextUrl.searchParams.get('slug'));
    const rows =
      await sql`SELECT count FROM likes WHERE slug = ${slug} LIMIT 1;`;
    const count = rows.length ? Number(rows[0].count) || 0 : 0;

    return NextResponse.json(
      { success: true, slug, count },
      { status: 200, headers },
    );
  } catch (err) {
    console.error('GET /likes:', err);

    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500, headers },
    );
  }
}

async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { slug } = await req.json();
    const validSlug = validateSlug(slug);
    const rows = await sql`
      INSERT INTO likes (slug, count)
      VALUES (${validSlug}, 1)
      ON CONFLICT (slug)
      DO UPDATE SET count = likes.count + 1
      RETURNING count;
    `;

    const count = Number(rows[0].count) || 1;

    return NextResponse.json(
      { success: true, slug: validSlug, count },
      { status: 200, headers },
    );
  } catch (err) {
    console.error('POST /likes:', err);

    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500, headers },
    );
  }
}

export { GET, POST };
