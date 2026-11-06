'use client';

import Image from 'next/image';
import { ArrowRight, Flower2, Heart, Moon, Sparkles } from 'lucide-react';
import { OrnamentDivider, Reveal, SectionHeading, StarMark } from '@/components/site/brand';
import { navigateTo } from '@/lib/router';

export function SobreView() {
  return (
    <div className="bg-creme">
      {/* Abertura */}
      <section className="bg-marsala-deep py-16 text-center sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-eyebrow text-dourado-claro">
            <StarMark className="h-2.5 w-2.5 text-dourado" />
            Sobre a marca
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold text-dourado-claro sm:text-5xl">
            A história que o ouro conta
          </h1>
          <p className="mt-4 font-serif text-lg italic text-dourado/90">
            Beleza, espiritualidade e simbolismo em cada peça.
          </p>
        </div>
      </section>

      {/* Nossa história */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-20">
        <Reveal>
          <div className="overflow-hidden rounded-sm border border-dourado/50 bg-white p-2.5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image
                src="/images/sobre.jpg"
                alt="Peças douradas da Alma Cigana sobre linho creme com pétalas de rosa"
                fill
                sizes="(max-width: 1024px) 90vw, 560px"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <SectionHeading
            eyebrow="Nossa história"
            title="Onde a beleza encontra significado"
          />
          <div className="-mt-6 space-y-4 text-[15px] leading-relaxed text-tinta/75">
            <p>
              A Alma Cigana nasceu do desejo de unir beleza, espiritualidade e simbolismo em peças
              que carregam personalidade e significado.
            </p>
            <p>
              Inspirada pelo universo místico, pela força feminina, pela conexão com a natureza e
              pela riqueza dos símbolos espirituais, nossa marca busca oferecer muito mais do que
              produtos: queremos proporcionar experiências e expressões de identidade.
            </p>
            <p>
              Cada detalhe foi pensado para transmitir encanto, elegância e autenticidade. Nossa
              essência está presente nas luas, nas rosas, nos elementos da natureza e nas joias que
              representam força, beleza e individualidade.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Missão e identidade */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="flex h-full flex-col gap-3 rounded-sm border border-dourado/35 bg-creme p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-marsala-deep text-dourado">
                  <Moon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <h2 className="font-serif text-2xl font-semibold text-marsala-deep">Nossa missão</h2>
                <p className="text-[14px] leading-relaxed text-tinta/70">
                  Oferecer produtos que unam estética, qualidade, identidade e simbolismo,
                  respeitando a diversidade de crenças e a liberdade de cada pessoa viver sua
                  espiritualidade.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="flex h-full flex-col gap-3 rounded-sm border border-dourado/35 bg-creme p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-marsala-deep text-dourado">
                  <Flower2 className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <h2 className="font-serif text-2xl font-semibold text-marsala-deep">
                  Nossa identidade
                </h2>
                <p className="text-[14px] leading-relaxed text-tinta/70">
                  O nome Alma Cigana representa movimento, liberdade, força e conexão com as raízes
                  espirituais. Nossa lua simboliza os ciclos e a intuição; a rosa, a beleza e a
                  força que floresce mesmo diante dos desafios.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-12">
            <blockquote className="mx-auto max-w-2xl border-t border-b border-dourado/40 py-8 text-center">
              <Sparkles className="mx-auto h-5 w-5 text-dourado" strokeWidth={1.6} />
              <p className="mt-3 font-serif text-xl italic leading-relaxed text-marsala-deep sm:text-2xl">
                “Alma Cigana — onde a beleza encontra significado e cada detalhe conta uma
                história.”
              </p>
              <footer className="mt-3 text-[11px] uppercase tracking-eyebrow text-tinta/50">
                Seja bem-vinda ao nosso universo
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Chamada para o catálogo */}
      <section className="bg-marsala">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-14 text-center sm:px-6 lg:px-8">
          <Reveal>
            <OrnamentDivider className="mb-2" />
            <h2 className="font-serif text-3xl font-semibold text-creme sm:text-4xl">
              Escolha a peça que conta a sua história
            </h2>
            <button
              type="button"
              onClick={() => navigateTo('#/catalogo')}
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-sm bg-creme px-8 text-[12px] font-medium uppercase tracking-eyebrow text-marsala-deep transition-colors hover:bg-white"
            >
              Explorar catálogo
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-5 flex items-center gap-1.5 text-[12px] text-creme/60">
              <Heart className="h-3.5 w-3.5 text-dourado-claro" strokeWidth={1.8} />
              Cada pedido vira uma conversa com a loja
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
