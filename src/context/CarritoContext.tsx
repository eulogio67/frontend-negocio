import { createContext, useContext, useState, type ReactNode } from "react";

type CarritoContextType = {
  cantidad: number;
  agregar: () => void;
};

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider = ({ children }: { children: ReactNode }) => {
  const [cantidad, setCantidad] = useState(0);

  const agregar = () => setCantidad((c) => c + 1);

  return (
    <CarritoContext.Provider value={{ cantidad, agregar }}>
      {children}
    </CarritoContext.Provider>
  );
};

// Hook para usarlo en cualquier componente
export const useCarrito = () => {
  const contexto = useContext(CarritoContext);
  if (!contexto) {
    throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  }
  return contexto;
};