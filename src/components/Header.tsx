import logo from "../assets/hadajr_icono.svg";
import { useCarrito } from "../context/CarritoContext";
import Buscador from "./Buscador";
import RegisterButton from "./RegisterButton";
import UbicationButton from "./UbicationButton";
import { Link } from "react-router-dom";

type Opcion = {
  name: string;
  href: string;
  icon: string | null;
  tipo?: "login" | "carrito";
};

const opciones: Opcion[] = [
  { name: "ES", href: "#", icon: "fa-regular fa-flag" },
  { name: "Hola, Identifícate", href: "#", icon: null, tipo: "login" },
  { name: "Devoluciones y pedidos", href: "#", icon: "fa-solid fa-rotate-left" },
  { name: "Carrito", href: "/carrito", icon: "fa-solid fa-cart-shopping", tipo: "carrito" },
];

const Header = () => {

  const { cantidad, abrirCarrito } = useCarrito();

  return (
    <header className="flex w-full items-center justify-between gap-4 bg-blue-950 px-6 py-3">
      <Link to="/" aria-label="Ir a la página principal">
        <img src={logo} alt="HADAJR" className="h-18 w-20" />
      </Link>

      <UbicationButton />
      <Buscador />

      <nav className="flex items-center gap-6 text-sm text-white">
        {opciones.map((op) => {
          if (op.tipo === "login") {
            return <RegisterButton key={op.name} />;
          }

          const contenido = (
            <>
              {op.icon && <i className={op.icon}></i>}
              {op.tipo === "carrito" ? `Carrito (${cantidad})` : op.name}
            </>
          );

          if (op.tipo === "carrito") {
            return (
              <button onClick={abrirCarrito} className="flex items-center gap-1 hover:underline">
  <i className="fa-solid fa-cart-shopping"></i>
  Carrito ({cantidad})
</button>
            );
          }

          return (
            <a
              key={op.name}
              href={op.href}
              className="flex items-center gap-1 hover:underline"
            >
              {contenido}
            </a>
          );
        })}
      </nav>
    </header>
  );
};

export default Header;