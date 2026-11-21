import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/hadajr_icono.svg";
import { useCarrito } from "../context/CarritoContext";
import Buscador from "./Buscador";
import RegisterButton from "./RegisterButton";
import UbicationButton from "./UbicationButton";
import { useEffect } from "react";

const IconoCarrito = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const IconoMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="17" x2="20" y2="17" />
  </svg>
);

const IconoCerrar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

const BadgeCarrito = ({ cantidad }: { cantidad: number }) =>
  cantidad > 0 ? (
    <span className="absolute -right-2 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-400 px-1 text-[10px] font-bold leading-none text-blue-950">
      {cantidad > 99 ? "99+" : cantidad}
    </span>
  ) : null;

const Header = () => {
  const { cantidad, abrirCarrito } = useCarrito();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [oculto, setOculto] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;

        // Solo en móvil y sin menú abierto
        if (window.innerWidth < 640 && !menuAbierto) {
          if (y < 60) {
            setOculto(false);
          } else if (Math.abs(delta) > 6) {
            setOculto(delta > 0); // baja → oculta · sube → muestra
          }
        } else {
          setOculto(false);
        }

        lastY.current = y;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuAbierto]);

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <header
      className={`sticky top-0 z-40 bg-blue-950 text-white shadow-md transition-transform duration-300 ease-out ${
        oculto ? "-translate-y-full" : "translate-y-0"
      }`}
    >
    {/* ============ MÓVIL ============ */}
      <div className="sm:hidden">
        {/* Fila 1: hamburguesa + logo + carrito */}
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <button
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
            className="flex h-10 w-10 items-center justify-center rounded hover:bg-blue-900"
          >
            {menuAbierto ? <IconoCerrar /> : <IconoMenu />}
          </button>

          <Link to="/" aria-label="Ir a la página principal" onClick={cerrarMenu}>
            <img src={logo} alt="HADAJR" className="h-10 w-11" />
          </Link>

          <button
            type="button"
            onClick={abrirCarrito}
            aria-label={`Abrir carrito, ${cantidad} productos`}
            className="relative flex h-10 w-10 items-center justify-center rounded hover:bg-blue-900"
          >
            <IconoCarrito />
            <BadgeCarrito cantidad={cantidad} />
          </button>
        </div>

        {/* Fila 2: buscador ancho completo (como Amazon) */}
        <div className="px-2 pb-2">
          <Buscador />
        </div>

        {/* Drawer del menú */}
        {menuAbierto && (
          <nav className="border-t border-blue-900 bg-blue-950 px-2 py-2">
            <Link to="/devoluciones" onClick={cerrarMenu}
              className="block rounded px-3 py-2 text-sm hover:bg-blue-900">
              Devoluciones y pedidos
            </Link>
            <Link to="/carrito" onClick={cerrarMenu}
              className="block rounded px-3 py-2 text-sm hover:bg-blue-900">
              Mi carrito ({cantidad})
            </Link>
            <Link to="/privacidad" onClick={cerrarMenu}
              className="block rounded px-3 py-2 text-sm hover:bg-blue-900">
              Privacidad
            </Link>
            <div className="mt-2 border-t border-blue-900 pt-2">
              <RegisterButton />
            </div>
          </nav>
        )}
      </div>

      {/* ============ ESCRITORIO ============ */}
      <div className="hidden items-center gap-3 px-4 py-2 sm:flex lg:gap-4">
        <Link to="/" aria-label="Ir a la página principal" className="shrink-0">
          <img src={logo} alt="HADAJR" className="h-12 w-14 lg:h-14 lg:w-16" />
        </Link>

        <div className="shrink-0">
          <UbicationButton />
        </div>

        {/* Buscador largo: min-w-0 + flex-1 lo estira al máximo */}
        <div className="flex min-w-0 flex-1">
          <Buscador />
        </div>

        <nav className="flex shrink-0 items-center gap-3 text-sm lg:gap-5">
          <RegisterButton />

          <Link
            to="/devoluciones"
            className="hidden flex-col leading-tight hover:text-yellow-400 md:flex"
          >
            <span className="text-xs text-gray-300">Devoluciones</span>
            <span className="font-semibold">y pedidos</span>
          </Link>

          <button
            type="button"
            onClick={abrirCarrito}
            aria-label={`Abrir carrito, ${cantidad} productos`}
            className="relative flex items-center gap-1.5 rounded px-2 py-1 hover:bg-blue-900"
          >
            <span className="relative">
              <IconoCarrito size={24} />
              <BadgeCarrito cantidad={cantidad} />
            </span>
            <span className="hidden font-semibold lg:inline">Carrito</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;