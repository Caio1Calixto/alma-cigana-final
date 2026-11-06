'use client';

import Image from 'next/image';
import {
  ArrowRight,
  Instagram,
  MessageCircle,
  PackageCheck,
  RefreshCcw,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { Emblem, OrnamentDivider, Reveal, SectionHeading, StarMark } from '@/components/site/brand';
import { ProductCard } from '@/components/site/product-card';
import { navigateTo } from '@/lib/router';
import { SITE, waLink, formatBRL, FREE_SHIPPING_THRESHOLD } from '@/lib/site';
import type { Category } from '@/lib/types';

export function HomeView({ categories }: { categories: Category[] | null }) {
  const featured = (categories ?? []).flatMap((c) => c.products.filter((p) => p.featured)).slice(0, 8);
  const categoryName = (id: number) => categories?.find((c) => c.id === id)?.name ?? 'Alma Cigana';

  return (
    <>
      {/* Banner principal */}
      <section className="relative overflow-hidden bg-marsala-deep">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 20% 30%, rgba(122,18,32,0.55), transparent), radial-gradient(ellipse 60% 50% at 85% 80%, rgba(198,161,91,0.14), transparent)',
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:px-8 lg:py-24">
          <div className="alma-fade-up">
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-eyebrow text-dourado-claro">
              <StarMark className="h-2.5 w-2.5 text-dourado" />
              Alma Cigana · Joias &amp; Acessórios
            </p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.08] text-dourado-claro sm:text-5xl lg:text-6xl">
              Joias e acessórios
              <br />
              com <em className="italic text-creme">alma.</em>
            </h1>
            <p className="mt-3 font-serif text-lg italic text-dourado/90">
              Mais que acessórios: símbolos de beleza, identidade e significado.
            </p>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-creme/75">
              Colares, braceletes, anéis e brincos em dourado, escolhidos com cuidado para
              acompanhar a sua história. Compre online e receba com carinho.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigateTo('#/catalogo')}
                className="inline-flex h-12 items-center gap-2 rounded-sm bg-marsala px-6 text-[12px] font-medium uppercase tracking-eyebrow text-creme ring-1 ring-dourado/70 transition-colors hover:bg-marsala-night"
              >
                Ver catálogo
                <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
              </button>
              <a
                href={waLink('Olá! Vim pelo site da Alma Cigana e gostaria de saber mais sobre as peças.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-sm border border-dourado-claro/50 px-6 text-[12px] font-medium uppercase tracking-eyebrow text-dourado-claro transition-colors hover:bg-creme/5"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
                Falar no WhatsApp
              </a>
            </div>
            <p className="mt-6 text-[12px] text-creme/55">
              Frete grátis acima de {formatBRL(FREE_SHIPPING_THRESHOLD)} · Pix, cartão ou boleto
            </p>
          </div>

          <Reveal delay={0.15} className="relative">
            <div className="relative mx-auto max-w-md overflow-hidden rounded-sm border border-dourado/40 p-2 bg-marsala-night/60">
              <div className="relative aspect-square overflow-hidden rounded-sm">
                <Image
                  src="/images/logo-alma-cigana.png"
                  alt="Logo da Alma Cigana Produtos: lua crescente dourada com estrela e rosa sobre fundo marsala"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 448px"
                  className="object-cover"
                />
              </div>
            </div>
            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.22em] text-creme/40">
              Alma Cigana Produtos · joias &amp; acessórios
            </p>
          </Reveal>
        </div>
      </section>

      {/* Benefícios */}
      <section className="border-b border-dourado/20 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-6 px-4 py-8 sm:grid-cols-4 sm:px-6 lg:px-8">
          {[
            { icon: Truck, title: 'Frete grátis', desc: `acima de ${formatBRL(FREE_SHIPPING_THRESHOLD)}` },
            { icon: ShieldCheck, title: 'Compra segura', desc: 'dados protegidos' },
            { icon: RefreshCcw, title: 'Troca facilitada', desc: 'até 7 dias após receber' },
            { icon: PackageCheck, title: 'Envio com carinho', desc: 'embalagem especial' },
          ].map((b) => (
            <div key={b.title} className="flex items-center gap-3">
              <b.icon className="h-8 w-8 shrink-0 text-dourado" strokeWidth={1.4} />
              <div>
                <p className="text-[13px] font-semibold text-marsala-deep">{b.title}</p>
                <p className="text-[12px] text-tinta/60">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Apresentação da marca */}
      <section className="bg-creme">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1fr] lg:gap-14 lg:px-8 lg:py-20">
          <Reveal className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[320px]">
              <div className="overflow-hidden rounded-t-full border border-dourado/50 p-2.5 bg-white">
                <div className="relative aspect-[4/5] overflow-hidden rounded-t-full">
                  <Image
                    src="/images/sobre.jpg"
                    alt="Peças douradas da Alma Cigana sobre linho creme"
                    fill
                    sizes="(max-width: 1024px) 80vw, 320px"
                    className="object-cover"
                  />
                </div>
              </div>
              <Emblem className="absolute -bottom-5 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full bg-marsala-deep p-3 text-dourado shadow-lg" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <SectionHeading
              eyebrow="Sobre a marca"
              title="A história que o ouro conta"
              description="A Alma Cigana nasceu do desejo de unir beleza, espiritualidade e simbolismo em peças que carregam personalidade e significado. Inspirada pelo universo místico, pela força feminina e pela riqueza dos símbolos, a marca oferece muito mais do que produtos: experiências e expressões de identidade."
            />
            <p className="-mt-6 mb-8 max-w-2xl text-[15px] leading-relaxed text-tinta/70">
              Nossa lua simboliza os ciclos, a intuição e a transformação. A rosa representa a
              beleza e a força que floresce mesmo diante dos desafios. Cada detalhe traduz o que
              desejamos transmitir.
            </p>
            <button
              type="button"
              onClick={() => navigateTo('#/sobre')}
              className="group inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-eyebrow text-marsala"
            >
              Conhecer a marca
              <span className="h-px w-8 bg-dourado transition-all duration-300 group-hover:w-12" />
            </button>
          </Reveal>
        </div>
      </section>

      {/* Categorias */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Catálogo organizado"
            title="Categorias"
            description="Encontre a peça certa para o seu momento: explore por tipo de acessório."
          />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {(categories ?? []).map((cat, i) => (
              <Reveal key={cat.slug} delay={i * 0.06}>
                <button
                  type="button"
                  onClick={() => navigateTo(`#/catalogo?cat=${cat.slug}`)}
                  className="group flex w-full flex-col items-center gap-2 rounded-sm bg-marsala-deep px-4 py-8 text-center transition-all duration-300 hover:-translate-y-0.5 hover:bg-marsala hover:shadow-[0_12px_30px_rgba(74,7,16,0.25)]"
                >
                  <StarMark className="h-4 w-4 text-dourado transition-transform duration-300 group-hover:rotate-45" />
                  <span className="font-serif text-lg font-semibold text-dourado-claro sm:text-xl">
                    {cat.name}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-creme/55">
                    {cat.products.length} {cat.products.length === 1 ? 'peça' : 'peças'} · explorar ↗
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Produtos em destaque */}
      <section className="bg-creme">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Vitrine"
              title="Produtos em destaque"
              description="Uma seleção especial para conhecer o universo Alma Cigana."
            />
            <button
              type="button"
              onClick={() => navigateTo('#/catalogo')}
              className="group mb-10 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-eyebrow text-marsala transition-colors hover:text-marsala-deep"
            >
              Ver catálogo completo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} categoryName={categoryName(p.categoryId)} />
            ))}
          </div>
          {!categories && (
            <p className="py-10 text-center text-[13px] uppercase tracking-eyebrow text-tinta/50">
              Carregando peças…
            </p>
          )}
        </div>
      </section>

      {/* Seção institucional */}
      <section className="relative overflow-hidden bg-marsala-deep">
        <OrnamentDivider className="pt-14 opacity-80" />
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-medium uppercase tracking-eyebrow text-dourado-claro">
              A essência Alma Cigana
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-creme sm:text-4xl">
              Uma marca autoral, do primeiro desenho ao atendimento
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: 'Atendimento pessoal',
                desc: 'Cada pedido vira uma conversa com a loja: antes, durante e depois da compra.',
              },
              {
                title: 'Catálogo curado',
                desc: 'Peças escolhidas com cuidado, organizadas por categorias e com descrições verdadeiras.',
              },
              {
                title: 'Identidade autoral',
                desc: 'Marsala e dourado, lua, estrela e rosa: símbolos que assinam cada detalhe.',
              },
            ].map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="flex h-full flex-col items-center gap-3 rounded-sm border border-dourado/35 bg-marsala-night/50 px-6 py-8 text-center">
                  <StarMark className="h-3.5 w-3.5 text-dourado" />
                  <h3 className="font-serif text-xl font-semibold text-dourado-claro">{p.title}</h3>
                  <p className="text-[13px] leading-relaxed text-creme/70">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Chamada final */}
      <section className="bg-marsala">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-14 text-center sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-serif text-3xl font-semibold text-creme sm:text-4xl">
              Sua próxima peça favorita está aqui
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-creme/75">
              Compre online em poucos cliques, ou fale com a loja para escolher a peça perfeita.
              Sem cadastro complicado, com atendimento de verdade.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => navigateTo('#/catalogo')}
                className="inline-flex h-12 items-center rounded-sm bg-creme px-7 text-[12px] font-medium uppercase tracking-eyebrow text-marsala-deep transition-colors hover:bg-white"
              >
                Explorar catálogo
              </button>
              <a
                href={waLink('Olá! Vim pelo site da Alma Cigana e gostaria de atendimento.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-sm border border-dourado-claro/60 px-7 text-[12px] font-medium uppercase tracking-eyebrow text-dourado-claro transition-colors hover:bg-creme/10"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
                Chamar no WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Redes sociais */}
      <section className="bg-creme">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <Reveal>
            <h3 className="font-serif text-2xl font-semibold text-marsala-deep">Redes sociais</h3>
            <p className="mt-2 text-[13px] text-tinta/60">
              Acompanhe novidades, bastidores e lançamentos.
            </p>
            <div className="mt-5 flex justify-center gap-4">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Alma Cigana"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-dourado text-marsala transition-all hover:bg-dourado/15"
              >
                <Instagram className="h-5 w-5" strokeWidth={1.6} />
              </a>
              <a
                href={waLink('Olá! Vim pelo site da Alma Cigana.')}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp da Alma Cigana"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-dourado text-marsala transition-all hover:bg-dourado/15"
              >
                <MessageCircle className="h-5 w-5" strokeWidth={1.6} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
