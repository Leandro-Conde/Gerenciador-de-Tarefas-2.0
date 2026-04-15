import { useState } from "react";
import { supabase } from "../services/supabase";

export default function Registro({ onRegistro, voltarLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegistro(e) {
    e.preventDefault();
    setLoading(true);
    setErro("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha
    });

    if (error) {
      setErro(error.message);
      setLoading(false);
      return;
    }

    onRegistro(data.user);
    setLoading(false);
  }

  return (
    <form onSubmit={handleRegistro} className="login-box">
      <h2>Criar conta</h2>

      <input type="email" placeholder="Email"
        value={email} onChange={e => setEmail(e.target.value)} />

      <input type="password" placeholder="Senha"
        value={senha} onChange={e => setSenha(e.target.value)} />

      <button type="submit" disabled={loading}>
        {loading ? "Criando..." : "Cadastrar"}
      </button>

      <p onClick={voltarLogin} style={{cursor: "pointer"}}>
        Já tenho conta
      </p>

      {erro && <p className="erro">{erro}</p>}
    </form>
  );
}