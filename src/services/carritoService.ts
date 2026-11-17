import api from '../api/axios';

export interface ItemCarrito {
  itemId: number;
  productoId: number;
  nombre: string;
  precio: number;
  imageUrl: string;
  talla: string;
  cantidad: number;
}

export const carritoService = {
  listar: async (): Promise<ItemCarrito[]> => (await api.get('/api/carrito')).data,
  agregar: (productoId: number, talla: string, cantidad = 1) =>
    api.post('/api/carrito', { productoId, talla, cantidad }),
  quitar: (itemId: number) => api.delete(`/api/carrito/${itemId}`),
};