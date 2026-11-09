function initBackground() {
  const canvas = document.getElementById('site-background')
  const ctx = canvas.getContext('2d')

  let width = window.innerWidth
  let height = window.innerHeight

  const ripples = []

  function resizeCanvas() {
    width = window.innerWidth
    height = window.innerHeight
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
  let nextRippleSecs = 0
  const rippleLifetime = 7
  function animate(ts) {
    requestAnimationFrame(animate)

    if (ts - lastFrameTs < 1000 / fps) {
      return
    }

    lastFrameTs = ts

    const secs = ts / 1000

    if (secs >= nextRippleSecs) {
      addRipple(secs)
      nextRippleSecs = secs + 0.7 + Math.random() * 0.7
    }

    for (let i = ripples.length - 1; i >= 0; i--) {
      if (secs - ripples[i].startSecs > rippleLifetime) {
        ripples.splice(i, 1)
      }
    }

    drawBackground(secs)
  }

  const cellWidth = 14
  const cellHeight = 16
  const chars = ' .:+=%#@'
  function drawBackground(secs) {
    ctx.clearRect(0, 0, width, height)
    
    for (let y = 0; y < height; y += cellHeight) {
      for (let x = 0; x < width ; x += cellWidth) {
        const brightness = brightnessAt(x, y, secs)
        const idx = Math.min(chars.length - 1, Math.floor(brightness * chars.length))
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
  const waveStrength = 0.8
  const rippleStrength = 1
  function waveAt(x, y, secs) {
    const warp = warpAt(x, y, secs)

    const waveA = Math.sin(warp.x * waveHFreqA + warp.y * waveVFreqA + secs * waveSpeedA)
    const waveB = Math.sin(warp.x * waveHFreqB + warp.y * waveVFreqB + secs * waveSpeedB)
    const base = (waveA + waveB) / 2
    let disturbance = 0

    for (const ripple of ripples) {
      disturbance += rippleAt(x, y, secs, ripple)
    }

    return base * waveStrength + disturbance * rippleStrength
  }

  const warpXAmpA = 19
  const warpXAmpB = 13
  const warpXFreqA = 0.02
  const warpXFreqB = 0.012
  const warpXFreqC = 0.014
  const warpXSpeedA =   0.17
  const warpXSpeedB =   0.13
  const warpYAmpA = 17
  const warpYAmpB = 12
  const warpYFreqA = 0.015
  const warpYFreqB = 0.007
  const warpYFreqC = 0.012
  const warpYSpeedA = 0.14
  const warpYSpeedB = 0.11
  function warpAt(x, y, secs) {
    const warpX = 
      warpXAmpA * Math.sin(y * warpXFreqA + secs * warpXSpeedA) +
      warpXAmpB * Math.sin(x * warpXFreqB - y * warpXFreqC - secs * warpXSpeedB)
    const warpY =
      warpYAmpA * Math.cos(x * warpYFreqA - secs * warpYSpeedA) +
      warpYAmpB * Math.sin(x * warpYFreqB + y * warpYFreqC + secs * warpYSpeedB)

    return {
      x: x + warpX,
      y: y + warpY,
    }
  }

  const rippleSpread = 40
  const rippleSpeed = 40
  const rippleFreq = 0.1
  const rippleDecayRate = 0.5
  function rippleAt(x, y, secs, ripple) {
    const dist = Math.hypot(x - ripple.x, y - ripple.y)
    const age = secs - ripple.startSecs
    const radius = age * rippleSpeed
    const ringDist = dist - radius
    const envelope = Math.exp(-Math.pow(ringDist / rippleSpread, 2))
    const fade = Math.exp(-age * rippleDecayRate)
    return Math.sin(ringDist * rippleFreq) * envelope * fade
  }

  function addRipple(secs) {
    ripples.push({
      x: Math.random() * width,
      y: Math.random() * height,
      startSecs: secs,
    })
  }

  const sampleOffset = 4
  const lightDirectionX = 0.7
  const lightDirectionY = -0.5
  const gain = 6
  function brightnessAt(x, y, secs) {
    const slopeX = waveAt(x + sampleOffset, y, secs) - waveAt(x - sampleOffset, y, secs)
    const slopeY = waveAt(x, y + sampleOffset, secs) - waveAt(x, y - sampleOffset, secs)
    const light = slopeX * lightDirectionX + slopeY * lightDirectionY
    return Math.max(0, Math.min(1, light * gain))
  }

  resizeCanvas()
  requestAnimationFrame(animate)
  window.addEventListener('resize', resizeCanvas)
}

document.addEventListener('DOMContentLoaded', () => {
  initBackground()
})

