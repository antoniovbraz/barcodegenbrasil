export interface BarcodeConfig {
  id?: string;
  base_fixo: string;
  codigo_minerva: string;
  peso_liquido: string;
  data_producao: string;
  dias_validade: number;
  tara: string;
  rg_inicial: number;
  rg_final: number;
  nome_pdf: string;
  created_at?: string;
  user_id?: string;
}

export interface GenerationHistory {
  id?: string;
  config: BarcodeConfig;
  total_etiquetas: number;
  pdf_url?: string;
  status: 'pending' | 'completed' | 'error';
  created_at?: string;
  user_id?: string;
}
