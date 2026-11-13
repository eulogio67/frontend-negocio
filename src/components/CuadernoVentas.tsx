import { useState, type FormEvent } from "react";

type Origen = "Web" | "WhatsApp" | "Puesto";

interface Venta {
  id: number;
  producto: string;
  cantidad: number;
  monto: number;
  origen: Origen;
}

const formato = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });

const FORM_INICIAL = { producto: "", cantidad: "1", monto: "", origen: "WhatsApp" as Origen };

const CuadernoVentas = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [form, setForm] = useState(FORM_INICIAL);

  const registrar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setVentas((prev) => [
      ...prev,
      {
        id: Date.now(),
        producto: form.producto.trim(),
        cantidad: Number(form.cantidad),
        monto: Number(form.monto),
        origen: form.origen,
      },
    ]);
    setForm(FORM_INICIAL);
  };

  const total = ventas.reduce((suma, v) => suma + v.monto, 0);

  return (
    <div className="w-full rounded-xl bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold text-blue-950">Cuaderno de ventas</h2>

      <form onSubmit={registrar} className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        <input
          placeholder="Producto"
          value={form.producto}
          onChange={(e) => setForm({ ...form, producto: e.target.value })}
          required
          className="col-span-2 rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="number"
          min="1"
          placeholder="Cant."
          value={form.cantidad}
          onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
          required
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Monto"
          value={form.monto}
          onChange={(e) => setForm({ ...form, monto: e.target.value })}
          required
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          value={form.origen}
          onChange={(e) => setForm({ ...form, origen: e.target.value as Origen })}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option>WhatsApp</option>
          <option>Web</option>
          <option>Puesto</option>
        </select>
        <button
          type="submit"
          className="col-span-2 rounded-md bg-yellow-400 px-4 py-2 font-semibold text-blue-950 hover:bg-yellow-300 sm:col-span-5"
        >
          Registrar venta
        </button>
      </form>

      <table className="w-full text-sm">
        <thead className="text-left text-gray-500">
          <tr>
            <th className="py-2">Producto</th>
            <th>Cant.</th>
            <th>Monto</th>
            <th>Origen</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((v) => (
            <tr key={v.id} className="border-t">
              <td className="py-2">{v.producto}</td>
              <td>{v.cantidad}</td>
              <td>{formato.format(v.monto)}</td>
              <td>{v.origen}</td>
            </tr>
          ))}
        </tbody>
        {ventas.length > 0 && (
          <tfoot>
            <tr className="border-t font-semibold">
              <td className="py-2" colSpan={2}>Total</td>
              <td colSpan={2}>{formato.format(total)}</td>
            </tr>
          </tfoot>
        )}
      </table>

      {ventas.length === 0 && (
        <p className="text-sm text-gray-500">Todavía no hay ventas registradas.</p>
      )}
    </div>
  );
};

export default CuadernoVentas;