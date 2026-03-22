import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FiArrowLeft, FiBox, FiPlus, FiSearch, 
  FiEdit, FiTrash2, FiAlertTriangle, FiX 
} from "react-icons/fi";
import "./produtos.css";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    id: null, 
    nome: "", 
    tipo: "", 
    estoque_atual: "", // Alterado de quantidade para estoque_atual
    preco: "",
    fabricante: "", 
    sku: "", 
    quantidade_minima: "" 
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  const carregarProdutos = async () => {
    try {
      // Adicionado timestamp para evitar cache e pegar o valor real do banco
      const res = await api.get(`/produtos/?t=${new Date().getTime()}`);
      setProdutos(res.data);
    } catch (err) {
      console.error("Erro ao carregar produtos", err);
    }
  };

  useEffect(() => { carregarProdutos(); }, []);

  const handleBusca = (e) => {
    setBusca(e.target.value.toLowerCase());
  };

  const salvar = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await api.put(`/produtos/${form.id}/`, form);
      } else {
        await api.post("/produtos/", form);
      }
      fecharModal();
      carregarProdutos();
    } catch (err) {
      alert("Erro ao salvar produto");
    }
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setForm({ 
      id: null, nome: "", tipo: "", estoque_atual: "", 
      preco: "", fabricante: "", sku: "", quantidade_minima: "" 
    });
  };

  const editar = (p) => {
    setForm(p);
    setIsModalOpen(true);
  };

  const deletar = async (id) => {
    if (!window.confirm("Deseja excluir permanentemente este produto?")) return;
    try {
      await api.delete(`/produtos/${id}/`);
      carregarProdutos();
    } catch (err) {
      alert("Erro ao excluir produto.");
    }
  };

  return (
    <div className="produtos-page">
      <header className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate("/admin/home")}>
            <FiArrowLeft />
          </button>
          <div className="header-title">
            <div className="header-icon"><FiBox /></div>
            <div>
              <h1>Cadastro de Produtos</h1>
              <span>Gerencie seus produtos e inventário</span>
            </div>
          </div>
        </div>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
          <FiPlus /> Novo Produto
        </button>
      </header>

      <main className="content-container">
        <div className="table-card">
          <div className="table-header">
            <h3>Produtos Cadastrados ({produtos.length})</h3>
            <div className="search-bar">
              <FiSearch />
              <input 
                placeholder="Buscar por nome, categoria, SKU..." 
                value={busca}
                onChange={handleBusca}
              />
            </div>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque Atual</th> {/* Título atualizado */}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.filter(p => p.nome.toLowerCase().includes(busca)).map((p) => (
                <tr key={p.id}>
                  <td className="name-cell">{p.nome}</td>
                  <td>{p.tipo}</td>
                  <td>R$ {Number(p.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td>
                    {/* Lógica de aviso baseada no estoque_atual */}
                    <span className={p.estoque_atual <= 5 ? "stock-warning" : ""}>
                      {p.estoque_atual} {p.estoque_atual <= 5 && <FiAlertTriangle />}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="edit-icon" onClick={() => editar(p)}><FiEdit /></button>
                    <button className="delete-icon" onClick={() => deletar(p.id)}><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h2>{form.id ? "Editar Produto" : "Adicionar Novo Produto"}</h2>
                <p>Mantenha os dados do inventário atualizados</p>
              </div>
              <button className="close-modal" onClick={fecharModal}><FiX /></button>
            </div>

            <form onSubmit={salvar}>
              <div className="form-grid">
                <div className="input-group full">
                  <label>Nome do Produto *</label>
                  <input 
                    required 
                    value={form.nome} 
                    onChange={e => setForm({...form, nome: e.target.value})}
                    placeholder="Ex: Smartphone Galaxy S24"
                  />
                </div>
                <div className="input-group">
                  <label>Categoria *</label>
                  <input required value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})} placeholder="Ex: Smartphones"/>
                </div>
                <div className="input-group">
                  <label>Preço (R$) *</label>
                  <input type="number" step="0.01" required value={form.preco} onChange={e => setForm({...form, preco: e.target.value})} placeholder="0,00"/>
                </div>
                <div className="input-group">
                  <label>Quantidade em Estoque *</label>
                  <input 
                    type="number" 
                    required 
                    value={form.estoque_atual} // Ligado ao estoque_atual
                    onChange={e => setForm({...form, estoque_atual: e.target.value})} 
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={fecharModal}>Cancelar</button>
                <button type="submit" className="btn-submit">
                  {form.id ? "Salvar Alterações" : "Adicionar Produto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}