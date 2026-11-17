// Debe coincidir con ProductoResponse del backend
export interface CategoriaResumen {
  id: number;
  nombre: string;
}

export interface ImagenProducto {
  url: string;
  orden: number;
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  stock: number;                  // suma de todas las tallas
  tallas: Record<string, number>; // ej: { S: 1, M: 2, L: 2, XL: 5 }
  imageUrl: string;
  categorias: CategoriaResumen[];
  imagenes: ImagenProducto[];
}