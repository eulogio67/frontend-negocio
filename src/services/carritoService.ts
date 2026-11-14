import api from '../api/axios';

export interface ItemCarrito {
  itemId: number;
  productoId: number;
  nombre: string;
  precio: number;
  imageUrl: string;
  cantidad: number;
}

export const carritoService = {
  listar: async (): Promise<ItemCarrito[]> => (await api.get('/api/carrito')).data,
  agregar: (productoId: number, cantidad = 1) =>
    api.post('/api/carrito', { productoId, cantidad }),
  quitar: (itemId: number) => api.delete(`/api/carrito/${itemId}`),
};