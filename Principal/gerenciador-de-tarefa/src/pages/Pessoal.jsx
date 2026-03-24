import { useState, useEffect } from "react";
import Calendar from "../components/Calendar";

export default function Pessoal() {

  const [tasks, setTasks] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [prioridade, setPrioridade] = useState("media");
  const [data, setData] = useState("");
  const [filtro, setFiltro] = useState("todas");

  useEffect(() => {
    const stored = localStorage.getItem("tasks_pessoal");
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks_pessoal", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(e) {
    e.preventDefault();

    if (!titulo.trim() || !data) return alert("Preencha tudo");

    const nova = {
      id: Date.now(),
      titulo,
      prioridade,
      data,
      concluida: false
    };

    setTasks([...tasks, nova]);
    setTitulo("");
    setData("");
  }

  function toggleTask(id) {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, concluida: !t.concluida } : t
    ));
  }

  const filtradas = tasks.filter(t => {
    if (filtro === "pendentes") return !t.concluida;
    if (filtro === "concluidas") return t.concluida;
    return true;
  });

  return (
    <>
      <h2>Pessoal</h2>

      <form onSubmit={addTask}>
        <input value={titulo} onChange={e => setTitulo(e.target.value)} />
        <input type="date" value={data} onChange={e => setData(e.target.value)} />

        <select value={prioridade} onChange={e => setPrioridade(e.target.value)}>
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>

        <button>Adicionar</button>
      </form>

      <ul>
        {filtradas.map(task => (
          <li key={task.id} onClick={() => toggleTask(task.id)}>
            {task.titulo} - {new Date(task.data).toLocaleDateString("pt-BR")}
            className={`prioridade-${task.prioridade} ${task.concluida ? "feito" : ""}`}
          </li>
        ))}
      </ul>
      
      <Calendar tasks={tasks} />
    </>
  );
}