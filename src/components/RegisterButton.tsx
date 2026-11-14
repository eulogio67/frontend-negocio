const RegisterButton = () => {
  const token = localStorage.getItem("token");
  const nombre = localStorage.getItem("nombre");

  const iniciarSesion = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorization/google`;
  };

  if (token && nombre) {
    return (
      <span className="flex items-center gap-1">
        Hola, {nombre.split(" ")[0]}
      </span>
    );
  }

  return (
    <button
      onClick={iniciarSesion}
      className="flex items-center gap-1 hover:underline"
    >
      Hola, Identifícate
    </button>
  );
};

export default RegisterButton;