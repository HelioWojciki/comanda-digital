"use client";

import { Comanda } from "./CardComanda";

interface DashboardMetricasProps {
  comandas: Comanda[];
}

export default function DashboardMetricas({ comandas }: DashboardMetricasProps) {
  const comandasAbertas = comandas.filter((c) => c.aberta);
  const comandasPagas = comandas.filter((c) => !c.aberta);

  // sdoma das pagas
  const totalFaturado = comandasPagas.reduce((soma, c) => soma + (c.valorTotal || 0), 0);

  // ticket médio (faturamento/ Qtd de mesas pagas)
  const ticketMedio = comandasPagas.length > 0 ? totalFaturado / comandasPagas.length : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Card: faturamento */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200 shadow-sm">
        <p className="text-xs font-bold text-green-700 uppercase tracking-wider">Faturamento Total</p>
        <h3 className="text-2xl font-black text-green-900 mt-1">R$ {totalFaturado.toFixed(2)}</h3>
        <p className="text-xs text-green-600 mt-1">{comandasPagas.length} comandas pagas</p>
      </div>

      {/* card: ticket médio */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200 shadow-sm">
        <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Ticket Médio</p>
        <h3 className="text-2xl font-black text-blue-900 mt-1">R$ {ticketMedio.toFixed(2)}</h3>
        <p className="text-xs text-blue-600 mt-1">Média de consumo por mesa</p>
      </div>

      {/* Card: mesas ativas */}
      <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl border border-red-200 shadow-sm">
        <p className="text-xs font-bold text-red-700 uppercase tracking-wider">Mesas Ativas</p>
        <h3 className="text-2xl font-black text-red-900 mt-1">{comandasAbertas.length}</h3>
        <p className="text-xs text-red-600 mt-1">Clientes em atendimento</p>
      </div>
    </div>
  );
}