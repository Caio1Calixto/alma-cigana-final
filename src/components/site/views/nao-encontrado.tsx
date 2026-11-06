'use client';

import { MoonStar } from 'lucide-react';
import { OrnamentDivider } from '@/components/site/brand';
import { navigateTo } from '@/lib/router';

export function NaoEncontradoView({ path }: { path?: string }) {
  return (
    <div className="bg-creme">
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-6 py-20 text-center">
        <MoonStar className="h-14 w-14 text-dourado/70" strokeWidth={1.2} />
        <h1 className="font-serif text-3xl font-semibold text-marsala-deep sm:text-4xl">
          Esta página não existe
        </h1>
        <p className="max-w-md text-[14px] leading-relaxed text-tinta/65">
          {path
            ? `Não encontramos nada em "${path}". `
            : ''}
          Talvez a estrela tenha nos levado para outro caminho — volte para o início ou explore o
          catálogo.
        </p>
        <OrnamentDivider className="my-2" />
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => navigateTo('#/')}
            className="inline-flex h-12 items-center rounded-sm bg-marsala px-8 text-[12px] font-medium uppercase tracking-eyebrow text-creme ring-1 ring-dourado/60 transition-colors hover:bg-marsala-deep"
          >
            Ir para o início
          </button>
          <button
            type="button"
            onClick={() => navigateTo('#/catalogo')}
            className="inline-flex h-12 items-center rounded-sm border border-marsala bg-white px-8 text-[12px] font-medium uppercase tracking-eyebrow text-marsala transition-colors hover:bg-marsala hover:text-creme"
          >
            Ver catálogo
          </button>
        </div>
      </div>
    </div>
  );
}
