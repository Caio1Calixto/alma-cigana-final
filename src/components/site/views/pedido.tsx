'use client';

import { useEffect, useState } from 'react';
import { Check, Copy, MessageCircle, PackageSearch, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingBlock, ErrorBlock, OrnamentDivider } from '@/components/site/brand';
import { navigateTo } from '@/lib/router';
import { formatBRL, waLink } from '@/lib/site';
import type { OrderInfo } from '@/lib/types';

function paymentInstructions(method: string): { title: string; text: string } {
  switch (method) {
    case 'pix':
      return {
        title: 'Pagamento via Pix',
        text: 'A chave Pix e as instruções serão enviadas agora mesmo pelo WhatsApp da loja. Envie o comprovante para liberarmos o envio.',
      };
    case 'cartao':
      return {
        title: 'Pagamento no cartão',
        text: 'Você receberá um link de pagamento seguro pelo WhatsApp com até 3x sem juros. A produção começa após a aprovação.',
      };
    case 'boleto':
      return {
        title: 'Pagamento via boleto',
        text: 'O boleto será enviado para o seu e-mail e vence em 3 dias úteis. Envie o comprovante de pagamento pelo WhatsApp.',
      };
    default:
      return { title: 'Pagamento', text: 'As instruções serão enviadas pelo WhatsApp da loja.' };
  }
}

type LookupState =
  | { phase: 'loading' }
  | { phase: 'ok'; order: OrderInfo }
  | { phase: 'error' };

export function PedidoView({ code }: { code?: string }) {
  const [lookup, setLookup] = useState<LookupState>({ phase: 'loading' });
  const [copied, setCopied] = useState(false);
  // Reconsulta quando o código muda (ajuste de estado durante o render)
  const [lastCode, setLastCode] = useState(code);
  if (code !== lastCode) {
    setLastCode(code);
    setLookup({ phase: 'loading' });
  }

  useEffect(() => {
    if (!code) return;
    let active = true;
    fetch(`/api/orders/${encodeURIComponent(code)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('not found');
        const data = await res.json();
        if (active) setLookup({ phase: 'ok', order: data.order });
      })
      .catch(() => {
        if (active) setLookup({ phase: 'error' });
      });
    return () => {
      active = false;
    };
  }, [code]);

  const copyCode = async () => {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(order.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard indisponível */
    }
  };

  if (!code || lookup.phase === 'error') {
    return (
      <div className="bg-creme">
        <ErrorBlock
          message="Não encontramos esse pedido. Confira o código (começa com AC-) ou fale com a loja pelo WhatsApp."
          onRetry={() => navigateTo('#/catalogo')}
        />
      </div>
    );
  }

  if (lookup.phase === 'loading') return <LoadingBlock label="Consultando seu pedido…" />;
  const order = lookup.order;

  const instructions = paymentInstructions(order.paymentMethod);
  const orderDate = new Date(order.createdAt).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const waMessage = `Olá! Acabei de fazer o pedido ${order.code} no site da Alma Cigana (${formatBRL(order.total)}). Posso combinar o pagamento?`;

  return (
    <div className="bg-creme">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Confirmação */}
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-dourado bg-white shadow-[0_4px_20px_rgba(198,161,91,0.35)]">
            <Check className="h-9 w-9 text-dourado" strokeWidth={2.2} />
          </div>
          <h1 className="mt-6 font-serif text-3xl font-semibold text-marsala-deep sm:text-4xl">
            Pedido confirmado ✦
          </h1>
          <p className="mt-2 text-[14px] text-tinta/65">
            Obrigada pela confiança! Sua peça já é nossa prioridade.
          </p>
          <button
            type="button"
            onClick={copyCode}
            className="mt-5 inline-flex items-center gap-2 rounded-sm border border-dourado/60 bg-white px-4 py-2 font-mono text-[14px] font-semibold tracking-wider text-marsala transition-colors hover:bg-linho"
            aria-label="Copiar código do pedido"
          >
            {order.code}
            {copied ? (
              <Check className="h-4 w-4 text-dourado" />
            ) : (
              <Copy className="h-4 w-4 text-tinta/50" />
            )}
          </button>
          <p className="mt-2 text-[12px] text-tinta/50">Pedido realizado em {orderDate}</p>
        </div>

        <OrnamentDivider className="my-10" />

        {/* Instrução de pagamento */}
        <div className="rounded-sm border border-dourado/40 bg-white p-5 sm:p-6">
          <h2 className="font-serif text-xl font-semibold text-marsala-deep">
            {instructions.title}
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-tinta/70">{instructions.text}</p>
          <a
            href={waLink(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-sm bg-marsala px-5 text-[12px] font-medium uppercase tracking-eyebrow text-creme ring-1 ring-dourado/60 transition-colors hover:bg-marsala-deep"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
            Falar com a loja no WhatsApp
          </a>
        </div>

        {/* Itens */}
        <div className="mt-8 rounded-sm border border-dourado/35 bg-white p-5 sm:p-6">
          <h2 className="font-serif text-xl font-semibold text-marsala-deep">Itens do pedido</h2>
          <ul className="mt-4 divide-y divide-dourado/15">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-tinta">{item.name}</p>
                  <p className="text-[12px] text-tinta/55">
                    {item.quantity} × {formatBRL(item.price)}
                  </p>
                </div>
                <p className="shrink-0 text-[14px] font-semibold text-marsala">
                  {formatBRL(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 border-t border-dourado/20 pt-4 text-[14px]">
            <div className="flex justify-between text-tinta/75">
              <dt>Subtotal</dt>
              <dd>{formatBRL(order.subtotal)}</dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-marsala">
                <dt>Desconto {order.couponCode ? `(${order.couponCode})` : ''}</dt>
                <dd>− {formatBRL(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between text-tinta/75">
              <dt>Frete</dt>
              <dd>{order.shipping === 0 ? 'Grátis ✦' : formatBRL(order.shipping)}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-dourado/25 pt-3">
              <dt className="text-[13px] uppercase tracking-wider text-tinta/70">Total</dt>
              <dd className="font-serif text-2xl font-semibold text-marsala">
                {formatBRL(order.total)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Entrega */}
        <div className="mt-8 rounded-sm border border-dourado/35 bg-white p-5 sm:p-6">
          <h2 className="font-serif text-xl font-semibold text-marsala-deep">Entrega</h2>
          <address className="mt-2 not-italic text-[14px] leading-relaxed text-tinta/70">
            {order.customerName}
            <br />
            {order.address}
            <br />
            {order.city} — {order.state}, CEP {order.cep}
          </address>
        </div>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            onClick={() => navigateTo('#/catalogo')}
            className="h-12 bg-marsala px-8 text-[12px] uppercase tracking-eyebrow text-creme hover:bg-marsala-deep"
          >
            <ShoppingBag className="mr-2 h-4 w-4" strokeWidth={1.8} />
            Continuar comprando
          </Button>
          <Button
            onClick={() => navigateTo('#/')}
            variant="outline"
            className="h-12 border-marsala bg-white px-8 text-[12px] uppercase tracking-eyebrow text-marsala hover:bg-marsala hover:text-creme"
          >
            <PackageSearch className="mr-2 h-4 w-4" strokeWidth={1.8} />
            Voltar ao início
          </Button>
        </div>
      </div>
    </div>
  );
}
