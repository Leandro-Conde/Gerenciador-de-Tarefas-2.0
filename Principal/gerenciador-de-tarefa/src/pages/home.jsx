import { useState, useEffect } from "react";
import Pessoal from "./Pessoal";
import Empresarial from "./Empresarial";
import Dashboard from "./Dashboard";
import Calendar from "../components/Calendar";
import { motion } from "framer-motion";
import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://vmglciwaonssdv1rbgqk.supabase.co'
const supabaseKey = 'sb_publishable_SUA_KEY_AQUI'

export const supabase = createClient(supabaseUrl, supabaseKey)

export default function Home() {
  

  const [dark, setDark] = useState(false);
  const [menuAberto, setMenuAberto] = useState(true);
  const [pagina, setPagina] = useState("tarefas");
  const [view, setView] = useState("lista");

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

        <button 
          className="menu" 
          onClick={() => {
            setMenuAberto(prev => !prev);
            setAbrirHistorico(false); // fecha histórico
          }}
        >
          ☰
</button>

        <button onClick={() => setPagina("Calendário")}>Calendário</button>

      </header>

      <div 
          className={`overlay ${menuAberto ? "ativo" : ""}`} 
          onClick={() => setMenuAberto(false)}
        />


        <aside className={`sidebar ${menuAberto ? "ativo" : ""}`}>
          <button onClick={() => {setPagina("Tarefas"); setMenuAberto(false);}}>Tarefas</button>
          <button onClick={() => {setPagina("Empresarial"); setMenuAberto(false);}}>Empresarial</button>
          <button onClick={() => {setView("lista"); setMenuAberto(false);}}>Lista</button>
          <button onClick={() => {setView("calendario"); setMenuAberto(false);}}>Calendário</button>
        </aside>
      



      <main className="container">
        {pagina === "tarefas" && <Pessoal />}
        {pagina === "Empresarial" && <Empresarial />}
        {pagina === "Calendário" && <Dashboard />}

      </main>

      {view === "lista" && (
        <ul>...</ul>
      )}

      {view === "calendario" && (
        <Calendar tasks={[]}/>
      )}

      <footer>
        <p>Feito por Leandro</p>
      </footer>
    </>
  );
}