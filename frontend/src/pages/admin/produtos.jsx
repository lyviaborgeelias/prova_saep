import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./produtos.css";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [form, setForm] = useState({
    id: null,
    nome: "",
    tipo: "",
    quantidade: "",
    preco: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  // 🔄 LISTAR PRODUTOS
  const carregarProdutos = async () => {
    const res = await api.get("/produtos/");
    setProdutos(res.data);
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  // 🔍 BUSCA
  const buscar = async () => {
    const res = await api.get(`/produtos/?nome=${busca}`);
    setProdutos(res.data);
  };

  // 🧾 VALIDAR
  const validar = () => {
    if (!form.nome || !form.tipo || !form.quantidade || !form.preco) {
      alert("Preencha todos os campos!");
      return false;
    }
    if (form.quantidade < 0 || form.preco < 0) {
      alert("Valores inválidos!");
      return false;
    }
    return true;
  };

  // ➕ CRIAR / EDITAR
  const salvar = async () => {
    if (!validar()) return;

    if (form.id) {
      await api.put(`/produtos/${form.id}/`, form);
    } else {
      await api.post("/produtos/", form);
    }

    setForm({ id: null, nome: "", tipo: "", quantidade: "", preco: "" });
    carregarProdutos();
  };

  // ✏️ EDITAR
  const editar = (p) => {
    setForm(p);
  };

  // ❌ DELETAR
  const deletar = async (id) => {
    if (!window.confirm("Deseja excluir?")) return;

    await api.delete(`/produtos/${id}/`);
    carregarProdutos();
  };

  return (
    <div className="container">
      <h2>Cadastro de Produtos</h2>

      {/* 🔙 VOLTAR */}
      <button className="btnVoltar" onClick={() => navigate("/admin/home")}>
        ← Voltar
      </button>

      {/* 🔍 BUSCA */}
      <div className="busca">
        <input
          placeholder="Buscar produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button onClick={buscar}>Buscar</button>
      </div>

      {/* 🧾 FORM */}
      <div className="form">
        <input
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
        />
        <input
          placeholder="Tipo"
          value={form.tipo}
          onChange={(e) => setForm({ ...form, tipo: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={form.quantidade}
          onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
        />
        <input
          type="number"
          placeholder="Preço"
          value={form.preco}
          onChange={(e) => setForm({ ...form, preco: e.target.value })}
        />

        <button className="btnSalvar" onClick={salvar}>
          {form.id ? "Atualizar" : "Cadastrar"}
        </button>
      </div>

      {/* 📊 TABELA */}
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Qtd</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((p) => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>{p.tipo}</td>
              <td>{p.quantidade}</td>
              <td>R$ {p.preco}</td>
              <td>
                <button onClick={() => editar(p)}>Editar</button>
                <button onClick={() => deletar(p.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}