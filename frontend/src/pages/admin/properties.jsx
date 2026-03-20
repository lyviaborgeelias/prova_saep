// src/pages/admin/properties/index.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
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

export default function Properties() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [imoveis, setImoveis] = useState([]);
  const [lista, setLista] = useState([]);

  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("");
  const [status, setStatus] = useState("");

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const headers = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  const listar = async () => {
    setErro("");
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/imoveis/", headers);
      setImoveis(response.data || []);
    } catch (error) {
      console.log(error);
      setErro("Não foi possível carregar a lista de imóveis.");
    } finally {
      setLoading(false);
    }
  };

  const pesquisar = async () => {
    setErro("");
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (titulo) params.append("titulo", titulo);
      if (tipo) params.append("tipo", tipo);
      if (status) params.append("status", status);

      const url = `http://127.0.0.1:8000/api/imoveis/?${params.toString()}`;
      const response = await axios.get(url, headers);

      setLista(response.data || []);
    } catch (error) {
      console.log(error);
      setErro("Não foi possível realizar a pesquisa.");
    } finally {
      setLoading(false);
    }
  };

  const limparPesquisa = () => {
    setTitulo("");
    setTipo("");
    setStatus("");
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
            <h2 className="dashboard__title">Imóveis</h2>
            <p className="dashboard__subtitle">Acesso negado: token não encontrado</p>
          </div>
        </div>
      </div>
    );
  }

  const pillByStatus = (s) => {
    if (s === "DISPONIVEL") return "pill pill--ok";
    if (s === "ALUGADO") return "pill pill--warn";
    return "pill";
  };

  const total = imoveis.length;
  const disponiveis = imoveis.filter((i) => i.status === "DISPONIVEL").length;
  const alugados = imoveis.filter((i) => i.status === "ALUGADO").length;
  const barData = {
    labels: ["Total", "Disponíveis", "Alugados"],
    datasets: [
      {
        label: "Imóveis",
        data: [total, disponiveis, alugados],
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
        text: "Resumo de Imóveis",
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
        data: [disponiveis, alugados],
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
        labels: { color: "#e2e8f0" }
      },
      title: {
        display: true,
        text: "Distribuição de Imóveis",
        color: "#e2e8f0"
      }
    }
  };

  const abrirSeletorExcel = () => {
    fileInputRef.current.click()
  }

  const importarExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setErro("");
    setLoading(true);

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/importar_imoveis/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await listar();
      alert("Importação realizada com sucesso.");
    } catch (error) {
      console.log(error);
      console.log(error.response?.data);
      setErro("Não foi possível importar a planilha.");
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard__header">
        <div>
          <h2 className="dashboard__title">Imóveis</h2>
          <p className="dashboard__subtitle">Gerenciamento e consulta de imóveis cadastrados</p>

          <div className="actions">
            <button className="actionBtn" onClick={() => navigate("/admin/home")}>
              Dashboard
            </button>
            <button className="actionBtn" onClick={() => navigate("/admin/users")}>
              Usuários
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
        <button
          className="actionBtn"
          onClick={abrirSeletorExcel}
          disabled={loading}
        >
          Importar Excel
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          style={{ display: "none" }}
          onChange={importarExcel}
        />
      </div>

      {/* Cards */}
      <div className="status">
        <div className="card">
          <div className="card__badge badge--primary" />
          <div className="card__content">
            <p className="card__label">Total de imóveis</p>
            <p className="card__value">{total}</p>
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
            <p className="card__label">Disponíveis</p>
            <p className="card__value">{disponiveis}</p>
            <p className="card__hint">Prontos para alugar</p>
          </div>
        </div>

        <div className="card">
          <div className="card__badge badge--danger" />
          <div className="card__content">
            <p className="card__label">Alugados</p>
            <p className="card__value">{alugados}</p>
            <p className="card__hint">Em contrato</p>
          </div>
        </div>
      </div>
      <hr className="hr" />

      {/* Charts */}
      <div className="charts">

        <div className="chartCard">
          <p className="chartCard__title">Resumo de Imóveis</p>
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
      <hr className="hr" />

      {/* Pesquisa */}
      <h3 className="sectionTitle">Pesquisar imóveis</h3>

      <div className="tableWrap" style={{ padding: 12 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            className="inputSearch"
            placeholder="Título (ex: Casa, Apartamento...)"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <input
            className="inputSearch"
            placeholder="Tipo (ex: casa, ap...)"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          />

          <select
            className="inputSearch"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: 220 }}
          >
            <option value="">Status (todos)</option>
            <option value="DISPONIVEL">DISPONÍVEL</option>
            <option value="ALUGADO">ALUGADO</option>
          </select>

          <button className="actionBtn" onClick={pesquisar} disabled={loading}>
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

      {/* Tabela principal */}
      <h3 className="sectionTitle">Lista de Imóveis</h3>
      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Valor</th>
              <th>Locador</th>
            </tr>
          </thead>
          <tbody>
            {imoveis.length === 0 ? (
              <tr>
                <td className="table__empty" colSpan="6">
                  {loading ? "Carregando..." : "Nenhum imóvel encontrado."}
                </td>
              </tr>
            ) : (
              imoveis.map((i) => (
                <tr key={i.id}>
                  <td>{i.id}</td>
                  <td>{i.titulo}</td>
                  <td>{i.tipo}</td>
                  <td>
                    <span className={pillByStatus(i.status)}>{i.status}</span>
                  </td>
                  <td>{i.valor_aluguel}</td>
                  <td>{i.locador_id || "-"}</td>
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
              <th>Título</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Valor</th>
              <th>Locador</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 ? (
              <tr>
                <td className="table__empty" colSpan="6">
                  {(titulo || tipo || status)
                    ? "Nenhum resultado encontrado."
                    : "Use os filtros acima para pesquisar."}
                </td>
              </tr>
            ) : (
              lista.map((i) => (
                <tr key={i.id}>
                  <td>{i.id}</td>
                  <td>{i.titulo}</td>
                  <td>{i.tipo}</td>
                  <td>
                    <span className={pillByStatus(i.status)}>{i.status}</span>
                  </td>
                  <td>{i.valor_aluguel}</td>
                  <td>{i.locador_id || "-"}</td>
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