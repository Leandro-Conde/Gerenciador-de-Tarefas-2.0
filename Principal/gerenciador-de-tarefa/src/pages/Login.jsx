import { useState } from "react";
import { supabase } from "../services/supabase";

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
        <div>
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
                <input type="email" 
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)} />
            
            <input type="password" 
                placeholder="Senha"
                value={senha}
                onChange={e => setSenha(e.target.value)} />

            <button type="submit">Entrar</button>
            </form>
        </div>
    );
}