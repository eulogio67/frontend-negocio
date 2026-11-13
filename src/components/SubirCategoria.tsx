import { useEffect, useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import api from "../api/axios";

interface Categoria {
  id: number;
  nombre: string;
}

const SubirCategoria = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const cargar = async () => {
    const { data } = await api.get<Categoria[]>("/api/categorias");
    setCategorias(data);
  };

  useEffect(() => {
    cargar().catch(() => setError("No se pudieron cargar las categorías."));
  }, []);

  const agregar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      await api.post("/api/categorias", { nombre: nombre.trim() });
      setNombre("");
      await cargar();
    } catch (err) {
      const msg = isAxiosError(err) ? err.response?.data?.error : null;
      setError(msg ?? "No se pudo agregar la categoría.");
    } finally {
      setCargando(false);
    }
  };

  const eliminar = async (id: number) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    await api.delete(`/api/categorias/${id}`);
    await cargar();
  };

  return (
    <div className="w-full rounded-xl bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold text-blue-950">Categorías</h2>

      <form onSubmit={agregar} className="mb-4 flex gap-2">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nueva categoría"
          maxLength={100}
          required
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          type="submit"
          disabled={cargando}
          className="rounded-md bg-yellow-400 px-4 py-2 font-semibold text-blue-950 hover:bg-yellow-300 disabled:opacity-60"
        >
          Agregar
        </button>
      </form>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <ul className="flex flex-col divide-y">
        {categorias.map((c) => (
          <li key={c.id} className="flex items-center justify-between py-2">
            <span className="text-gray-800">{c.nombre}</span>
            <button
              onClick={() => eliminar(c.id)}
              className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
            >
              Eliminar
            </button>
          </li>
        ))}
        {categorias.length === 0 && (
          <li className="py-2 text-sm text-gray-500">Todavía no hay categorías.</li>
        )}
      </ul>
    </div>
  );
};

export default SubirCategoria;