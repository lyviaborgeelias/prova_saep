// src/pages/login/index.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const logar = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username: user,
        password: password,
      });

      const access = response.data.access;

      localStorage.setItem("token", access);

      window.location.href = "/admin/home";

    } catch (error) {
      console.log("Error: ", error);
      localStorage.removeItem("token");
      setMessage("Usuário ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="loginPage">
      <div className="loginCard">
        <div className="loginHeader">
          <h1 className="loginTitle">Acessar sistema</h1>
          <p className="loginSubtitle">Entre com suas credenciais para continuar</p>
        </div>

        <form className="loginForm" onSubmit={logar}>
          <div className="field">
            <label className="label">Usuário</label>
            <input
              className="input"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Digite seu usuário"
              autoComplete="username"
            />
          </div>

          <div className="field">
            <label className="label">Senha</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              autoComplete="current-password"
            />
          </div>

          {message && <div className="alert">{message}</div>}

          <button className="btnPrimary" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}