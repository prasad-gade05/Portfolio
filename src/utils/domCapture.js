export const captureDOM = async (element) => {
  if (!element) return null

  try {
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(element, {
      useCORS: true,
      scale: 1,
      backgroundColor: null,
      logging: false,
      allowTaint: true,
    })
    return canvas.toDataURL('image/png')
  } catch (err) {
    console.error('DOM capture failed:', err)
    return null
  }
}
