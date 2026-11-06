export const SITE = {
  name: 'Alma Cigana',
  tagline: 'Joias e acessórios com alma',
  whatsapp: '5511997721481',
  whatsappDisplay: '+55 (11) 99772-1481',
  instagram: 'https://www.instagram.com/almacigana.produtos/',
  instagramHandle: '@almacigana.produtos',
} as const;

export const FREE_SHIPPING_THRESHOLD = 199;
export const SHIPPING_FLAT = 19.9;

export type Coupon = {
  type: 'percent' | 'freeship';
  value: number;
  label: string;
};

export const COUPONS: Record<string, Coupon> = {
  ALMA10: { type: 'percent', value: 10, label: '10% de desconto na compra' },
  FRETEGRATIS: { type: 'freeship', value: 0, label: 'Frete grátis em qualquer pedido' },
};

export const PAYMENT_METHODS = [
  {
    id: 'pix',
    name: 'Pix',
    hint: 'Aprovação imediata · instruções enviadas após a confirmação',
  },
  {
    id: 'cartao',
    name: 'Cartão de crédito',
    hint: 'Até 3x sem juros · link de pagamento seguro',
  },
  {
    id: 'boleto',
    name: 'Boleto bancário',
    hint: 'Vence em 3 dias úteis · enviado por e-mail',
  },
] as const;

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]['id'];

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

export type Totals = {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  freeShip: boolean;
  couponApplied: string | null;
};

export function calcTotals(subtotal: number, couponCode?: string | null): Totals {
  const coupon = couponCode ? COUPONS[couponCode.toUpperCase()] : undefined;
  const discount = coupon?.type === 'percent' ? Math.round(subtotal * coupon.value) / 100 : 0;
  const base = subtotal - discount;
  const freeShip = coupon?.type === 'freeship' || base >= FREE_SHIPPING_THRESHOLD;
  const shipping = freeShip ? 0 : SHIPPING_FLAT;
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount,
    shipping,
    total: Math.round((base + shipping) * 100) / 100,
    freeShip,
    couponApplied: coupon ? couponCode!.toUpperCase() : null,
  };
}

export function waLink(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const ORDER_STATUS: Record<string, { label: string; className: string }> = {
  confirmado: { label: 'Confirmado', className: 'border-dourado bg-dourado/10 text-marsala-deep' },
  preparando: { label: 'Em preparação', className: 'border-marsala/40 bg-marsala/5 text-marsala' },
  enviado: { label: 'Enviado', className: 'border-dourado/50 bg-dourado/10 text-marsala-deep' },
  entregue: { label: 'Entregue', className: 'border-emerald-700/40 bg-emerald-700/10 text-emerald-800' },
};
