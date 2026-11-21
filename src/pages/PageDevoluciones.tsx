import { useEffect } from "react";
import { Link } from "react-router-dom";

const actualizado = "Noviembre 2026";

const Seccion = ({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) => (
  <section className="flex flex-col gap-2">
    <h2 className="text-lg font-bold text-blue-950 sm:text-xl">{titulo}</h2>
    <div className="flex flex-col gap-2 text-sm leading-relaxed text-gray-700 sm:text-base">
      {children}
    </div>
  </section>
);

const Paso = ({ n, titulo, children }: { n: number; titulo: string; children: React.ReactNode }) => (
  <li className="flex gap-3">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-950 text-sm font-bold text-white">
      {n}
    </span>
    <div className="flex flex-col gap-1">
      <span className="font-semibold text-gray-900">{titulo}</span>
      <span className="text-sm text-gray-700">{children}</span>
    </div>
  </li>
);

const PageDevoluciones = () => {
  useEffect(() => {
    document.title = "Devoluciones y Cambios | HADAJR";
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4">
        <header className="flex flex-col gap-2 border-b border-gray-300 pb-4">
          <Link to="/" className="text-sm font-medium text-blue-950 underline">
            ← Volver a la tienda
          </Link>
          <h1 className="text-2xl font-bold text-blue-950 sm:text-3xl">
            Devoluciones y Cambios
          </h1>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Última actualización: {actualizado}
          </p>
        </header>

        <div className="rounded-lg border border-gray-300 bg-white p-5 text-sm leading-relaxed text-gray-700 sm:text-base">
          En <strong>HADAJR</strong> queremos que compres con confianza. Si tu
          pedido no era lo que esperabas, tienes <strong>7 días calendario</strong>{" "}
          desde que lo recibes para solicitar un cambio o devolución, conforme al
          Código de Protección y Defensa del Consumidor (Ley N.° 29571).
        </div>

        <div className="flex flex-col gap-6 rounded-lg border border-gray-300 bg-white p-5 sm:p-6">
          <Seccion titulo="1. Plazo para devolver">
            <p>
              Tienes <strong>7 días calendario</strong> contados desde la recepción
              del pedido para solicitar el cambio o la devolución. Pasado ese plazo
              no podemos aceptar la solicitud, salvo que exista un defecto de
              fábrica, en cuyo caso aplica la garantía legal.
            </p>
          </Seccion>

          <Seccion titulo="2. Motivos aceptados">
            <ul className="ml-5 list-disc">
              <li>
                <strong>Producto defectuoso o dañado:</strong> costura abierta,
                mancha, rotura, cierre defectuoso, etc.
              </li>
              <li>
                <strong>Producto incorrecto:</strong> recibiste una talla, color o
                modelo distinto al que pediste.
              </li>
              <li>
                <strong>Talla que no te queda:</strong> siempre que la prenda esté
                sin uso y conserve todas sus etiquetas.
              </li>
              <li>
                <strong>Retracto de la compra:</strong> derecho que tienes por ley
                en compras online, sin necesidad de justificar el motivo, dentro
                de los primeros 7 días.
              </li>
            </ul>
          </Seccion>

          <Seccion titulo="3. Condiciones del producto">
            <p>
              Para aceptar la devolución o el cambio, el producto debe cumplir
              todas estas condiciones:
            </p>
            <ul className="ml-5 list-disc">
              <li>Sin uso, sin lavar y sin alteraciones.</li>
              <li>Con todas sus etiquetas originales adheridas.</li>
              <li>En su empaque original (bolsa o caja), cuando corresponda.</li>
              <li>
                Acompañado del comprobante de compra o número de pedido.
              </li>
            </ul>
            <p className="text-xs text-gray-500">
              * Por higiene, no aceptamos devoluciones de ropa interior, bikinis
              ni prendas íntimas, salvo que presenten un defecto de fábrica.
            </p>
          </Seccion>

          <Seccion titulo="4. Cómo solicitar una devolución">
            <ol className="flex flex-col gap-4">
              <Paso n={1} titulo="Escríbenos por WhatsApp">
                Envía un mensaje al WhatsApp Business de HADAJR con tu número de
                pedido y una foto del producto (si es por defecto).
              </Paso>
              <Paso n={2} titulo="Confirma el motivo">
                Nuestro equipo te confirmará si aplica el cambio o la devolución
                en un plazo máximo de <strong>48 horas hábiles</strong>.
              </Paso>
              <Paso n={3} titulo="Envía el producto">
                Coordinamos el recojo por courier o te indicamos el punto de
                entrega más cercano. El costo del envío corre por cuenta de
                HADAJR si el producto es defectuoso o incorrecto; en cambios por
                talla, corre por cuenta del cliente.
              </Paso>
              <Paso n={4} titulo="Reembolso o cambio">
                Una vez recibido y verificado el producto, procesamos el cambio o
                el reembolso en un plazo máximo de <strong>10 días hábiles</strong>.
              </Paso>
            </ol>
          </Seccion>

          <Seccion titulo="5. Reembolsos">
            <p>El reembolso se realiza por el mismo medio de pago utilizado:</p>
            <ul className="ml-5 list-disc">
              <li>
                <strong>Yape / Plin / transferencia:</strong> devolución a la misma
                cuenta en un plazo de 3 a 5 días hábiles.
              </li>
              <li>
                <strong>Tarjeta de crédito o débito:</strong> el abono se ve
                reflejado según los plazos de tu banco (puede tomar hasta 2
                estados de cuenta).
              </li>
              <li>
                <strong>Pago en efectivo o contra entrega:</strong> coordinamos la
                devolución por transferencia bancaria o Yape.
              </li>
            </ul>
            <p>
              Si la compra incluyó un cupón o descuento, el monto a reembolsar
              corresponde al monto efectivamente pagado, no al precio de lista.
            </p>
          </Seccion>

          <Seccion titulo="6. Cambios">
            <p>
              Si prefieres cambiar el producto por otra talla o modelo, indícalo
              en la conversación con nuestro equipo. El cambio está sujeto a
              disponibilidad de stock. Si el nuevo producto tiene un precio
              distinto, se ajusta la diferencia a favor o en contra del cliente.
            </p>
          </Seccion>

          <Seccion titulo="7. Productos que no aceptan devolución">
            <ul className="ml-5 list-disc">
              <li>Prendas íntimas, trajes de baño y ropa interior.</li>
              <li>Productos personalizados (con nombre, estampado especial).</li>
              <li>Productos en liquidación o con descuento final (salvo defecto).</li>
              <li>Productos usados, lavados o alterados por el cliente.</li>
            </ul>
          </Seccion>

          <Seccion titulo="8. Defectos de fábrica (garantía legal)">
            <p>
              Si el producto presenta un defecto de fábrica, tienes derecho a
              exigir la reparación, el cambio o la devolución del dinero, sin
              costo alguno, conforme a la garantía legal de la Ley 29571. El plazo
              para reportar un defecto de fábrica es de <strong>30 días</strong>{" "}
              desde la recepción del pedido.
            </p>
          </Seccion>

          <Seccion titulo="9. ¿No recibiste tu pedido?">
            <p>
              Si pasado el plazo de entrega estimado no recibiste tu pedido,
              contáctanos por WhatsApp Business. Haremos el seguimiento con el
              courier y, si el pedido se pierde, te ofrecemos el reenvío o el
              reembolso total, a tu elección.
            </p>
          </Seccion>

          <Seccion titulo="10. Reclamos y libro de reclamaciones">
            <p>
              Si tu solicitud no fue atendida o consideras que no se respetaron
              tus derechos como consumidor, puedes presentar un reclamo formal a
              través de nuestro <strong>Libro de Reclamaciones virtual</strong>,
              conforme al D.S. 011-2011-PCM.
            </p>
            <p>
              Asimismo, puedes acudir al{" "}
              <strong>INDECOPI</strong> o a la Oficina Municipal de Información al
              Consumidor (OMIC) de tu distrito.
            </p>
          </Seccion>

          <Seccion titulo="11. Contacto">
            <p>Para cualquier consulta sobre devoluciones o cambios:</p>
            <ul className="ml-5 list-disc">
              <li>
                <strong>WhatsApp Business:</strong> publicado en el sitio
                (respuesta en horario de atención).
              </li>
              <li>
                <strong>Correo:</strong>{" "}
                <a href="mailto:devoluciones@hadajr.com" className="text-blue-950 underline">
                  devoluciones@hadajr.com
                </a>
              </li>
              <li>
                <strong>Horario de atención:</strong> lunes a sábado, 9:00 a
                18:00.
              </li>
            </ul>
          </Seccion>
        </div>

        <footer className="border-t border-gray-300 pt-4 text-xs text-gray-500">
          <p>
            Al realizar una compra en HADAJR aceptas esta política de devoluciones
            y cambios, sin perjuicio de tus derechos como consumidor reconocidos
            por la Ley N.° 29571.
          </p>
          <p className="mt-2">
            <Link to="/" className="text-blue-950 underline">
              ← Volver a la tienda
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
};

export default PageDevoluciones;