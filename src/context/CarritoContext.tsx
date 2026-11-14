import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { carritoService, type ItemCarrito } from "../services/carritoService";

type CarritoContextType = {
  items: ItemCarrito[];
  cantidad: number;
  agregar: (productoId: number) => Promise<void>;
  quitar: (itemId: number) => Promise<void>;
  recargar: () => Promise<void>;
};

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ItemCarrito[]>([]);

  const recargar = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setItems([]);
      return;
    }
    try {
      setItems(await carritoService.listar());
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  const agregar = async (productoId: number) => {
    await carritoService.agregar(productoId);
    await recargar();
  };

  const quitar = async (itemId: number) => {
    await carritoService.quitar(itemId);
    await recargar();
  };

  const cantidad = items.reduce((total, i) => total + i.cantidad, 0);

  return (
    <CarritoContext.Provider value={{ items, cantidad, agregar, quitar, recargar }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const contexto = useContext(CarritoContext);
  if (!contexto) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return contexto;
};