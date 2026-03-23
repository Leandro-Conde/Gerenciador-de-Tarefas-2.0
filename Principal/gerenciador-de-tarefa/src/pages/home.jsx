import Calendar from "../components/Calendar";
import { useEffect, useState } from "react";

export default function Home() {

  // 🔥 ESTADOS (o coração do React)
  const [tasks, setTasks] = useState([]); // lista de tarefas
  const [titulo, setTitulo] = useState(""); // input de texto
  const [prioridade, setPrioridade] = useState("media"); // select
  const [data, setData] = useState("");
  const [filtro, setFiltro] = useState("todas"); // filtro atual
  const [dark, setDark] = useState(false); // tema

  // 📦 CARREGAR dados ao iniciar (equivalente ao loadTasks do seu JS antigo)
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) setTasks(JSON.parse(storedTasks));

    const tema = localStorage.getItem("tema");
    if (tema === "dark") setDark(true);
  }, []); // [] = roda só uma vez

  // 💾 SALVAR tarefas sempre que mudar
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]); // roda sempre que tasks mudar

  // 🌗 CONTROLE DO TEMA
  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
      localStorage.setItem("tema", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("tema", "light");
    }
  }, [dark]);

  // ➕ ADICIONAR tarefa
  function addTask(e) {
    e.preventDefault(); // impede reload da página

    if (!titulo.trim() || !data) {
      return alert("Escolha um título e data");
    }

    const nova = {
      id: Date.now(), // id único
      titulo,
      prioridade,
      data,
      concluida: false
    };

    // 🔁 atualiza lista (imutabilidade!)
    setTasks([...tasks, nova]);

    // limpa campos
    setTitulo("");
    setPrioridade("media");
    setData("");
  }

  // ✔️ MARCAR COMO CONCLUÍDA
  function toggleTask(id) {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, concluida: !t.concluida } : t
    ));
  }

  // ❌ DELETAR tarefa
  function deleteTask(id) {
    setTasks(tasks.filter(t => t.id !== id));
  }

  // ✏️ EDITAR tarefa
  function editTask(id, novoTitulo) {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, titulo: novoTitulo } : t
    ));
  }

  // 🧹 LIMPAR concluídas
  function clearCompleted() {
    setTasks(tasks.filter(t => !t.concluida));
  }

  // 🔍 FILTRO
  const tarefasFiltradas = tasks.filter(t => {
    if (filtro === "pendentes") return !t.concluida;
    if (filtro === "concluidas") return t.concluida;
    return true;
  });

  // 📊 CONTADOR
  const total = tasks.length;
  const concluidas = tasks.filter(t => t.concluida).length;
  const pendentes = total - concluidas;

  return (
    <>
      {/* 🔝 HEADER */}
      <header className="head">
        <h1>Gerenciamento de Tarefas</h1>
        <p>organize suas tarefas</p>

        {/* botão de tema */}
        <button onClick={() => setDark(!dark)}>
          {dark ? "Claro" : "Escuro"}
        </button>
      </header>

      {/* 🧱 CONTEÚDO PRINCIPAL */}
      <main className="container">

        {/* 📥 FORMULÁRIO */}
        <section>
          <h2>Nova tarefa</h2>

          <form onSubmit={addTask}>
            {/* input controlado */}
            <input
              type="text"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              placeholder="Título"
            />

            <input 
            type="date"
            value={data}
            onChange={e => setData(e.target.value)}
            />

            {/* select controlado */}
            <select
              value={prioridade}
              onChange={e => setPrioridade(e.target.value)}
            >
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>

            <button type="submit">Adicionar</button>
          </form>

          {/* 🎛️ FILTROS */}
          <div>
            <button onClick={() => setFiltro("todas")}>Todas</button>
            <button onClick={() => setFiltro("pendentes")}>Pendentes</button>
            <button onClick={() => setFiltro("concluidas")}>Concluídas</button>
            <button onClick={clearCompleted}>Limpar</button>
          </div>

          {/* 📊 CONTADOR */}
          <p>
            Total: {total} | Pendentes: {pendentes} | Concluídas: {concluidas}
          </p>
        </section>

        {/* 📋 LISTA */}
        <section>
          <h2>Suas tarefas</h2>

          <ul>
            {tarefasFiltradas.map(task => (
              <li
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`prioridade-${task.prioridade} ${task.concluida ? "feito" : ""}`}
              >
                {/* texto da tarefa */}
                <div className="task-content">
                  <strong>{task.titulo}</strong>
                    <p>{new Date(task.data).toLocaleDateString("pt-BR")}</p>
                  <span>{task.prioridade}</span>
                </div>

                {/* ✏️ EDITAR */}
                <button onClick={(e) => {
                  e.stopPropagation(); // evita marcar como concluída
                  const novo = prompt("Editar:");
                  if (novo) editTask(task.id, novo);
                }}>
                  Editar
                </button>

                {/* ❌ DELETAR */}
                <button onClick={(e) => {
                  e.stopPropagation();
                  deleteTask(task.id);
                }}>
                  X
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
<Calendar tasks={tasks}/>
      {/* 🔻 FOOTER */}
      <footer>
        <p>Feito por Leandro</p>
      </footer>
    </>
  );
} 