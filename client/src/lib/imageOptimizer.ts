/**
 * Browser-side image compression and resizing utility.
 * Optimizes images to save bandwidth and storage quota in Supabase.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/webp' | 'image/jpeg';
}

/**
 * Resizes and compresses an image File or Data URL in the browser using HTMLCanvasElement.
 */
export async function compressImage(
  fileOrUrl: File | string,
  options: CompressionOptions = {}
): Promise<string> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    format = 'image/webp',
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions maintaining aspect ratio
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Draw image onto canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to compressed Data URL (WebP or JPEG)
      try {
        let compressedUrl = canvas.toDataURL(format, quality);
        // Fallback to jpeg if webp isn't supported or returned png fallback
        if (format === 'image/webp' && !compressedUrl.startsWith('data:image/webp')) {
          compressedUrl = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(compressedUrl);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (err) => reject(new Error('Falha ao carregar imagem para compressão'));

    if (typeof fileOrUrl === 'string') {
      img.src = fileOrUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(fileOrUrl);
    }
  });
}
