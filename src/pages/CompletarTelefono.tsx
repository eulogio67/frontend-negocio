import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const REGEX_CELULAR = /^9\d{8}$/; // 9 dígitos, empieza con 9

const Telefono = () => {
  const navigate = useNavigate();
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Solo deja escribir dígitos y nunca más de 9
  const cambiar = (valor: string) => {
    setTelefono(valor.replace(/\D/g, "").slice(0, 9));
  };

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!REGEX_CELULAR.test(telefono)) {
      setError("Ingresa un número válido: 9 dígitos y que empiece con 9.");
      return;
    }

    setGuardando(true);
    try {
      await api.put("/api/auth/telefono", { telefono });
      const rol = localStorage.getItem("rol");
      navigate(rol === "ROLE_ADMIN" ? "/admin" : "/", { replace: true });
    } catch {
      setError("No se pudo guardar el número. Inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form onSubmit={enviar} className="flex w-full max-w-sm flex-col gap-4 bg-white p-6 shadow-md">
        <h1 className="text-xl font-semibold text-blue-950">Completa tu cuenta</h1>
        <p className="text-sm text-gray-600">
          Necesitamos tu número para coordinar tus pedidos por WhatsApp.
        </p>

        <label className="text-xs font-medium uppercase text-gray-600">Teléfono</label>
        <input
          type="tel"
          inputMode="numeric"
          value={telefono}
          onChange={(e) => cambiar(e.target.value)}
          placeholder="999999999"
          maxLength={9}
          required
          className="border border-gray-400 px-3 py-2 text-sm"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={guardando}
          className="bg-yellow-400 py-3 font-semibold text-blue-950 hover:bg-yellow-300 disabled:opacity-60"
        >
          {guardando ? "Guardando..." : "Guardar y continuar"}
        </button>
      </form>
    </main>
  );
};

export default Telefono;