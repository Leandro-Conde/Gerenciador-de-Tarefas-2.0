import { useState, useEffect } from "react";
import Calendar from "../components/Calendar";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

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

  

  useEffect(() => {
    const stored = localStorage.getItem("tasks_empresa");
    if (stored) setTasks(JSON.parse(stored));

    const hist = localStorage.getItem("historico_tasks");
    if (hist) setHistorico(JSON.parse(hist));
  }, []);

  useEffect(() => {
    localStorage.setItem("historico_tasks", JSON.stringify(historico));
  }, [historico]);

  useEffect(() => {
    localStorage.setItem("tasks_empresa", JSON.stringify(tasks));
  }, [tasks]);

 /* useEffect(() => {
    const concluidas = tasks.filter(t => t.concluida && !t.jaSalva);

    if (concluidas.length > 0) {
      setHistorico(prev => [
        ...prev,
        ...concluidas.map(t => ({
          ...t,
          status: "concluida",
          dataAcao: new Date().toISOString()
        }))
      ]);

      setTasks(prev =>
        prev.map(t =>
          t.concluida ? { ...t, jaSalva: true } : t
        )
      );
    }
  }, [tasks]);*/


  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev =>
        prev.map(t => {
          if (!t.timerAtivo || t.tempoRestante == null) return t;
  
          // acabou
          if (t.tempoRestante <= 1) {
            const finalizada = {
              ...t,
              tempoRestante: 0,
              timerAtivo: false,
              esgotado: true,
              concluida: true
            };
  
            setHistorico(prev => [
              ...prev,
              {
                ...finalizada,
                status: "concluida",
                dataAcao: new Date()
              }
            ]);
  
            return finalizada;
          }
  
          // continua
          return {
            ...t,
            tempoRestante: t.tempoRestante - 1
          };
        })
      );
    }, 1000);
  
    return () => clearInterval(interval);
  }, []);


  function addTask(e) {
    e.preventDefault();

    if (!titulo || !data) return alert("Preencha todas as informações");

    

    const nova = {
      id: Date.now(),
      titulo,
      prioridade,
      data,
      empresa,
      tipo,
      concluida: false,
      tempo: tempoInput ? Number(tempoInput) : null,
      tempoRestante: tempoInput ? Number(tempoInput) : null,
      timerAtivo: tempoInput ? true : false,
      esgotado: false
    };

    setTasks(prev => [...prev, nova]);

    setTitulo("");
    setData("");
    setPrioridade("media");
    setEmpresa("");
    setTipo("suporte");
  }

  function toggleTask(id) {
    setTasks(tasks.map(t =>
      t.id === id
        ? { ...t, concluida: !t.concluida, timerAtivo: false }
        : t
    ));
  }

  function deleteTask(id) {
    setTasks(tasks.filter(t => t.id !== id));
    const taskRemovida = tasks.find(t => t.id === id);

    if (!taskRemovida) return;

    setTasks(prev => prev.filter(t => t.id !== id));

    setHistorico(prev => [
      ...prev,
      { ...taskRemovida, status: "excluida", dataAcao: new Date() }
    ]);

  }

  function limparHistorico() {
    if (!window.confirm("Tem certeza que quer apagar o histórico?")) return;
  
    setHistorico([]);
    localStorage.removeItem("historico_tasks");
  } 

  function editDescricao(id) {
    const nova = prompt("Digite a descrição (máx 180 caracteres):");
  
    if (!nova) return;
  
    if (nova.length > 180) {
      alert("Passou do limite!");
      return;
    }
  
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, descricao: nova } : t
    ));
  }

  function editTask(id) {
    const novo = prompt("Novo título:");
    if (!novo) return;

    setTasks(tasks.map(t =>
      t.id === id ? { ...t, titulo: novo } : t
    ));
  }

  function clearCompleted() {
    setTasks(tasks.filter(t => !t.concluida));
  }


  const tarefasFiltradas = tasks.filter(t => {
    if (filtro === "pendentes") return !t.concluida;
    if (filtro === "concluidas") return t.concluida;
    return true;


  });

  const formatarTempo = (s) => {
    const min = Math.floor(s / 60);
    const seg = s % 60;
    return `${min}:${seg.toString().padStart(2, "0")}`;
  };
  
function editTempo(id) {
  const novoTempo = prompt("Novo tempo em segundos");
 if (!novoTempo) return;

 setTasks(tasks.map(t =>
  t.id === id ? {
    ...t,
    tempo: Number(novoTempo),
    tempoRestante: Number(novoTempo),
    esgotado: false, 
    timerAtivo: true
  }
  : t
 ));
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
    <aside className={`historico ${abrirHistorico ? "ativo" : ""}`}>

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
        <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título da tarefa"/>
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
          placeholder="Tempo (segundos) (ex: 3600 = 1 horas)"
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
        <button type="button" onClick={() => setAbrirHistorico(prev => !prev)}>📜</button>
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
      onClick={() => toggleTask(task.id)}
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
        deleteTask(task.id);
      }}>
        Concluir

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