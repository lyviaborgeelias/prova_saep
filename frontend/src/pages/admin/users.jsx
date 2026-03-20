import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles.css";

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

export default function Users() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [lista, setLista] = useState([]);
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  const listar = async () => {
    setErro("");
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/usuarios/", headers);
      setUsuarios(response.data || []);
    } catch (error) {
      console.log(error);
      setErro("Não foi possível carregar a lista de usuários.");
    } finally {
      setLoading(false);
    }
  };

  const pesquisar = async () => {
    setErro("");
    setLoading(true);
    try {
      const url = `http://127.0.0.1:8000/api/usuarios/?nome=${encodeURIComponent(nome)}`;
      const response = await axios.get(url, headers);
      console.log("Response: ", response);

      setLista(response.data || []);
    } catch (error) {
      console.log(error);
      setErro("Não foi possível realizar a pesquisa.");
    } finally {
      setLoading(false);
    }
  };

  const limparPesquisa = () => {
    setNome("");
    setLista([]);
  };

  useEffect(() => {
    if (token) listar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!token) {
    return (
      <div className="dashboard">
        <div className="dashboard__header">
          <div>
            <h2 className="dashboard__title">Usuários</h2>
            <p className="dashboard__subtitle">Acesso negado: token não encontrado</p>
          </div>
        </div>
      </div>
    );
  }

  const pillByTipo = (tipo) => {
    if (tipo === "LOCADOR") return "pill pill--ok";
    if (tipo === "LOCATARIO") return "pill pill--warn";
    return "pill";
  };
  const totalUsuarios = usuarios.length;
  const locadores = usuarios.filter((u) => u.tipo === "LOCADOR").length;
  const locatarios = usuarios.filter((u) => u.tipo === "LOCATARIO").length;

  const barData = {
    labels: ["Total", "Locadores", "Locatários", "Resultado Pesquisa"],
    datasets: [
      {
        label: "Usuários",
        data: [totalUsuarios, locadores, locatarios, lista.length],
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
        labels: { color: "#e2e8f0" },
      },
      title: {
        display: true,
        text: "Resumo de Usuários",
        color: "#e2e8f0",
      },
    },
    scales: {
      x: {
        ticks: { color: "#e2e8f0" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "#e2e8f0" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  const doughnutData = {
    labels: ["Locadores", "Locatários"],
    datasets: [
      {
        data: [locadores, locatarios],
        backgroundColor: [
          "#3af800",
          "#f6673b",
        ],
        borderColor: "#0f172a",
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        labels: { color: "#e2e8f0" },
      },
      title: {
        display: true,
        text: "Distribuição de Tipos de Usuário",
        color: "#e2e8f0",
      },
    },
  };
  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard__header">
        <div>
          <h2 className="dashboard__title">Usuários</h2>
          <p className="dashboard__subtitle">
            Gerenciamento e consulta de usuários cadastrados
          </p>

          <div className="actions">
            <button className="actionBtn" onClick={() => navigate("/admin/home")}>
              Dashboard
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
        </div>

        <div className="dashboard__chip" title="Token carregado no navegador">
          <span className="dot" />
          <span>{loading ? "Carregando" : "Conectado"}</span>
        </div>
      </div>

      {/* Cards */}
      <div className="status">
        <div className="card">
          <div className="card__badge badge--primary" />
          <div className="card__content">
            <p className="card__label">Total de usuários</p>
            <p className="card__value">{usuarios.length}</p>
            <p className="card__hint">Base cadastrada</p>
          </div>
        </div>

        <div className="card">
          <div className="card__badge badge--secondary" />
          <div className="card__content">
            <p className="card__label">Pesquisa</p>
            <p className="card__value">{lista.length}</p>
            <p className="card__hint">Resultados filtrados</p>
          </div>
        </div>

        <div className="card">
          <div className="card__badge badge--warn" />
          <div className="card__content">
            <p className="card__label">Locadores</p>
            <p className="card__value">
              {usuarios.filter((u) => u.tipo === "LOCADOR").length}
            </p>
            <p className="card__hint">Perfis locador</p>
          </div>
        </div>

        <div className="card">
          <div className="card__badge badge--danger" />
          <div className="card__content">
            <p className="card__label">Locatários</p>
            <p className="card__value">
              {usuarios.filter((u) => u.tipo === "LOCATARIO").length}
            </p>
            <p className="card__hint">Perfis locatário</p>
          </div>
        </div>
      </div>

      <hr className="hr" />

      {/* Pesquisa */}
      <h3 className="sectionTitle">Pesquisar por nome</h3>

      <div className="tableWrap" style={{ padding: 12 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            className="inputSearch"
            placeholder="Digite um nome (ex: Ana)"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <button className="actionBtn" onClick={pesquisar} disabled={!nome || loading}>
            Pesquisar
          </button>

          <button className="actionBtn" onClick={limparPesquisa} disabled={loading}>
            Limpar
          </button>

          <button className="actionBtn" onClick={listar} disabled={loading}>
            Recarregar
          </button>
        </div>

        {erro && <p style={{ marginTop: 12, color: "rgba(255,255,255,0.75)" }}>{erro}</p>}
      </div>
      <hr className="hr" />

      <div className="charts">

        <div className="chartCard">
          <p className="chartCard__title">Resumo de Usuários</p>

          <div className="chartCanvas">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="chartCard">
          <p className="chartCard__title">Distribuição de Tipos</p>

          <div className="chartCanvas">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

      </div>

      <hr className="hr" />
      <hr className="hr" />

      {/* Tabela principal */}
      <h3 className="sectionTitle">Lista de Usuários</h3>
      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td className="table__empty" colSpan="5">
                  {loading ? "Carregando..." : "Nenhum usuário encontrado."}
                </td>
              </tr>
            ) : (
              usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nome}</td>
                  <td>{u.email || "-"}</td>
                  <td>{u.telefone || "-"}</td>
                  <td>
                    <span className={pillByTipo(u.tipo)}>{u.tipo}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <hr className="hr" />

      {/* Tabela pesquisa */}
      <h3 className="sectionTitle">Resultado da Pesquisa</h3>
      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 ? (
              <tr>
                <td className="table__empty" colSpan="5">
                  {nome ? "Nenhum resultado encontrado." : "Digite um nome para pesquisar."}
                </td>
              </tr>
            ) : (
              lista.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nome}</td>
                  <td>{u.email || "-"}</td>
                  <td>{u.telefone || "-"}</td>
                  <td>
                    <span className={pillByTipo(u.tipo)}>{u.tipo}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <hr className="hr" />

      {/* Footer */}
      <footer className="footer">
        <div className="footerContent">
          <p className="footerSystem">Sistema de Gestão de Aluguéis</p>
          <p className="footerDev">
            Desenvolvido por <strong>Lindomar José Batistão</strong> e <strong>Lyvia Borge Elias</strong>
          </p>
          <p className="footerCopy">© {new Date().getFullYear()} Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
}