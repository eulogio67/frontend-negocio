// Debe coincidir con ProductoResponse del backend
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  categoria: string;
  imageUrl: string;
}