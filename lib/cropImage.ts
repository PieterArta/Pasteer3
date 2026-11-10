export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => {
      console.error("Gagal memuat image untuk crop:", url, error);
      reject(error);
    });
    // HANYA pasang crossOrigin untuk URL remote http/https
    // JANGAN pasang untuk blob: atau data: karena browser akan memblokir request CORS lokal
    if (
      !url.startsWith("blob:") &&
      !url.startsWith("data:") &&
      (url.startsWith("http://") || url.startsWith("https://"))
    ) {
      image.setAttribute("crossOrigin", "anonymous");
    }
    image.src = url;
  });

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * Crops and rotates an image client-side, returning a new File object.
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: PixelCrop,
  rotation = 0,
  fileName = "cropped.jpg",
  mimeType = "image/jpeg",
  quality = 0.92
): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas 2D context tidak tersedia");
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.naturalWidth || image.width,
    image.naturalHeight || image.height,
    rotation
  );

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas center to draw rotated image
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(
    -(image.naturalWidth || image.width) / 2,
    -(image.naturalHeight || image.height) / 2
  );

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  // croppedAreaPixels values are bounding box relative
  // extract the cropped area into a final canvas
  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    throw new Error("Cropped canvas context tidak tersedia");
  }

  // Set the size of the cropped canvas
  croppedCanvas.width = Math.max(1, Math.round(pixelCrop.width));
  croppedCanvas.height = Math.max(1, Math.round(pixelCrop.height));

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    croppedCanvas.width,
    croppedCanvas.height
  );

  return new Promise<File>((resolve, reject) => {
    try {
      croppedCanvas.toBlob(
        (blob) => {
          if (!blob) {
            // Fallback via toDataURL jika toBlob null
            try {
              const dataUrl = croppedCanvas.toDataURL(mimeType, quality);
              const fallbackFile = dataURLtoFile(dataUrl, fileName);
              resolve(fallbackFile);
            } catch (fallbackErr) {
              reject(fallbackErr);
            }
            return;
          }
          const file = new File([blob], fileName, { type: mimeType });
          resolve(file);
        },
        mimeType,
        quality
      );
    } catch {
      try {
        const dataUrl = croppedCanvas.toDataURL(mimeType, quality);
        const fallbackFile = dataURLtoFile(dataUrl, fileName);
        resolve(fallbackFile);
      } catch (fallbackErr) {
        reject(fallbackErr);
      }
    }
  });
}
