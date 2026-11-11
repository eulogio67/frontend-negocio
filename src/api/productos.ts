
export type Usuario = {
  id: number;
  email: string;
  password: string;
};

export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string;
  descripcion: string;
};

export const productos: Producto[] = [
  { 
    id: 1, 
    nombre: "Polo básico algodón", 
    precio: 39.9, 
    categoria: "Polos", 
    imagen: "",
    descripcion: "Polo 100% algodón ideal para el uso diario."
  },
  { 
    id: 2, 
    nombre: "Polo estampado", 
    precio: 49.9, 
    categoria: "Polos", 
    imagen: "",
    descripcion: "Polo con estampado frontal resistente al lavado."
  },
  { 
    id: 3, 
    nombre: "Casaca denim", 
    precio: 129.0, 
    categoria: "Casacas", 
    imagen: "",
    descripcion: "Casaca clásica de jean con botones metálicos."
  },
  { 
    id: 4, 
    nombre: "Pantalón jogger", 
    precio: 89.9, 
    categoria: "Pantalones", 
    imagen: "",
    descripcion: "Jogger cómodo con ajuste en los tobillos y cintura elástica."
  },
];