import logo from "../assets/hadajr_icono.svg";
import { useCarrito } from "../context/CarritoContext";
import Buscador from "./Buscador";
import RegisterButton from "./RegisterButton";

const UbicationButton = () => (
  <div className="flex items-center gap-2 text-sm text-white">
    <i className="fa-solid fa-location-crosshairs"></i>
    <button className="hover:underline">Enviar a Peru</button>
  </div>
);

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
  { name: "Carrito", href: "#", icon: "fa-solid fa-cart-shopping", tipo: "carrito" },
];

const Header = () => {
  const { cantidad } = useCarrito();

  return (
    <header className="flex w-full items-center justify-between gap-4 bg-blue-950 px-6 py-3">
      <img src={logo} alt="HADAJR" className="h-18 w-20" />
      <UbicationButton />
      <Buscador />

      <nav className="flex items-center gap-6 text-sm text-white">
        {opciones.map((op) => {
          if (op.tipo === "login") {
            return <RegisterButton key={op.name} />;
          }

          return (
            <a
              key={op.name}
              href={op.href}
              className="flex items-center gap-1 hover:underline"
            >
              {op.icon && <i className={op.icon}></i>}
              {op.tipo === "carrito" ? `Carrito (${cantidad})` : op.name}
            </a>
          );
        })}
      </nav>
    </header>
  );
};

export default Header;