import { useEffect, useState } from "react";
import api from "../api/axios";

interface Venta {
  id: number;
  nombreProducto: string;
  talla: string;
  cantidad: number;
  total: number;
  fecha: string;
}

const formato = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });

const Ventas = () => {
  const hoy = new Date();
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [mes, setMes] = useState(hoy.getMonth() + 1);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    api
      .get<Venta[]>("/api/admin/ventas", { params: { anio, mes } })
      .then((r) => setVentas(r.data))
      .finally(() => setCargando(false));
  }, [anio, mes]);

  const total = ventas.reduce((s, v) => s + v.total, 0);
  const unidades = ventas.reduce((s, v) => s + v.cantidad, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <select value={mes} onChange={(e) => setMes(Number(e.target.value))} className="border border-gray-400 px-3 py-2 text-sm">
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(2000, i).toLocaleString("es-PE", { month: "long" })}
            </option>
          ))}
        </select>
        <input type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))} className="w-28 border border-gray-400 px-3 py-2 text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="border border-gray-300 bg-white p-4">
          <p className="text-xs uppercase text-gray-500">Total vendido</p>
          <p className="text-xl font-bold text-blue-950">{formato.format(total)}</p>
        </div>
        <div className="border border-gray-300 bg-white p-4">
          <p className="text-xs uppercase text-gray-500">Unidades</p>
          <p className="text-xl font-bold text-blue-950">{unidades}</p>
        </div>
      </div>

      {cargando ? (
        <p className="text-gray-500">Cargando...</p>
      ) : ventas.length === 0 ? (
        <p className="text-sm text-gray-500">No hay ventas en este mes.</p>
      ) : (
        <table className="w-full border border-gray-300 bg-white text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-2">Fecha</th>
              <th className="p-2">Producto</th>
              <th className="p-2">Talla</th>
              <th className="p-2">Cant.</th>
              <th className="p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="p-2">{new Date(v.fecha).toLocaleDateString("es-PE")}</td>
                <td className="p-2">{v.nombreProducto}</td>
                <td className="p-2">{v.talla}</td>
                <td className="p-2">{v.cantidad}</td>
                <td className="p-2 text-right">{formato.format(v.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Ventas;