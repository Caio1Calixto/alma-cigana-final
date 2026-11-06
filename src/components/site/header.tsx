'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { Menu, MessageCircle, ShoppingBag, X } from 'lucide-react';
import { Emblem } from '@/components/site/brand';
import { useCartStore, cartCount } from '@/lib/cart-store';
import { navigateTo, type RouteInfo } from '@/lib/router';
import { SITE, waLink } from '@/lib/site';

const NAV_ITEMS = [
  { label: 'Início', path: '#/', match: 'home' },
  { label: 'Catálogo', path: '#/catalogo', match: 'catalogo' },
  { label: 'Sobre', path: '#/sobre', match: 'sobre' },
  { label: 'Contato', path: '#/contato', match: 'contato' },
] as const;

const emptySubscribe = () => () => {};

export function Header({ route }: { route: RouteInfo }) {
  const [menuOpen, setMenuOpen] = useState(false);
  // Fecha o menu sempre que a rota muda (ajuste de estado durante o render)
  const [lastPath, setLastPath] = useState(route.path);
  if (route.path !== lastPath) {
    setLastPath(route.path);
    setMenuOpen(false);
  }
  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.openCart);
  // Evita descompasso de hidratação: o badge só mostra contagem após o mount
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const count = mounted ? cartCount(items) : 0;

  // Tecla ESC fecha o menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const go = (path: string) => {
    setMenuOpen(false);
    navigateTo(path);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-dourado/30 bg-creme/95 backdrop-blur supports-[backdrop-filter]:bg-creme/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[72px] sm:px-6 lg:px-8">
        {/* Marca */}
        <button
          type="button"
          onClick={() => go('#/')}
          className="group flex items-center gap-2.5"
          aria-label="Alma Cigana — ir para o início"
        >
          <Emblem className="h-8 w-8 text-marsala transition-transform duration-300 group-hover:rotate-6 sm:h-9 sm:w-9" />
          <span className="flex flex-col leading-none text-left">
            <span className="font-serif text-xl font-semibold tracking-wide text-marsala-deep sm:text-[22px]">
              Alma Cigana
            </span>
            <span className="mt-0.5 hidden text-[9px] font-medium uppercase tracking-[0.28em] text-dourado sm:block">
              Joias &amp; Acessórios
            </span>
          </span>
        </button>

        {/* Navegação desktop */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
          {NAV_ITEMS.map((item) => {
            const active = route.name === item.match;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => go(item.path)}
                className={`relative py-1 text-[12px] font-medium uppercase tracking-eyebrow transition-colors ${
                  active ? 'text-marsala' : 'text-tinta/70 hover:text-marsala'
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[2px] w-full bg-dourado transition-opacity ${
                    active ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </nav>

        {/* Ações */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={openCart}
            className="relative flex h-11 w-11 items-center justify-center rounded-sm text-marsala-deep transition-colors hover:bg-linho"
            aria-label={`Abrir sacola de compras${count ? ` (${count} itens)` : ''}`}
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.8} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-dourado px-1 text-[10px] font-semibold text-marsala-night">
                {count}
              </span>
            )}
          </button>

          <a
            href={waLink('Olá! Vim pelo site da Alma Cigana e gostaria de atendimento.')}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-11 items-center gap-2 rounded-sm bg-marsala px-5 text-[12px] font-medium uppercase tracking-eyebrow text-creme ring-1 ring-dourado/70 transition-colors hover:bg-marsala-deep sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
            WhatsApp
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-sm text-marsala-deep transition-colors hover:bg-linho md:hidden"
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {menuOpen ? <X className="h-5 w-5" strokeWidth={1.8} /> : <Menu className="h-5 w-5" strokeWidth={1.8} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div
          id="menu-mobile"
          className="border-t border-dourado/20 bg-marsala-deep text-creme md:hidden"
        >
          <nav className="mx-auto max-w-6xl px-4 sm:px-6" aria-label="Navegação móvel">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => go(item.path)}
                className={`block w-full border-b border-creme/10 py-4 text-left text-[13px] font-medium uppercase tracking-eyebrow transition-colors ${
                  route.name === item.match ? 'text-dourado-claro' : 'text-creme/85 hover:text-dourado-claro'
                }`}
              >
                {item.label}
              </button>
            ))}
            <a
              href={waLink('Olá! Vim pelo site da Alma Cigana e gostaria de atendimento.')}
              target="_blank"
              rel="noopener noreferrer"
              className="my-4 flex h-12 items-center justify-center gap-2 rounded-sm bg-marsala text-[12px] font-medium uppercase tracking-eyebrow text-creme ring-1 ring-dourado/70"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
              Atendimento pelo WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
