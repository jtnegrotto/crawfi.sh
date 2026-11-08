function initBackground() {
  const canvas = document.getElementById('site-background')
  const ctx = canvas.getContext('2d')

  function resizeCanvas() {
    const width = window.innerWidth
    const height = window.innerHeight
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    // Scale for HiDPI/Retina displays
    const scale = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.floor(width * scale)
    canvas.height = Math.floor(height * scale)
    ctx.scale(scale, scale)

    ctx.font = '14px monospace'
    ctx.fillStyle = '#cccccc'
    ctx.textBaseline = 'top'
  }

  const fps = 20
  let lastFrameTs = 0
  function animate(ts) {
    requestAnimationFrame(animate)

    if (ts - lastFrameTs < 1000 / fps) {
      return
    }

    lastFrameTs = ts

    drawBackground(ts)
  }

  const cellWidth = 14
  const cellHeight = 16
  function drawBackground(ts) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    for (let y = 0; y < canvas.height; y += cellHeight) {
      for (let x = 0; x < canvas.width ; x += cellWidth) {
        ctx.fillText('@', x, y)
      }
    }
  }

  resizeCanvas()
  requestAnimationFrame(animate)
  window.addEventListener('resize', resizeCanvas)
}

document.addEventListener('DOMContentLoaded', () => {
  initBackground()
})

