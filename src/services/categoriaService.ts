const API_URL = import.meta.env.VITE_API_URL;
const BASE = `${API_URL}/api/categorias`;

export interface Categoria {
  id: number;
  nombre: string;
}

export interface CategoriaConImagen {
  id: number;
  nombre: string;
  imageUrl: string | null;
}

export interface CategoriaRequest {
  nombre: string;
}

async function manejarRespuesta<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let mensaje = `Error ${res.status}`;
    try {
      const data = await res.json();
      mensaje = data.message ?? data.error ?? mensaje;
    } catch {
      // La respuesta no tiene JSON; se usa el mensaje genérico
    }
    throw new Error(mensaje);
  }

  // 204 No Content (por ejemplo, al eliminar) no tiene cuerpo
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

function encabezados(token?: string): HeadersInit {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

// ----- Lectura (públicos) -----

export async function listarCategorias(): Promise<Categoria[]> {
  const res = await fetch(BASE);
  return manejarRespuesta<Categoria[]>(res);
}

export async function listarCategoriasConImagen(): Promise<CategoriaConImagen[]> {
  const res = await fetch(`${BASE}/con-imagen`);
  return manejarRespuesta<CategoriaConImagen[]>(res);
}

export async function obtenerCategoria(id: number): Promise<Categoria> {
  const res = await fetch(`${BASE}/${id}`);
  return manejarRespuesta<Categoria>(res);
}

// ----- Escritura (solo ROLE_ADMIN) -----

export async function crearCategoria(datos: CategoriaRequest, token: string): Promise<Categoria> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: encabezados(token),
    body: JSON.stringify(datos),
  });
  return manejarRespuesta<Categoria>(res);
}

export async function actualizarCategoria(
  id: number,
  datos: CategoriaRequest,
  token: string
): Promise<Categoria> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: encabezados(token),
    body: JSON.stringify(datos),
  });
  return manejarRespuesta<Categoria>(res);
}

export async function eliminarCategoria(id: number, token: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    headers: encabezados(token),
  });
  return manejarRespuesta<void>(res);
}