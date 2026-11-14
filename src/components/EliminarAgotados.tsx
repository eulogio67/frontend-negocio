import { useState } from "react";
import api from "../api/axios";

const EliminarAgotados = ({ onEliminado }: { onEliminado?: () => void }) => {
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const eliminar = async () => {
    if (!confirm("¿Eliminar todos los productos con stock 0? Se borrarán también sus fotos.")) return;
    setCargando(true);
    setMensaje(null);
    try {
      const { data } = await api.delete<{ eliminados: number }>("/api/productos/agotados");
      setMensaje(`Se eliminaron ${data.eliminados} producto(s).`);
      onEliminado?.();
    } catch {
      setMensaje("No se pudieron eliminar los productos agotados.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-md">
      <button
        onClick={eliminar}
        disabled={cargando}
        className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
      >
        {cargando ? "Eliminando..." : "Eliminar productos agotados"}
      </button>
      {mensaje && <p className="text-sm text-gray-700">{mensaje}</p>}
    </div>
  );
};

export default EliminarAgotados;