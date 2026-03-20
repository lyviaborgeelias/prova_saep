import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

export default function Home() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        const response = await axios.get(
          "http://127.0.0.1:8000/api/usuarios/me/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUserName(response.data.nome);
      } catch (error) {
        console.log("Erro ao buscar usuário:", error);
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    fetchUser();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="homeContainer">
      <header className="homeHeader">
        <h2>Bem-vindo, {userName}</h2>
        <button className="logoutBtn" onClick={logout}>
          Sair
        </button>
      </header>

      <div className="homeCards">
        <div
          className="card"
          onClick={() => navigate("/produtos")}
        >
          <h3>Cadastro de Produto</h3>
          <p>Adicionar novos produtos ao sistema</p>
        </div>

        <div
          className="card"
          onClick={() => navigate("/estoque")}
        >
          <h3>Gestão de Estoque</h3>
          <p>Visualizar e controlar movimentações</p>
        </div>
      </div>
    </div>
  );
}