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
  stock: number;
  imageUrl: string;
  categorias: CategoriaResumen[];
  imagenes: ImagenProducto[];
}