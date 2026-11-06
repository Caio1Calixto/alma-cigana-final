'use client';

import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cart-store';
import { navigateTo } from '@/lib/router';
import { formatBRL } from '@/lib/site';
import type { Product } from '@/lib/types';

export function ProductCard({ product, categoryName }: { product: Product; categoryName: string }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <article className="group flex flex-col overflow-hidden rounded-sm border border-dourado/25 bg-card shadow-[0_1px_2px_rgba(74,7,16,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(74,7,16,0.12)]">
      <button
        type="button"
        onClick={() => navigateTo(`#/produto/${product.slug}`)}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-linho"
        aria-label={`Ver detalhes de ${product.name}`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <span
          className="absolute inset-x-0 bottom-0 h-[2px] bg-dourado opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />
      </button>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-medium uppercase tracking-eyebrow text-marsala/60">
          {categoryName}
        </p>
        <button
          type="button"
          onClick={() => navigateTo(`#/produto/${product.slug}`)}
          className="mt-1 text-left font-serif text-[17px] font-semibold leading-snug text-tinta transition-colors hover:text-marsala"
        >
          {product.name}
        </button>
        <p className="mt-1.5 text-[15px] font-semibold text-marsala">
          {formatBRL(product.price)}
          <span className="ml-2 text-[11px] font-normal text-tinta/55">
            ou 3x de {formatBRL(product.price / 3)}
          </span>
        </p>
        <div className="mt-auto pt-3">
          <Button
            onClick={() =>
              addItem({
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.image,
              })
            }
            className="h-10 w-full bg-marsala text-[11px] uppercase tracking-eyebrow text-creme hover:bg-marsala-deep"
          >
            <ShoppingBag className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.8} />
            Adicionar à sacola
          </Button>
        </div>
      </div>
    </article>
  );
}
