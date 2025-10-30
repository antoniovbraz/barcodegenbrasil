import { BarcodeConfig } from '@/types/barcode';

/**
 * Converte o peso em kg para 5 dígitos usando kg*100 (hectogramas).
 * Ex.: 10 kg -> 1000 -> '01000'
 */
export function formatPesoLiquido(valorKg: string): string {
  const s = valorKg.replace(',', '.').trim();
  try {
    const hg = Math.round(parseFloat(s) * 100); // hectogramas
    return hg.toString().padStart(5, '0');
  } catch {
    return '00000';
  }
}

/**
 * Gera o sufixo fixo com formatação correta
 */
export function generateSuffix(config: BarcodeConfig): string {
  // Data DD/MM/YYYY -> DDMMYYYY
  const [dia, mes, ano] = config.data_producao.split('/');
  const dataFormatada = dia.padStart(2, '0') + mes.padStart(2, '0') + ano;

  // Peso líquido (kg -> *100) em 5 dígitos
  const pesoFormatado = formatPesoLiquido(config.peso_liquido);

  // Dias de validade em 3 dígitos
  const validadeFormatada = config.dias_validade.toString().padStart(3, '0');

  // Tara em 6 dígitos (gramas)
  const taraFormatada = Math.floor(parseFloat(config.tara.replace(',', '.')))
    .toString()
    .padStart(6, '0');

  return `${config.codigo_minerva}01${pesoFormatado}${dataFormatada}${validadeFormatada}${taraFormatada}`;
}

/**
 * Gera o código de barras completo
 */
export function generateBarcodeWithText(config: BarcodeConfig, rg: number): string {
  const sufixo = generateSuffix(config);
  const rgFormatado = rg.toString().padStart(8, '0');
  return config.base_fixo + rgFormatado + sufixo;
}

/**
 * Valida a data no formato DD/MM/YYYY
 */
export function isValidDate(dateString: string): boolean {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateString.match(regex);
  
  if (!match) return false;
  
  const [, dia, mes, ano] = match;
  const d = parseInt(dia, 10);
  const m = parseInt(mes, 10);
  const y = parseInt(ano, 10);
  
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  if (y < 1900 || y > 2100) return false;
  
  return true;
}
