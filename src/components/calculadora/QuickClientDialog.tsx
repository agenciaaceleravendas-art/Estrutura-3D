import React, { useState } from 'react';

export interface QuickClientFormValue {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
}

interface QuickClientDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (client: QuickClientFormValue) => void;
}

const INITIAL_STATE: QuickClientFormValue = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address: '',
  city: ''
};

export const QuickClientDialog: React.FC<QuickClientDialogProps> = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState<QuickClientFormValue>(INITIAL_STATE);

  if (!open) {
    return null;
  }

  const updateField = (field: keyof QuickClientFormValue, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.firstName.trim() || !form.phone.trim()) {
      return;
    }

    onSave(form);
    setForm(INITIAL_STATE);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl rounded-xl border border-zinc-700 bg-zinc-900 p-6 space-y-4">
        <h2 className="text-xl font-semibold">Cadastro rápido de cliente</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input required placeholder="Primeiro Nome" value={form.firstName} onChange={(event) => updateField('firstName', event.target.value)} className="bg-zinc-950 border border-zinc-700 rounded px-3 py-2" />
          <input placeholder="Sobrenome" value={form.lastName} onChange={(event) => updateField('lastName', event.target.value)} className="bg-zinc-950 border border-zinc-700 rounded px-3 py-2" />
          <input required placeholder="Telefone" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} className="bg-zinc-950 border border-zinc-700 rounded px-3 py-2" />
          <input type="email" placeholder="E-mail" value={form.email} onChange={(event) => updateField('email', event.target.value)} className="bg-zinc-950 border border-zinc-700 rounded px-3 py-2" />
          <input placeholder="Endereço (logradouro + número)" value={form.address} onChange={(event) => updateField('address', event.target.value)} className="sm:col-span-2 bg-zinc-950 border border-zinc-700 rounded px-3 py-2" />
          <input placeholder="Cidade" value={form.city} onChange={(event) => updateField('city', event.target.value)} className="bg-zinc-950 border border-zinc-700 rounded px-3 py-2" />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded border border-zinc-600">Cancelar</button>
          <button type="submit" className="px-4 py-2 rounded bg-orange-500 text-black font-semibold">Salvar cliente</button>
        </div>
      </form>
    </div>
  );
};
