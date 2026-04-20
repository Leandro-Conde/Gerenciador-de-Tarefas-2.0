import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import Login from "./Login";
import Registro from "./Registro";
import Empresarial from "./Empresarial";

export default function Home({ user, setUser }) {

  const [loading, setLoading] = useState(true);
  const [tela, setTela] = useState("login");

  const [dark, setDark] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  // sessão persistente
  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    }

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // tema
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

  // loading inicial
  if (loading) return <p>Carregando...</p>;

  // NÃO LOGADO
  if (!user) {
    if (tela === "login") {
      return (
        <Login
          onLogin={(user) => setUser(user)}
          irParaCadastro={() => setTela("registro")}
        />
      );
    }

    return (
      <Registro
        voltarLogin={() => setTela("login")}
      />
    );
  }

  // LOGADO
  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <>
      <header className="head">
        <h1>Gerenciamento de Tarefas</h1>

        <button onClick={() => setDark(!dark)}>🌗</button>

        <button onClick={() => setMenuAberto(prev => !prev)}>
          ☰
        </button>

        <button onClick={handleLogout}>Sair</button>
      </header>

      <div
        className={`overlay ${menuAberto ? "ativo" : ""}`}
        onClick={() => setMenuAberto(false)}
      />

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