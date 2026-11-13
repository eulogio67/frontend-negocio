import SubirProducto from "../components/SubirProducto";
import SubirCategoria from "../components/SubirCategoria";
import CuadernoVentas from "../components/CuadernoVentas";

const Admin = () => {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4 rounded-xl bg-white p-8 shadow-md">
          <h1 className="text-2xl font-bold text-blue-950">Administración HADAJR</h1>
          <a
            href={`${import.meta.env.VITE_API_URL}/oauth2/authorization/google`}
            className="rounded-md border border-gray-300 bg-white px-6 py-2 font-medium text-gray-800 hover:bg-gray-50"
          >
            Iniciar sesión con Google
          </a>
        </div>
      </main>
    );
  }

  if (rol !== "ROLE_ADMIN") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100">
        <p className="text-gray-700">No tienes permisos para esta sección.</p>
        <a href="/" className="rounded-md bg-blue-950 px-4 py-2 text-white">
          Volver a la tienda
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4">
        <h1 className="text-3xl font-bold text-blue-950">Administración HADAJR</h1>

        <section className="flex w-full flex-col">
          <SubirProducto />
        </section>

        <section className="flex w-full flex-col">
          <SubirCategoria />
        </section>

        <section className="flex w-full flex-col">
          <CuadernoVentas />
        </section>
      </div>
    </main>
  );
};

export default Admin;