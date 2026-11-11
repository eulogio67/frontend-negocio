import { isAxiosError } from 'axios';
import api from '../api/axios';
import type { Producto } from '../types/Producto';

export type {Producto};


export const productoService = {
  /**
   * Lista productos. Si se pasa categoría, el backend filtra.
   */
  obtenerTodos: async (categoria?: string): Promise<Producto[]> => {
    const { data } = await api.get<Producto[]>('/api/productos', {
      params: categoria ? { categoria } : undefined,
    });
    return data;
  },

  /**
   * Obtiene un producto por ID. Devuelve undefined si no existe (404).
   */
  obtenerPorId: async (id: number): Promise<Producto | undefined> => {
    try {
      const { data } = await api.get<Producto>(`/api/productos/${id}`);
      return data;
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 404) return undefined;
      throw err;
    }
  },
};