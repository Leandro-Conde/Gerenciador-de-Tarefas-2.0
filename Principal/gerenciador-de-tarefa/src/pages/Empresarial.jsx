import { useState, useEffect } from "react";
import Calendar from "../components/Calendar";

export default function Empresarial() {

  const [tasks, setTasks] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [prioridade, setPrioridade] = useState("media");
  const [data, setData] = useState("");
  const [empresa, setEmpresa] = useState("gennera");
  const [tipo, setTipo] = useState("suporte");
  const [view, setView] = useState("Lista");

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
        placeholder="Nome da empresa">

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
                onClick={() => toggleTask(task.id)}
                key={task.id}
                className={`prioridade-${task.prioridade} ${task.concluida ? "feito" : ""}`}>
                    
                    <strong>{task.titulo}</strong>
                    <p>{new Date(task.data).toLocaleDateString("pt-BR")}</p>
                    <span>{task.empresa} | {task.tipo}</span>
                  
            </li>
        ))}
      </ul>

      <Calendar tasks={tasks} />
    </>
  );
}