import { useState, useEffect } from "react";
import Calendar from "../components/Calendar";
import { motion } from "framer-motion";
//import { AnimatePresence } from "framer-motion";

export default function Empresarial() {

 

  const [tasks, setTasks] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [prioridade, setPrioridade] = useState("media");
  const [data, setData] = useState("");
  const [empresa, setEmpresa] = useState("gennera");
  const [tipo, setTipo] = useState("suporte");
  const [view, setView] = useState("Lista");
  const [filtro, setFiltro] = useState("todas")

  useEffect(() => {
    const stored = localStorage.getItem("tasks_empresa");
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks_empresa", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev =>
        prev.map(t =>
          t.timerAtivo
          ? { ...t, tempo: t.tempo + 1}
          : t
        )
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
      tempo: 0,
      timerAtivo: false
    };

    setTasks([...tasks, nova]);

    setTitulo("");
    setData("");
    setPrioridade("media");
    setEmpresa("");
    setTipo("suporte");
  }

  function toggleTask(id) {
    setTasks(tasks.map(t =>
      t.id === id
      ? { ...t, concluida: !t.concluida, timerAtivo: false } : t
    ));
  }

  function deleteTask(id) {
    setTasks(tasks.filter(t => t.id !== id));
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
  
  

  function toggleTimer(id) {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, timerAtivo: !t.timerAtivo } : t
    ));
  }
  

  return (
    <>
      <h2>Empresarial</h2>

      <form onSubmit={addTask}>
        <input value={titulo} onChange={e => setTitulo(e.target.value)} />
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
        placeholder="Nome da empresa"
        />

        <select value={tipo} onChange={e => setTipo(e.target.value)}>
          <option value="suporte">Suporte</option>
          <option value="financeiro">Financeiro</option>
          <option value="design">Design</option>
        </select>


        <div>
        <button onClick={() => setFiltro("todas")}>Todas</button>
        <button onClick={() => setFiltro("pendentes")}>Pendentes</button>
        <button onClick={() => setFiltro("concluidas")}>Concluídas</button>
        </div> 
        <button>Adicionar</button>
        
                    <button type="button" onClick={clearCompleted}>
                      Limpar Concluidas
                    </button>
      </form>

      <ul>
  {tarefasFiltradas.map(task => (
    <motion.li
      key={task.id}
      onClick={() => toggleTask(task.id)}
      className={`prioridade-${task.prioridade} 
                  ${task.timerAtivo ? "timer-ativo" : ""} 
                  ${task.concluida ? "feito" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <strong>{task.titulo}</strong>

      <p>{new Date(task.data).toLocaleDateString("pt-BR")}</p>

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

      <p>Tempo: {task.tempo || 0}s</p>

      <button onClick={(e) => {
        e.stopPropagation();
        toggleTimer(task.id);
      }}>
        ⏱️
      </button>
    </motion.li>
  ))}
</ul>

     {/* <span className={`badge ${task.prioridade}`}>
        {task.prioridade}
      </span>

      <AnimatePresence>
        {tarefasFiltradas.map(...)}
      </AnimatePresence> */}

      <Calendar tasks={tasks} />
    </>
  );
}