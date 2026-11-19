import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { pedidoService, type Pedido } from "../services/pedidoService";

const formato = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });

const PedidosAdmin = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [procesando, setProcesando] = useState<number | null>(null);

  const cargar = () =>
    pedidoService.listarPendientes().then(setPedidos).catch(() => setError("No se pudieron cargar los pedidos."));

  useEffect(() => {
    cargar();
  }, []);

  const confirmar = async (id: number) => {
    if (!confirm(`¿Confirmas que recibiste el Yape del pedido #${id}? Esto descuenta el stock.`)) return;
    setError(null);
    setProcesando(id);
    try {
      await pedidoService.confirmar(id);
      await cargar();
    } catch (e) {
      setError(isAxiosError(e) ? e.response?.data?.error ?? "No se pudo confirmar." : "Error inesperado.");
    } finally {
      setProcesando(null);
    }
  };

    const rechazar = async (id: number) => {
    if (!confirm(`¿Rechazar el pedido #${id}? No se descontará stock.`)) return;
    setProcesando(id);
    try {
      await pedidoService.rechazar(id);
      await cargar();
    } catch (e) {
      setError(isAxiosError(e) ? e.response?.data?.error ?? "No se pudo rechazar." : "Error inesperado.");
    } finally {
      setProcesando(null);
    }
  };

  return (
    <div className="w-full rounded-xl bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold text-blue-950">Pedidos pendientes de pago</h2>

      {error && <p className="mb-3 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}

      {pedidos.length === 0 && <p className="text-sm text-gray-500">No hay pedidos pendientes.</p>}

      <ul className="flex flex-col gap-4">
        {pedidos.map((p) => (
          <li key={p.id} className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Pedido #{p.id}</span>
              <div className="flex flex-col items-end text-sm text-gray-500">
  <span>{p.clienteEmail}</span>
  {p.clienteTelefono && (
    <a
      href={`https://wa.me/51${p.clienteTelefono}`}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-green-700 underline"
    >
      📱 {p.clienteTelefono}
    </a>
  )}
</div>
            </div>
            <ul className="mt-2 text-sm text-gray-700">
              {p.items.map((l, i) => (
                <li key={i}>
                  {l.cantidad} x {l.nombre}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-bold text-blue-950">{formato.format(p.total)}</span>
              <button
                onClick={() => confirmar(p.id)}
                disabled={procesando === p.id}
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
              >
                {procesando === p.id ? "Confirmando..." : "Confirmar pago"}
              </button>

              <button
                onClick={() => rechazar(p.id)}
                disabled={procesando === p.id}
                className="rounded-md border border-red-600 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                Rechazar pago
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PedidosAdmin;