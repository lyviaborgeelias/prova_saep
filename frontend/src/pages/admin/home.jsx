import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FiBox, FiUser, FiLogOut, FiShoppingCart 
} from "react-icons/fi";
import "./styles.css";

export default function Home() {
  const [userName, setUserName] = useState("Carregando...");
  const [stats, setStats] = useState({
    total: 0,
    baixoEstoque: 0,
    valorTotal: "0,00",
    movimentacoes: 0
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/"); return; }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Busca dados do usuário
        const userRes = await axios.get("http://127.0.0.1:8000/api/usuarios/me/", config);
        setUserName(userRes.data.nome);
        
      } catch (error) {
        console.log("Erro na autenticação:", error);
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    fetchData();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="main-header">
        <div className="brand">
          <div className="brand-icon"><FiBox /></div>
          <div>
            <h1>Sistema de Gestão</h1>
            <span>Equipamentos Eletrônicos</span>
          </div>
        </div>
        <div className="user-menu">
          <div className="user-info">
            <FiUser /> <span>{userName}</span>
          </div>
          <button className="logout-button" onClick={logout}>
            <FiLogOut /> Sair
          </button>
        </div>
      </header>
        {/* CARDS DE AÇÃO */}
        <section className="actions-grid">
          <div className="action-card">
            <div className="action-header">
              <div className="action-icon blue-bg"><FiBox /></div>
              <div>
                <h3>Cadastro de Produtos</h3>
                <p>Gerenciar produtos cadastrados no sistema</p>
              </div>
            </div>
            <ul>
              <li>Adicionar novos produtos</li>
              <li>Editar informações de produtos</li>
              <li>Buscar e filtrar produtos</li>
            </ul>
            <button className="btn-access dark" onClick={() => navigate("/produtos")}>
              Acessar Cadastro
            </button>
          </div>

          <div className="action-card">
            <div className="action-header">
              <div className="action-icon green-bg"><FiShoppingCart /></div>
              <div>
                <h3>Gestão de Estoque</h3>
                <p>Controlar movimentações de estoque</p>
              </div>
            </div>
            <ul>
              <li>Registrar entradas e saídas</li>
              <li>Visualizar histórico de movimentações</li>
              <li>Alertas de estoque mínimo</li>
            </ul>
            <button className="btn-access green" onClick={() => navigate("/estoque")}>
              Acessar Gestão
            </button>
          </div>
        </section>
    </div>
  );
}