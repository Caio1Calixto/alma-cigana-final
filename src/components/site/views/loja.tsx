'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { PackageSearch, RefreshCcw, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ErrorBlock, LoadingBlock, OrnamentDivider } from '@/components/site/brand';
import { formatBRL, ORDER_STATUS, PAYMENT_METHODS } from '@/lib/site';
import type { OrderInfo } from '@/lib/types';

export function LojaView() {
  const [orders, setOrders] = useState<OrderInfo[] | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrders(data.orders);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const revenue = useMemo(
    () => (orders ?? []).reduce((acc, o) => acc + o.total, 0),
    [orders],
  );
  const average = orders?.length ? revenue / orders.length : 0;

  if (loading) return <LoadingBlock label="Carregando pedidos…" />;
  if (error) return <ErrorBlock message="Não foi possível carregar os pedidos." onRetry={load} />;

  return (
    <div className="bg-creme">
      <div className="bg-marsala-night py-12 text-center">
        <p className="text-[11px] font-medium uppercase tracking-eyebrow text-dourado-claro">
          Área da loja · uso interno
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-dourado-claro sm:text-4xl">
          Pedidos recebidos
        </h1>
        <p className="mt-2 text-[13px] text-creme/60">
          Acompanhe as compras feitas no site, em ordem da mais recente.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Métricas */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Pedidos', value: String(orders?.length ?? 0) },
            { label: 'Faturamento', value: formatBRL(revenue) },
            { label: 'Ticket médio', value: formatBRL(average) },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-sm border border-dourado/35 bg-white p-4 text-center sm:p-6"
            >
              <p className="text-[10px] font-medium uppercase tracking-eyebrow text-tinta/55">
                {m.label}
              </p>
              <p className="mt-1.5 font-serif text-xl font-semibold text-marsala sm:text-2xl">
                {m.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <OrnamentDivider className="flex-1" />
          <Button
            onClick={load}
            variant="outline"
            size="sm"
            className="mx-4 h-9 shrink-0 border-marsala/50 text-[11px] uppercase tracking-wider text-marsala hover:bg-marsala hover:text-creme"
          >
            <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
            Atualizar
          </Button>
          <OrnamentDivider className="flex-1" />
        </div>

        {orders?.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <PackageSearch className="h-12 w-12 text-dourado/50" strokeWidth={1.2} />
            <p className="font-serif text-xl text-tinta/75">Nenhum pedido ainda</p>
            <p className="text-[13px] text-tinta/55">
              Assim que a primeira compra acontecer, ela aparece aqui.
            </p>
          </div>
        ) : (
          <>
            {/* Tabela desktop */}
            <div className="mt-6 hidden rounded-sm border border-dourado/35 bg-white md:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-dourado/25 bg-linho/50">
                    <TableHead className="text-[11px] uppercase tracking-wider text-tinta/60">Código</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-tinta/60">Data</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-tinta/60">Cliente</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-tinta/60">Pagamento</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-tinta/60">Itens</TableHead>
                    <TableHead className="text-right text-[11px] uppercase tracking-wider text-tinta/60">Total</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-tinta/60">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(orders ?? []).map((o) => {
                    const status = ORDER_STATUS[o.status] ?? {
                      label: o.status,
                      className: 'border-dourado/40 bg-white text-tinta/70',
                    };
                    const payment = PAYMENT_METHODS.find((m) => m.id === o.paymentMethod)?.name ?? o.paymentMethod;
                    return (
                      <TableRow key={o.id} className="border-dourado/15">
                        <TableCell className="font-mono text-[13px] font-semibold text-marsala">
                          {o.code}
                        </TableCell>
                        <TableCell className="text-[13px] text-tinta/70">
                          {new Date(o.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                          })}
                        </TableCell>
                        <TableCell className="text-[13px]">
                          <span className="font-medium text-tinta">{o.customerName}</span>
                          <span className="block text-[12px] text-tinta/55">{o.city} · {o.state}</span>
                        </TableCell>
                        <TableCell className="text-[13px] text-tinta/70">{payment}</TableCell>
                        <TableCell className="text-[13px] text-tinta/70">
                          {o.items.reduce((acc, i) => acc + i.quantity, 0)}
                        </TableCell>
                        <TableCell className="text-right text-[14px] font-semibold text-marsala">
                          {formatBRL(o.total)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${status.className}`}>
                            {status.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Cartões mobile */}
            <ul className="mt-6 space-y-4 md:hidden">
              {(orders ?? []).map((o) => {
                const status = ORDER_STATUS[o.status] ?? {
                  label: o.status,
                  className: 'border-dourado/40 bg-white text-tinta/70',
                };
                const payment = PAYMENT_METHODS.find((m) => m.id === o.paymentMethod)?.name ?? o.paymentMethod;
                return (
                  <li key={o.id} className="rounded-sm border border-dourado/35 bg-white p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[14px] font-semibold text-marsala">{o.code}</span>
                      <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${status.className}`}>
                        {status.label}
                      </Badge>
                    </div>
                    <p className="mt-2 text-[14px] font-medium text-tinta">{o.customerName}</p>
                    <p className="text-[12px] text-tinta/55">
                      {new Date(o.createdAt).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      · {payment}
                    </p>
                    <p className="mt-1 text-[12px] text-tinta/55">
                      {o.items.reduce((acc, i) => acc + i.quantity, 0)} item(ns) ·{' '}
                      {o.items.map((i) => i.name).join(', ')}
                    </p>
                    <p className="mt-2 font-serif text-xl font-semibold text-marsala">
                      {formatBRL(o.total)}
                    </p>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        <div className="mt-10 flex items-center justify-center gap-2 text-[12px] text-tinta/45">
          <TrendingUp className="h-3.5 w-3.5" />
          Painel demonstrativo — os pedidos são salvos no banco de dados da loja.
        </div>
      </div>
    </div>
  );
}
