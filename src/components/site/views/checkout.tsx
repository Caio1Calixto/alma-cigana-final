'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { BadgeCheck, Lock, ShoppingBag, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { cartSubtotal, useCartStore } from '@/lib/cart-store';
import { navigateTo } from '@/lib/router';
import {
  calcTotals,
  COUPONS,
  formatBRL,
  FREE_SHIPPING_THRESHOLD,
  PAYMENT_METHODS,
} from '@/lib/site';

type FormState = {
  customerName: string;
  email: string;
  phone: string;
  cep: string;
  address: string;
  city: string;
  state: string;
  paymentMethod: string;
  notes: string;
};

const initialForm: FormState = {
  customerName: '',
  email: '',
  phone: '',
  cep: '',
  address: '',
  city: '',
  state: '',
  paymentMethod: 'pix',
  notes: '',
};

export function CheckoutView() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const { toast } = useToast();

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [couponInput, setCouponInput] = useState('');
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cartSubtotal(items);
  const totals = useMemo(() => calcTotals(subtotal, couponCode), [subtotal, couponCode]);

  const set = (field: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (COUPONS[code]) {
      setCouponCode(code);
      setCouponError(null);
      toast({
        title: 'Cupom aplicado ✦',
        description: COUPONS[code].label,
      });
    } else {
      setCouponCode(null);
      setCouponError('Cupom inválido ou expirado.');
    }
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setCouponInput('');
    setCouponError(null);
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (form.customerName.trim().length < 3) next.customerName = 'Informe seu nome completo.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'E-mail inválido.';
    if (form.phone.trim().length < 8) next.phone = 'Informe um telefone com DDD.';
    if (form.cep.trim().length < 8) next.cep = 'CEP inválido.';
    if (form.address.trim().length < 5) next.address = 'Informe o endereço completo.';
    if (form.city.trim().length < 2) next.city = 'Informe a cidade.';
    if (form.state.trim().length !== 2) next.state = 'UF com 2 letras.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (items.length === 0) return;
    if (!validate()) {
      toast({
        title: 'Formulário incompleto',
        description: 'Verifique os campos destacados antes de confirmar o pedido.',
        variant: 'destructive',
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          couponCode,
          items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Erro ao registrar o pedido.');
      clear();
      toast({ title: 'Pedido confirmado ✦', description: `Código ${data.code}` });
      navigateTo(`#/pedido/${data.code}`);
    } catch (err) {
      toast({
        title: 'Não foi possível concluir',
        description: err instanceof Error ? err.message : 'Tente novamente em instantes.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-creme">
        <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <ShoppingBag className="h-14 w-14 text-dourado/50" strokeWidth={1.2} />
          <h1 className="font-serif text-2xl font-semibold text-tinta">Sua sacola está vazia</h1>
          <p className="max-w-sm text-[14px] text-tinta/60">
            Adicione peças ao carrinho para finalizar sua compra.
          </p>
          <Button
            onClick={() => navigateTo('#/catalogo')}
            className="mt-2 h-12 bg-marsala px-8 text-[12px] uppercase tracking-eyebrow text-creme hover:bg-marsala-deep"
          >
            Explorar catálogo
          </Button>
        </div>
      </div>
    );
  }

  const inputClass = (field: keyof FormState) =>
    `bg-white text-[14px] ${errors[field] ? 'border-marsala focus-visible:ring-marsala/40' : 'border-dourado/40 focus-visible:ring-dourado'}`;

  return (
    <div className="bg-creme">
      <div className="bg-marsala-deep py-10 text-center">
        <p className="text-[11px] font-medium uppercase tracking-eyebrow text-dourado-claro">
          Finalização da compra
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-dourado-claro sm:text-4xl">
          Checkout seguro
        </h1>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-[12px] text-creme/65">
          <Lock className="h-3.5 w-3.5 text-dourado" strokeWidth={1.8} />
          Seus dados são usados apenas para processar a entrega
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_400px] lg:gap-12 lg:px-8 lg:py-14">
        {/* Formulário */}
        <div className="space-y-10">
          <section aria-labelledby="dados-entrega">
            <h2 id="dados-entrega" className="flex items-center gap-3 font-serif text-2xl font-semibold text-marsala-deep">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-marsala text-[13px] font-medium text-creme">1</span>
              Dados de entrega
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="nome" className="text-[12px] uppercase tracking-wider text-tinta/70">Nome completo *</Label>
                <Input id="nome" value={form.customerName} onChange={(e) => set('customerName', e.target.value)} className={`mt-1.5 h-11 ${inputClass('customerName')}`} placeholder="Como você se chama" autoComplete="name" />
                {errors.customerName && <p className="mt-1 text-[12px] text-marsala">{errors.customerName}</p>}
              </div>
              <div>
                <Label htmlFor="email" className="text-[12px] uppercase tracking-wider text-tinta/70">E-mail *</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={`mt-1.5 h-11 ${inputClass('email')}`} placeholder="voce@email.com" autoComplete="email" />
                {errors.email && <p className="mt-1 text-[12px] text-marsala">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="telefone" className="text-[12px] uppercase tracking-wider text-tinta/70">Telefone / WhatsApp *</Label>
                <Input id="telefone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={`mt-1.5 h-11 ${inputClass('phone')}`} placeholder="(11) 99999-0000" autoComplete="tel" />
                {errors.phone && <p className="mt-1 text-[12px] text-marsala">{errors.phone}</p>}
              </div>
              <div className="sm:col-span-1">
                <Label htmlFor="cep" className="text-[12px] uppercase tracking-wider text-tinta/70">CEP *</Label>
                <Input id="cep" value={form.cep} onChange={(e) => set('cep', e.target.value)} className={`mt-1.5 h-11 ${inputClass('cep')}`} placeholder="00000-000" autoComplete="postal-code" />
                {errors.cep && <p className="mt-1 text-[12px] text-marsala">{errors.cep}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="endereco" className="text-[12px] uppercase tracking-wider text-tinta/70">Endereço completo *</Label>
                <Input id="endereco" value={form.address} onChange={(e) => set('address', e.target.value)} className={`mt-1.5 h-11 ${inputClass('address')}`} placeholder="Rua, número, complemento e bairro" autoComplete="street-address" />
                {errors.address && <p className="mt-1 text-[12px] text-marsala">{errors.address}</p>}
              </div>
              <div>
                <Label htmlFor="cidade" className="text-[12px] uppercase tracking-wider text-tinta/70">Cidade *</Label>
                <Input id="cidade" value={form.city} onChange={(e) => set('city', e.target.value)} className={`mt-1.5 h-11 ${inputClass('city')}`} placeholder="Sua cidade" autoComplete="address-level2" />
                {errors.city && <p className="mt-1 text-[12px] text-marsala">{errors.city}</p>}
              </div>
              <div>
                <Label htmlFor="uf" className="text-[12px] uppercase tracking-wider text-tinta/70">Estado (UF) *</Label>
                <Input id="uf" value={form.state} onChange={(e) => set('state', e.target.value.toUpperCase().slice(0, 2))} className={`mt-1.5 h-11 uppercase ${inputClass('state')}`} placeholder="SP" autoComplete="address-level1" maxLength={2} />
                {errors.state && <p className="mt-1 text-[12px] text-marsala">{errors.state}</p>}
              </div>
            </div>
          </section>

          <section aria-labelledby="pagamento">
            <h2 id="pagamento" className="flex items-center gap-3 font-serif text-2xl font-semibold text-marsala-deep">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-marsala text-[13px] font-medium text-creme">2</span>
              Forma de pagamento
            </h2>
            <RadioGroup
              value={form.paymentMethod}
              onValueChange={(v) => set('paymentMethod', v)}
              className="mt-5 gap-3"
            >
              {PAYMENT_METHODS.map((m) => (
                <Label
                  key={m.id}
                  htmlFor={`pg-${m.id}`}
                  className={`flex cursor-pointer items-start gap-3 rounded-sm border bg-white p-4 transition-colors ${
                    form.paymentMethod === m.id
                      ? 'border-marsala bg-linho/60 ring-1 ring-marsala/30'
                      : 'border-dourado/40 hover:border-dourado'
                  }`}
                >
                  <RadioGroupItem value={m.id} id={`pg-${m.id}`} className="mt-1 text-marsala" />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-semibold text-tinta">{m.name}</span>
                    <span className="text-[12px] text-tinta/60">{m.hint}</span>
                  </span>
                </Label>
              ))}
            </RadioGroup>
          </section>

          <section aria-labelledby="observacoes">
            <h2 id="observacoes" className="flex items-center gap-3 font-serif text-2xl font-semibold text-marsala-deep">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-marsala text-[13px] font-medium text-creme">3</span>
              Observações
            </h2>
            <Textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              className="mt-5 min-h-24 border-dourado/40 bg-white text-[14px] focus-visible:ring-dourado"
              placeholder="Mensagem para presente, preferências de embalagem, ponto de referência…"
              aria-label="Observações do pedido"
            />
          </section>
        </div>

        {/* Resumo */}
        <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Resumo do pedido">
          <div className="rounded-sm border border-dourado/35 bg-white p-5 shadow-[0_2px_14px_rgba(74,7,16,0.06)]">
            <h3 className="font-serif text-xl font-semibold text-marsala-deep">Resumo do pedido</h3>

            <ul className="mt-4 max-h-64 divide-y divide-dourado/15 overflow-y-auto pr-1">
              {items.map((item) => (
                <li key={item.slug} className="flex items-center gap-3 py-3">
                  <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-sm border border-dourado/25">
                    <Image src={item.image} alt={item.name} fill sizes="44px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-tinta">{item.name}</p>
                    <p className="text-[12px] text-tinta/55">
                      {item.quantity} × {formatBRL(item.price)}
                    </p>
                  </div>
                  <p className="text-[13px] font-semibold text-marsala">
                    {formatBRL(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            {/* Cupom */}
            <div className="mt-4 border-t border-dourado/20 pt-4">
              {couponCode ? (
                <div className="flex items-center justify-between rounded-sm border border-dourado/60 bg-linho/60 px-3 py-2.5">
                  <p className="flex items-center gap-2 text-[13px] font-medium text-marsala-deep">
                    <BadgeCheck className="h-4 w-4 text-dourado" />
                    {couponCode} · {COUPONS[couponCode]?.label}
                  </p>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="rounded-sm p-1 text-tinta/50 hover:text-marsala"
                    aria-label="Remover cupom"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tinta/40" />
                      <Input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                        placeholder="Cupom de desconto"
                        className="h-10 border-dourado/40 bg-creme pl-9 text-[13px] uppercase focus-visible:ring-dourado"
                        aria-label="Código do cupom"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={applyCoupon}
                      variant="outline"
                      className="h-10 border-marsala px-4 text-[12px] uppercase tracking-wider text-marsala hover:bg-marsala hover:text-creme"
                    >
                      Aplicar
                    </Button>
                  </div>
                  {couponError && <p className="mt-1.5 text-[12px] text-marsala">{couponError}</p>}
                  <p className="mt-1.5 text-[11px] text-tinta/50">
                    Experimente: ALMA10 · FRETEGRATIS
                  </p>
                </>
              )}
            </div>

            {/* Totais */}
            <dl className="mt-4 space-y-2 border-t border-dourado/20 pt-4 text-[14px]">
              <div className="flex justify-between text-tinta/75">
                <dt>Subtotal</dt>
                <dd>{formatBRL(totals.subtotal)}</dd>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-marsala">
                  <dt>Desconto ({totals.couponApplied})</dt>
                  <dd>− {formatBRL(totals.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between text-tinta/75">
                <dt>Frete</dt>
                <dd>{totals.freeShip ? <span className="text-dourado">Grátis ✦</span> : formatBRL(totals.shipping)}</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-dourado/25 pt-3">
                <dt className="text-[13px] uppercase tracking-wider text-tinta/70">Total</dt>
                <dd className="font-serif text-3xl font-semibold text-marsala">{formatBRL(totals.total)}</dd>
              </div>
            </dl>

            {!totals.freeShip && totals.subtotal - totals.discount < FREE_SHIPPING_THRESHOLD && (
              <p className="mt-2 text-[12px] text-tinta/55">
                Adicione mais {formatBRL(FREE_SHIPPING_THRESHOLD - (totals.subtotal - totals.discount))} para ganhar frete grátis.
              </p>
            )}

            <Button
              onClick={submit}
              disabled={submitting}
              className="mt-5 h-13 w-full bg-marsala py-3.5 text-[12px] uppercase tracking-eyebrow text-creme ring-1 ring-dourado/60 hover:bg-marsala-deep disabled:opacity-60"
            >
              {submitting ? 'Confirmando pedido…' : `Confirmar pedido · ${formatBRL(totals.total)}`}
            </Button>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-tinta/50">
              Após confirmar, você receberá as instruções de pagamento e poderá acompanhar tudo
              pelo WhatsApp com o código do pedido.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
