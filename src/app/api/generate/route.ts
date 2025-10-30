import { NextRequest, NextResponse } from 'next/server';
import { BarcodeConfig } from '@/types/barcode';
import { generateBarcodeWithText } from '@/lib/barcode-utils';

// Configuração do runtime
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const config: BarcodeConfig = await request.json();

    // Validações
    if (!config.base_fixo || !config.codigo_minerva) {
      return NextResponse.json(
        { error: 'Configuração inválida' },
        { status: 400 }
      );
    }

    if (config.rg_inicial > config.rg_final) {
      return NextResponse.json(
        { error: 'RG inicial deve ser menor ou igual ao RG final' },
        { status: 400 }
      );
    }

    const totalEtiquetas = config.rg_final - config.rg_inicial + 1;

    // Limite de segurança
    if (totalEtiquetas > 1000) {
      return NextResponse.json(
        { error: 'Máximo de 1000 etiquetas por vez' },
        { status: 400 }
      );
    }

    // Gerar lista de códigos para o cliente processar
    const codigos = [];
    for (let rg = config.rg_inicial; rg <= config.rg_final; rg++) {
      codigos.push({
        rg,
        codigo: generateBarcodeWithText(config, rg),
      });
    }

    return NextResponse.json({
      success: true,
      codigos,
      totalEtiquetas,
      fileName: config.nome_pdf || 'etiquetas.pdf',
    });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: String(error) },
      { status: 500 }
    );
  }
}
