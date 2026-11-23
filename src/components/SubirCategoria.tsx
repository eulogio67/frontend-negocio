import { useEffect, useState, type FormEvent } from "react";
import {
  listarCategorias,
  crearCategoria,
  eliminarCategoria,
  type Categoria,
} from "../services/categoriaService";

const SubirCategoria = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

  const cargar = async () => {
    try {
      const data = await listarCategorias();
      setCategorias(data);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const agregar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return setError("Debes iniciar sesión.");
    setError(null);
    setCargando(true);
    try {
      await crearCategoria({ nombre: nombre.trim() }, token);
      setNombre("");
      await cargar();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCargando(false);
    }
  };

  const eliminar = async (id: number) => {
    if (
      !confirm(
        "¿Eliminar esta categoría?\n\nLos productos asociados NO se eliminarán, pero quedarán sin categoría."
      )
    )
      return;

    const token = localStorage.getItem("token");
    if (!token) return setError("Debes iniciar sesión.");

    setError(null);
    setEliminandoId(id);
    const previas = categorias;
    setCategorias((prev) => prev.filter((c) => c.id !== id));

    try {
      await eliminarCategoria(id, token);
    } catch (err) {
      setCategorias(previas);
      setError((err as Error).message);
    } finally {
      setEliminandoId(null);
    }
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
          disabled={cargando}
          className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={cargando || !nombre.trim()}
          className="shrink-0 rounded-md bg-yellow-400 px-4 py-2 font-semibold text-blue-950 hover:bg-yellow-300 disabled:opacity-60"
        >
          {cargando ? "Agregando..." : "Agregar"}
        </button>
      </form>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <ul className="flex flex-col divide-y">
        {categorias.map((c) => {
          const enProceso = eliminandoId === c.id;
          return (
            <li key={c.id} className="flex items-center justify-between gap-2 py-2">
              <span
                className={`truncate text-gray-800 transition-opacity ${
                  enProceso ? "opacity-50" : "opacity-100"
                }`}
              >
                {c.nombre}
              </span>
              <button
                type="button"
                onClick={() => eliminar(c.id)}
                disabled={enProceso}
                className="shrink-0 rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-60"
              >
                {enProceso ? "Eliminando..." : "Eliminar"}
              </button>
            </li>
          );
        })}
        {categorias.length === 0 && (
          <li className="py-2 text-sm text-gray-500">Todavía no hay categorías.</li>
        )}
      </ul>
    </div>
  );
};

export default SubirCategoria;