import { useState, useEffect } from "react";
import Calendar from "../components/Calendar";

export default function Empresarial() {

  // onde por: {tarefasFiltradas.map(task => (?

  const [tasks, setTasks] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [prioridade, setPrioridade] = useState("media");
  const [data, setData] = useState("");
  const [empresa, setEmpresa] = useState("gennera");
  const [tipo, setTipo] = useState("suporte");
  const [view, setView] = useState("Lista");
  const [filtro, setFiltro] = useState("Todas")

  useEffect(() => {
    const stored = localStorage.getItem("tasks_empresa");
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks_empresa", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(e) {
    e.preventDefault();

    if (!titulo || !data) return alert("Preencha tudo");

    function toggleTask(id) {
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, concluida: !t.concluida } : t
      ));
    }

    const nova = {
      id: Date.now(),
      titulo,
      prioridade,
      data,
      empresa,
      tipo,
      concluida: false
    };

    setTasks([...tasks, nova]);

    setTitulo("");
    setData("");
    setPrioridade("media");
    setEmpresa("");
    setTipo("Suporte");
  }

  function deleteTask(id) {
    setTasks(task.filter(t => t.id !== id));
  }

  function editTask(id) {
    const novo = prompt("Novo título:");
    if (!novo) return;

    setTasks(task.map(t =>
      t.id === id? { ...t, titulo: novo } : t

      function clearCompleted() {
        setTasks(tasks.filter(t => !t.concluida));
      }


      const tarefasFiltradas = tasks.filter(t => {
        if (filtro === "pendentes") return !t.concluida;
        if (filtro === "concluidas") return t.concluida;
        return true;


      });
    ));
  }

  function starTime(id) {
    setInterval(() => {
      setTasks(prev =>
        prev.map(t =>
          t.id === id ? { ...t, tempo: t.tempo + 1 } : t
        )
      );
    }, 1000):
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
        
      </form>

      <ul>
        {tasks.map(task => (
            <li
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={task.concluida ? "feito" : ""}
                >
                    
                    <strong>{task.titulo}</strong>
                    <p>{new Date(task.data).toLocaleDateString("pt-BR")}</p>
                    <span>{task.empresa} | {task.tipo}</span>
                    <button onClick={(e) =>{e.stopPropagation();
                      deleteTask(task.id);
                    }}>
                      X
                    </button>

                    <button onClick={(e) => {
                      e.stopPropagation();
                      editTask(task.id);
                    }}>
                      Editar
                    </button>

                    <button onClick={clearCompleted}>
                      Limpar Concluidas
                    </button>

                    <p>Tempo: {task.tempo || 0}s</p>

                    <button onClick={(e) => {
                      e.stopPropagation();
                      starTimer(task.id);
                    }}>
                      Tempo
                    </button>
                  
            </li>
        ))}
      </ul>

      <Calendar tasks={tasks} />
    </>
  );
}