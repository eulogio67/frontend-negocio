const RegisterButton = () => {
  const iniciarSesion = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorization/google`;
  };

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