'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';

export interface RouteInfo {
  name:
    | 'home'
    | 'catalogo'
    | 'produto'
    | 'sobre'
    | 'contato'
    | 'checkout'
    | 'pedido'
    | 'loja'
    | '404';
  param?: string;
  query: Record<string, string>;
  path: string;
}

export function parseHash(hash: string): RouteInfo {
  const raw = hash.replace(/^#/, '') || '/';
  const [pathPart, queryPart] = raw.split('?');
  const segments = pathPart.split('/').filter(Boolean);
  const query: Record<string, string> = {};
  if (queryPart) {
    for (const pair of queryPart.split('&')) {
      const [key, value] = pair.split('=');
      if (key) query[key] = decodeURIComponent(value ?? '');
    }
  }
  if (segments.length === 0) return { name: 'home', query, path: raw };
  const [first, second] = segments;
  switch (first) {
    case 'catalogo':
      return { name: 'catalogo', query, path: raw };
    case 'produto':
      return { name: 'produto', param: second, query, path: raw };
    case 'sobre':
      return { name: 'sobre', query, path: raw };
    case 'contato':
      return { name: 'contato', query, path: raw };
    case 'checkout':
      return { name: 'checkout', query, path: raw };
    case 'pedido':
      return { name: 'pedido', param: second, query, path: raw };
    case 'loja':
      return { name: 'loja', query, path: raw };
    default:
      return { name: '404', query, path: raw };
  }
}

function subscribeHash(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

export function useHashRoute(): RouteInfo {
  const hash = useSyncExternalStore(
    subscribeHash,
    () => window.location.hash || '#/',
    () => '#/',
  );
  return useMemo(() => parseHash(hash), [hash]);
}

export function navigateTo(path: string): void {
  if (typeof window === 'undefined') return;
  window.location.hash = path;
}
