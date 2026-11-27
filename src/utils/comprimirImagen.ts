import imageCompression from "browser-image-compression";

/**
 * Comprime una imagen para subida a producto.
 * - 800 KB máximo: suficiente para ver detalle en zoom
 * - 1600 px: cubre pantallas Retina sin desperdicio
 * - WebP: ~30% más liviano que JPEG a la misma calidad
 */
export async function comprimirImagen(file: File): Promise<File> {
  // Si ya es pequeña, no perder tiempo recomprimiendo
  if (file.size < 300 * 1024) return file;

  try {
    return await imageCompression(file, {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      fileType: "image/webp",
      initialQuality: 0.85,
    });
  } catch {
    // Si falla la compresión, sube la original
    return file;
  }
}