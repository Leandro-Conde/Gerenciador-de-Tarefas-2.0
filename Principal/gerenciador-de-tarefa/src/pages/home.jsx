import { useState, useEffect } from "react";
import Login from "./Login";
import Registro from "./Registro";
import Empresarial from "./Empresarial";

export default function Home() {
  const [tela, setTela] = useState("login");

  const [dark, setDark] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

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

  // LOGIN
  if (tela === "login") {
    return (
      <Login
        onLogin={() => setTela("logado")}
        irParaCadastro={() => setTela("registro")}
      />
    );
  }

  // REGISTRO
  if (tela === "registro") {
    return (
      <Registro
        onRegistro={() => setTela("login")}
        voltarLogin={() => setTela("login")}
      />
    );
  }

  // 
  return (
    <>
      <header className="head">
        <h1>Gerenciamento de Tarefas</h1>

        <button onClick={() => setDark(!dark)}>🌗</button>

        <button onClick={() => setMenuAberto(prev => !prev)}>
          ☰
        </button>

        <button onClick={() => setTela("login")}>
          Sair
        </button>
      </header>

      {/* overlay */}
      <div
        className={`overlay ${menuAberto ? "ativo" : ""}`}
        onClick={() => setMenuAberto(false)}
      />

      {/* sidebar */}
      <aside className={`sidebar ${menuAberto ? "ativo" : ""}`}>
        <button onClick={() => setMenuAberto(false)}>
          Empresarial
        </button>
      </aside>

      <main>
        <Empresarial />
      </main>
    </>
  );
}