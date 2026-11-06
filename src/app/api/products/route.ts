import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        products: {
          where: { active: true },
          orderBy: { order: 'asc' },
        },
      },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('[api/products]', error);
    return NextResponse.json(
      { error: 'Não foi possível carregar o catálogo agora.' },
      { status: 500 },
    );
  }
}
