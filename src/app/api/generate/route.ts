import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore - bwip-js não tem tipos TypeScript
import bwipjs from 'bwip-js';
// @ts-ignore - jspdf pode ter problemas com tipos
import { jsPDF } from 'jspdf';
import { BarcodeConfig } from '@/types/barcode';
import { generateBarcodeWithText } from '@/lib/barcode-utils';

// Configuração do runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Aumentar o tempo de execução para 60 segundos (máximo no Vercel Hobby)
export const maxDuration = 60;

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

    // Criar PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [100, 75], // 10cm x 7.5cm
    });

    let isFirstPage = true;

    for (let rg = config.rg_inicial; rg <= config.rg_final; rg++) {
      if (!isFirstPage) {
        pdf.addPage([100, 75], 'landscape');
      }
      isFirstPage = false;

      const codigoCompleto = generateBarcodeWithText(config, rg);

      try {
        // Gerar código de barras Code128
        const pngBuffer = await bwipjs.toBuffer({
          bcid: 'code128',
          text: codigoCompleto,
          scale: 3,
          height: 15,
          includetext: false,
        });

        const base64Image = pngBuffer.toString('base64');
        const imgData = `data:image/png;base64,${base64Image}`;

        // Texto acima do código de barras
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(codigoCompleto, 50, 25, { align: 'center' });

        // Código de barras centralizado
        const imgWidth = 90;
        const imgHeight = 40;
        const x = (100 - imgWidth) / 2;
        const y = 30;

        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      } catch (error) {
        console.error(`Erro ao gerar código para RG ${rg}:`, error);
        continue;
      }
    }

    // Gerar PDF como buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
    const base64Pdf = pdfBuffer.toString('base64');

    return NextResponse.json({
      success: true,
      pdf: base64Pdf,
      totalEtiquetas,
      fileName: config.nome_pdf || 'etiquetas.pdf',
    });
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar PDF', details: String(error) },
      { status: 500 }
    );
  }
}
