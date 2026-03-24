import { useState, useEffect } from "react";
import Pessoal from "./Pessoal";
import Empresarial from "./Empresarial";
import Dashboard from "./Dashboard";
import Calendar from "../components/Calendar";

export default function Home() {

  const [dark, setDark] = useState(false);
  const [menuAberto, setMenuAberto] = useState(true);
  const [pagina, setPagina] = useState("tarefas");

  useEffect(() => {
    const tema = localStorage.getItem("tema");
    if (tema === "dark") setDark(true);
  }, []);

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
      localStorage.setItem("tema", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("tema", "light");
    }
  }, [dark]);

  return (
    <>
      <header className="head">
        <h1>Gerenciamento de Tarefas</h1>

        <button onClick={() => setDark(!dark)}>
          {dark ? "Claro" : "Escuro"}
        </button>

        <button className="menu" onClick={() => setMenuAberto(!menuAberto)}>
          ☰
        </button>

        <button onClick={() => setPagina("dashboard")}>Dashboard</button>
      </header>

      {menuAberto && (
        <aside className="sidebar">
          <button onClick={() => setPagina("tarefas")}>Tarefas</button>
          <button onClick={() => setPagina("empresarial")}>Empresarial</button>
          <button onClick={() => SetView("lista")}>Lista</button>
          <button onClick={() => SetView("calendario")}>Calendário</button>
        </aside>
      )}

      <main className="container">
        {pagina === "tarefas" && <Pessoal />}
        {pagina === "empresarial" && <Empresarial />}
        {pagina === "Dashboard" && <Dashboard />}
      </main>

      {view === "lista" && (
        <ul>...</ul>
      )}

      {view === "calendario" && (
        <Calendar tasks={tasks}/>
      )}

      <footer>
        <p>Feito por Leandro</p>
      </footer>
    </>
  );
}