/**
 * Compresses an image to keep base64 under reasonable limits.
 * Now supports skipping compression entirely for high-quality logos.
 */
export function compressImage(
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.7,
  skipCompression: boolean = false
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // Si queremos saltar la compresión (ej: Logo nítido)
    // Devolvemos el archivo original tal cual (PNG/JPG original)
    if (skipCompression) {
      console.log("📸 Subiendo imagen original (Calidad 100% sin procesar)");
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      return;
    }

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Redimensionar solo si excede límites
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Usar imageSmoothingQuality high para mejor nitidez al redimensionar
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a JPEG para ahorrar espacio (si no es logo)
        // O mantener PNG si la calidad es 1.0 (opcional, aquí forzamos JPEG para fotos normales)
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/** 
 * Logo: ORIGINAL (Sin compresión, PNG/Transparencia intacta) 
 * Usamos skipCompression=true
 */
export function compressLogoImage(file: File): Promise<string> {
  // Pasamos true al final para saltar compresión
  return compressImage(file, 2000, 2000, 1.0, true);
}

/** 
 * Product images: 
 * Buena calidad (800px ancho), suficiente para verse nítido en tarjetas grandes 
 */
export function compressProductImage(file: File): Promise<string> {
  return compressImage(file, 800, 600, 0.8);
}

/** 
 * Hero/About: 
 * Alta calidad (1600px ancho), para pantallas grandes
 */
export function compressHeroImage(file: File): Promise<string> {
  return compressImage(file, 1600, 1200, 0.75);
}
