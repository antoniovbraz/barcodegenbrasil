import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { config, totalEtiquetas, status } = await request.json();

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase não configurado' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('generation_history')
      .insert({
        config,
        total_etiquetas: totalEtiquetas,
        status: status || 'completed',
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar histórico:', error);
      return NextResponse.json(
        { error: 'Erro ao salvar histórico' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ history: [] });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('generation_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Erro ao buscar histórico:', error);
      return NextResponse.json({ history: [] });
    }

    return NextResponse.json({ history: data || [] });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ history: [] });
  }
}
