// src/pages/admin/payments.jsx
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

export default function Payments() {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [pagamentos, setPagamentos] = useState([]);
    const [lista, setLista] = useState([]);

    const [dataPagamento, setDataPagamento] = useState("");
    const [status, setStatus] = useState(""); // "", "true", "false"
    const [contrato, setContrato] = useState("");

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
            const response = await axios.get("http://127.0.0.1:8000/api/pagamentos/", headers);
            setPagamentos(response.data || []);
        } catch (error) {
            console.log(error);
            setErro("Não foi possível carregar a lista de pagamentos.");
        } finally {
            setLoading(false);
        }
    };

    const pesquisar = async () => {
        setErro("");
        setLoading(true);

        try {
            const params = new URLSearchParams();

            if (dataPagamento) params.append("data_pagamento", dataPagamento);
            if (status !== "") params.append("status", status); // true/false
            if (contrato) params.append("contrato", contrato);  // contrato__id

            const url = `http://127.0.0.1:8000/api/pagamentos/?${params.toString()}`;

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
        setDataPagamento("");
        setStatus("");
        setContrato("");
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
                        <h2 className="dashboard__title">Pagamentos</h2>
                        <p className="dashboard__subtitle">Acesso negado: token não encontrado</p>
                    </div>
                </div>
            </div>
        );
    }

    // ===== cards =====
    const total = pagamentos.length;
    const pagos = pagamentos.filter((p) => p.status === true).length;
    const emAberto = pagamentos.filter((p) => p.status === false).length;
    const barData = {
        labels: ["Total", "Pagos", "Em aberto"],
        datasets: [
            {
                label: "Pagamentos",
                data: [total, pagos, emAberto],
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
                text: "Resumo de Pagamentos",
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
        labels: ["Pagos", "Em aberto"],
        datasets: [
            {
                data: [pagos, emAberto],
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
                text: "Distribuição de Pagamentos",
                color: "#e2e8f0"
            }
        }
    };
    const pillByStatus = (s) => {
        if (s === true) return "pill pill--ok";
        if (s === false) return "pill pill--warn";
        return "pill";
    };

    const labelStatus = (s) => {
        if (s === true) return "PAGO";
        if (s === false) return "EM_ABERTO";
        return "-";
    };

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="dashboard__header">
                <div>
                    <h2 className="dashboard__title">Pagamentos</h2>
                    <p className="dashboard__subtitle">Gerenciamento e consulta de pagamentos</p>

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
                        <p className="card__label">Total de pagamentos</p>
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
                        <p className="card__label">Em aberto</p>
                        <p className="card__value">{emAberto}</p>
                        <p className="card__hint">Pendentes</p>
                    </div>
                </div>

                <div className="card">
                    <div className="card__badge badge--danger" />
                    <div className="card__content">
                        <p className="card__label">Pagos</p>
                        <p className="card__value">{pagos}</p>
                        <p className="card__hint">Concluídos</p>
                    </div>
                </div>
            </div>
            <hr className="hr" />

            {/* Charts */}
            <div className="charts">

                <div className="chartCard">
                    <p className="chartCard__title">Resumo de Pagamentos</p>
                    <div className="chartCanvas">
                        <Bar data={barData} options={barOptions} />
                    </div>
                </div>

                <div className="chartCard">
                    <p className="chartCard__title">Distribuição de Pagamentos</p>
                    <div className="chartCanvas">
                        <Doughnut data={doughnutData} options={doughnutOptions} />
                    </div>
                </div>

            </div>

            <hr className="hr" />
            <hr className="hr" />

            {/* Pesquisa */}
            <h3 className="sectionTitle">Pesquisar pagamentos</h3>

            <div className="tableWrap" style={{ padding: 12 }}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <input
                        type="date"
                        className="inputSearch"
                        value={dataPagamento}
                        onChange={(e) => setDataPagamento(e.target.value)}
                    />

                    <select
                        className="inputSearch"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={{ width: 220 }}
                    >
                        <option value="">Status (todos)</option>
                        <option value="true">PAGO</option>
                        <option value="false">EM ABERTO</option>
                    </select>

                    <input
                        className="inputSearch"
                        placeholder="Contrato ID (ex: 10)"
                        value={contrato}
                        onChange={(e) => setContrato(e.target.value)}
                        style={{ width: 220 }}
                    />

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
            <h3 className="sectionTitle">Lista de Pagamentos</h3>
            <div className="tableWrap">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Data</th>
                            <th>Status</th>
                            <th>Contrato</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagamentos.length === 0 ? (
                            <tr>
                                <td className="table__empty" colSpan="4">
                                    {loading ? "Carregando..." : "Nenhum pagamento encontrado."}
                                </td>
                            </tr>
                        ) : (
                            pagamentos.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.data_pagamento || "-"}</td>
                                    <td>
                                        <span className={pillByStatus(p.status)}>{labelStatus(p.status)}</span>
                                    </td>
                                    <td>{p.contrato || p.contrato_id || "-"}</td>
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
                            <th>Data</th>
                            <th>Status</th>
                            <th>Contrato</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lista.length === 0 ? (
                            <tr>
                                <td className="table__empty" colSpan="4">
                                    {(dataPagamento || status !== "" || contrato)
                                        ? "Nenhum resultado encontrado."
                                        : "Use os filtros acima para pesquisar."}
                                </td>
                            </tr>
                        ) : (
                            lista.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.data_pagamento || "-"}</td>
                                    <td>
                                        <span className={pillByStatus(p.status)}>{labelStatus(p.status)}</span>
                                    </td>
                                    <td>{p.contrato || p.contrato_id || "-"}</td>
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