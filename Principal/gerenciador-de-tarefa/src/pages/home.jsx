import { useState, useEffect, use } from "react";
import Empresarial from "./Empresarial";
import { motion } from "framer-motion";
import { supabase } from "../services/supabase";

async function handleLogout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Erro ao sair:", error);
  }
}


export default function Home() {
  

  const [dark, setDark] = useState(false);
  const [menuAberto, setMenuAberto] = useState(true);
  const [pagina, setPagina] = useState("tarefas");
  const [view, setView] = useState("lista");
  const [abrirHistorico, setAbrirHistorico] = useState(false);

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

        <button onClick={handleLogout}>
          Sair
        </button>

      </header>

      <div 
          className={`overlay ${menuAberto ? "ativo" : ""}`} 
          onClick={() => setMenuAberto(false)}
        />


        <aside className={`sidebar ${menuAberto ? "ativo" : ""}`}>
          <button onClick={() => {setPagina("Empresarial"); setMenuAberto(false);}}>Empresarial</button>
          <button onClick={() => {setView("lista"); setMenuAberto(false);}}>Lista</button>
        </aside>
      



      <main className="container">
     
        {pagina === "Empresarial" && <Empresarial />}
        
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