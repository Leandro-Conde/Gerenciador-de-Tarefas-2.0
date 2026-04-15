import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

export default function Login({ onLogin, irParaCadastro }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    document.body.classList.add("login-page");
  
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setErro("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    });

    if (error) {
      setErro("Email ou senha inválidos");
      setLoading(false);
      return;
    }

    onLogin(data.user);
    setLoading(false);

  }

  return (
    <form onSubmit={handleLogin} className="login-box">
      <h2>Login de acesso</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={e => setSenha(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>

      <button 
        type="button" 
        onClick={irParaCadastro}
        className="btn-secundario"
        >
        Criar conta
        </button>

      {erro && <p className="erro">{erro}</p>}
    </form>
  );
}
