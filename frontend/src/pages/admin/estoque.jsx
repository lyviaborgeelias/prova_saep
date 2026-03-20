import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function Estoque() {
    const [produtos, setProdutos] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState("");
    const [tipo, setTipo] = useState("entrada");
    const [quantidade, setQuantidade] = useState("");
    const [data, setData] = useState("");
    const [usuarioId, setUsuarioId] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const api = axios.create({
        baseURL: "http://127.0.0.1:8000/api",
        headers: { Authorization: `Bearer ${token}` },
    });

    // 🔥 ALGORITMO DE ORDENAÇÃO (Bubble Sort)
    const ordenarProdutos = (lista) => {
        let arr = [...lista];
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (arr[j].nome > arr[j + 1].nome) {
                    let temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        return arr;
    };

    // 🔄 CARREGAR PRODUTOS
    const carregarProdutos = async () => {
        const res = await api.get("/produtos/");
        const ordenados = ordenarProdutos(res.data);
        setProdutos(ordenados);
    };

    useEffect(() => {
        const fetchUser = async () => {
            const res = await api.get("/usuarios/me/");
            setUsuarioId(res.data.id);
        };

        fetchUser();
        carregarProdutos();
    }, []);

    // 📦 MOVIMENTAÇÃO
    const movimentar = async () => {
        if (!produtoSelecionado || !quantidade || !data) {
            alert("Preencha todos os campos!");
            return;
        }

        try {
            await api.post("/movimentacoes/", {
                produtoID: produtoSelecionado,
                quantidade: Number(quantidade),
                tipo: tipo,
                data_operacao: data,
                responsavelID: usuarioId,
            });

            // 🔄 atualiza lista
            await carregarProdutos();

            const produto = produtos.find(p => p.id == produtoSelecionado);

            // ⚠️ ALERTA ESTOQUE MÍNIMO
            if (tipo === "saida" && produto.estoque_atual <= produto.estoque_minimo) {
                alert("⚠️ Estoque abaixo do mínimo!");
            }

            alert("Movimentação realizada!");
            setQuantidade("");
            setData("");

        } catch (err) {
            console.log(err);
            alert("Erro ao movimentar!");
        }
    };

    return (
        <div className="container">
            <h2>Gestão de Estoque</h2>

            <button className="btnVoltar" onClick={() => navigate("/admin/home")}>
                ← Voltar
            </button>

            {/* FORM */}
            <div className="form">
                <select
                    value={produtoSelecionado}
                    onChange={(e) => setProdutoSelecionado(e.target.value)}
                >
                    <option value="">Selecione um produto</option>
                    {produtos.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.nome}
                        </option>
                    ))}
                </select>

                <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                </select>

                <input
                    type="number"
                    placeholder="Quantidade"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                />

                <input
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                />

                <button className="btnSalvar" onClick={movimentar}>
                    Movimentar
                </button>
            </div>

            {/* TABELA */}
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Estoque Atual</th>
                        <th>Mínimo</th>
                    </tr>
                </thead>
                <tbody>
                    {produtos.map((p) => (
                        <tr key={p.id}>
                            <td>{p.nome}</td>
                            <td>{p.estoque_atual}</td>
                            <td>{p.estoque_minimo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}