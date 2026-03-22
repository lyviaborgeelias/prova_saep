import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPackage, FiTrendingUp, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import "./estoque.css";

export default function Estoque() {
    const [produtos, setProdutos] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState("");
    const [tipo, setTipo] = useState("entrada");
    const [quantidade, setQuantidade] = useState("");
    const [data, setData] = useState(new Date().toISOString().split('T')[0]);
    const [usuarioId, setUsuarioId] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const api = axios.create({
        baseURL: "http://127.0.0.1:8000/api",
        headers: { Authorization: `Bearer ${token}` },
    });

    const carregarProdutos = async () => {
        try {
            // Timestamp adicionado para evitar cache do navegador
            const res = await api.get(`/produtos/?t=${new Date().getTime()}`);
            
            let arr = [...res.data];
            // Algoritmo Bubble Sort
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr.length - i - 1; j++) {
                    if (arr[j].nome > arr[j + 1].nome) {
                        let temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                    }
                }
            }
            setProdutos(arr);
        } catch (err) {
            console.error("Erro ao carregar produtos", err);
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const userRes = await api.get("/usuarios/me/");
                setUsuarioId(userRes.data.id);
                await carregarProdutos();
            } catch (e) { navigate("/"); }
        };
        fetchInitialData();
    }, []);

    const movimentar = async (e) => {
        e.preventDefault();

        if (!produtoSelecionado || !quantidade) {
            alert("Preencha o produto e a quantidade!");
            return;
        }

        try {
            const response = await api.post("/movimentacoes/", {
                produtoID: produtoSelecionado,
                quantidade: Number(quantidade),
                tipo: tipo,
                data_operacao: data,
                responsavelID: usuarioId,
            });

            if (response.status === 201 || response.status === 200) {
                // Aguarda 500ms para o banco processar a alteração e busca os dados novos
                setTimeout(async () => {
                    await carregarProdutos();
                    alert(`Sucesso! Estoque atualizado.`);
                }, 500);
                
                setQuantidade("");
            }
        } catch (err) {
            console.error(err);
            alert("Erro ao atualizar estoque.");
        }
    };

    return (
        <div className="estoque-page">
            <header className="page-header">
                <div className="header-left">
                    <button className="back-btn" onClick={() => navigate("/admin/home")}>
                        <FiArrowLeft />
                    </button>
                    <div className="header-title">
                        <div className="header-icon green-bg"><FiPackage /></div>
                        <div>
                            <h1>Gestão de Estoque</h1>
                            <span>Controle e consulta de saldo</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="estoque-grid-layout">
                {/* LADO ESQUERDO: FORMULÁRIO */}
                <section className="form-container">
                    <div className="card-estoque">
                        <h3>Nova Movimentação</h3>
                        <p>Atualize o saldo do inventário</p>

                        <form onSubmit={movimentar}>
                            <div className="input-group">
                                <label>Produto</label>
                                <select 
                                    required
                                    value={produtoSelecionado} 
                                    onChange={(e) => setProdutoSelecionado(e.target.value)}
                                >
                                    <option value="">Selecione um produto</option>
                                    {produtos.map((p) => (
                                        <option key={p.id} value={p.id}>{p.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label>Tipo</label>
                                <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                                    <option value="entrada">Entrada (+)</option>
                                    <option value="saida">Saída (-)</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label>Quantidade</label>
                                <input
                                    required
                                    type="number"
                                    value={quantidade}
                                    onChange={(e) => setQuantidade(e.target.value)}
                                    placeholder="0"
                                />
                            </div>

                            <button type="submit" className="btn-registrar">
                                <FiTrendingUp /> Registrar Movimentação
                            </button>
                        </form>
                    </div>
                </section>

                {/* LADO DIREITO: TABELA ATUALIZADA */}
                <section className="table-container">
                    <div className="card-estoque">
                        <h3>Saldos Disponíveis</h3>
                        <p>Quantidades atualizadas do banco</p>

                        <table className="estoque-table">
                            <thead>
                                <tr>
                                    <th>Produto</th>
                                    <th>Status</th>
                                    <th className="text-right">Qtd. Atual</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produtos.map((p) => {
                                    // Mudança para 'estoque_atual' conforme o banco de dados
                                    const valorEstoque = p.estoque_atual;
                                    const isBaixo = valorEstoque <= 5;

                                    return (
                                        <tr key={p.id}>
                                            <td className="font-bold">{p.nome}</td>
                                            <td>
                                                {isBaixo ? (
                                                    <span className="badge-danger"><FiAlertTriangle /> Baixo</span>
                                                ) : (
                                                    <span className="badge-success"><FiCheckCircle /> OK</span>
                                                )}
                                            </td>
                                            <td className={`text-right font-bold ${isBaixo ? 'text-red' : ''}`}>
                                                {/* Exibindo o valor real que muda no banco */}
                                                {valorEstoque}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}