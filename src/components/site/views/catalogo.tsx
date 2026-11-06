'use client';

import { useMemo, useState } from 'react';
import { Search, SearchX } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingBlock, ErrorBlock, OrnamentDivider } from '@/components/site/brand';
import { ProductCard } from '@/components/site/product-card';
import { normalizeText } from '@/lib/site';
import type { Category } from '@/lib/types';

type SortOption = 'destaque' | 'nome' | 'preco-asc' | 'preco-desc';

export function CatalogoView({
  categories,
  loading,
  error,
  onRetry,
  initialCategory,
}: {
  categories: Category[] | null;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  initialCategory?: string;
}) {
  const [selectedCat, setSelectedCat] = useState<string>(initialCategory ?? 'todos');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('destaque');
  // Ajuste de estado durante o render quando a categoria inicial muda (ex.: clicou em um tile)
  const [lastInitialCategory, setLastInitialCategory] = useState(initialCategory);
  if (initialCategory !== lastInitialCategory) {
    setLastInitialCategory(initialCategory);
    setSelectedCat(initialCategory ?? 'todos');
  }

  const allProducts = useMemo(() => {
    const list: { product: (typeof categories)[number]['products'][number]; categoryName: string }[] = [];
    (categories ?? []).forEach((c) => c.products.forEach((p) => list.push({ product: p, categoryName: c.name })));
    return list;
  }, [categories]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, { name: string; count: number }>();
    (categories ?? []).forEach((c) => counts.set(c.slug, { name: c.name, count: c.products.length }));
    return counts;
  }, [categories]);

  const visible = useMemo(() => {
    let list = allProducts;
    if (selectedCat !== 'todos') list = list.filter((i) => {
      const cat = (categories ?? []).find((c) => c.slug === selectedCat);
      return cat ? i.product.categoryId === cat.id : false;
    });
    const q = normalizeText(search.trim());
    if (q) {
      list = list.filter(
        (i) =>
          normalizeText(i.product.name).includes(q) ||
          normalizeText(i.product.description).includes(q),
      );
    }
    const sorted = [...list];
    switch (sort) {
      case 'nome':
        sorted.sort((a, b) => a.product.name.localeCompare(b.product.name, 'pt-BR'));
        break;
      case 'preco-asc':
        sorted.sort((a, b) => a.product.price - b.product.price);
        break;
      case 'preco-desc':
        sorted.sort((a, b) => b.product.price - a.product.price);
        break;
      default:
        sorted.sort((a, b) => Number(b.product.featured) - Number(a.product.featured));
    }
    return sorted;
  }, [allProducts, categories, selectedCat, search, sort]);

  if (loading) return <LoadingBlock label="Carregando catálogo…" />;
  if (error) return <ErrorBlock message="Não foi possível carregar o catálogo agora." onRetry={onRetry} />;

  return (
    <div className="bg-creme">
      {/* Cabeçalho da página */}
      <div className="bg-marsala-deep py-14 text-center sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-medium uppercase tracking-eyebrow text-dourado-claro">
            Catálogo de produtos
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-dourado-claro sm:text-5xl">
            Todas as peças
          </h1>
          <OrnamentDivider className="mt-5" />
          <p className="mx-auto mt-5 max-w-xl text-[14px] leading-relaxed text-creme/70">
            Peças em dourado com simbolismo e delicadeza — escolha as suas favoritas e receba com
            todo o carinho da Alma Cigana.
          </p>
        </div>
      </div>

      {/* Filtros e busca */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
            <button
              type="button"
              onClick={() => setSelectedCat('todos')}
              className={`h-9 rounded-full border px-4 text-[12px] font-medium transition-colors ${
                selectedCat === 'todos'
                  ? 'border-marsala bg-marsala text-creme'
                  : 'border-dourado/50 bg-white text-tinta/70 hover:border-dourado hover:text-marsala'
              }`}
            >
              Todos <span className="ml-1 opacity-70">({allProducts.length})</span>
            </button>
            {[...categoryCounts.entries()].map(([slug, info]) => (
              <button
                key={slug}
                type="button"
                onClick={() => setSelectedCat(slug)}
                className={`h-9 rounded-full border px-4 text-[12px] font-medium transition-colors ${
                  selectedCat === slug
                    ? 'border-marsala bg-marsala text-creme'
                    : 'border-dourado/50 bg-white text-tinta/70 hover:border-dourado hover:text-marsala'
                }`}
              >
                {info.name} <span className="ml-1 opacity-70">({info.count})</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tinta/40" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar peça…"
                className="h-10 border-dourado/40 bg-white pl-9 text-[14px] focus-visible:ring-dourado"
                aria-label="Buscar peças no catálogo"
              />
            </div>
            <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
              <SelectTrigger className="h-10 w-full border-dourado/40 bg-white text-[13px] focus:ring-dourado sm:w-52" aria-label="Ordenar produtos">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="destaque">Em destaque</SelectItem>
                <SelectItem value="nome">Nome (A–Z)</SelectItem>
                <SelectItem value="preco-asc">Menor preço</SelectItem>
                <SelectItem value="preco-desc">Maior preço</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="mt-6 text-[12px] uppercase tracking-wider text-tinta/50" aria-live="polite">
          {visible.length} {visible.length === 1 ? 'peça encontrada' : 'peças encontradas'}
        </p>

        {visible.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {visible.map(({ product, categoryName }) => (
              <ProductCard key={product.slug} product={product} categoryName={categoryName} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <SearchX className="h-12 w-12 text-dourado/60" strokeWidth={1.2} />
            <p className="font-serif text-xl text-tinta/75">Nenhuma peça encontrada</p>
            <p className="text-[13px] text-tinta/55">
              Tente outra busca ou veja todas as categorias.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedCat('todos');
              }}
              className="mt-1 text-[12px] font-medium uppercase tracking-eyebrow text-marsala underline decoration-dourado underline-offset-4"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
