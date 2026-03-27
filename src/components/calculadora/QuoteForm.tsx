import React, { useMemo, useState } from 'react';
import { OPERATIONAL_DEFAULTS, PRODUCTS, ProductDefinition, formatCurrency } from '../../lib/calculadora';
import { QuickClientDialog, QuickClientFormValue } from './QuickClientDialog';

export interface ClientOption {
  id: string;
  label: string;
}

export interface QuoteFormItem {
  productId: string;
  quantity: number;
  meters: number;
}

export interface QuoteDraft {
  clientId?: string;
  clientName: string;
  status: 'pendente';
  items: QuoteFormItem[];
  operationalCosts: typeof OPERATIONAL_DEFAULTS;
  discountPercent: number;
  notes: string;
  total: number;
}

interface QuoteFormProps {
  clients: ClientOption[];
  onAddClient: (client: QuickClientFormValue) => ClientOption;
  onSave: (quote: QuoteDraft) => void;
}

const steps = ['Cliente', 'Produtos', 'Custos', 'Resumo'];

export const QuoteForm: React.FC<QuoteFormProps> = ({ clients, onAddClient, onSave }) => {
  const [step, setStep] = useState(0);
  const [isQuickClientOpen, setQuickClientOpen] = useState(false);
  const [clientId, setClientId] = useState('');
  const [quickName, setQuickName] = useState('');
  const [items, setItems] = useState<QuoteFormItem[]>([]);
  const [newProductId, setNewProductId] = useState(PRODUCTS[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [meters, setMeters] = useState(1);
  const [operationalCosts, setOperationalCosts] = useState(OPERATIONAL_DEFAULTS);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [notes, setNotes] = useState('');

  const selectedClient = clients.find((client) => client.id === clientId);

  const itemsSubtotal = useMemo(() => {
    return items.reduce((total, item) => {
      const product = PRODUCTS.find((entry) => entry.id === item.productId);
      if (!product) return total;
      const chargeable = product.priceType === 'per_meter' ? item.meters : item.quantity;
      return total + product.unitPrice * chargeable;
    }, 0);
  }, [items]);

  const operationalTotal = useMemo(
    () => Object.values(operationalCosts).reduce((acc, value) => acc + Number(value || 0), 0),
    [operationalCosts]
  );

  const grossTotal = itemsSubtotal + operationalTotal;
  const total = grossTotal - grossTotal * (discountPercent / 100);

  const addItem = () => {
    setItems((current) => [...current, { productId: newProductId, quantity, meters }]);
  };

  const productById = (id: string): ProductDefinition | undefined => PRODUCTS.find((item) => item.id === id);

  const saveQuote = () => {
    onSave({
      clientId: selectedClient?.id,
      clientName: selectedClient?.label ?? quickName,
      status: 'pendente',
      items,
      operationalCosts,
      discountPercent,
      notes,
      total
    });

    setStep(0);
    setClientId('');
    setQuickName('');
    setItems([]);
    setDiscountPercent(0);
    setNotes('');
    setOperationalCosts(OPERATIONAL_DEFAULTS);
  };

  return (
    <section className="rounded-xl border border-zinc-700 bg-zinc-900 p-5 space-y-4">
      <div className="flex gap-2 flex-wrap">
        {steps.map((label, index) => (
          <div key={label} className={`px-3 py-1 text-xs rounded-full ${index === step ? 'bg-orange-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}>
            {index + 1}. {label}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-3">
          <label className="text-sm text-zinc-400">Selecionar cliente</label>
          <select value={clientId} onChange={(event) => setClientId(event.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2">
            <option value="">Selecione</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>{client.label}</option>
            ))}
          </select>
          <p className="text-xs text-zinc-500">ou usar nome rápido</p>
          <input value={quickName} onChange={(event) => setQuickName(event.target.value)} placeholder="Nome do cliente" className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2" />
          <button type="button" onClick={() => setQuickClientOpen(true)} className="px-3 py-2 rounded border border-zinc-600 text-sm">Novo Cliente</button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3">
          <div className="grid md:grid-cols-4 gap-2">
            <select value={newProductId} onChange={(event) => setNewProductId(event.target.value)} className="md:col-span-2 bg-zinc-950 border border-zinc-700 rounded px-3 py-2">
              {PRODUCTS.map((product) => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
            <input type="number" min={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="bg-zinc-950 border border-zinc-700 rounded px-3 py-2" placeholder="Quantidade" />
            <input type="number" min={1} value={meters} onChange={(event) => setMeters(Number(event.target.value))} className="bg-zinc-950 border border-zinc-700 rounded px-3 py-2" placeholder="Metragem" />
          </div>
          <button type="button" onClick={addItem} className="px-3 py-2 rounded bg-orange-500 text-black font-semibold text-sm">Adicionar Produto</button>

          <ul className="space-y-2">
            {items.map((item, index) => {
              const product = productById(item.productId);
              if (!product) return null;
              const chargeable = product.priceType === 'per_meter' ? item.meters : item.quantity;
              return (
                <li key={`${item.productId}-${index}`} className="text-sm text-zinc-300 flex justify-between border-b border-zinc-800 py-1">
                  <span>{product.name} ({product.priceType === 'per_meter' ? `${item.meters} m` : `${item.quantity} un`})</span>
                  <span>{formatCurrency(product.unitPrice * chargeable)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {step === 2 && (
        <div className="grid md:grid-cols-2 gap-2">
          {Object.entries(operationalCosts).map(([key, value]) => (
            <label key={key} className="text-sm text-zinc-400">
              {key}
              <input type="number" value={value} onChange={(event) => setOperationalCosts((prev) => ({ ...prev, [key]: Number(event.target.value) }))} className="mt-1 w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-zinc-200" />
            </label>
          ))}
          <label className="text-sm text-zinc-400 md:col-span-2">
            Desconto (%)
            <input type="number" min={0} max={100} value={discountPercent} onChange={(event) => setDiscountPercent(Number(event.target.value))} className="mt-1 w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-zinc-200" />
          </label>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Observações" className="md:col-span-2 bg-zinc-950 border border-zinc-700 rounded px-3 py-2 min-h-20" />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-1 text-sm">
          <p>Cliente: <strong>{selectedClient?.label || quickName || 'Não informado'}</strong></p>
          <p>Subtotal produtos: <strong>{formatCurrency(itemsSubtotal)}</strong></p>
          <p>Custos operacionais: <strong>{formatCurrency(operationalTotal)}</strong></p>
          <p>Desconto: <strong>{discountPercent}%</strong></p>
          <p className="text-lg mt-2">Total: <strong>{formatCurrency(total)}</strong></p>
          <button type="button" onClick={saveQuote} className="mt-3 px-3 py-2 rounded bg-emerald-500 text-black font-semibold">Salvar como Pendente</button>
        </div>
      )}

      <div className="flex justify-between">
        <button type="button" disabled={step === 0} onClick={() => setStep((value) => Math.max(value - 1, 0))} className="px-3 py-2 rounded border border-zinc-700 disabled:opacity-50">Voltar</button>
        <button type="button" disabled={step === steps.length - 1} onClick={() => setStep((value) => Math.min(value + 1, steps.length - 1))} className="px-3 py-2 rounded border border-zinc-700 disabled:opacity-50">Próximo</button>
      </div>

      <QuickClientDialog
        open={isQuickClientOpen}
        onClose={() => setQuickClientOpen(false)}
        onSave={(client) => {
          const saved = onAddClient(client);
          setClientId(saved.id);
          setQuickName(saved.label);
        }}
      />
    </section>
  );
};
