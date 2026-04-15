import { useState, useEffect } from "react";
import Empresarial from "./Empresarial";
import { supabase } from "../services/supabase";
import Login from "./Login";
import Registro from "./Registro";

async function handleLogout() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Erro ao sair:", error);
}

export default function Home() {
  const [dark, setDark] = useState(false);
  const [menuAberto, setMenuAberto] = useState(true);
  const [pagina, setPagina] = useState("tarefas");
  const [view, setView] = useState("lista");
  const [tela, setTela] = useState("login");

  // 🌙 tema
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

  // LOGIN / REGISTRO
  if (tela === "login") {
    return (
      <Login
        onLogin={() => setTela("app")}
        irParaCadastro={() => setTela("registro")}
      />
    );
  }

  if (tela === "registro") {
    return (
      <Registro
        onRegistro={() => setTela("login")}
        voltarLogin={() => setTela("login")}
      />
    );
  }

  if (tela === "logado") {
    return (
      <>
        {/* SUA TELA NORMAL AQUI */}
        <h1>Logado</h1>
      </>
    );
  }

  // 
  return (
    <>
      <header className="head">
        <h1>Gerenciamento de Tarefas</h1>

        <button onClick={() => setDark(!dark)}>🌗</button>

        <button
          className="menu"
          onClick={() => setMenuAberto(prev => !prev)}
        >
          ☰
        </button>

        <button onClick={handleLogout}>Sair</button>
      </header>

      <div
        className={`overlay ${menuAberto ? "ativo" : ""}`}
        onClick={() => setMenuAberto(false)}
      />

      <aside className={`sidebar ${menuAberto ? "ativo" : ""}`}>
        <button onClick={() => setPagina("Empresarial")}>
          Empresarial
        </button>
      </aside>

      <main className="container">
        {pagina === "Empresarial" && <Empresarial />}
      </main>

      <footer>
        <p>Feito por Leandro</p>
      </footer>
    </>
  );
}