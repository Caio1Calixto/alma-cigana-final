'use client';

import { useId, type ReactNode } from 'react';
import { motion } from 'framer-motion';

/** Emblema da marca: lua, estrela e rosa em traço dourado (reprodução vetorial). */
export function Emblem({ className }: { className?: string }) {
  const id = useId();
  const maskId = `moon-cut-${id.replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <defs>
        <mask id={maskId}>
          <rect width="64" height="64" fill="black" />
          <circle cx="28" cy="34" r="19" fill="white" />
          <circle cx="41" cy="22" r="16" fill="black" />
        </mask>
      </defs>
      {/* lua crescente */}
      <circle cx="28" cy="34" r="19" fill="currentColor" mask={`url(#${maskId})`} />
      {/* estrela de quatro pontas */}
      <path
        d="M46 14l1.9 5.6L53.5 21.5l-5.6 1.9L46 29l-1.9-5.6L38.5 21.5l5.6-1.9z"
        fill="currentColor"
      />
      {/* rosa em traço fino */}
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M20 52c0-4 2.6-7 6.5-7s6.5 3 6.5 7" />
        <path d="M22.5 49.5c0-2.4 1.8-4.2 4-4.2s4 1.8 4 4.2" />
        <path d="M17 52h19" />
      </g>
    </svg>
  );
}

/** Filete dourado com estrela central — ornamento divisor de seções. */
export function OrnamentDivider({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className ?? ''}`} aria-hidden="true">
      <span className="h-px w-16 bg-dourado/70 sm:w-24" />
      <svg viewBox="0 0 20 20" className="h-3 w-3 fill-dourado">
        <path d="M10 0l2.2 7.8L20 10l-7.8 2.2L10 20l-2.2-7.8L0 10l7.8-2.2z" />
      </svg>
      <span className="h-px w-16 bg-dourado/70 sm:w-24" />
    </div>
  );
}

export function StarMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`fill-current ${className ?? ''}`} aria-hidden="true">
      <path d="M10 0l2.2 7.8L20 10l-7.8 2.2L10 20l-2.2-7.8L0 10l7.8-2.2z" />
    </svg>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'dark',
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
}) {
  const eyebrowColor = tone === 'dark' ? 'text-dourado' : 'text-dourado-claro';
  const titleColor = tone === 'dark' ? 'text-marsala-deep' : 'text-creme';
  const descColor = tone === 'dark' ? 'text-tinta/70' : 'text-creme/75';
  return (
    <Reveal
      className={`mb-10 flex flex-col gap-3 ${
        align === 'center' ? 'items-center text-center' : 'items-start'
      }`}
    >
      <p className={`text-[11px] font-medium uppercase tracking-eyebrow ${eyebrowColor}`}>
        {eyebrow}
      </p>
      <h2 className={`font-serif text-3xl font-semibold leading-tight sm:text-4xl ${titleColor}`}>
        {title}
      </h2>
      <span
        className={`h-px w-14 bg-dourado ${align === 'center' ? '' : ''}`}
        aria-hidden="true"
      />
      {description ? (
        <p className={`max-w-2xl text-[15px] leading-relaxed ${descColor}`}>{description}</p>
      ) : null}
    </Reveal>
  );
}

/** Revelação suave ao entrar na viewport (Framer Motion). */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

/** Estado de carregamento em tom da marca. */
export function LoadingBlock({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20">
      <Emblem className="alma-pulse-soft h-14 w-14 text-dourado" />
      <p className="text-sm uppercase tracking-eyebrow text-tinta/60">{label}</p>
    </div>
  );
}

/** Estado de erro com ação de repetir. */
export function ErrorBlock({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      <Emblem className="h-12 w-12 text-marsala/40" />
      <p className="max-w-sm text-[15px] text-tinta/70">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 inline-flex h-11 items-center justify-center rounded-sm bg-marsala px-6 text-[12px] font-medium uppercase tracking-eyebrow text-creme transition-colors hover:bg-marsala-deep"
        >
          Tentar novamente
        </button>
      ) : null}
    </div>
  );
}
