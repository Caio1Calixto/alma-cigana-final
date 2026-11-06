'use client';

import { Instagram, MessageCircle, ShoppingBag } from 'lucide-react';
import { Emblem, StarMark } from '@/components/site/brand';
import { navigateTo } from '@/lib/router';
import { SITE, waLink } from '@/lib/site';

export function Footer({ categories }: { categories?: { slug: string; name: string }[] }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto bg-marsala-night text-creme">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {/* Marca */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <Emblem className="h-9 w-9 text-dourado" />
            <span className="font-serif text-xl font-semibold tracking-wide text-dourado-claro">
              Alma Cigana
            </span>
          </div>
          <p className="max-w-xs text-[13px] leading-relaxed text-creme/60">
            Joias e acessórios com alma: marsala e dourado, lua, estrela e rosa em cada peça.
          </p>
          <div className="flex gap-3">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da Alma Cigana"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-dourado/50 text-dourado-claro transition-colors hover:bg-dourado/10"
            >
              <Instagram className="h-4.5 w-4.5" strokeWidth={1.6} />
            </a>
            <a
              href={waLink('Olá! Vim pelo site da Alma Cigana.')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp da Alma Cigana"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-dourado/50 text-dourado-claro transition-colors hover:bg-dourado/10"
            >
              <MessageCircle className="h-4.5 w-4.5" strokeWidth={1.6} />
            </a>
          </div>
        </div>

        {/* Navegação */}
        <nav aria-label="Rodapé, navegação">
          <h3 className="mb-4 text-[11px] font-medium uppercase tracking-eyebrow text-dourado">
            Navegação
          </h3>
          <ul className="flex flex-col gap-2.5 text-[14px] text-creme/75">
            <li><button type="button" className="transition-colors hover:text-dourado-claro" onClick={() => navigateTo('#/')}>Início</button></li>
            <li><button type="button" className="transition-colors hover:text-dourado-claro" onClick={() => navigateTo('#/catalogo')}>Catálogo</button></li>
            <li><button type="button" className="transition-colors hover:text-dourado-claro" onClick={() => navigateTo('#/sobre')}>Sobre a marca</button></li>
            <li><button type="button" className="transition-colors hover:text-dourado-claro" onClick={() => navigateTo('#/contato')}>Contato</button></li>
            <li><button type="button" className="transition-colors hover:text-dourado-claro" onClick={() => navigateTo('#/checkout')}>Sacola &amp; pagamento</button></li>
          </ul>
        </nav>

        {/* Categorias */}
        <nav aria-label="Rodapé, categorias">
          <h3 className="mb-4 text-[11px] font-medium uppercase tracking-eyebrow text-dourado">
            Categorias
          </h3>
          <ul className="flex flex-col gap-2.5 text-[14px] text-creme/75">
            {(categories ?? []).map((c) => (
              <li key={c.slug}>
                <button
                  type="button"
                  className="transition-colors hover:text-dourado-claro"
                  onClick={() => navigateTo(`#/catalogo?cat=${c.slug}`)}
                >
                  {c.name}
                </button>
              </li>
            ))}
            {!categories?.length && <li className="text-creme/40">Carregando…</li>}
          </ul>
        </nav>

        {/* Atendimento */}
        <div>
          <h3 className="mb-4 text-[11px] font-medium uppercase tracking-eyebrow text-dourado">
            Atendimento
          </h3>
          <ul className="flex flex-col gap-2.5 text-[14px] text-creme/75">
            <li>
              <a
                href={waLink('Olá! Vim pelo site da Alma Cigana.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-dourado-claro"
              >
                <MessageCircle className="h-4 w-4 text-dourado" strokeWidth={1.6} />
                {SITE.whatsappDisplay}
              </a>
            </li>
            <li>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-dourado-claro"
              >
                <Instagram className="h-4 w-4 text-dourado" strokeWidth={1.6} />
                {SITE.instagramHandle}
              </a>
            </li>
            <li className="mt-2 text-[13px] text-creme/50">
              Atendimento pessoal: cada pedido vira uma conversa com a loja.
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-creme/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-[12px] text-creme/50 sm:flex-row sm:px-6 lg:px-8">
          <p>© {year} Alma Cigana · Joias &amp; Acessórios · Todos os direitos reservados.</p>
          <p className="flex items-center gap-2">
            <StarMark className="h-2.5 w-2.5 text-dourado/70" />
            Feito com alma
            <StarMark className="h-2.5 w-2.5 text-dourado/70" />
          </p>
          <button
            type="button"
            onClick={() => navigateTo('#/loja')}
            className="inline-flex items-center gap-1.5 text-creme/40 transition-colors hover:text-dourado-claro"
            aria-label="Área da loja, gestão de pedidos"
          >
            <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.6} />
            Área da loja
          </button>
        </div>
      </div>
    </footer>
  );
}
