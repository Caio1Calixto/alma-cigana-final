'use client';

import { MessageCircle } from 'lucide-react';
import { waLink } from '@/lib/site';

export function FloatingWhatsApp() {
  return (
    <a
      href={waLink('Olá! Vim pelo site da Alma Cigana e gostaria de atendimento.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Atendimento pelo WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-marsala text-creme shadow-[0_6px_20px_rgba(74,7,16,0.4)] ring-1 ring-dourado/70 transition-transform hover:scale-105 hover:bg-marsala-deep sm:hidden"
    >
      <MessageCircle className="h-6 w-6" strokeWidth={1.8} />
    </a>
  );
}
