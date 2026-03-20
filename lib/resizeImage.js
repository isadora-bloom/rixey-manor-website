/**
 * Resize an image File to max `maxPx` on the longest side,
 * convert to WebP at the given quality, and return a new File.
 * Falls back to the original file if the browser doesn't support canvas.
 */
export async function resizeImage(file, maxPx = 2000, quality = 0.85) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      let { width, height } = img
      if (width <= maxPx && height <= maxPx) {
        // Already small enough — still convert to WebP to reduce size
        const canvas = document.createElement('canvas')
        canvas.width  = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return }
            resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' }))
          },
          'image/webp',
          quality,
        )
        return
      }

      // Scale down
      const ratio = Math.min(maxPx / width, maxPx / height)
      width  = Math.round(width  * ratio)
      height = Math.round(height * ratio)

      const canvas = document.createElement('canvas')
      canvas.width  = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' }))
        },
        'image/webp',
        quality,
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(file) // fallback to original
    }

    img.src = url
  })
}
