import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { isAxiosError } from 'axios';
import api from '../api/axios';
import { listarCategorias, type Categoria } from '../services/categoriaService';
import type { Producto } from '../types/Producto';

interface SubirProductoProps {
  onCreado?: () => void;
}

interface FormularioProducto {
  nombre: string;
  precio: string;
  descripcion: string;
  stock: string;
}

const FORM_INICIAL: FormularioProducto = {
  nombre: '',
  precio: '',
  descripcion: '',
  stock: '',
};

const TAMANO_MAXIMO = 5 * 1024 * 1024; // 5 MB, igual que el backend
const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 ' +
  'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100';

export default function SubirProducto({ onCreado }: SubirProductoProps) {
  const [form, setForm] = useState<FormularioProducto>(FORM_INICIAL);
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creado, setCreado] = useState<Producto | null>(null);

  const [categoriasDisponibles, setCategoriasDisponibles] = useState<Categoria[]>([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);
  const [errorCategorias, setErrorCategorias] = useState<string | null>(null);
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const inputImagenRef = useRef<HTMLInputElement>(null);

  // Pide las categorías una sola vez al montar el componente
  useEffect(() => {
    listarCategorias()
      .then(setCategoriasDisponibles)
      .catch((e: Error) => setErrorCategorias(e.message))
      .finally(() => setCargandoCategorias(false));
  }, []);

  // Libera la URL de la vista previa cuando cambia o al desmontar el componente
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCategoria = (id: number) => {
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleImagen = (e: ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0] ?? null;
    setError(null);

    if (!archivo) {
      setImagen(null);
      setPreview(null);
      return;
    }

    if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
      setError('Solo se permiten imágenes JPG, PNG o WEBP.');
      e.target.value = '';
      return;
    }

    if (archivo.size > TAMANO_MAXIMO) {
      setError('La imagen no puede superar los 5 MB.');
      e.target.value = '';
      return;
    }

    setImagen(archivo);
    setPreview(URL.createObjectURL(archivo));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setCreado(null);

    if (!imagen) {
      setError('Debes seleccionar una imagen.');
      return;
    }

    if (seleccionadas.length === 0) {
      setError('Debes seleccionar al menos una categoría.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', form.nombre.trim());
    formData.append('precio', form.precio);
    formData.append('descripcion', form.descripcion.trim());
    formData.append('stock', form.stock);
    formData.append('imagen', imagen);
    // Un campo por cada ID: Spring lo convierte en la lista categoriaIds
    seleccionadas.forEach((id) => formData.append('categoriaIds', String(id)));

    setCargando(true);
    try {
      const { data } = await api.post<Producto>('/api/productos', formData);
      setCreado(data);
      setForm(FORM_INICIAL);
      setSeleccionadas([]);
      setMenuAbierto(false);
      setImagen(null);
      setPreview(null);
      if (inputImagenRef.current) inputImagenRef.current.value = '';
      onCreado?.();
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setCargando(false);
    }
  };

  const nombresSeleccionados = categoriasDisponibles
    .filter((c) => seleccionadas.includes(c.id))
    .map((c) => c.nombre);

  return (
    <div className="mx-auto my-8 max-w-lg rounded-xl bg-white p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-blue-950">Subir producto</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Campo label="Nombre" htmlFor="nombre">
          <input
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            maxLength={200}
            disabled={cargando}
            required
            className={inputClass}
          />
        </Campo>

        <Campo label="Precio" htmlFor="precio">
          <input
            id="precio"
            name="precio"
            type="number"
            step="0.01"
            min="0.01"
            value={form.precio}
            onChange={handleChange}
            disabled={cargando}
            required
            className={inputClass}
          />
        </Campo>

        <Campo label="Stock" htmlFor="stock">
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={handleChange}
            disabled={cargando}
            required
            className={inputClass}
          />
        </Campo>

        <Campo label="Categorías" htmlFor="categorias">
          <button
            type="button"
            id="categorias"
            onClick={() => setMenuAbierto((v) => !v)}
            disabled={cargando || cargandoCategorias || !!errorCategorias}
            aria-expanded={menuAbierto}
            className={`${inputClass} flex items-center justify-between text-left`}
          >
            <span className={nombresSeleccionados.length ? 'text-gray-900' : 'text-gray-400'}>
              {cargandoCategorias
                ? 'Cargando categorías...'
                : nombresSeleccionados.length
                ? nombresSeleccionados.join(', ')
                : 'Selecciona una o más categorías'}
            </span>
            <span className="ml-2 text-gray-500">{menuAbierto ? '▲' : '▼'}</span>
          </button>

          {errorCategorias && (
            <p className="mt-1 text-xs text-red-600">{errorCategorias}</p>
          )}

          {menuAbierto && categoriasDisponibles.length > 0 && (
            <ul className="mt-2 max-h-56 space-y-1 overflow-y-auto rounded-md border border-gray-200 bg-white p-2">
              {categoriasDisponibles.map((cat) => (
                <li key={cat.id}>
                  <label className="flex cursor-pointer items-center gap-3 rounded px-2 py-1.5 text-sm text-gray-800 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={seleccionadas.includes(cat.id)}
                      onChange={() => toggleCategoria(cat.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-blue-500"
                    />
                    {cat.nombre}
                  </label>
                </li>
              ))}
            </ul>
          )}

          {menuAbierto && !cargandoCategorias && categoriasDisponibles.length === 0 && !errorCategorias && (
            <p className="mt-2 text-sm text-gray-500">No hay categorías creadas todavía.</p>
          )}

          {seleccionadas.length > 0 && (
            <p className="mt-1 text-xs text-gray-500">
              {seleccionadas.length} seleccionada{seleccionadas.length > 1 ? 's' : ''}
            </p>
          )}
        </Campo>

        <Campo label="Descripción" htmlFor="descripcion">
          <textarea
            id="descripcion"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            maxLength={1000}
            rows={4}
            disabled={cargando}
            required
            className={inputClass}
          />
          <p className="mt-1 text-right text-xs text-gray-400">
            {form.descripcion.length}/1000
          </p>
        </Campo>

        <Campo label="Imagen" htmlFor="imagen">
          <input
            ref={inputImagenRef}
            id="imagen"
            name="imagen"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImagen}
            disabled={cargando}
            required
            className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-blue-950 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-blue-900 disabled:opacity-60"
          />
        </Campo>

        {preview && (
          <img
            src={preview}
            alt="Vista previa"
            className="h-48 w-full rounded-md border border-gray-200 object-cover"
          />
        )}

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {creado && (
          <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            <p>Producto "{creado.nombre}" creado correctamente.</p>
            <p className="mt-1 text-xs">
              Categorías: {creado.categorias.map((c) => c.nombre).join(', ')}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={cargando || cargandoCategorias}
          className="w-full rounded-md bg-yellow-400 px-4 py-2 font-semibold text-blue-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cargando ? 'Subiendo...' : 'Guardar producto'}
        </button>
      </form>
    </div>
  );
}

// Componente auxiliar para no repetir la etiqueta y el contenedor de cada campo
function Campo({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
}

function obtenerMensajeError(err: unknown): string {
  if (isAxiosError(err)) {
    const data = err.response?.data as { error?: string; message?: string } | undefined;
    if (data?.error) return data.error;
    if (data?.message) return data.message;
    if (err.response?.status === 413) return 'La imagen es demasiado grande.';
    if (err.response?.status === 400) return 'Revisa los datos del formulario.';
    return 'No se pudo conectar con el servidor.';
  }
  return 'Ocurrió un error inesperado.';
}