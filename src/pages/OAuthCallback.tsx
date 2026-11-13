import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hashToken = new URLSearchParams(window.location.hash.slice(1)).get("token");

    if (hashToken) {
      localStorage.setItem("token", hashToken);
      // Quita el token de la barra de direcciones
      window.history.replaceState(null, "", "/oauth2/callback");
    }

    if (!localStorage.getItem("token")) {
      navigate("/admin", { replace: true });
      return;
    }

    api
      .get<{ email: string; rol: string }>("/api/auth/me")
      .then(({ data }) => {
        localStorage.setItem("rol", data.rol);
        navigate(data.rol === "ROLE_ADMIN" ? "/admin" : "/", { replace: true });
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        navigate("/admin", { replace: true });
      });
  }, [navigate]);

  return <p className="p-6 text-gray-500">Iniciando sesión...</p>;
};

export default OAuthCallback;