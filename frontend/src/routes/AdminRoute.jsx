import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const verificarUsuario = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/usuarios/me/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.is_staff) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.log("Erro ao verificar admin:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verificarUsuario();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div style={{ padding: 40 }}>Verificando permissões...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/user/home" replace />;
  }

  return children;
}