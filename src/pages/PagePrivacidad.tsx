import { useEffect } from "react";

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

const PagePrivacidad = () => {
  useEffect(() => {
    document.title = "Política de Privacidad | HADAJR";
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4">
        {/* Encabezado */}
        <header className="flex flex-col gap-2 border-b border-gray-300 pb-4">
          <a href="/" className="text-sm font-medium text-blue-950 underline">
            ← Volver a la tienda
          </a>
          <h1 className="text-2xl font-bold text-blue-950 sm:text-3xl">
            Política de Privacidad
          </h1>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Última actualización: {actualizado}
          </p>
        </header>

        {/* Intro */}
        <div className="rounded-lg border border-gray-300 bg-white p-5 text-sm leading-relaxed text-gray-700 sm:text-base">
          En <strong>HADAJR</strong> respetamos tu privacidad y tratamos tus datos
          personales conforme a la <strong>Ley N.° 29733 — Ley de Protección de Datos
          Personales</strong> y su reglamento (D.S. 003-2013-JUS). Esta política explica
          qué datos recopilamos, para qué los usamos, con quién los compartimos y cómo
          puedes ejercer tus derechos.
        </div>

        <div className="flex flex-col gap-6 rounded-lg border border-gray-300 bg-white p-5 sm:p-6">
          <Seccion titulo="1. Responsable del tratamiento">
            <p>
              El responsable del banco de datos personales es <strong>HADAJR</strong>,
              identificado con RUC ante la SUNAT. Para cualquier consulta relacionada
              con tus datos personales puedes escribirnos a{" "}
              <a
                href="mailto:privacidad@hadajr.com"
                className="text-blue-950 underline"
              >
                privacidad@hadajr.com
              </a>
              .
            </p>
            <p className="text-xs text-gray-500">
              * Este es el canal oficial de privacidad. No compartimos datos de contacto
              personales del titular del negocio.
            </p>
          </Seccion>

          <Seccion titulo="2. Datos personales que recopilamos">
            <p>Recopilamos únicamente los datos necesarios para atender tu compra:</p>
            <ul className="ml-5 list-disc">
              <li>
                <strong>Datos de identificación y contacto:</strong> nombre, correo
                electrónico y número de teléfono.
              </li>
              <li>
                <strong>Datos de envío:</strong> dirección, distrito, provincia y
                referencias de entrega.
              </li>
              <li>
                <strong>Datos de la compra:</strong> productos adquiridos, tallas,
                importe y método de pago (no almacenamos números de tarjeta).
              </li>
              <li>
                <strong>Datos técnicos:</strong> dirección IP, tipo de navegador y
                cookies estrictamente necesarias para el funcionamiento del sitio.
              </li>
            </ul>
            <p>
              No solicitamos datos sensibles (salud, religión, origen étnico, opiniones
              políticas, etc.) y pedimos no enviarlos por ningún canal.
            </p>
          </Seccion>

          <Seccion titulo="3. Finalidad del tratamiento">
            <p>Usamos tus datos exclusivamente para:</p>
            <ul className="ml-5 list-disc">
              <li>Procesar, preparar y entregar tu pedido.</li>
              <li>Coordinar el envío con el servicio de courier o delivery.</li>
              <li>Atender consultas, cambios, devoluciones o reclamos.</li>
              <li>Cumplir obligaciones legales, tributarias y contables.</li>
              <li>
                Enviarte comunicaciones sobre tu pedido (estado, seguimiento). Las
                comunicaciones promocionales solo se envían si otorgaste tu
                consentimiento expreso y puedes revocarlo en cualquier momento.
              </li>
            </ul>
          </Seccion>

          <Seccion titulo="4. Base legal">
            <p>
              El tratamiento se sustenta en el <strong>consentimiento</strong> que otorgas
              al aceptar esta política antes de completar tu compra, así como en la{" "}
              <strong>ejecución de la relación contractual</strong> (entrega del producto)
              y el <strong>cumplimiento de obligaciones legales</strong>.
            </p>
          </Seccion>

          <Seccion titulo="5. Plazo de conservación">
            <p>
              Conservamos tus datos mientras exista la relación comercial y hasta por{" "}
              <strong>cinco (5) años</strong> adicionales para atender obligaciones
              tributarias y posibles reclamos, salvo que solicites su eliminación antes y
              no exista impedimento legal.
            </p>
          </Seccion>

          <Seccion titulo="6. Con quién compartimos tus datos">
            <p>
              No vendemos ni alquilamos tus datos. Los compartimos únicamente con:
            </p>
            <ul className="ml-5 list-disc">
              <li>
                <strong>Empresas de courier / delivery</strong>, solo los datos
                necesarios para entregar tu pedido (nombre, dirección, teléfono de
                contacto).
              </li>
              <li>
                <strong>Pasarelas de pago</strong>, que procesan el cobro bajo sus
                propias políticas de seguridad.
              </li>
              <li>
                <strong>Autoridades</strong>, cuando exista un requerimiento legal,
                judicial o administrativo debidamente fundamentado.
              </li>
            </ul>
            <p>
              Los encargados de tratamiento actúan bajo contratos que les obligan a
              guardar confidencialidad y a no usar los datos para fines distintos.
            </p>
          </Seccion>

          <Seccion titulo="7. Cookies">
            <p>
              Usamos cookies estrictamente necesarias para el funcionamiento del carrito
              y la sesión. No usamos cookies de publicidad de terceros sin tu
              consentimiento previo. Puedes desactivarlas desde tu navegador, aunque
              algunas funciones del sitio podrían dejar de operar correctamente.
            </p>
          </Seccion>

          <Seccion titulo="8. Seguridad de la información">
            <p>
              Aplicamos medidas técnicas y organizativas razonables para proteger tus
              datos: cifrado en tránsito (HTTPS), control de acceso a los sistemas,
              almacenamiento en servidores con medidas de seguridad y limitación del
              personal autorizado. Ningún sistema es 100 % infalible, pero trabajamos
              para reducir riesgos al mínimo.
            </p>
          </Seccion>

          <Seccion titulo="9. Tus derechos (ARCO)">
            <p>
              Como titular de los datos puedes ejercer en cualquier momento los
              derechos de <strong>Acceso, Rectificación, Cancelación y Oposición</strong>,
              así como revocar tu consentimiento. Para hacerlo, escríbenos a{" "}
              <a
                href="mailto:privacidad@hadajr.com"
                className="text-blue-950 underline"
              >
                privacidad@hadajr.com
              </a>{" "}
              indicando tu nombre completo, el derecho que deseas ejercer y adjuntando
              copia de tu documento de identidad. Responderemos en un plazo máximo de{" "}
              <strong>10 días hábiles</strong>.
            </p>
            <p>
              Si consideras que no hemos atendido correctamente tu solicitud, puedes
              presentar un reclamo ante la{" "}
              <strong>Autoridad Nacional de Protección de Datos Personales</strong> del
              Ministerio de Justicia y Derechos Humanos.
            </p>
          </Seccion>

          <Seccion titulo="10. Menores de edad">
            <p>
              Nuestros productos están dirigidos a personas mayores de 18 años. No
              recopilamos conscientemente datos de menores. Si detectamos un registro
              de este tipo, procederemos a eliminarlo.
            </p>
          </Seccion>

          <Seccion titulo="11. Cambios en esta política">
            <p>
              Podemos actualizar esta política para reflejar cambios legales u
              operativos. La versión vigente siempre estará publicada en esta página con
              su fecha de actualización. Los cambios sustanciales serán comunicados a
              través del sitio.
            </p>
          </Seccion>

          <Seccion titulo="12. Contacto">
            <p>
              Para cualquier consulta sobre esta política o sobre el tratamiento de tus
              datos personales:
            </p>
            <ul className="ml-5 list-disc">
              <li>
                Correo:{" "}
                <a
                  href="mailto:privacidad@hadajr.com"
                  className="text-blue-950 underline"
                >
                  privacidad@hadajr.com
                </a>
              </li>
              <li>Canal de atención al cliente: WhatsApp Business publicado en el sitio.</li>
            </ul>
          </Seccion>
        </div>

        <footer className="border-t border-gray-300 pt-4 text-xs text-gray-500">
          <p>
            Al realizar una compra en HADAJR confirmas que has leído y aceptado esta
            Política de Privacidad.
          </p>
          <p className="mt-2">
            <a href="/" className="text-blue-950 underline">
              ← Volver a la tienda
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
};

export default PagePrivacidad;