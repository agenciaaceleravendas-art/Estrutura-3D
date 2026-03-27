export type PriceType = 'unit' | 'per_meter';

export interface BomPart {
  name: string;
  quantity: number;
  unit: string;
}

export interface ProductDefinition {
  id: string;
  name: string;
  unitPrice: number;
  priceType: PriceType;
  bom: BomPart[];
}

export interface CalculationInput {
  productId: string;
  quantity: number;
  meters?: number;
}

export interface ProductCalculationResult {
  product: ProductDefinition;
  billOfMaterials: BomPart[];
  quantity: number;
  chargeableAmount: number;
  subtotal: number;
}

// Intencionalmente vazio: custos não são mais derivados dos componentes.
export const DEFAULT_PRICES: Record<string, number> = {};

export const PRODUCT_PRICES: Record<string, { price: number; priceType: PriceType }> = {
  tenda_4x4: { price: 800, priceType: 'unit' },
  tenda_6x6: { price: 1000, priceType: 'unit' },
  tenda_8x8: { price: 1400, priceType: 'unit' },
  tenda_10x10: { price: 1700, priceType: 'unit' },
  tenda_12x12: { price: 2000, priceType: 'unit' },
  tenda_chapeu_460: { price: 600, priceType: 'unit' },
  tenda_chapeu_6x6_calhada: { price: 700, priceType: 'unit' },
  tenda_calhada_10x10: { price: 1500, priceType: 'unit' },
  boxtruss: { price: 35, priceType: 'per_meter' },
  piso: { price: 35, priceType: 'per_meter' },
  fechamento: { price: 20, priceType: 'per_meter' },
  gradil: { price: 15, priceType: 'per_meter' },
  barricada: { price: 50, priceType: 'per_meter' },
  arquibancada_4: { price: 400, priceType: 'per_meter' },
  arquibancada_8: { price: 500, priceType: 'per_meter' },
  arquibancada_12: { price: 600, priceType: 'per_meter' },
  arquibancada_16: { price: 800, priceType: 'per_meter' },
  camarote: { price: 1000, priceType: 'per_meter' },
  unifila_prata: { price: 50, priceType: 'unit' },
  unifila_dourado: { price: 100, priceType: 'unit' },
  climatizador: { price: 350, priceType: 'per_meter' },
  octanorme: { price: 375, priceType: 'per_meter' },
  forracao_carpete: { price: 25, priceType: 'per_meter' },
  forracao: { price: 35, priceType: 'per_meter' },
  cobertura_ground: { price: 50, priceType: 'per_meter' },
  passa_cabo: { price: 50, priceType: 'per_meter' },
  palco: { price: 0, priceType: 'per_meter' }
};

export const PRODUCTS: ProductDefinition[] = [
  { id: 'tenda_4x4', name: 'Tenda 4x4 Piramidal', unitPrice: 800, priceType: 'unit', bom: [{ name: 'Cobertura 4x4', quantity: 1, unit: 'un' }] },
  { id: 'tenda_6x6', name: 'Tenda 6x6 Piramidal', unitPrice: 1000, priceType: 'unit', bom: [{ name: 'Cobertura 6x6', quantity: 1, unit: 'un' }] },
  { id: 'tenda_8x8', name: 'Tenda 8x8 Piramidal', unitPrice: 1400, priceType: 'unit', bom: [{ name: 'Cobertura 8x8', quantity: 1, unit: 'un' }] },
  { id: 'tenda_10x10', name: 'Tenda 10x10 Piramidal', unitPrice: 1700, priceType: 'unit', bom: [{ name: 'Cobertura 10x10', quantity: 1, unit: 'un' }] },
  { id: 'tenda_12x12', name: 'Tenda 12x12 Piramidal', unitPrice: 2000, priceType: 'unit', bom: [{ name: 'Cobertura 12x12', quantity: 1, unit: 'un' }] },
  { id: 'tenda_chapeu_460', name: 'Tenda Chapeu de Bruxa 4,60', unitPrice: 600, priceType: 'unit', bom: [{ name: 'Cobertura Chapeu 4,60', quantity: 1, unit: 'un' }] },
  { id: 'tenda_chapeu_6x6_calhada', name: 'Tenda Chapeu de Bruxa 6x6 Calhada', unitPrice: 700, priceType: 'unit', bom: [{ name: 'Cobertura Chapeu 6x6', quantity: 1, unit: 'un' }] },
  { id: 'tenda_calhada_10x10', name: 'Tenda Piramidal Calhada 10x10', unitPrice: 1500, priceType: 'unit', bom: [{ name: 'Cobertura Calhada 10x10', quantity: 1, unit: 'un' }] },
  { id: 'boxtruss', name: 'Boxtruss', unitPrice: 35, priceType: 'per_meter', bom: [{ name: 'Modulo Boxtruss', quantity: 1, unit: 'm' }] },
  { id: 'piso', name: 'Piso', unitPrice: 35, priceType: 'per_meter', bom: [{ name: 'Modulo Piso', quantity: 1, unit: 'm²' }] },
  { id: 'fechamento', name: 'Fechamento', unitPrice: 20, priceType: 'per_meter', bom: [{ name: 'Painel Fechamento', quantity: 1, unit: 'm' }] },
  { id: 'gradil', name: 'Gradil', unitPrice: 15, priceType: 'per_meter', bom: [{ name: 'Modulo Gradil', quantity: 1, unit: 'm' }] },
  { id: 'barricada', name: 'Barricada', unitPrice: 50, priceType: 'per_meter', bom: [{ name: 'Modulo Barricada', quantity: 1, unit: 'm' }] },
  { id: 'arquibancada_4', name: 'Arquibancada 4 Degraus', unitPrice: 400, priceType: 'per_meter', bom: [{ name: 'Modulo Arquibancada 4', quantity: 1, unit: 'm' }] },
  { id: 'arquibancada_8', name: 'Arquibancada 8 Degraus', unitPrice: 500, priceType: 'per_meter', bom: [{ name: 'Modulo Arquibancada 8', quantity: 1, unit: 'm' }] },
  { id: 'arquibancada_12', name: 'Arquibancada 12 Degraus', unitPrice: 600, priceType: 'per_meter', bom: [{ name: 'Modulo Arquibancada 12', quantity: 1, unit: 'm' }] },
  { id: 'arquibancada_16', name: 'Arquibancada 16 Degraus', unitPrice: 800, priceType: 'per_meter', bom: [{ name: 'Modulo Arquibancada 16', quantity: 1, unit: 'm' }] },
  { id: 'camarote', name: 'Camarote', unitPrice: 1000, priceType: 'per_meter', bom: [{ name: 'Estrutura Camarote', quantity: 1, unit: 'm' }] },
  { id: 'unifila_prata', name: 'Unifila Prata', unitPrice: 50, priceType: 'unit', bom: [{ name: 'Pedestal Prata', quantity: 1, unit: 'un' }] },
  { id: 'unifila_dourado', name: 'Unifila Dourado', unitPrice: 100, priceType: 'unit', bom: [{ name: 'Pedestal Dourado', quantity: 1, unit: 'un' }] },
  { id: 'climatizador', name: 'Climatizador', unitPrice: 350, priceType: 'per_meter', bom: [{ name: 'Conjunto Climatizacao', quantity: 1, unit: 'm' }] },
  { id: 'octanorme', name: 'Octanorme', unitPrice: 375, priceType: 'per_meter', bom: [{ name: 'Modulo Octanorme', quantity: 1, unit: 'm' }] },
  { id: 'forracao_carpete', name: 'Forracao Carpete', unitPrice: 25, priceType: 'per_meter', bom: [{ name: 'Carpete', quantity: 1, unit: 'm²' }] },
  { id: 'forracao', name: 'Forracao', unitPrice: 35, priceType: 'per_meter', bom: [{ name: 'Forro', quantity: 1, unit: 'm²' }] },
  { id: 'cobertura_ground', name: 'Cobertura de Ground', unitPrice: 50, priceType: 'per_meter', bom: [{ name: 'Cobertura Ground', quantity: 1, unit: 'm' }] },
  { id: 'passa_cabo', name: 'Passa Cabo', unitPrice: 50, priceType: 'per_meter', bom: [{ name: 'Canaleta Passa Cabo', quantity: 1, unit: 'm' }] },
  { id: 'palco', name: 'Palco', unitPrice: 0, priceType: 'per_meter', bom: [{ name: 'Estrutura Palco', quantity: 1, unit: 'm²' }] }
];

export const OPERATIONAL_DEFAULTS = {
  freteCarroViagem: 120,
  freteCarroEstadia: 90,
  frete3x4: 3.5,
  freteBau: 5,
  freteCarretaCavalinho: 8,
  freteCarretaAtrelado: 10,
  hospedagem: 120,
  alimentacao: 80
};

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export function calculateResultsForProduct(input: CalculationInput): ProductCalculationResult {
  const product = PRODUCTS.find((item) => item.id === input.productId);

  if (!product) {
    throw new Error(`Produto não encontrado: ${input.productId}`);
  }

  const chargeableAmount = product.priceType === 'per_meter' ? Math.max(input.meters ?? 0, 0) : Math.max(input.quantity, 0);
  const multiplier = product.priceType === 'per_meter' ? 1 : Math.max(input.quantity, 0);
  const billOfMaterials = product.bom.map((part) => ({
    ...part,
    quantity: part.quantity * multiplier
  }));

  return {
    product,
    billOfMaterials,
    quantity: input.quantity,
    chargeableAmount,
    subtotal: product.unitPrice * chargeableAmount
  };
}
