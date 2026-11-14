import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { useCarrito } from "../context/CarritoContext";
import { pedidoService } from "../services/pedidoService";

const WHATSAPP = import.meta.env.VITE_WHATSAPP;
const formato = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });

const Carrito = () => {
  const { items, quitar, recargar } = useCarrito();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0);

  const pedirPorWhatsapp = async () => {
    setError(null);
    setEnviando(true);
    // Se abre la pestaña antes del await: si se abre después, algunos navegadores la bloquean
    const ventana = window.open("", "_blank");
    try {
      const pedido = await pedidoService.crear();
      const lineas = pedido.items
        .map((l) => `- ${l.cantidad} x ${l.nombre} (${formato.format(l.precioUnitario * l.cantidad)})`)
        .join("\n");
      const texto =
        `Hola, quiero confirmar mi pedido #${pedido.id}:\n${lineas}\n` +
        `Total: ${formato.format(pedido.total)}\n` +
        `Pagaré por Yape. Mi correo: ${pedido.clienteEmail}`;

      if (ventana) ventana.location.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
      await recargar();
    } catch (e: any) {
      ventana?.close();
      setError(e?.response?.data?.error ?? "No se pudo crear el pedido.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-blue-950">Mi carrito</h1>

        {items.length === 0 ? (
          <p className="text-gray-600">
            Tu carrito está vacío. <Link to="/" className="underline">Seguir comprando</Link>
          </p>
        ) : (
          <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm">
            {items.map((i) => (
              <div key={i.itemId} className="flex items-center gap-4 border-b pb-4">
                <img src={i.imageUrl} alt={i.nombre} className="h-16 w-16 rounded object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{i.nombre}</p>
                  <p className="text-sm text-gray-500">
                    {i.cantidad} x {formato.format(i.precio)}
                  </p>
                </div>
                <button onClick={() => quitar(i.itemId)} className="text-sm text-red-600 underline">
                  Quitar
                </button>
              </div>
            ))}

            <div className="flex justify-between text-lg font-bold text-blue-950">
              <span>Total</span>
              <span>{formato.format(total)}</span>
            </div>

            <p className="text-sm text-gray-600">
              Al pedir, se abrirá WhatsApp con tu pedido. Paga por Yape y envía la captura por ese chat.
              Tu pedido se confirma cuando verifiquemos el pago.
            </p>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              onClick={pedirPorWhatsapp}
              disabled={enviando}
              className="flex items-center justify-center gap-2 rounded-md bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
            >
              <i className="fa-brands fa-whatsapp"></i>
              {enviando ? "Creando pedido..." : "Pedir por WhatsApp"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Carrito;