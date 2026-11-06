'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Instagram, MessageCircle, ShoppingBag } from 'lucide-react';
import { OrnamentDivider, Reveal, SectionHeading } from '@/components/site/brand';
import { navigateTo } from '@/lib/router';
import { SITE, waLink, FREE_SHIPPING_THRESHOLD, formatBRL } from '@/lib/site';

const FAQ = [
  {
    q: 'Quais são as formas de pagamento?',
    a: 'Aceitamos Pix (aprovação imediata), cartão de crédito em até 3x sem juros e boleto bancário. As instruções são enviadas após a confirmação do pedido.',
  },
  {
    q: 'Como funciona o frete?',
    a: `O frete é grátis para compras acima de ${formatBRL(FREE_SHIPPING_THRESHOLD)}. Abaixo desse valor, a contribuição fixa é de ${formatBRL(19.9)} — tudo calculado automaticamente na sacola.`,
  },
  {
    q: 'Posso trocar uma peça?',
    a: 'Sim! Você tem até 7 dias após receber o pedido para solicitar a troca pelo WhatsApp, com a peça sem uso e na embalagem original.',
  },
  {
    q: 'Como acompanho meu pedido?',
    a: 'Ao finalizar a compra, você recebe um código (começa com AC-). Guarde-o: é pelo WhatsApp, citando o código, que você acompanha produção e envio.',
  },
  {
    q: 'As peças são banhadas?',
    a: 'Trabalhamos com semijoias em banho de ouro 18k. Cada página de produto traz o material e os detalhes da peça específica.',
  },
];

export function ContatoView() {
  return (
    <div className="bg-creme">
      <div className="bg-marsala-deep py-14 text-center sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-[11px] font-medium uppercase tracking-eyebrow text-dourado-claro">
            Vamos conversar?
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-dourado-claro sm:text-5xl">
            Estamos por perto.
          </h1>
          <OrnamentDivider className="mt-5" />
          <p className="mx-auto mt-5 max-w-xl text-[14px] leading-relaxed text-creme/70">
            Tire dúvidas sobre peças, acompanhe seu pedido ou só venha dizer oi — respondemos
            rapidinho e com todo o carinho.
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {/* WhatsApp */}
          <Reveal>
            <div className="flex h-full flex-col rounded-sm border border-dourado/40 bg-white p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-marsala-deep text-dourado">
                <MessageCircle className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <h2 className="mt-4 font-serif text-2xl font-semibold text-marsala-deep">WhatsApp</h2>
              <p className="mt-1 text-[14px] text-tinta/70">
                Atendimento pessoal — o canal mais rápido para pedidos e dúvidas.
              </p>
              <p className="mt-3 font-mono text-[15px] font-semibold tracking-wide text-marsala">
                {SITE.whatsappDisplay}
              </p>
              <a
                href={waLink('Olá! Vim pelo site da Alma Cigana e gostaria de atendimento.')}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-marsala px-6 text-[12px] font-medium uppercase tracking-eyebrow text-creme ring-1 ring-dourado/60 transition-colors hover:bg-marsala-deep"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
                Abrir conversa
              </a>
            </div>
          </Reveal>

          {/* Instagram */}
          <Reveal delay={0.08}>
            <div className="flex h-full flex-col rounded-sm border border-dourado/40 bg-white p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-marsala-deep text-dourado">
                <Instagram className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <h2 className="mt-4 font-serif text-2xl font-semibold text-marsala-deep">Instagram</h2>
              <p className="mt-1 text-[14px] text-tinta/70">
                Novidades, bastidores e as peças em detalhe no nosso dia a dia.
              </p>
              <p className="mt-3 font-mono text-[15px] font-semibold tracking-wide text-marsala">
                {SITE.instagramHandle}
              </p>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-sm border border-marsala bg-white px-6 text-[12px] font-medium uppercase tracking-eyebrow text-marsala transition-colors hover:bg-marsala hover:text-creme"
              >
                <Instagram className="h-4 w-4" strokeWidth={1.8} />
                Visitar perfil
              </a>
            </div>
          </Reveal>
        </div>

        {/* FAQ */}
        <div className="mt-16 lg:mt-20">
          <SectionHeading
            eyebrow="Perguntas frequentes"
            title="Tudo o que você precisa saber"
            align="center"
          />
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="rounded-sm border border-dourado/35 bg-white px-5">
              {FAQ.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-b border-dourado/15 last:border-b-0">
                  <AccordionTrigger className="py-4 text-left font-serif text-[17px] font-semibold text-tinta hover:text-marsala hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[14px] leading-relaxed text-tinta/70">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* CTA */}
        <Reveal className="mt-14 text-center">
          <p className="font-serif text-2xl font-semibold text-marsala-deep">
            Prefere escolher com calma?
          </p>
          <button
            type="button"
            onClick={() => navigateTo('#/catalogo')}
            className="mt-4 inline-flex h-12 items-center gap-2 rounded-sm bg-marsala px-8 text-[12px] font-medium uppercase tracking-eyebrow text-creme ring-1 ring-dourado/60 transition-colors hover:bg-marsala-deep"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.8} />
            Ver catálogo completo
          </button>
        </Reveal>
      </section>
    </div>
  );
}
