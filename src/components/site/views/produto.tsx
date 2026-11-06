'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  ChevronRight,
  MessageCircle,
  Minus,
  Plus,
  RefreshCcw,
  ShoppingBag,
  Truck,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingBlock, ErrorBlock, SectionHeading } from '@/components/site/brand';
import { ProductCard } from '@/components/site/product-card';
import { useCartStore } from '@/lib/cart-store';
import { navigateTo } from '@/lib/router';
import { formatBRL, waLink } from '@/lib/site';
import type { Category } from '@/lib/types';

export function ProdutoView({
  slug,
  categories,
  loading,
  error,
  onRetry,
}: {
  slug?: string;
  categories: Category[] | null;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);

  const category = (categories ?? []).find((c) => c.products.some((p) => p.slug === slug));
  const product = category?.products.find((p) => p.slug === slug);

  if (loading) return <LoadingBlock label="Carregando peça…" />;
  if (error) return <ErrorBlock message="Não foi possível carregar a peça agora." onRetry={onRetry} />;
  if (!product || !category) {
    return (
      <div className="bg-creme">
        <ErrorBlock
          message="Não encontramos esta peça — talvez ela tenha sido renomeada ou removida do catálogo."
          onRetry={() => navigateTo('#/catalogo')}
        />
      </div>
    );
  }

  const related = category.products.filter((p) => p.slug !== product.slug).slice(0, 4);

  const add = () =>
    addItem(
      {
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      quantity,
    );

  const buyNow = () => {
    add();
    navigateTo('#/checkout');
  };

  return (
    <div className="bg-creme">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Trilha de navegação */}
        <nav aria-label="Trilha de navegação" className="flex flex-wrap items-center gap-1 text-[12px] text-tinta/55">
          <button type="button" onClick={() => navigateTo('#/')} className="hover:text-marsala">
            Início
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-tinta/35" />
          <button type="button" onClick={() => navigateTo('#/catalogo')} className="hover:text-marsala">
            Catálogo
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-tinta/35" />
          <button
            type="button"
            onClick={() => navigateTo(`#/catalogo?cat=${category.slug}`)}
            className="hover:text-marsala"
          >
            {category.name}
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-tinta/35" />
          <span className="font-medium text-marsala">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Galeria */}
          <div className="relative overflow-hidden rounded-sm border border-dourado/30 bg-white p-2.5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-linho">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 560px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Informações */}
          <div className="flex flex-col">
            <p className="text-[11px] font-medium uppercase tracking-eyebrow text-dourado">
              {category.name}
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight text-marsala-deep sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-2xl font-semibold text-marsala sm:text-3xl">
              {formatBRL(product.price)}
              <span className="ml-3 text-[13px] font-normal text-tinta/60">
                ou 3x de {formatBRL(product.price / 3)} sem juros
              </span>
            </p>

            <p className="mt-5 text-[15px] leading-relaxed text-tinta/80">{product.description}</p>

            <dl className="mt-6 space-y-2 rounded-sm border border-dourado/30 bg-white p-4 text-[13px]">
              {product.material && (
                <div className="flex gap-2">
                  <dt className="shrink-0 font-semibold text-marsala-deep">Material:</dt>
                  <dd className="text-tinta/70">{product.material}</dd>
                </div>
              )}
              {product.details && (
                <div className="flex gap-2">
                  <dt className="shrink-0 font-semibold text-marsala-deep">Detalhes:</dt>
                  <dd className="text-tinta/70">{product.details}</dd>
                </div>
              )}
            </dl>

            {/* Quantidade + ações */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-sm border border-dourado/50 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-12 w-11 items-center justify-center text-marsala transition-colors hover:bg-linho disabled:opacity-30"
                  disabled={quantity <= 1}
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-semibold text-tinta" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="flex h-12 w-11 items-center justify-center text-marsala transition-colors hover:bg-linho disabled:opacity-30"
                  disabled={quantity >= 10}
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                onClick={add}
                className="h-12 flex-1 bg-marsala text-[12px] uppercase tracking-eyebrow text-creme ring-1 ring-dourado/60 hover:bg-marsala-deep"
              >
                <ShoppingBag className="mr-2 h-4 w-4" strokeWidth={1.8} />
                Adicionar à sacola
              </Button>
            </div>
            <Button
              onClick={buyNow}
              variant="outline"
              className="mt-3 h-12 w-full border-marsala bg-white text-[12px] uppercase tracking-eyebrow text-marsala hover:bg-marsala hover:text-creme"
            >
              <Zap className="mr-2 h-4 w-4" strokeWidth={1.8} />
              Comprar agora
            </Button>

            <a
              href={waLink(
                `Olá! Tenho interesse no produto ${product.name} (${formatBRL(product.price)}). Gostaria de saber mais!`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex h-11 items-center justify-center gap-2 text-[12px] font-medium uppercase tracking-eyebrow text-marsala underline decoration-dourado underline-offset-4 transition-colors hover:text-marsala-deep"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
              Consultar pelo WhatsApp
            </a>

            {/* Reassuranças */}
            <ul className="mt-6 grid gap-3 border-t border-dourado/25 pt-6 text-[13px] text-tinta/70 sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <Truck className="h-4 w-4 shrink-0 text-dourado" strokeWidth={1.6} />
                Frete grátis acima de R$ 199
              </li>
              <li className="flex items-center gap-2">
                <RefreshCcw className="h-4 w-4 shrink-0 text-dourado" strokeWidth={1.6} />
                Troca facilitada em até 7 dias
              </li>
            </ul>
          </div>
        </div>

        {/* Relacionados */}
        {related.length > 0 && (
          <section className="mt-16 lg:mt-20" aria-label="Produtos relacionados">
            <SectionHeading
              eyebrow="Combine com"
              title={`Mais de ${category.name}`}
            />
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} categoryName={category.name} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
