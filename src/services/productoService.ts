// services/productoService.ts
import api from "../api/axios";
import type { Producto } from "../types/Producto";

const TTL_MS = 60_000;

// Cache por clave: "all" o "Polos:page0" (categoria + paginación)
const cache = new Map<string, { data: Producto[]; ts: number }>();
const enCurso = new Map<string, Promise<Producto[]>>();

/** Invalida TODA la caché (llamar tras crear/editar/eliminar producto) */
export function invalidarCacheProductos() {
  cache.clear();
  enCurso.clear();
}

interface ListarOpciones {
  categoria?: string;
  page?: number;
  size?: number;
  forzar?: boolean;
}

export const productoService = {
  obtenerTodos: async (opciones: ListarOpciones = {}): Promise<Producto[]> => {
    const {
      categoria,
      page = 0,
      size = 24,
      forzar = false,
    } = opciones;

    const key = `${categoria ?? "all"}:${page}`;
    const ahora = Date.now();

    // 1) Cache válido
    const cached = cache.get(key);
    if (!forzar && cached && ahora - cached.ts < TTL_MS) {
      return cached.data;
    }

    // 2) Dedupe por clave
    const enVuelo = enCurso.get(key);
    if (enVuelo) return enVuelo;

    // 3) Nueva petición
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("size", String(size));
    if (categoria) params.set("categoria", categoria);

    const promesa = api
      .get<Producto[]>(`/api/productos?${params}`)
      .then((r) => {
        cache.set(key, { data: r.data, ts: Date.now() });
        return r.data;
      })
      .finally(() => {
        enCurso.delete(key);
      });

    enCurso.set(key, promesa);
    return promesa;
  },

  obtenerPorId: async (id: number): Promise<Producto | undefined> => {
    const { data } = await api.get<Producto>(`/api/productos/${id}`);
    return data;
  },

  buscar: async (
    termino: string,
    opciones?: {
      categoriaId?: number;
      page?: number;
      size?: number;
      signal?: AbortSignal;
    }
  ): Promise<Producto[]> => {
    const params = new URLSearchParams();
    if (termino.trim()) params.set("q", termino.trim());
    if (opciones?.categoriaId)
      params.set("categoriaId", String(opciones.categoriaId));
    params.set("page", String(opciones?.page ?? 0));
    params.set("size", String(opciones?.size ?? 24));

    const { data } = await api.get<Producto[]>(`/api/productos/buscar?${params}`, {
      signal: opciones?.signal,
    });
    return data;
  },

  actualizar: async (
    id: number,
    datos: {
      nombre: string;
      descripcion: string;
      precio: number;
      tallas: Record<string, number>;
      categoriaIds: number[];
    }
  ): Promise<Producto> => {
    const { data } = await api.put<Producto>(`/api/productos/${id}`, datos);
    invalidarCacheProductos();
    return data;
  },
};

export type { Producto };