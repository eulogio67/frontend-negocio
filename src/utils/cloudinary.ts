/**
 * Agrega transformaciones de Cloudinary a una URL original.
 * Ej: /upload/v123/... -> /upload/f_auto,q_auto,w_800/v123/...
 */
export function optimizarImagen(
  url: string,
  opciones: { width?: number; height?: number; quality?: string } = {}
): string {
  if (!url) return url;
  // Solo toca URLs de Cloudinary
  if (!url.includes("/upload/")) return url;

  const { width = 800, height, quality = "auto" } = opciones;
  const partes = [
    "f_auto", // WebP/AVIF automático según el navegador
    `q_${quality}`, // Calidad automática
    `w_${width}`,
    "c_fill",
    "dpr_auto",
  ];
  if (height) partes.push(`h_${height}`);

  return url.replace("/upload/", `/upload/${partes.join(",")}/`);
}

/** Versión con srcSet para imágenes responsive */
export function srcSetCloudinary(url: string, anchos: number[] = [300, 600, 900]): string {
  return anchos
    .map((w) => `${optimizarImagen(url, { width: w })} ${w}w`)
    .join(", ");
}