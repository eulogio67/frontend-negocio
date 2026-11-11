import { Producto, productos } from '../api/productos';

export const productoService = {
  /**
   * Obtiene la lista completa de productos.
   */
  obtenerTodos: async (): Promise<Producto[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(productos);
      }, 500); // Simula 500ms de latencia de red
    });
  },

  /**
   * Obtiene un producto específico por su ID.
   */
  obtenerPorId: async (id: number): Promise<Producto | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const producto = productos.find(p => p.id === id);
        resolve(producto);
      }, 300);
    });
  },

  /**
   * Obtiene productos filtrados por categoría.
   */
  obtenerPorCategoria: async (categoria: string): Promise<Producto[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtrados = productos.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
        resolve(filtrados);
      }, 300);
    });
  }
};