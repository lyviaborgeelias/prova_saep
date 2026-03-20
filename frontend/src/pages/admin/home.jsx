// src/pages/home_admin/index.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./styles.css"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminHome() {
  const token = localStorage.getItem("token");

  const [status, setstatus] = useState(null);
  const [imoveisDestaque, setImoveisDestaque] = useState([]);
  const [contratosRecentes, setContratosRecentes] = useState([]);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const carregarDashboard = async () => {
    setErro("");
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/dashboard/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setstatus(response.data.status);
      setImoveisDestaque(response.data.imoveis_destaque || []);
      setContratosRecentes(response.data.contratos_recentes || []);
    } catch (e) {
      console.log("Erro ao carregar dashboard:", e);
      setErro("Não foi possível carregar o dashboard. Verifique o token e a API.");
    }
  };

  useEffect(() => {
    carregarDashboard();
  }, []);

  if (!token) {
    return (
      <div className="dashboard">
        <div className="dashboard__header">
          <div>
            <h2 className="dashboard__title">Dashboard</h2>
            <p className="dashboard__subtitle">Acesso negado: token não encontrado</p>
          </div>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="dashboard">
        <div className="dashboard__header">
          <div>
            <h2 className="dashboard__title">Dashboard</h2>
            <p className="dashboard__subtitle">Carregando dados...</p>
          </div>
          <div className="dashboard__chip">
            <span className="dot" />
            <span>Conectando</span>
          </div>
        </div>

        {erro && <p style={{ color: "rgba(255,255,255,0.75)" }}>{erro}</p>}
      </div>
    );
  }

  // ===== Chart options (legível no dark) =====
  const commonPlugins = {
    legend: { labels: { color: "rgba(255,255,255,0.75)" } },
    title: { color: "rgba(255,255,255,0.75)" },
    tooltip: { enabled: true },
  };

  const barData = {
    labels: ["Imóveis", "Disponíveis", "Alugados", "Pag. em aberto"],
    datasets: [
      {
        label: "Quantidade",
        data: [
          status.imoveis_cadastrados,
          status.disponiveis,
          status.alugados,
          status.pagamentos_em_aberto,
        ],
        backgroundColor: [
          "#6366f1", // roxo
          "#22c55e", // verde
          "#f59e0b", // laranja
          "#ef4444", // vermelho
        ],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#e2e8f0" }
      },
      title: {
        display: true,
        text: "Resumo do Sistema",
        color: "#e2e8f0"
      }
    },
    scales: {
      x: {
        ticks: { color: "#e2e8f0" },
        grid: { color: "rgba(255,255,255,0.1)" }
      },
      y: {
        ticks: { color: "#e2e8f0" },
        grid: { color: "rgba(255,255,255,0.1)" }
      }
    }
  };

  const doughnutData = {
    labels: ["Disponíveis", "Alugados"],
    datasets: [
      {
        data: [status.disponiveis, status.alugados],
        backgroundColor: [
          "#3af800", // verde forte
          "#f6673b"  // azul forte
        ],
        borderColor: "#0f172a", // mesma cor do fundo (para separar)
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        labels: { color: "#e2e8f0" }
      },
      title: {
        display: true,
        text: "Distribuição de Imóveis",
        color: "#e2e8f0"
      }
    }
  };

  const pillClassByStatus = (status) => {
    if (status === "DISPONIVEL") return "pill pill--ok";
    if (status === "ALUGADO") return "pill pill--warn";
    return "pill";
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard__header">
        <div>
          <h2 className="dashboard__title">Dashboard</h2>
          <div className="actions">
            <button className="actionBtn" onClick={() => navigate("/admin/users")}>
              Usuários
            </button>

            <button className="actionBtn" onClick={() => navigate("/admin/properties")}>
              Imóveis
            </button>

            <button className="actionBtn" onClick={() => navigate("/admin/payments")}>
              Pagamentos
            </button>

            <button className="actionBtn" onClick={() => navigate("/admin/contracts")}>
              Contratos
            </button>
          </div>
          <p className="dashboard__subtitle">Resumo do sistema de aluguel</p>
        </div>

        <div className="dashboard__chip" title="Token carregado no navegador">
          <span className="dot" />
          <span>Conectado</span>
        </div>
      </div>

      {/* status cards */}
      <div className="status">
        <div className="card">
          <div className="card__badge badge--primary" />
          <div className="card__content">
            <p className="card__label">Imóveis</p>
            <p className="card__value">{status.imoveis_cadastrados}</p>
            <p className="card__hint">Total cadastrado</p>
          </div>
        </div>

        <div className="card">
          <div className="card__badge badge--secondary" />
          <div className="card__content">
            <p className="card__label">Disponíveis</p>
            <p className="card__value">{status.disponiveis}</p>
            <p className="card__hint">Prontos para alugar</p>
          </div>
        </div>

        <div className="card">
          <div className="card__badge badge--warn" />
          <div className="card__content">
            <p className="card__label">Alugados</p>
            <p className="card__value">{status.alugados}</p>
            <p className="card__hint">Contratos ativos</p>
          </div>
        </div>

        <div className="card">
          <div className="card__badge badge--danger" />
          <div className="card__content">
            <p className="card__label">Em aberto</p>
            <p className="card__value">{status.pagamentos_em_aberto}</p>
            <p className="card__hint">Pagamentos pendentes</p>
          </div>
        </div>
      </div>

      <hr className="hr" />

      {/* Charts */}
      <div className="charts">
        <div className="chartCard">
          <p className="chartCard__title">Resumo do Sistema</p>
          <div className="chartCanvas">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="chartCard">
          <p className="chartCard__title">Distribuição de Imóveis</p>
          <div className="chartCanvas">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      <hr className="hr" />

      {/* Table: últimos imóveis */}
      <h3 className="sectionTitle">Últimos Imóveis</h3>
      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Valor</th>
              <th>Locador ID</th>
            </tr>
          </thead>
          <tbody>
            {imoveisDestaque.length === 0 ? (
              <tr>
                <td className="table__empty" colSpan="6">
                  Nenhum imóvel encontrado.
                </td>
              </tr>
            ) : (
              imoveisDestaque.map((i) => (
                <tr key={i.id}>
                  <td>{i.id}</td>
                  <td>{i.titulo}</td>
                  <td>{i.tipo}</td>
                  <td>
                    <span className={pillClassByStatus(i.status)}>{i.status}</span>
                  </td>
                  <td>{i.valor_aluguel}</td>
                  <td>{i.locador_id}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <hr className="hr" />

      {/* Table: últimos contratos */}
      <h3 className="sectionTitle">Últimos Contratos</h3>
      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Valor</th>
              <th>Imóvel</th>
              <th>Locador</th>
              <th>Locatário</th>
            </tr>
          </thead>
          <tbody>
            {contratosRecentes.length === 0 ? (
              <tr>
                <td className="table__empty" colSpan="7">
                  Nenhum contrato encontrado.
                </td>
              </tr>
            ) : (
              contratosRecentes.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.data_inicio}</td>
                  <td>{c.data_fim || "-"}</td>
                  <td>{c.valor}</td>
                  <td>{c.imovel__titulo}</td>
                  <td>{c.locador__nome}</td>
                  <td>{c.locatario__nome}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <hr className="hr" />

      <footer className="footer">
        <div className="footerContent">
          <p className="footerSystem">
            Sistema de Gestão de Aluguéis
          </p>

          <p className="footerDev">
            Desenvolvido por <strong>Lindomar José Batistão</strong> e <strong>Lyvia Borge Elias</strong>
          </p>

          <p className="footerCopy">
            © {new Date().getFullYear()} Todos os direitos reservados
          </p>
        </div>
      </footer>

      {erro && <p style={{ marginTop: 14, color: "rgba(255,255,255,0.75)" }}>{erro}</p>}
    </div>
  );
}