const LoginGoogle = () => {
  const iniciar = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorization/google`;
  };

  return (
    <button
      onClick={iniciar}
      className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-800 hover:bg-gray-50"
    >
      Continuar con Google
    </button>
  );
};

export default LoginGoogle;