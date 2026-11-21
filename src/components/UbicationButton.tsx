const IconoUbicacion = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconoChevron = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

type Props = { variant?: "compact" | "full" };

const UbicationButton = ({ variant = "compact" }: Props) => {
  const contenido = (
    <>
      <IconoUbicacion size={variant === "full" ? 18 : 20} />
      <span className="flex flex-col leading-tight">
        <span className="text-[11px] text-gray-300">Enviar a</span>
        <span className="flex items-center gap-1 text-sm font-semibold text-white">
          Perú 24/7
          <IconoChevron size={11} />
        </span>
      </span>
    </>
  );

  if (variant === "full") {
    return (
      <button
        type="button"
        aria-label="Elegir ubicación de envío"
        className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-white hover:bg-blue-900"
      >
        {contenido}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label="Elegir ubicación de envío"
      className="flex items-center gap-1.5 rounded px-2 py-1 text-left hover:bg-blue-900"
    >
      {contenido}
    </button>
  );
};

export default UbicationButton;