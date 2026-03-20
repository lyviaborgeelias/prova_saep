// src/pages/admin/contracts.jsx
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

export default function Contracts() {

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [contratos, setContratos] = useState([]);
  const [lista, setLista] = useState([]);

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  const contratosAtivos = contratos.filter(c => !c.data_fim).length;
  const contratosFinalizados = contratos.filter(c => c.data_fim).length;

  const barData = {
    labels: ["Total", "Ativos", "Finalizados"],
    datasets: [
      {
        label: "Contratos",
        data: [
          contratos.length,
          contratosAtivos,
          contratosFinalizados
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
        text: "Resumo de Contratos",
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
    labels: ["Ativos", "Finalizados"],
    datasets: [
      {
        data: [contratosAtivos, contratosFinalizados],
        backgroundColor: [
          "#3af800",
          "#f6673b",
        ],
        borderColor: "#0f172a",
        borderWidth: 2
      }
    ]
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        labels: { color: "#e2e8f0" }
      },
      title: {
        display: true,
        text: "Distribuição de Contratos",
        color: "#e2e8f0"
      }
    }
  };

  // LISTAR
  const listar = async () => {
    setErro("");
    setLoading(true);

    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/contratos/",
        headers
      );

      setContratos(response.data || []);

    } catch (error) {
      console.log(error);
      setErro("Não foi possível carregar a lista de contratos.");
    } finally {
      setLoading(false);
    }
  };

  // PESQUISAR
  const pesquisar = async () => {

    setErro("");
    setLoading(true);

    try {

      const params = new URLSearchParams();

      if (dataInicio) params.append("data_inicio", dataInicio);
      if (dataFim) params.append("data_fim", dataFim);

      const url = `http://127.0.0.1:8000/api/contratos/?${params.toString()}`;

      const response = await axios.get(url, headers);

      setLista(response.data || []);

    } catch (error) {
      console.log(error);
      setErro("Erro ao pesquisar contratos.");
    } finally {
      setLoading(false);
    }
  };

  const limparPesquisa = () => {
    setDataInicio("");
    setDataFim("");
    setLista([]);
  };

  useEffect(() => {
    if (token) listar();
  }, []);

  if (!token) {
    return (
      <div className="dashboard">
        <div className="dashboard__header">
          <div>
            <h2 className="dashboard__title">Contratos</h2>
            <p className="dashboard__subtitle">
              Acesso negado: token não encontrado
            </p>
          </div>
        </div>
      </div>
    );
  }

  const total = contratos.length;

  const valorTotal = contratos.reduce(
    (acc, c) => acc + Number(c.valor || 0),
    0
  );

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dashboard__header">

        <div>
          <h2 className="dashboard__title">Contratos</h2>
          <p className="dashboard__subtitle">
            Gerenciamento de contratos de aluguel
          </p>

          <div className="actions">

            <button className="actionBtn" onClick={() => navigate("/admin/home")}>
              Dashboard
            </button>

            <button className="actionBtn" onClick={() => navigate("/admin/users")}>
              Usuários
            </button>

            <button className="actionBtn" onClick={() => navigate("/admin/properties")}>
              Imóveis
            </button>

            <button className="actionBtn" onClick={() => navigate("/admin/payments")}>
              Pagamentos
            </button>

          </div>

        </div>

        <div className="dashboard__chip">
          <span className="dot" />
          <span>{loading ? "Carregando" : "Conectado"}</span>
        </div>

      </div>

      {/* CARDS */}
      <div className="status">

        <div className="card">
          <div className="card__badge badge--primary" />
          <div className="card__content">
            <p className="card__label">Total de contratos</p>
            <p className="card__value">{total}</p>
            <p className="card__hint">Registros cadastrados</p>
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
            <p className="card__label">Valor total</p>
            <p className="card__value">R$ {valorTotal}</p>
            <p className="card__hint">Somatório contratos</p>
          </div>
        </div>

      </div>
      <hr className="hr" />

      {/* GRÁFICOS */}
      <div className="charts">

        <div className="chartCard">
          <p className="chartCard__title">Resumo de Contratos</p>
          <div className="chartCanvas">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="chartCard">
          <p className="chartCard__title">Distribuição de Contratos</p>
          <div className="chartCanvas">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

      </div>

      <hr className="hr" />
      <hr className="hr" />

      {/* PESQUISA */}
      <h3 className="sectionTitle">Pesquisar por período</h3>

      <div className="tableWrap" style={{ padding: 12 }}>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>

          <input
            type="date"
            className="inputSearch"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />

          <input
            type="date"
            className="inputSearch"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />

          <button className="actionBtn" onClick={pesquisar}>
            Pesquisar
          </button>

          <button className="actionBtn" onClick={limparPesquisa}>
            Limpar
          </button>

          <button className="actionBtn" onClick={listar}>
            Recarregar
          </button>

        </div>

        {erro && (
          <p style={{ marginTop: 12, color: "rgba(255,255,255,0.75)" }}>
            {erro}
          </p>
        )}

      </div>

      <hr className="hr" />

      {/* LISTA */}
      <h3 className="sectionTitle">Lista de Contratos</h3>

      <div className="tableWrap">

        <table className="table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Imóvel</th>
              <th>Locatário</th>
              <th>Data início</th>
              <th>Data fim</th>
              <th>Valor</th>
            </tr>
          </thead>

          <tbody>

            {contratos.length === 0 ? (
              <tr>
                <td className="table__empty" colSpan="6">
                  Nenhum contrato encontrado
                </td>
              </tr>
            ) : (
              contratos.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.imovel_nome}</td>
                  <td>{c.locatario_nome}</td>
                  <td>{c.data_inicio}</td>
                  <td>{c.data_fim}</td>
                  <td>R$ {c.valor}</td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      <hr className="hr" />

      {/* RESULTADO PESQUISA */}
      <h3 className="sectionTitle">Resultado da Pesquisa</h3>

      <div className="tableWrap">

        <table className="table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Imóvel</th>
              <th>Locatário</th>
              <th>Data início</th>
              <th>Data fim</th>
              <th>Valor</th>
            </tr>
          </thead>

          <tbody>

            {lista.length === 0 ? (
              <tr>
                <td className="table__empty" colSpan="6">
                  Nenhum resultado encontrado
                </td>
              </tr>
            ) : (
              lista.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.imovel_id}</td>
                  <td>{c.locatario_id}</td>
                  <td>{c.data_inicio}</td>
                  <td>{c.data_fim}</td>
                  <td>R$ {c.valor}</td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      <hr className="hr" />

      {/* FOOTER */}
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

    </div>
  );
}