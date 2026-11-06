'use client';

import Image from 'next/image';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cartCount, cartSubtotal, useCartStore } from '@/lib/cart-store';
import { navigateTo } from '@/lib/router';
import { calcTotals, formatBRL, FREE_SHIPPING_THRESHOLD } from '@/lib/site';

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const items = useCartStore((s) => s.items);
  const closeCart = useCartStore((s) => s.closeCart);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const subtotal = cartSubtotal(items);
  const totals = calcTotals(subtotal);
  const missingForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - (subtotal - totals.discount));
  const progress = Math.min(100, ((subtotal - totals.discount) / FREE_SHIPPING_THRESHOLD) * 100);

  const goToCheckout = () => {
    closeCart();
    navigateTo('#/checkout');
  };

  const keepShopping = () => {
    closeCart();
    navigateTo('#/catalogo');
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? undefined : closeCart())}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-l border-dourado/30 bg-creme p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-dourado/25 bg-white px-5 py-4">
          <SheetTitle className="flex items-center gap-2 font-serif text-xl font-semibold text-marsala-deep">
            <ShoppingBag className="h-5 w-5 text-dourado" strokeWidth={1.8} />
            Sua sacola
            <span className="ml-1 rounded-full bg-linho px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-marsala">
              {cartCount(items)} {cartCount(items) === 1 ? 'item' : 'itens'}
            </span>
          </SheetTitle>
          <SheetDescription className="text-[13px] text-tinta/60">
            Frete grátis a partir de {formatBRL(FREE_SHIPPING_THRESHOLD)}.
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-12 w-12 text-dourado/50" strokeWidth={1.2} />
            <p className="font-serif text-xl text-tinta/80">Sua sacola está vazia</p>
            <p className="max-w-[26ch] text-[13px] text-tinta/55">
              Descubra peças com alma no nosso catálogo.
            </p>
            <Button
              onClick={keepShopping}
              className="mt-2 h-11 bg-marsala px-6 text-[12px] uppercase tracking-eyebrow text-creme hover:bg-marsala-deep"
            >
              Ver catálogo
            </Button>
          </div>
        ) : (
          <>
            {/* Progresso do frete grátis */}
            <div className="border-b border-dourado/25 bg-linho px-5 py-3">
              {totals.freeShip ? (
                <p className="text-center text-[12px] font-medium uppercase tracking-wider text-marsala-deep">
                  ✦ Você ganhou frete grátis!
                </p>
              ) : (
                <>
                  <p className="text-center text-[12px] text-tinta/70">
                    Faltam{' '}
                    <strong className="font-semibold text-marsala">
                      {formatBRL(missingForFreeShip)}
                    </strong>{' '}
                    para frete grátis
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-dourado transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Itens */}
            <ul className="flex-1 divide-y divide-dourado/15 overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.slug} className="flex gap-3 py-4">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-sm border border-dourado/20 bg-white">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="truncate font-serif text-[15px] font-semibold text-tinta">
                      {item.name}
                    </p>
                    <p className="text-[12px] text-tinta/60">{formatBRL(item.price)} cada</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center rounded-sm border border-dourado/40 bg-white">
                        <button
                          type="button"
                          onClick={() => setQuantity(item.slug, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center text-marsala transition-colors hover:bg-linho"
                          aria-label={`Diminuir quantidade de ${item.name}`}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-[13px] font-semibold text-tinta">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(item.slug, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center text-marsala transition-colors hover:bg-linho"
                          aria-label={`Aumentar quantidade de ${item.name}`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-[14px] font-semibold text-marsala">
                        {formatBRL(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.slug)}
                    className="self-start rounded-sm p-1.5 text-tinta/40 transition-colors hover:bg-linho hover:text-marsala"
                    aria-label={`Remover ${item.name} da sacola`}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.6} />
                  </button>
                </li>
              ))}
            </ul>

            {/* Resumo + ações */}
            <div className="border-t border-dourado/25 bg-white px-5 py-4">
              <div className="flex items-center justify-between text-[14px] text-tinta/75">
                <span>Subtotal</span>
                <span className="font-medium">{formatBRL(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[14px] text-tinta/75">
                <span>Frete</span>
                <span className="font-medium">
                  {totals.freeShip ? 'Grátis ✦' : formatBRL(totals.shipping)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-dourado/20 pt-3">
                <span className="text-[13px] uppercase tracking-wider text-tinta/70">Total</span>
                <span className="font-serif text-2xl font-semibold text-marsala">
                  {formatBRL(totals.total)}
                </span>
              </div>
              <Button
                onClick={goToCheckout}
                className="mt-4 h-12 w-full bg-marsala text-[12px] uppercase tracking-eyebrow text-creme ring-1 ring-dourado/60 hover:bg-marsala-deep"
              >
                Finalizar compra
              </Button>
              <button
                type="button"
                onClick={closeCart}
                className="mt-2 flex h-10 w-full items-center justify-center gap-1.5 text-[12px] uppercase tracking-eyebrow text-tinta/60 transition-colors hover:text-marsala"
              >
                <X className="h-3.5 w-3.5" />
                Continuar comprando
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
