import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { calcTotals, COUPONS } from '@/lib/site';

export const dynamic = 'force-dynamic';

const orderSchema = z.object({
  customerName: z.string().trim().min(3, 'Informe seu nome completo.'),
  email: z.string().trim().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'E-mail inválido.'),
  phone: z.string().trim().min(8, 'Telefone inválido.'),
  cep: z.string().trim().min(8, 'CEP inválido.'),
  address: z.string().trim().min(5, 'Informe o endereço de entrega.'),
  city: z.string().trim().min(2, 'Informe a cidade.'),
  state: z.string().trim().min(2).max(2, 'UF com 2 letras.'),
  paymentMethod: z.enum(['pix', 'cartao', 'boleto']),
  notes: z.string().max(600).optional().nullable(),
  couponCode: z.string().optional().nullable(),
  items: z
    .array(
      z.object({
        slug: z.string().min(1),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1, 'Carrinho vazio.'),
});

function generateOrderCode(): string {
  const time = Date.now().toString(36).toUpperCase().slice(-6);
  const random = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
  return `AC-${time}${random.padEnd(4, '0')}`;
}

export async function POST(req: NextRequest) {
  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requisição inválida.' }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? 'Dados do pedido inválidos.' },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const couponCode = data.couponCode?.toUpperCase() ?? null;
  if (couponCode && !COUPONS[couponCode]) {
    return NextResponse.json({ error: 'Cupom inválido.' }, { status: 400 });
  }

  try {
    const slugs = data.items.map((i) => i.slug);
    const products = await db.product.findMany({
      where: { slug: { in: slugs }, active: true },
    });

    const items = data.items.flatMap((i) => {
      const product = products.find((p) => p.slug === i.slug);
      return product
        ? [{ productId: product.id, name: product.name, price: product.price, quantity: i.quantity }]
        : [];
    });

    if (items.length === 0) {
      return NextResponse.json(
        { error: 'Os produtos da sacola não estão mais disponíveis.' },
        { status: 400 },
      );
    }

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totals = calcTotals(subtotal, couponCode);

    const order = await db.order.create({
      data: {
        code: generateOrderCode(),
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        cep: data.cep,
        address: data.address,
        city: data.city,
        state: data.state.toUpperCase(),
        paymentMethod: data.paymentMethod,
        notes: data.notes ?? null,
        couponCode: totals.couponApplied,
        subtotal: totals.subtotal,
        discount: totals.discount,
        shipping: totals.shipping,
        total: totals.total,
        status: 'confirmado',
        items: { create: items },
      },
    });

    return NextResponse.json({
      code: order.code,
      total: order.total,
      paymentMethod: order.paymentMethod,
    });
  } catch (error) {
    console.error('[api/orders POST]', error);
    return NextResponse.json(
      { error: 'Não foi possível registrar o pedido agora. Tente novamente.' },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('[api/orders GET]', error);
    return NextResponse.json({ error: 'Erro ao carregar pedidos.' }, { status: 500 });
  }
}
