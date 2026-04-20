import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function Registro({ onRegistro, voltarLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  async function handleRegistro(e) {
    e.preventDefault();
    setLoading(true);
    setErro("");
  
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      setLoading(false);
      return;
    }
  
    // chama o Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha
    });
  
    console.log("SUPABASE:", { data, error });
  
    // ERRO
    if (error) {
      setErro(error.message);
      setLoading(false);
      return;
    }
  
    // SUCESSO
    setErro("Conta criada com sucesso!");
  
    setLoading(false);
  
    setTimeout(() => {
      voltarLogin(); //MUDA PRA TELA DE LOGIN
    }, 1500);
  }

  return (
    <form onSubmit={handleRegistro} className="login-box">
      <h2>Criar conta</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      {/* SENHA */}
      <div className="input-senha">
        <input
          type={mostrarSenha ? "text" : "password"}
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
        />

        <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)}>
          {mostrarSenha ? "🙈" : "👁️"}
        </button>
      </div>

      {/* CONFIRMAR SENHA */}
      <div className="input-senha">
        <input
          type={mostrarConfirmar ? "text" : "password"}
          placeholder="Confirmar senha"
          value={confirmarSenha}
          onChange={e => setConfirmarSenha(e.target.value)}
        />

        <button type="button" onClick={() => setMostrarConfirmar(!mostrarConfirmar)}>
          {mostrarConfirmar ? "🙈" : "👁️"}
        </button>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Criando..." : "Cadastrar"}
      </button>

      <p onClick={voltarLogin} style={{ cursor: "pointer" }}>
        Já tenho conta
      </p>

      {erro && <p className="erro">{erro}</p>}
    </form>
  );
}