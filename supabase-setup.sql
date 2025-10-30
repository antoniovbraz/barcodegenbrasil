-- ============================================
-- SQL para configurar o Supabase
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- Criar tabela de histórico de gerações
CREATE TABLE IF NOT EXISTS generation_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  config JSONB NOT NULL,
  total_etiquetas INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID
);

-- Criar índice para melhor performance nas consultas
CREATE INDEX IF NOT EXISTS idx_generation_history_created_at 
ON generation_history(created_at DESC);

-- Criar índice para filtrar por status
CREATE INDEX IF NOT EXISTS idx_generation_history_status 
ON generation_history(status);

-- Comentários nas colunas (documentação)
COMMENT ON TABLE generation_history IS 'Histórico de gerações de códigos de barras';
COMMENT ON COLUMN generation_history.id IS 'ID único da geração';
COMMENT ON COLUMN generation_history.config IS 'Configuração usada para gerar os códigos (JSON)';
COMMENT ON COLUMN generation_history.total_etiquetas IS 'Total de etiquetas geradas';
COMMENT ON COLUMN generation_history.status IS 'Status da geração: pending, completed, error';
COMMENT ON COLUMN generation_history.created_at IS 'Data e hora da geração';
COMMENT ON COLUMN generation_history.user_id IS 'ID do usuário (opcional, para autenticação futura)';

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Habilitar RLS na tabela
ALTER TABLE generation_history ENABLE ROW LEVEL SECURITY;

-- Política 1: Permitir todas as operações (para desenvolvimento)
-- ⚠️ AVISO: Esta política é permissiva. Para produção, ajuste conforme necessário.
CREATE POLICY "Allow all operations" ON generation_history
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- Políticas alternativas (comentadas)
-- Descomente e ajuste conforme necessário
-- ============================================

-- Política 2: Permitir apenas inserção (para aplicações sem autenticação)
-- DROP POLICY IF EXISTS "Allow all operations" ON generation_history;
-- CREATE POLICY "Allow insert" ON generation_history
--   FOR INSERT
--   WITH CHECK (true);

-- CREATE POLICY "Allow select" ON generation_history
--   FOR SELECT
--   USING (true);

-- Política 3: Permitir apenas para usuários autenticados
-- DROP POLICY IF EXISTS "Allow all operations" ON generation_history;
-- CREATE POLICY "Allow authenticated users" ON generation_history
--   FOR ALL
--   USING (auth.role() = 'authenticated')
--   WITH CHECK (auth.role() = 'authenticated');

-- Política 4: Cada usuário vê apenas seus próprios registros
-- DROP POLICY IF EXISTS "Allow all operations" ON generation_history;
-- CREATE POLICY "Users see own data" ON generation_history
--   FOR SELECT
--   USING (auth.uid() = user_id);

-- CREATE POLICY "Users insert own data" ON generation_history
--   FOR INSERT
--   WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Função para limpar histórico antigo (opcional)
-- ============================================

-- Criar função para deletar registros com mais de 90 dias
CREATE OR REPLACE FUNCTION cleanup_old_history()
RETURNS void AS $$
BEGIN
  DELETE FROM generation_history
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Comentário na função
COMMENT ON FUNCTION cleanup_old_history() IS 'Remove registros de histórico com mais de 90 dias';

-- ============================================
-- Verificação (queries úteis)
-- ============================================

-- Ver todas as tabelas
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Ver estrutura da tabela
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'generation_history';

-- Ver políticas de RLS
-- SELECT * FROM pg_policies WHERE tablename = 'generation_history';

-- Testar inserção
-- INSERT INTO generation_history (config, total_etiquetas, status)
-- VALUES (
--   '{"base_fixo": "280000179", "codigo_minerva": "21789", "peso_liquido": "10", "data_producao": "18/08/2025", "dias_validade": 150, "tara": "258", "rg_inicial": 1, "rg_final": 10, "nome_pdf": "teste.pdf"}',
--   10,
--   'completed'
-- );

-- Ver dados inseridos
-- SELECT * FROM generation_history ORDER BY created_at DESC LIMIT 10;

-- ============================================
-- Concluído! ✅
-- ============================================
-- Sua tabela está pronta para uso.
-- Não se esqueça de adicionar as variáveis de ambiente no Vercel!
