import Calendar from "../components/Calendar";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { supabase } from '../services/supabase'
import { useState, useEffect, useRef } from "react";


export default function Empresarial() {

 

  const [tasks, setTasks] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [prioridade, setPrioridade] = useState("media");
  const [data, setData] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [tipo, setTipo] = useState("suporte");
  const [view, setView] = useState("Lista");
  const [filtro, setFiltro] = useState("todas")
  const [tempoInput, setTempoInput] = useState("");
  const [descricao, setDescricao] = useState("");
  const [historico, setHistorico] = useState([]);
  const [abrirHistorico, setAbrirHistorico] = useState(false);
  const [abrirMenu, setAbrirMenu] = useState(false);
  const historicoRef = useRef(null);

  
  useEffect(() => {
    function handleClickFora(event) {
      if (
        historicoRef.current &&
        !historicoRef.current.contains(event.target)
      ) {
        setAbrirHistorico(false);
      }
    }
  
    document.addEventListener("mousedown", handleClickFora);
  
    return () => {
      document.removeEventListener("mousedown", handleClickFora);
    };
  }, []);

  useEffect(() => {
    buscarTasks(); //supabase

    const hist = localStorage.getItem("historico_tasks");
    if (hist) setHistorico(JSON.parse(hist));
  }, []); //localStorage

  useEffect(() => {
    localStorage.setItem("historico_tasks", JSON.stringify(historico));
  }, [historico]);

  {/*useEffect(() => {
    localStorage.setItem("tasks_empresa", JSON.stringify(tasks));
  }, [tasks]);*/}


  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev =>
        prev.map(t => {
          if (!t.timerAtivo || t.tempoRestante == null) return t;
  
          const novoTempo = t.tempoRestante - 1;
  
          // terminou
          if (novoTempo <= 0) {
            salvarTempoNoBanco(t.id, 0, true);
            return {
              ...t,
              tempoRestante: 0,
              timerAtivo: false,
              esgotado: true,
              concluida: true
            };
          }
  
          // a cada 5 segundos salva
          if (novoTempo % 5 === 0) {
            salvarTempoNoBanco(t.id, novoTempo, false);
          }
  
          return {
            ...t,
            tempoRestante: novoTempo
          };
        })
      );
    }, 1000);
  
    return () => clearInterval(interval);
  }, []);

  async function salvarTempoNoBanco(id, tempoRestante, finalizado) {
    const { error } = await supabase
      .from('Tarefas')
      .update({
        tempoRestante: tempoRestante,
        timerAtivo: finalizado ? false : true,
        esgotado: finalizado,
        concluida: finalizado
      })
      .eq('id', id);
  
    if (error) {
      console.error("Erro ao salvar tempo:", error);
    }
  }

  async function addTask(e) {
    e.preventDefault();

    if (!titulo || !data) {
       alert("Preencha todas as informações");
       return;
    }

        const tempoNum = tempoInput ? Number(tempoInput) : null;

    if (tempoNum !== null && tempoNum <= 0) {
      alert("Tempo tem que ser maior que 0");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();

if (!userData?.user) {
  alert("Usuário não logado");
  return;
}
    
    const { error } = await supabase
    .from('Tarefas')
    .insert([{
      titulo,
      prioridade,
      data,
      empresa,
      tipo,
      concluida: false,
      tempo: tempoNum ?? null,
      tempoRestante: tempoNum ?? null,
      timerAtivo: tempoNum !== null,
      esgotado: false,
      user_id: userData.user.id
    }]);

    console.log("RESULTADO INSERT:", error);

    if (!error) {
      buscarTasks();
    }

    //setTasks(prev => [...prev, nova]);

    setTitulo("");
    setData("");
    setPrioridade("media");
    setEmpresa("");
    setTipo("suporte");
    setTempoInput("");


  }

  async function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
  
    const novoEstado = !task.concluida;
  
    const { error } = await supabase
      .from('Tarefas')
      .update({ 
        concluida: novoEstado,
        timerAtivo: false
      })
      .eq('id', id);
  
    if (error) {
      console.error(error);
    } else {
      // atualização local imediata (evita delay visual)
      setTasks(prev =>
        prev.map(t =>
          t.id === id ? { ...t, concluida: novoEstado } : t
        )
      );
    }
  }

  

  async function deleteTask(id) {
    const taskRemovida = tasks.find(t => t.id === id);
    if (!taskRemovida) return;
  
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;
  
    // salva no histórico
    setHistorico(h => [
      ...h,
      {
        ...taskRemovida,
        status: "excluida",
        dataAcao: new Date()
      }
    ]);
  
    const { error } = await supabase
      .from('Tarefas')
      .delete()
      .eq('id', id)
      .eq('user_id', userData.user.id);
  
    if (error) {
      console.error("Erro ao deletar:", error);
    } else {
      // remove da tela na hora (sem delay)
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  }


  async function deleteTaskSemHistorico(id) {
    const { error } = await supabase
      .from('Tarefas')
      .delete()
      .eq('id', id);
  
    if (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro ao concluir tarefa");
      return false;
    }
  
    return true;
  }

  async function concluirTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
  
    
    const sucesso = await deleteTaskSemHistorico(id);
  
    if (!sucesso) return;
  
    setHistorico(h => [
      ...h,
      {
        ...task,
        status: "concluida",
        dataAcao: new Date()
      }
    ]);
  
    buscarTasks();
  }

  function limparHistorico() {
    if (!window.confirm("Tem certeza que quer apagar o histórico?")) return;
  
    setHistorico([]);
    localStorage.removeItem("historico_tasks");
  } 

  async function editDescricao(id) {
    const nova = prompt("Digite a descrição (máx 180 caracteres):");
  
    if (!nova) return;
  
    if (nova.length > 180) {
      alert("Passou do limite!");
      return;
    }
  
    const { data: userData } = await supabase.auth.getUser();
  
    const { error } = await supabase
      .from('Tarefas')
      .update({ descricao: nova })
      .eq('id', id)
      .eq('user_id', userData.user.id);
  
    if (error) {
      console.error("Erro ao editar descrição:", error);
    } else {
      setTasks(prev =>
        prev.map(t =>
          t.id === id ? { ...t, descricao: nova } : t
        )
      );
    }
  }

  async function editTask(id) {
    const novo = prompt("Novo título:");
    if (!novo) return;
  
    const { error } = await supabase
      .from('Tarefas')
      .update({ titulo: novo })
      .eq('id', id);
  
    if (error) {
      console.error("Erro ao editar título:", error);
    } else {
      buscarTasks();
    }
  }

  async function clearCompleted() {
    await supabase
      .from('Tarefas')
      .delete()
      .eq('concluida', true);
  
    buscarTasks();
  }

  async function buscarTasks() {
    const { data: userData } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('Tarefas')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('id', { ascending: false });

    if (error) {
      console.error('ERRO AO BUSCAR:', error);
    } else {
      setTasks(data);
    }
  }


  const ordenarTarefas = (tarefas) => {
    const prioridadePeso = {
      alta: 3,
      media: 2,
      baixa: 1
    };
  
    return tarefas.sort((a, b) => {
      if (prioridadePeso[a.prioridade] !== prioridadePeso[b.prioridade]) {
        return prioridadePeso[b.prioridade] - prioridadePeso[a.prioridade];
      }
  
      if (a.prioridade === "alta" && b.prioridade === "alta") {
        const tempoA = a.tempoRestante ?? Infinity;
        const tempoB = b.tempoRestante ?? Infinity;
        return tempoA - tempoB;
      }
  
      return 0;
    });
  };

  const tarefasFiltradas = ordenarTarefas(
    [...tasks].filter(t => {
      if (filtro === "pendentes") return !t.concluida;
      if (filtro === "concluidas") return t.concluida;
      return true;
    })
  );

  const formatarTempo = (s) => {
    const min = Math.floor(s / 60);
    const seg = s % 60;
    return `${min}:${seg.toString().padStart(2, "0")}`;
  };
  
  async function editTempo(id) {
    const novoTempo = prompt("Novo tempo em segundos");
  
    if (!novoTempo) return;
  
    const tempoNum = Number(novoTempo);
  
    if (isNaN(tempoNum) || tempoNum <= 0) {
      alert("Digite um tempo válido");
      return;
    }
  
    const { error } = await supabase
      .from('Tarefas')
      .update({
        tempo: tempoNum,
        tempoRestante: tempoNum,
        esgotado: false,
        timerAtivo: true
      })
      .eq('id', id);
  
    if (error) {
      console.error("Erro ao editar tempo:", error);
    } else {
      // ATUALIZA NA HORA (sem esperar o banco)
      setTasks(prev =>
        prev.map(t =>
          t.id === id
            ? {
                ...t,
                tempo: tempoNum,
                tempoRestante: tempoNum,
                timerAtivo: true,
                esgotado: false
              }
            : t
        )
      );
    }
  }

  function toggleTimer(id) {
    setTasks(tasks.map(t => 
      t.id === id 
        ? { ...t, timerAtivo: !t.timerAtivo } 
        : t
    ));
  }
  

  return (
    <>
      <h2>Empresarial</h2>

      
    <div className="layout">
    <aside ref={historicoRef}
    className={`historico ${abrirHistorico ? "ativo" : ""}`}>

     <h3>Histórico</h3>

      <button onClick={limparHistorico} className="btn-limpar-historico">
        Limpar
      </button>

      {historico.length === 0 ? (
        <p>Nenhum histórico ainda</p>
      ) : (
        <ul>
          {historico.map(item => (
            <li key={item.id + item.dataAcao}
            className={`prioridade-${item.prioridade}`}>

              <strong>{item.titulo}</strong>
              
              <p>{item.status}</p>

              {item.empresa && (
                <p>Empresa: {item.empresa}</p>
              )}

              {item.data && (
                <p>
                  Criada em: {new Date(item.data).toLocaleDateString("pt-BR")}
                </p>
              )}

              {item.dataAcao && (
                <p>
                  ação em: {new Date(item.dataAcao).toLocaleDateString("pt-BR")}{" "}
                  às {new Date(item.dataAcao).toLocaleTimeString("pt-BR")}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </aside>
        
            <main className="conteudo">

            <form onSubmit={addTask}>
        <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título da tarefa (Obrigatório)"/>
        <input type="date" value={data} onChange={e => setData(e.target.value)} />

        <select value={prioridade} onChange={e => setPrioridade(e.target.value)}>
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>

        <input
        type="text"
        value={empresa}
        onChange={e => setEmpresa(e.target.value)}
        placeholder="Nome da empresa (Obrigatório)"
        />

        <input
          type="number"
          placeholder="Tempo (segundos) (ex: 3600 = 1 hora)"
          value={tempoInput}
          onChange={e => setTempoInput(e.target.value)}
          />

        <select value={tipo} onChange={e => setTipo(e.target.value)}>
          <option value="suporte">Suporte</option>
          <option value="financeiro">Financeiro</option>
          <option value="design">Design</option>
        </select>


        <div>
        <button type="button" onClick={() => setFiltro("todas")}>Todas</button>
        <button type="button" onClick={() => setFiltro("pendentes")}>Pendentes</button>
        <button type="button" onClick={() => setFiltro("concluidas")}>Concluídas</button>
        <button type="button" onClick={() => {setAbrirHistorico(prev => !prev); setAbrirMenu(false);}}>📜</button>
        </div> 
        <button type="submit">Adicionar</button>
        
                    <button type="button" onClick={clearCompleted}>
                      Limpar Concluidas
                    </button>


      </form>


    <div className="area-inferior">
      <ul>
  {tarefasFiltradas.map(task => (
    <motion.li
      key={task.id}
      onClick={(e) => {
        if (e.target.tagName !== "BUTTON") {
          toggleTask(task.id);
        }
      }}
      className={`prioridade-${task.prioridade} 
                  ${task.timerAtivo ? "timer-ativo" : ""} 
                  ${task.concluida ? "feito" : ""}
                  ${task.tempoRestante !== null && task.tempoRestante <= 10 ? "timer-urgente" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <strong>{task.titulo}</strong>

      <p>{task.data ? new Date(task.data).toLocaleDateString("pt-BR")
      : "sem data"}</p>

      <span>{task.empresa} | {task.tipo}</span>

      <button onClick={(e) => {
        e.stopPropagation();
        editTask(task.id);
      }}>
        Editar
      </button>

      <button onClick={(e) => {
        e.stopPropagation();
        deleteTask(task.id);
      }}>
        X
      </button>

     <p>
      Tempo:
      {task.tempoRestante !== null
      ? formatarTempo(task.tempoRestante)
      : "Sem Timer"}
     </p>

        <button onClick={(e) => {
          e.stopPropagation();

          if (task.tempoRestante === null) {
            alert("Defina um tempo antes");
            return;
          }

          toggleTimer(task.id);
        }}>

          {task.timerAtivo ? "⏸" : "▶️"}

        </button>

      <button onClick={(e) => {
        e.stopPropagation();
        editTempo(task.id);
      }} >
        ⏱️ Editar Tempo
      </button>

      {task.concluida && (
      <button onClick={(e) => {
        e.stopPropagation();
        concluirTask(task.id)
      }}>
        ✔️
      </button>
      )}

        <button
          className="btn-descricao"
          onClick={(e) => {
            e.stopPropagation();
            editDescricao(task.id);
          }}
        >
          💬
        </button>




      {task.descricao && (
        <motion.p
          className="descricao"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {task.descricao}
        </motion.p>
      )}

     {/*} className={`prioridade-${task.prioridade}
${task.esgotado ? "tempo-esgotado" : ""}
${task.timerAtivo ? "timer-ativo" : ""}
${task.concluida ? "feito" : ""}`}
*/}


    </motion.li>
  ))}
</ul>


<Calendar tasks={tasks} />

</div>
</main>

</div>

     {/* <span className={`badge ${task.prioridade}`}>
        {task.prioridade}
      </span> */}

     {/*} <AnimatePresence>
        {tarefasFiltradas.map(task => (
          <motion.li key={task.id}>
            {task.titulo}
          </motion.li>
        ))}
      </AnimatePresence> */}


    </>
  );
}