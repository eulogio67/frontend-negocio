import logo from "../assets/hadajr_icono.svg"
import { useCarrito } from "../context/CarritoContext"


const UbicationButton = () => {
    return(
        <div className="flex items-center gap-2 text-white text-sm ">
            <i className="fa-solid fa-location-crosshairs"></i>
            <button className="hover:underline">
                Enviar a Peru
            </button>
        </div>
    )
  }

const Searcher = () => (
    <div className="flex flex-1 mx-4 max-w-6xl ">
        <button className="bg-gray-200 text-black px-3 rounded-l-md flex items-center gap-2 ">
                Todos <i className="fa-solid fa-arrow-down-long"></i> 
        </button>
            <input 
            type="text"
            placeholder="Polos de Hombre"
            className="flex-1 px-3 py-2 bg-white text-black outline-none" 
            />
            <button className="bg-yellow-400 px-4 rounded-r-md">
                <i className="fa-solid fa-magnifying-glass"></i>
            </button>
        
    </div>
  )

const opciones = [
  { name: "ES", href: "#", icon: "fa-regular fa-flag" },
  { name: "Hola, Identifícate", href: "#", icon: null },
  { name: "Devoluciones y pedidos", href: "#", icon: "fa-solid fa-rotate-left" },
  { name: "Carrito", href: "#", icon: "fa-solid fa-cart-shopping" },
]


const Header = () => {
    const {cantidad} = useCarrito();
;  return (
        <header className="w-full bg-blue-950 flex items-center justify-between gap-4 px-6 py-3">
        <img src={logo} alt="HADAJR" className="h-18 w-20" />
        <UbicationButton />
        <Searcher />
        <nav className="flex items-center gap-6 text-white text-sm">
            {opciones.map((op) => (
                <a key={op.name}  href={op.href} className="flex items-center gap-1 hover:underline">
                    {op.icon && <i className={op.icon} ></i>}
                    {op.name == "Carrito" ? `Carrito (${cantidad})` : op.name}
                </a>
            ))}
        </nav>

    </header>
  )
}

export default Header    