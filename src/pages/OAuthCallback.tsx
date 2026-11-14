import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

interface MeResponse {
  email: string;
  rol: string;
  nombre: string;
}

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hashToken = new URLSearchParams(window.location.hash.slice(1)).get("token");

    if (hashToken) {
      localStorage.setItem("token", hashToken);
      window.history.replaceState(null, "", "/oauth2/callback");
    }

    if (!localStorage.getItem("token")) {
      navigate("/admin", { replace: true });
      return;
    }

    api
      .get<MeResponse>("/api/auth/me")
      .then(({ data }) => {
        localStorage.setItem("rol", data.rol);
        localStorage.setItem("nombre", data.nombre ?? "");
        navigate(data.rol === "ROLE_ADMIN" ? "/admin" : "/", { replace: true });
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        localStorage.removeItem("nombre");
        navigate("/admin", { replace: true });
      });
  }, [navigate]);

  return <p className="p-6 text-gray-500">Iniciando sesión...</p>;
};

export default OAuthCallback;