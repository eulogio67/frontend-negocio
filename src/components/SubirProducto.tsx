import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { isAxiosError } from 'axios';
import api from '../api/axios';

interface SubirProductoProps {
  onCreado?: () => void;
}

interface ProductoCreado {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  categoria: string;
  imageUrl: string;
}

interface FormularioProducto {
  nombre: string;
  precio: string;
  descripcion: string;
  categoria: string;
}

const FORM_INICIAL: FormularioProducto = {
  nombre: '',
  precio: '',
  descripcion: '',
  categoria: '',
};

const TAMANO_MAXIMO = 5 * 1024 * 1024; // 5 MB, igual que el backend
const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 ' +
  'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100';

export default function SubirProducto({ onCreado } : SubirProductoProps) {
  const [form, setForm] = useState<FormularioProducto>(FORM_INICIAL);
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creado, setCreado] = useState<ProductoCreado | null>(null);
  const inputImagenRef = useRef<HTMLInputElement>(null);

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

    const formData = new FormData();
    formData.append('nombre', form.nombre.trim());
    formData.append('precio', form.precio);
    formData.append('descripcion', form.descripcion.trim());
    formData.append('categoria', form.categoria.trim());
    formData.append('imagen', imagen);

    setCargando(true);
    try {
      const { data } = await api.post<ProductoCreado>('/api/productos', formData);
      setCreado(data);
      setForm(FORM_INICIAL);
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

        <Campo label="Categoría" htmlFor="categoria">
          <input
            id="categoria"
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            maxLength={200}
            disabled={cargando}
            required
            className={inputClass}
          />
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
            Producto "{creado.nombre}" creado correctamente.
          </div>
        )}

        <button
          type="submit"
          disabled={cargando}
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
    const data = err.response?.data as { error?: string } | undefined;
    if (data?.error) return data.error;
    if (err.response?.status === 413) return 'La imagen es demasiado grande.';
    if (err.response?.status === 400) return 'Revisa los datos del formulario.';
    return 'No se pudo conectar con el servidor.';
  }
  return 'Ocurrió un error inesperado.';
}