import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://vmglciwaonssdv1rbgqk.supabase.co'
const supabaseKey = 'sb_publishable_SUA_KEY_AQUI'

export const supabase = createClient(supabaseUrl, supabaseKey)

import { supabase } from './services/supabase'

async function adicionarTask() {
  const { data, error } = await supabase
    .from('Tarefas')
    .insert([
      {
        titulo: 'Teste',
        prioridade: 'Alta',
        data: '2026-04-10',
        empresa: 'Teste',
        tipo: 'Trabalho',
        concluida: false,
        tempo: 60,
        tempo_restante: 60,
        descricao: 'Testando supabase'
      }
    ])

  if (error) {
    console.error('ERRO:', error)
  } else {
    console.log('SUCESSO:', data)
  }


  <button onClick={adicionarTask}>Testar</button>
}