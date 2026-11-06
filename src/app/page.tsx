'use client';

import { useCallback, useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { Header } from '@/components/site/header';
import { Footer } from '@/components/site/footer';
import { CartDrawer } from '@/components/site/cart-drawer';
import { FloatingWhatsApp } from '@/components/site/floating-whatsapp';
import { HomeView } from '@/components/site/views/home';
import { CatalogoView } from '@/components/site/views/catalogo';
import { ProdutoView } from '@/components/site/views/produto';
import { SobreView } from '@/components/site/views/sobre';
import { ContatoView } from '@/components/site/views/contato';
import { CheckoutView } from '@/components/site/views/checkout';
import { PedidoView } from '@/components/site/views/pedido';
import { LojaView } from '@/components/site/views/loja';
import { NaoEncontradoView } from '@/components/site/views/nao-encontrado';
import { useHashRoute } from '@/lib/router';
import type { Category } from '@/lib/types';

function TopBar() {
  return (
    <div className="bg-marsala-night px-4 py-2 text-center">
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-dourado-claro/90">
        <Star className="h-3 w-3 fill-dourado text-dourado" aria-hidden="true" />
        Frete grátis acima de R$ 199
        <span aria-hidden="true" className="text-dourado/60">·</span>
        Cupom ALMA10 — 10% off
        <span aria-hidden="true" className="text-dourado/60">·</span>
        Atendimento pelo WhatsApp
      </p>
    </div>
  );
}

export default function Page() {
  const route = useHashRoute();
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('erro ao carregar');
      const data = await res.json();
      setCategories(data.categories);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [route.path]);

  const catalogProps = { categories, loading, error, onRetry: loadCatalog };

  return (
    <div className="flex min-h-screen flex-col bg-creme text-tinta">
      <TopBar />
      <Header route={route} />

      <main className="flex-1" id="conteudo">
        {route.name === 'home' && <HomeView categories={categories} />}
        {route.name === 'catalogo' && (
          <CatalogoView {...catalogProps} initialCategory={route.query.cat} />
        )}
        {route.name === 'produto' && <ProdutoView slug={route.param} {...catalogProps} />}
        {route.name === 'sobre' && <SobreView />}
        {route.name === 'contato' && <ContatoView />}
        {route.name === 'checkout' && <CheckoutView />}
        {route.name === 'pedido' && <PedidoView code={route.param} />}
        {route.name === 'loja' && <LojaView />}
        {route.name === '404' && <NaoEncontradoView path={route.path} />}
      </main>

      <Footer categories={categories?.map((c) => ({ slug: c.slug, name: c.name }))} />
      <CartDrawer />
      <FloatingWhatsApp />
    </div>
  );
}
