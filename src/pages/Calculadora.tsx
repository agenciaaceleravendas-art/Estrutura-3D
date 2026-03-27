import React, { useMemo, useState } from 'react';
import { calculateResultsForProduct, formatCurrency, PRODUCTS } from '../lib/calculadora';
import { QuoteForm } from '../components/calculadora/QuoteForm';
import { QuoteItem, QuotesList, QuoteStatus } from '../components/calculadora/QuotesList';
import { QuickClientFormValue } from '../components/calculadora/QuickClientDialog';

interface ClientRecord {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
}

export const CalculadoraPage: React.FC = () => {
  const [tab, setTab] = useState<'montar' | 'orcamentos'>('montar');

  const [productId, setProductId] = useState(PRODUCTS[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [meters, setMeters] = useState(1);

  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>('all');

  const result = useMemo(() => {
    if (!productId) return null;
    return calculateResultsForProduct({ productId, quantity, meters });
  }, [productId, quantity, meters]);

  return (
    <div className="max-w-6xl mx-auto p-5 space-y-5 text-zinc-100">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Calculadora</h1>
        <p className="text-zinc-400 text-sm">Monte pedido e crie orçamentos com preços da planilha de vendas.</p>
      </header>

      <div className="flex gap-2">
        <button onClick={() => setTab('montar')} className={`px-4 py-2 rounded ${tab === 'montar' ? 'bg-orange-500 text-black' : 'bg-zinc-800'}`}>Montar Pedido</button>
        <button onClick={() => setTab('orcamentos')} className={`px-4 py-2 rounded ${tab === 'orcamentos' ? 'bg-orange-500 text-black' : 'bg-zinc-800'}`}>Orçamentos</button>
      </div>

      {tab === 'montar' && (
        <section className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 space-y-3">
            <h2 className="font-semibold">Montar Pedido</h2>
            <select value={productId} onChange={(event) => setProductId(event.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2">
              {PRODUCTS.map((product) => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
            <input type="number" min={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2" placeholder="Quantidade" />
            <input type="number" min={1} value={meters} onChange={(event) => setMeters(Number(event.target.value))} className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2" placeholder="Metragem" />
          </div>

          <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 space-y-2">
            <h3 className="font-semibold">Resumo</h3>
            {result && (
              <>
                <p>Produto: {result.product.name}</p>
                <p>Tipo de preço: {result.product.priceType === 'per_meter' ? 'Por metro' : 'Unitário'}</p>
                <p>Subtotal: <strong>{formatCurrency(result.subtotal)}</strong></p>
                <div>
                  <p className="text-sm text-zinc-400">Romaneio (BOM)</p>
                  <ul className="text-sm text-zinc-300 list-disc list-inside">
                    {result.billOfMaterials.map((part) => (
                      <li key={part.name}>{part.name}: {part.quantity} {part.unit}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {tab === 'orcamentos' && (
        <section className="space-y-4">
          <QuoteForm
            clients={clients.map((client) => ({ id: client.id, label: client.label }))}
            onAddClient={(client: QuickClientFormValue) => {
              const label = `${client.firstName} ${client.lastName}`.trim();
              const created: ClientRecord = {
                id: crypto.randomUUID(),
                label,
                ...client
              };
              setClients((previous) => [created, ...previous]);
              return { id: created.id, label: created.label };
            }}
            onSave={(draft) => {
              setQuotes((previous) => [
                {
                  id: crypto.randomUUID(),
                  clientLabel: draft.clientName || 'Cliente não informado',
                  total: draft.total,
                  status: draft.status,
                  createdAt: new Date().toISOString()
                },
                ...previous
              ]);
            }}
          />

          <QuotesList
            quotes={quotes}
            selectedStatus={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onStatusChange={(id, status) => setQuotes((previous) => previous.map((quote) => (quote.id === id ? { ...quote, status } : quote)))}
            onDuplicate={(id) => {
              setQuotes((previous) => {
                const found = previous.find((quote) => quote.id === id);
                if (!found) return previous;
                return [{ ...found, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...previous];
              });
            }}
          />
        </section>
      )}
    </div>
  );
};
