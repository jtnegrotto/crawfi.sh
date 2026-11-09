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
  const chars = ' .:+=%#@'
  function drawBackground(ts) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const secs = ts / 1000
    
    for (let y = 0; y < canvas.height; y += cellHeight) {
      for (let x = 0; x < canvas.width ; x += cellWidth) {
        const value = surfaceAt(x, y, secs)
        const idx = Math.min(chars.length - 1, Math.floor(value * chars.length))
        const c = chars[idx]
        ctx.fillText(c, x, y)
      }
    }
  }

  const waveHFreqA = 0.02
  const waveVFreqA = 0.01
  const waveSpeedA = 0.4
  const waveHFreqB = 0.01
  const waveVFreqB = -0.025
  const waveSpeedB = -0.3
  function surfaceAt(x, y, time) {
    const waveA = Math.sin(x * waveHFreqA + y * waveVFreqA + time * waveSpeedA)
    const waveB = Math.sin(x * waveHFreqB + y * waveVFreqB + time * waveSpeedB)
    const wave = (waveA + waveB) / 2
    const norm = (wave + 1) / 2
    return norm
  }

  resizeCanvas()
  requestAnimationFrame(animate)
  window.addEventListener('resize', resizeCanvas)
}

document.addEventListener('DOMContentLoaded', () => {
  initBackground()
})

