import { useState } from "react";
import { supabase } from "../services/supabase";

const [email, setEmail] = useState("");
const [senha, setSenha] = useState("");
const [loading, setLoading] = useState(false);
const [erro, setErro] = useState("");

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
    }

    setLoading(false);
}


export default function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    async function handleLogin(e) {
        e.preventDefault();

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: senha
        });

        if (error) {
            alert("Erro no login, tente novamente");
            console.error(error);
        } else {
            onLogin(data.user);
        }
    }

    return (
        <form onSubmit={handleLogin} className="login-box">
        <h2>Login</h2>

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

        {erro && <p className="erro">{erro}</p>}
        </form>
    );
}