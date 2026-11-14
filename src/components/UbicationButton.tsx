const UbicationButton = () => (
  <div className="flex items-center gap-2 text-sm text-white">
    <i className="fa-solid fa-location-crosshairs text-yellow-400"></i>

    <button className="group relative isolate overflow-hidden rounded-full px-4 py-1.5 font-medium">
      {/* Fondo líquido: manchas de color que se mueven dentro del botón */}
      <span aria-hidden className="blob-fondo pointer-events-none absolute inset-0 -z-10" />

      <span className="relative z-10 text-white drop-shadow group-hover:underline">
        Envios a Perú 24/7
      </span>

      <style>{`
        .blob-fondo {
          background: #1e3a8a;
          filter: blur(6px) saturate(1.4);
        }
        .blob-fondo::before,
        .blob-fondo::after {
          content: "";
          position: absolute;
          width: 60%;
          height: 160%;
          border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%;
          filter: blur(4px);
          opacity: 0.85;
        }
        .blob-fondo::before {
          background: radial-gradient(circle, #f472b6, transparent 70%);
          animation: moco-a 6s ease-in-out infinite alternate;
        }
        .blob-fondo::after {
          background: radial-gradient(circle, #facc15, transparent 70%);
          animation: moco-b 7s ease-in-out infinite alternate;
        }
        @keyframes moco-a {
          0%   { transform: translate(-20%, -10%) rotate(0deg) scale(1);   border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; }
          50%  { transform: translate(60%, 10%)   rotate(120deg) scale(1.2); border-radius: 60% 40% 30% 70% / 55% 40% 60% 45%; }
          100% { transform: translate(120%, -5%)  rotate(240deg) scale(0.9); border-radius: 35% 65% 55% 45% / 60% 35% 65% 40%; }
        }
        @keyframes moco-b {
          0%   { transform: translate(120%, 10%) rotate(0deg) scale(0.9); border-radius: 55% 45% 40% 60% / 40% 60% 40% 60%; }
          50%  { transform: translate(20%, -15%) rotate(-100deg) scale(1.15); border-radius: 30% 70% 60% 40% / 50% 50% 50% 50%; }
          100% { transform: translate(-30%, 15%) rotate(-200deg) scale(1); border-radius: 65% 35% 45% 55% / 35% 65% 35% 65%; }
        }
      `}</style>
    </button>
  </div>
);

export default UbicationButton;