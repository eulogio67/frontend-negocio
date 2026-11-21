import { useEffect, useRef, useState } from "react";

interface Props {
  imagenes: string[];
  indiceInicial: number;
  onCerrar: () => void;
  alt?: string;
}

const IconoAtras = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ModalImagen = ({ imagenes, indiceInicial, onCerrar, alt = "" }: Props) => {
  const [indice, setIndice] = useState(indiceInicial);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const scrollerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef(1);
  const translateRef = useRef({ x: 0, y: 0 });
  const pinchStart = useRef({ dist: 0, scale: 1 });
  const panStart = useRef({ x: 0, y: 0 });
  const lastTap = useRef(0);

  // sincroniza refs con estado (para listeners nativos)
  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { translateRef.current = translate; }, [translate]);

  // bloquear scroll del body + cerrar con Escape
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onCerrar]);

  // reset de zoom al cambiar imagen
  useEffect(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, [indice]);

  // posiciona el carrusel en la imagen inicial
  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollLeft =
        indiceInicial * scrollerRef.current.clientWidth;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // actualiza índice al hacer swipe (solo cuando no hay zoom)
  const onScroll = () => {
    if (scaleRef.current > 1 || !scrollerRef.current) return;
    const { scrollLeft, clientWidth } = scrollerRef.current;
    setIndice(Math.round(scrollLeft / clientWidth));
  };

  // listeners nativos para que preventDefault funcione (passive: false)
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    const onStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const d = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        pinchStart.current = { dist: d, scale: scaleRef.current };
      } else if (e.touches.length === 1) {
        const now = Date.now();
        if (now - lastTap.current < 300) {
          // doble-tap → toggle zoom
          const zoom = scaleRef.current > 1 ? 1 : 2.5;
          setScale(zoom);
          setTranslate({ x: 0, y: 0 });
        }
        lastTap.current = now;
        panStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && scaleRef.current >= 1) {
        e.preventDefault();
        const d = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const nueva = Math.min(5, Math.max(1, (d / pinchStart.current.dist) * pinchStart.current.scale));
        setScale(nueva);
        if (nueva === 1) setTranslate({ x: 0, y: 0 });
      } else if (e.touches.length === 1 && scaleRef.current > 1) {
        e.preventDefault();
        const dx = e.touches[0].clientX - panStart.current.x;
        const dy = e.touches[0].clientY - panStart.current.y;
        setTranslate((t) => ({ x: t.x + dx, y: t.y + dy }));
        panStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
    };
  }, []);

  const zoomeado = scale > 1;

  return (
    <div className="fixed inset-0 z-100 flex flex-col bg-black">
      {/* Botón atrás arriba-izquierda */}
      <button
        type="button"
        onClick={onCerrar}
        aria-label="Volver"
        className="absolute left-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-black/80"
      >
        <IconoAtras />
      </button>

      {/* Contador arriba-derecha */}
      <div className="absolute right-3 top-3 z-20 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
        {indice + 1} / {imagenes.length}
      </div>

      {/* Carrusel scroll-snap; cuando zoomeado se bloquea para permitir pan */}
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className={`flex h-full w-full ${
          zoomeado
            ? "overflow-hidden"
            : "snap-x snap-mandatory overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden"
        }`}
      >
        {imagenes.map((url, i) => (
          <div
            key={i}
            ref={i === indice ? imgRef : undefined}
            className="flex h-full w-full shrink-0 snap-center items-center justify-center p-2"
          >
            <img
              src={url}
              alt={alt}
              draggable={false}
              style={
                i === indice
                  ? {
                      transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
                      transition: scale === 1 ? "transform 200ms ease-out" : "none",
                    }
                  : undefined
              }
              className="max-h-full max-w-full select-none object-contain will-change-transform"
            />
          </div>
        ))}
      </div>

      {!zoomeado && (
        <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-xs text-white/70">
          {imagenes.length > 1 ? "Desliza para cambiar · Pellizca para acercar" : "Pellizca para acercar"}
        </p>
      )}
    </div>
  );
};

export default ModalImagen;