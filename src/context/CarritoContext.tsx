import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { carritoService, type ItemCarrito } from "../services/carritoService";

type CarritoContextType = {
  items: ItemCarrito[];
  cantidad: number;
  agregar: (productoId: number, talla: string, cantidad?: number) => Promise<void>;
  quitar: (itemId: number) => Promise<void>;
  recargar: () => Promise<void>;
  abierto: boolean;
  abrirCarrito: () => void;
  cerrarCarrito: () => void;
};

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [abierto, setAbierto] = useState(false);

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

  const agregar = useCallback(
    async (productoId: number, talla: string, cantidad = 1) => {
      await carritoService.agregar(productoId, talla, cantidad);
      await recargar();
      setAbierto(true); // muestra el panel con el producto recién añadido
    },
    [recargar]
  );

  const quitar = useCallback(
    async (itemId: number) => {
      await carritoService.quitar(itemId);
      await recargar();
    },
    [recargar]
  );

  const abrirCarrito = useCallback(() => setAbierto(true), []);
  const cerrarCarrito = useCallback(() => setAbierto(false), []);

  const cantidad = items.reduce((total, i) => total + i.cantidad, 0);

  const valor = useMemo(
    () => ({
      items,
      cantidad,
      agregar,
      quitar,
      recargar,
      abierto,
      abrirCarrito,
      cerrarCarrito,
    }),
    [items, cantidad, agregar, quitar, recargar, abierto, abrirCarrito, cerrarCarrito]
  );

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
};

export const useCarrito = () => {
  const contexto = useContext(CarritoContext);
  if (!contexto) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return contexto;
};