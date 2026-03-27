import React from 'react';
import { formatCurrency } from '../../lib/calculadora';

export type QuoteStatus = 'pendente' | 'pronto_para_envio' | 'enviado' | 'fechado' | 'perdido';

export interface QuoteItem {
  id: string;
  clientLabel: string;
  total: number;
  status: QuoteStatus;
  createdAt: string;
}

interface QuotesListProps {
  quotes: QuoteItem[];
  selectedStatus: QuoteStatus | 'all';
  onStatusFilterChange: (status: QuoteStatus | 'all') => void;
  onStatusChange: (id: string, status: QuoteStatus) => void;
  onDuplicate: (id: string) => void;
}

const STATUS_META: Record<QuoteStatus, { label: string; color: string }> = {
  pendente: { label: 'Pendente', color: 'bg-amber-500/20 text-amber-300' },
  pronto_para_envio: { label: 'Pronto para Envio', color: 'bg-blue-500/20 text-blue-300' },
  enviado: { label: 'Enviado', color: 'bg-violet-500/20 text-violet-300' },
  fechado: { label: 'Fechado', color: 'bg-emerald-500/20 text-emerald-300' },
  perdido: { label: 'Perdido', color: 'bg-rose-500/20 text-rose-300' }
};

export const QuotesList: React.FC<QuotesListProps> = ({ quotes, selectedStatus, onStatusFilterChange, onStatusChange, onDuplicate }) => {
  const filteredQuotes = selectedStatus === 'all' ? quotes : quotes.filter((quote) => quote.status === selectedStatus);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => onStatusFilterChange('all')} className={`px-3 py-1 rounded-full text-xs border ${selectedStatus === 'all' ? 'border-orange-400 text-orange-300' : 'border-zinc-700 text-zinc-400'}`}>
          Todos
        </button>
        {(Object.keys(STATUS_META) as QuoteStatus[]).map((status) => (
          <button key={status} onClick={() => onStatusFilterChange(status)} className={`px-3 py-1 rounded-full text-xs ${STATUS_META[status].color} ${selectedStatus === status ? 'ring-1 ring-white/40' : ''}`}>
            {STATUS_META[status].label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredQuotes.length === 0 && <p className="text-zinc-400">Nenhum orçamento encontrado.</p>}

        {filteredQuotes.map((quote) => (
          <article key={quote.id} className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 grid gap-3 md:grid-cols-[1fr_auto]">
            <div>
              <p className="font-semibold">{quote.clientLabel}</p>
              <p className="text-sm text-zinc-400">Criado em {new Date(quote.createdAt).toLocaleDateString('pt-BR')}</p>
              <p className="text-sm text-zinc-300 mt-1">Total: {formatCurrency(quote.total)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-end">
              <select value={quote.status} onChange={(event) => onStatusChange(quote.id, event.target.value as QuoteStatus)} className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-sm">
                {(Object.keys(STATUS_META) as QuoteStatus[]).map((status) => (
                  <option key={status} value={status}>{STATUS_META[status].label}</option>
                ))}
              </select>
              <button className="text-xs px-3 py-1 rounded border border-zinc-700" type="button">Exportar PDF</button>
              <button className="text-xs px-3 py-1 rounded border border-zinc-700" type="button">Compartilhar WhatsApp</button>
              <button className="text-xs px-3 py-1 rounded border border-zinc-700" type="button" onClick={() => onDuplicate(quote.id)}>Duplicar</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
