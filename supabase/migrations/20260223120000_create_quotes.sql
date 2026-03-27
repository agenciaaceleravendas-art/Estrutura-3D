create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  client_name text,
  status text not null default 'pendente' check (status in ('pendente', 'pronto_para_envio', 'enviado', 'fechado', 'perdido')),
  items jsonb not null default '[]'::jsonb,
  operational_costs jsonb not null default '{}'::jsonb,
  total numeric not null default 0,
  notes text,
  created_by uuid not null,
  discount_percent numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.quotes enable row level security;

create policy "quotes_staff_select"
  on public.quotes
  for select
  using (public.get_current_user_role() in ('staff', 'seller', 'admin'));

create policy "quotes_staff_insert"
  on public.quotes
  for insert
  with check (public.get_current_user_role() in ('staff', 'seller', 'admin'));

create policy "quotes_staff_update"
  on public.quotes
  for update
  using (public.get_current_user_role() in ('staff', 'seller', 'admin'))
  with check (public.get_current_user_role() in ('staff', 'seller', 'admin'));

create policy "quotes_admin_delete"
  on public.quotes
  for delete
  using (public.get_current_user_role() = 'admin');

create or replace function public.set_quotes_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger quotes_set_updated_at
before update on public.quotes
for each row
execute function public.set_quotes_updated_at();
