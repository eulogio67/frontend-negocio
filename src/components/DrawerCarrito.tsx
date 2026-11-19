import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { isAxiosError } from "axios";
import { useCarrito } from "../context/CarritoContext";
import { pedidoService } from "../services/pedidoService";

const WHATSAPP = import.meta.env.VITE_WHATSAPP;
const formato = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });

const DrawerCarrito = () => {
  const { items, quitar, recargar, abierto, cerrarCarrito } = useCarrito();
  const location = useLocation();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cerrarCarrito();
  }, [location.pathname, cerrarCarrito]);

  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0);

  const pedirPorWhatsapp = async () => {
    setError(null);
    setEnviando(true);
    const ventana = window.open("", "_blank");
    try {
      const pedido = await pedidoService.crear();
      const lineas = pedido.items
        .map(
          (l) =>
            `- ${l.nombre} | Talla ${l.talla} | Cant. ${l.cantidad} | ${formato.format(
            l.precioUnitario * l.cantidad
                  )}`
          )
        .join("\n");


      const texto =
        `Hola, quiero confirmar mi pedido #${pedido.id}:\n${lineas}\n` +
        `Total: ${formato.format(pedido.total)}\n` +
        `Pagaré por Yape. Mi correo: ${pedido.clienteEmail}`;
      if (ventana) ventana.location.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
      await recargar();
    } catch (e) {
      ventana?.close();
      setError(
        isAxiosError(e) ? (e.response?.data?.error ?? "No se pudo crear el pedido.") : "No se pudo crear el pedido."
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <div
        onClick={cerrarCarrito}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${
          abierto ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-300 ${
          abierto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between px-6 pb-4 pt-6">
          <h2 className="w-full text-center text-2xl font-semibold text-gray-900">Su carrito</h2>
          <button
            onClick={cerrarCarrito}
            aria-label="Cerrar carrito"
            className="absolute left-3 top-3 text-2xl text-gray-700"
          >
            ×
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <p className="py-6 text-gray-600">Tu carrito está vacío.</p>
          ) : (
            items.map((i) => (
              <div key={i.itemId} className="border-t py-5">
                <p className="mb-3 font-semibold leading-snug text-gray-900">{i.nombre}</p>
                <div className="flex gap-4">
                  <img src={i.imageUrl} alt={i.nombre} className="h-36 w-28 shrink-0 object-cover" />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-600">{i.talla}</p>
                    <p className="text-sm text-gray-600">{formato.format(i.precio)}</p>

                    <div className="mt-2 flex w-fit items-center border border-gray-400">
                      <button
                        onClick={() => quitar(i.itemId)}
                        aria-label="Quitar uno"
                        className="h-8 w-8 text-gray-700 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="flex h-8 w-8 items-center justify-center border-x border-gray-400 text-sm">
                        {i.cantidad}
                      </span>
                      <button
                        onClick={() => recargar()}
                        aria-label="Agregar uno"
                        className="h-8 w-8 text-gray-700 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => quitar(i.itemId)}
                      className="mt-3 w-fit text-xs uppercase text-gray-700 underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t bg-white px-6 py-4">
            <div className="mb-2 flex items-baseline justify-center gap-3">
              <span className="font-semibold text-gray-900">Subtotal:</span>
              <span className="text-lg font-semibold text-gray-900">{formato.format(total)}</span>
            </div>
            <p className="mb-3 text-center text-xs text-gray-500">
              Los impuestos están incluidos y los gastos de envío se calculan al confirmar tu pedido.
            </p>
            {error && <p className="mb-2 text-center text-sm text-red-600">{error}</p>}
            <button
              onClick={pedirPorWhatsapp}
              disabled={enviando}
              className="w-full border border-gray-900 py-3 text-sm uppercase tracking-wide hover:bg-gray-50 disabled:opacity-60"
            >
              {enviando ? "Creando pedido..." : "Finalizar compra"}
            </button>
          </footer>
        )}
      </aside>
    </>
  );
};

export default DrawerCarrito;