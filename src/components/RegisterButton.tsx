import { useNavigate } from "react-router-dom";

const IconoUsuario = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconoChevron = ({ size = 11 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

type Props = { variant?: "compact" | "full" };

const RegisterButton = ({ variant = "compact" }: Props) => {
  const token = localStorage.getItem("token");
  const nombre = localStorage.getItem("nombre");
  const autenticado = Boolean(token && nombre);
  const navigate = useNavigate();

  const iniciarSesion = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorization/google`;
  };

  const cerrarSesion = () => {
    if (!confirm("¿Cerrar sesión?")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("nombre");
    navigate(0);
  };

  const accion = autenticado ? cerrarSesion : iniciarSesion;
  const saludo = autenticado ? `Hola, ${nombre!.split(" ")[0]}` : "Hola, Identifícate";

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={accion}
        className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm text-white hover:bg-blue-900"
      >
        <IconoUsuario size={18} />
        <span className="truncate">{saludo}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={accion}
      className="flex items-center gap-1.5 rounded px-2 py-1 text-left text-white hover:bg-blue-900"
      aria-label={autenticado ? "Cerrar sesión" : "Iniciar sesión"}
    >
      <IconoUsuario size={22} />
      <span className="flex flex-col leading-tight">
        <span className="text-[11px] text-gray-300">{saludo}</span>
        <span className="flex items-center gap-1 text-sm font-semibold">
          Cuenta y listas
          <IconoChevron />
        </span>
      </span>
    </button>
  );
};

export default RegisterButton;