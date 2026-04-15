import { useState } from "react";
import Login from "./Login";
import Registro from "./Registro";

export default function Home() {
  const [tela, setTela] = useState("login");

  if (tela === "login") {
    return (
      <Login
        onLogin={() => setTela("logado")}
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

  return <div>Logado</div>;
}