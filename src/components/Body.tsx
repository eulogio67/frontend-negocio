import ProductCard from "./ProductCard";
import { productos } from "../api/productos";

const Body = () => (
  <main className="w-full bg-gray-100">
    {/* Banner principal */}
    <section className="w-full bg-blue-900 text-white py-16 px-6 text-center">
      <h1 className="text-4xl font-bold">Nueva colección HADAJR</h1>
      <p className="mt-2 text-blue-100">Envíos a todo el Perú</p>
      <button className="mt-6 bg-yellow-400 text-blue-950 font-semibold px-6 py-2 rounded-md">
        Ver ofertas
      </button>
    </section>

    {/* Categorías */}
    <section className="px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Categorías</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {["Polos", "Casacas", "Pantalones", "Accesorios"].map((cat) => (
          <a
            key={cat}
            href="#"
            className="bg-white rounded-lg p-6 text-center font-medium shadow hover:shadow-md"
          >
            {cat}
          </a>
        ))}
      </div>
    </section>

    {/* Productos destacados */}
    <section className="px-6 pb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Productos destacados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {productos.map((p) => (
          <ProductCard key={p.id} producto={p} />
        ))}
      </div>
    </section>
  </main>
);

export default Body;