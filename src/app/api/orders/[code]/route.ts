import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params;
  try {
    const order = await db.order.findUnique({
      where: { code: code.toUpperCase() },
      include: { items: true },
    });
    if (!order) {
      return NextResponse.json({ error: 'Pedido não encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (error) {
    console.error('[api/orders/code GET]', error);
    return NextResponse.json({ error: 'Erro ao consultar o pedido.' }, { status: 500 });
  }
}
