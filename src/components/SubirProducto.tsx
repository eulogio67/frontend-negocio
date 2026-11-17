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
}

interface FotoSeleccionada {
  id: string;
  file: File;
  url: string;
}

interface FilaTalla {
  id: string;
  talla: string;
  cantidad: string; // string para que el input se pueda dejar vacío mientras escribes
}

const FORM_INICIAL: FormularioProducto = {
  nombre: '',
  precio: '',
  descripcion: '',
};

const crearFila = (): FilaTalla => ({ id: crypto.randomUUID(), talla: '', cantidad: '' });

// Debe coincidir con spring.servlet.multipart.max-file-size del backend
const TAMANO_MAXIMO = 10 * 1024 * 1024;
const MAX_FOTOS = 10;
const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 ' +
  'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100';

const botonSecundario =
  'flex flex-1 items-center justify-center gap-2 rounded-md border border-blue-950 px-3 py-2 text-sm font-medium text-blue-950 hover:bg-blue-50 disabled:opacity-60';

export default function SubirProducto({ onCreado }: SubirProductoProps) {
  const [form, setForm] = useState<FormularioProducto>(FORM_INICIAL);
  const [filasTalla, setFilasTalla] = useState<FilaTalla[]>([crearFila()]);
  const [fotos, setFotos] = useState<FotoSeleccionada[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creado, setCreado] = useState<Producto | null>(null);

  const [categoriasDisponibles, setCategoriasDisponibles] = useState<Categoria[]>([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);
  const [errorCategorias, setErrorCategorias] = useState<string | null>(null);
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const camaraRef = useRef<HTMLInputElement>(null);
  const galeriaRef = useRef<HTMLInputElement>(null);

  const fotosRef = useRef<FotoSeleccionada[]>([]);
  fotosRef.current = fotos;

  useEffect(() => {
    listarCategorias()
      .then(setCategoriasDisponibles)
      .catch((e: Error) => setErrorCategorias(e.message))
      .finally(() => setCargandoCategorias(false));

    return () => {
      fotosRef.current.forEach((f) => URL.revokeObjectURL(f.url));
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ---- Tallas ----
  const actualizarFila = (id: string, campo: 'talla' | 'cantidad', valor: string) => {
    setFilasTalla((prev) => prev.map((f) => (f.id === id ? { ...f, [campo]: valor } : f)));
  };

  const agregarFila = () => setFilasTalla((prev) => [...prev, crearFila()]);

  const quitarFila = (id: string) => {
    setFilasTalla((prev) => (prev.length > 1 ? prev.filter((f) => f.id !== id) : prev));
  };

  // Devuelve el mensaje de error o null, y las tallas listas para enviar
  const validarTallas = (): { error: string | null; tallas: string[] } => {
    const tallas: string[] = [];
    const vistas = new Set<string>();

    for (const fila of filasTalla) {
      const talla = fila.talla.trim().toUpperCase();
      if (!talla && fila.cantidad === '') continue; // fila vacía: se ignora

      if (!talla) return { error: 'Cada fila de talla necesita un nombre (ej. S, M, L).', tallas: [] };
      if (vistas.has(talla)) return { error: `La talla ${talla} está repetida.`, tallas: [] };
      if (fila.cantidad === '' || !/^\d+$/.test(fila.cantidad)) {
        return { error: `Indica una cantidad válida para la talla ${talla}.`, tallas: [] };
      }

      vistas.add(talla);
      tallas.push(`${talla}:${Number(fila.cantidad)}`);
    }

    if (tallas.length === 0) {
      return { error: 'Agrega al menos una talla con su cantidad.', tallas: [] };
    }
    return { error: null, tallas };
  };

  // ---- Fotos ----
  const validarArchivo = (file: File): string | null => {
    if (!TIPOS_PERMITIDOS.includes(file.type)) {
      return `"${file.name}" no es un formato permitido (JPG, PNG, WEBP o HEIC).`;
    }
    if (file.size > TAMANO_MAXIMO) {
      return `"${file.name}" supera los 10 MB.`;
    }
    return null;
  };

  const agregarArchivos = (lista: FileList | null) => {
    setError(null);
    if (!lista || lista.length === 0) return;

    const nuevas: FotoSeleccionada[] = [];
    for (const file of Array.from(lista)) {
      const problema = validarArchivo(file);
      if (problema) {
        setError(problema);
        return;
      }
      nuevas.push({
        id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
        file,
        url: URL.createObjectURL(file),
      });
    }

    setFotos((prev) => {
      if (prev.length + nuevas.length > MAX_FOTOS) {
        setError(`Puedes subir como máximo ${MAX_FOTOS} fotos por producto.`);
        nuevas.forEach((f) => URL.revokeObjectURL(f.url));
        return prev;
      }
      return [...prev, ...nuevas];
    });
  };

  const handleCamara = (e: ChangeEvent<HTMLInputElement>) => {
    agregarArchivos(e.target.files);
    e.target.value = '';
  };

  const handleGaleria = (e: ChangeEvent<HTMLInputElement>) => {
    agregarArchivos(e.target.files);
    e.target.value = '';
  };

  const quitarFoto = (id: string) => {
    setFotos((prev) => {
      const foto = prev.find((f) => f.id === id);
      if (foto) URL.revokeObjectURL(foto.url);
      return prev.filter((f) => f.id !== id);
    });
  };

  const hacerPrincipal = (id: string) => {
    setFotos((prev) => {
      const foto = prev.find((f) => f.id === id);
      if (!foto) return prev;
      return [foto, ...prev.filter((f) => f.id !== id)];
    });
  };

  const toggleCategoria = (id: number) => {
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ---- Envío ----
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setCreado(null);

    const { error: errorTallas, tallas } = validarTallas();
    if (errorTallas) {
      setError(errorTallas);
      return;
    }
    if (fotos.length === 0) {
      setError('Debes agregar al menos una foto.');
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
    // Un campo por talla, formato "S:1"
    tallas.forEach((t) => formData.append('tallas', t));
    // El primer archivo es la principal
    fotos.forEach((f) => formData.append('imagenes', f.file));
    seleccionadas.forEach((id) => formData.append('categoriaIds', String(id)));

    setCargando(true);
    try {
      const { data } = await api.post<Producto>('/api/productos', formData);
      setCreado(data);
      setForm(FORM_INICIAL);
      setFilasTalla([crearFila()]);
      setSeleccionadas([]);
      setMenuAbierto(false);
      fotos.forEach((f) => URL.revokeObjectURL(f.url));
      setFotos([]);
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

        <Campo label="Tallas y cantidades" htmlFor="tallas">
          <div className="space-y-2">
            {filasTalla.map((fila) => (
              <div key={fila.id} className="flex items-center gap-2">
                <input
                  placeholder="Talla (S, M, L...)"
                  value={fila.talla}
                  onChange={(e) => actualizarFila(fila.id, 'talla', e.target.value)}
                  maxLength={10}
                  disabled={cargando}
                  className={`${inputClass} uppercase`}
                />
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Cantidad"
                  value={fila.cantidad}
                  onChange={(e) => actualizarFila(fila.id, 'cantidad', e.target.value)}
                  disabled={cargando}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => quitarFila(fila.id)}
                  disabled={cargando || filasTalla.length === 1}
                  aria-label="Quitar talla"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={agregarFila}
            disabled={cargando}
            className="mt-2 text-sm font-medium text-blue-950 underline disabled:opacity-60"
          >
            + Agregar talla
          </button>

          <p className="mt-1 text-xs text-gray-500">
            El stock total se calcula sumando las cantidades de cada talla.
          </p>
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

          {errorCategorias && <p className="mt-1 text-xs text-red-600">{errorCategorias}</p>}

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
          <p className="mt-1 text-right text-xs text-gray-400">{form.descripcion.length}/1000</p>
        </Campo>

        <Campo label={`Fotos (${fotos.length}/${MAX_FOTOS})`} htmlFor="fotos">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => camaraRef.current?.click()}
              disabled={cargando || fotos.length >= MAX_FOTOS}
              className={botonSecundario}
            >
              <i className="fa-solid fa-camera"></i>
              Tomar foto
            </button>
            <button
              type="button"
              onClick={() => galeriaRef.current?.click()}
              disabled={cargando || fotos.length >= MAX_FOTOS}
              className={botonSecundario}
            >
              <i className="fa-solid fa-images"></i>
              Elegir fotos
            </button>
          </div>

          <input
            ref={camaraRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCamara}
            className="hidden"
          />

          <input
            ref={galeriaRef}
            id="fotos"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            multiple
            onChange={handleGaleria}
            className="hidden"
          />

          {fotos.length > 0 && (
            <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {fotos.map((foto, i) => (
                <li key={foto.id} className="relative">
                  <img
                    src={foto.url}
                    alt={`Foto ${i + 1}`}
                    className={`aspect-square w-full rounded-md object-cover ${
                      i === 0 ? 'ring-2 ring-yellow-400' : 'border border-gray-200'
                    }`}
                  />

                  {i === 0 ? (
                    <span className="absolute left-1 top-1 rounded bg-yellow-400 px-1.5 py-0.5 text-[10px] font-semibold text-blue-950">
                      Principal
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => hacerPrincipal(foto.id)}
                      disabled={cargando}
                      className="absolute left-1 top-1 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-blue-950 shadow hover:bg-white"
                    >
                      Hacer principal
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => quitarFoto(foto.id)}
                    disabled={cargando}
                    aria-label="Quitar foto"
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white shadow hover:bg-red-700"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {fotos.length === 0 && (
            <p className="mt-2 text-xs text-gray-500">Agrega una o varias fotos. La primera será la principal.</p>
          )}
        </Campo>

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
            <p className="mt-1 text-xs">
              Stock total: {creado.stock}
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
    if (err.response?.status === 413) return 'Las fotos son demasiado pesadas en total.';
    if (err.response?.status === 400) return 'Revisa los datos del formulario.';
    return 'No se pudo conectar con el servidor.';
  }
  return 'Ocurrió un error inesperado.';
}