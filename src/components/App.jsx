import { useEffect, useState, useRef } from 'react'
import '../style.css'

const Icon = ({ name }) => {
  const icons = {
    arrow: {
      type: 'stroke',
      content: <path d="M4 12h16m-7-7 7 7-7 7" />
    },

    play: {
      type: 'stroke',
      content: <path d="m9 6 7 6-7 6V6Z" />
    },

    compass: {
      type: 'stroke',
      content: (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m15.4 8.6-2.1 4.7-4.7 2.1 2.1-4.7 4.7-2.1Z" />
        </>
      )
    },

    tiktok: {
      type: 'fill',
      content: (
        <path d="M15.6 3c.3 2.4 1.7 4.1 4.4 4.4v3.3a8.4 8.4 0 0 1-4.4-1.3v6.1A5.6 5.6 0 1 1 10.7 10v3.4a2.4 2.4 0 1 0 1.6 2.3V3h3.3Z" />
      )
    },

    youtube: {
      type: 'fill',
      content: (
        <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8ZM10 15.4V8.6l5.9 3.4-5.9 3.4Z" />
      )
    },

    facebook: {
      type: 'fill',
      content: (
        <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.27h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
      )
    },

    soundcloud: {
      type: 'fill',
      content: (
        <>
          <rect x="1" y="13.6" width="1.2" height="3.1" rx=".6" />
          <rect x="3.1" y="12.2" width="1.2" height="5.7" rx=".6" />
          <rect x="5.2" y="10.7" width="1.2" height="8.2" rx=".6" />
          <rect x="7.3" y="9.7" width="1.2" height="9.8" rx=".6" />
          <rect x="9.4" y="8.8" width="1.2" height="10.7" rx=".6" />
          <path d="M11.7 19.5V8.1a6.2 6.2 0 0 1 10.7 4.2 3.7 3.7 0 0 1-1.9 7.2h-8.8Z" />
        </>
      )
    }
  }

  const icon = icons[name]
  if (!icon) return null
  const isFilled = icon.type === 'fill'

  return (
    <svg
      viewBox="0 0 24 24"
      fill={isFilled ? 'currentColor' : 'none'}
      stroke={isFilled ? 'none' : 'currentColor'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {icon.content}
    </svg>
  )
}

const portals = [
  ['TikTok', '@mightybit', 'tiktok', 'https://www.tiktok.com/@mightybit'],
  ['Facebook', 'MIGHTYBIT', 'facebook', 'https://www.facebook.com/mightybit'],
  ['YouTube', 'MIGHTYBIT Gaming', 'youtube', 'https://www.youtube.com/@mightybit'],
  ['SoundCloud', 'MIGHTYBIT Sounds', 'soundcloud', 'https://soundcloud.com/mightybit']
]

const portalVectors = ['portal-nw', 'portal-ne', 'portal-sw', 'portal-se']

const routes = [
  ['01', 'CHAOS MODE'],
  ['02', 'CURRENT QUEST'],
  ['03', 'OPEN PORTALS'],
  ['04', 'NEXT EPISODE']
]

export default function App() {
  const [currentPage, setCurrentPage] = useState(0)
  const [progress, setProgress] = useState(0)
  const [inTransition, setInTransition] = useState(false)
  const isScrollingRef = useRef(false)
  
  // Cinematic states
  const [audioActive, setAudioActive] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // Animated Counters for Chapter 01
  const [statToxic, setStatToxic] = useState(0)
  const [statSkill, setStatSkill] = useState(0)

  // Canvas & Cursor Refs
  const canvasRef = useRef(null)
  const cursorRef = useRef(null)
  const dotRef = useRef(null)
  const shockwaveTriggerRef = useRef(null)

  // Audio Engine Refs
  const audioContextRef = useRef(null)
  const musicRef = useRef(null)

  // 1. Dynamic Animated Counter Engine for Chapter 01
  useEffect(() => {
    if (currentPage === 1) {
      const duration = 850
      const startTime = performance.now()
      let frameId

      const updateCounter = (now) => {
        const elapsed = now - startTime
        const p = Math.min(elapsed / duration, 1)
        const ease = 1 - Math.pow(1 - p, 3) // easeOutCubic

        setStatToxic(Math.round(ease * 99))
        setStatSkill(Math.round(ease * -5))

        if (p < 1) {
          frameId = requestAnimationFrame(updateCounter)
        }
      }

      const timer = setTimeout(() => {
        frameId = requestAnimationFrame(updateCounter)
      }, 300)

      return () => {
        clearTimeout(timer)
        cancelAnimationFrame(frameId)
      }
    } else {
      setStatToxic(0)
      setStatSkill(0)
    }
  }, [currentPage])

  // 2. Interactive Audio Engine
  const initAudio = () => {
    if (musicRef.current) return
    const music = new Audio('/assets/Sound.mp3')
    music.loop = true
    music.preload = 'auto'
    music.volume = 0.35
    musicRef.current = music
  }

  const toggleAudio = async () => {
    if (!musicRef.current) initAudio()
    const music = musicRef.current

    if (audioActive) {
      music.pause()
      setAudioActive(false)
      return
    }

    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext
        if (AudioCtx) audioContextRef.current = new AudioCtx()
      }
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }
      await music.play()
      setAudioActive(true)
    } catch (error) {
      console.warn('Unable to start audio playback.', error)
    }
  }

  const playHoverSound = () => {
    if (!audioActive) return
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext
        if (AudioCtx) audioContextRef.current = new AudioCtx()
      }
      const ctx = audioContextRef.current
      if (!ctx || ctx.state === 'suspended') return

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(800, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.08)

      gain.gain.setValueAtTime(0.025, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.08)
    } catch {
      // AudioContext fallback
    }
  }

  const playWarpSound = () => {
    if (!audioActive) return
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext
        if (AudioCtx) audioContextRef.current = new AudioCtx()
      }
      const ctx = audioContextRef.current
      if (!ctx || ctx.state === 'suspended') return

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(140, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.4)

      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.4)
    } catch {
      // AudioContext fallback
    }
  }

  const navigateToPage = (pageNumber) => {
    if (pageNumber === currentPage || isScrollingRef.current) return
    setCurrentPage(pageNumber)
    playWarpSound()
    setInTransition(true)
    isScrollingRef.current = true
    
    // Trigger canvas shockwave burst
    if (shockwaveTriggerRef.current) {
      shockwaveTriggerRef.current()
    }

    const nextProgress = pageNumber === 0 ? 0 : (pageNumber - 1) * 33.3333
    setProgress(nextProgress)

    setTimeout(() => {
      setInTransition(false)
    }, 1000)
    setTimeout(() => {
      isScrollingRef.current = false
    }, 1100)
  }

  // 3. Interactive Liquid Waves & Ambient Crimson Particles Canvas Engine
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Particle pool
    const particleCount = Math.min(45, Math.floor(width / 28))
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -(Math.random() * 0.5 + 0.2),
      alpha: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2
    }))

    // Mouse wave ripples pool
    const waves = []
    let mouseX = width / 2
    let mouseY = height / 2
    let lastMouseX = mouseX
    let lastMouseY = mouseY

    const onPointerMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      const dist = Math.hypot(mouseX - lastMouseX, mouseY - lastMouseY)
      if (dist > 18) {
        waves.push({
          x: mouseX,
          y: mouseY,
          radius: 4,
          maxRadius: Math.min(75, 25 + dist * 0.8),
          alpha: 0.35,
          color: Math.random() > 0.3 ? 'rgba(255, 118, 92, ' : 'rgba(255, 211, 112, '
        })
        lastMouseX = mouseX
        lastMouseY = mouseY
      }

      // Pass mouse coordinates to CSS variables for dynamic specular shine & tilt
      const xPercent = (mouseX / width) * 100
      const yPercent = (mouseY / height) * 100
      const tiltX = (mouseX / width - 0.5) * 8
      const tiltY = (mouseY / height - 0.5) * -8
      document.documentElement.style.setProperty('--mouse-x', `${xPercent}%`)
      document.documentElement.style.setProperty('--mouse-y', `${yPercent}%`)
      document.documentElement.style.setProperty('--tilt-x', `${tiltX}deg`)
      document.documentElement.style.setProperty('--tilt-y', `${tiltY}deg`)
    }

    // Shockwave burst on chapter warp
    shockwaveTriggerRef.current = () => {
      for (let i = 0; i < 3; i++) {
        waves.push({
          x: width / 2,
          y: height / 2,
          radius: 10 + i * 25,
          maxRadius: Math.max(width, height) * 0.85,
          alpha: 0.55 - i * 0.12,
          speed: 16 + i * 4,
          color: 'rgba(255, 118, 92, '
        })
      }
    }

    window.addEventListener('mousemove', onPointerMove)

    let animationFrameId
    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // 1. Draw Wave Ripples
      for (let i = waves.length - 1; i >= 0; i--) {
        const w = waves[i]
        w.radius += w.speed || 2.2
        w.alpha *= 0.965

        if (w.alpha <= 0.01 || w.radius >= w.maxRadius) {
          waves.splice(i, 1)
          continue
        }

        ctx.beginPath()
        ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `${w.color}${w.alpha})`
        ctx.lineWidth = 1.2
        ctx.stroke()
      }

      // 2. Draw Floating Crimson / Amber Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.pulse += 0.03
        p.x += p.speedX
        p.y += p.speedY

        // Wrap around screen boundaries
        if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width }
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10

        // Magnetic repulsion from mouse
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const dist = Math.hypot(dx, dy)
        if (dist < 110) {
          const angle = Math.atan2(dy, dx)
          const force = (110 - dist) * 0.035
          p.x -= Math.cos(angle) * force
          p.y -= Math.sin(angle) * force
        }

        const currentAlpha = p.alpha * (0.6 + Math.sin(p.pulse) * 0.4)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 118, 92, ${currentAlpha})`
        ctx.shadowBlur = 8
        ctx.shadowColor = '#ff4d43'
        ctx.fill()
        ctx.shadowBlur = 0
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', onPointerMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // 4. Wheel and Touch event listener for full page navigation
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault()
      if (isScrollingRef.current) return

      const direction = e.deltaY > 0 ? 1 : -1
      const nextPage = Math.max(0, Math.min(4, currentPage + direction))

      if (nextPage !== currentPage) {
        navigateToPage(nextPage)
      }
    }

    let startY = 0
    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY
    }

    const handleTouchMove = (e) => {
      if (isScrollingRef.current) return
      
      const currentY = e.touches[0].clientY
      const diffY = startY - currentY

      if (Math.abs(diffY) > 50) {
        const direction = diffY > 0 ? 1 : -1
        const nextPage = Math.max(0, Math.min(4, currentPage + direction))

        if (nextPage !== currentPage) {
          navigateToPage(nextPage)
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [currentPage, audioActive])

  useEffect(() => () => { musicRef.current?.pause() }, [])

  // 5. Custom target crosshair cursor setup
  useEffect(() => {
    const cursor = cursorRef.current
    const dot = dotRef.current
    if (!cursor || !dot) return

    let mouseX = 0, mouseY = 0
    let cursorX = 0, cursorY = 0

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = `${mouseX}px`
      dot.style.top = `${mouseY}px`
    }

    let animationFrameId
    const tick = () => {
      const dx = mouseX - cursorX
      const dy = mouseY - cursorY
      cursorX += dx * 0.16
      cursorY += dy * 0.16

      cursor.style.left = `${cursorX}px`
      cursor.style.top = `${cursorY}px`

      animationFrameId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMouseMove)
    tick()

    const handleMouseEnter = () => {
      setIsHovering(true)
      playHoverSound()
    }
    const handleMouseLeave = () => {
      setIsHovering(false)
    }

    const attachListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, .portal, .start-button, .stat-row span, .world-card')
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter)
        el.addEventListener('mouseleave', handleMouseLeave)
      })
    }

    attachListeners()
    const observer = new MutationObserver(attachListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(animationFrameId)
      observer.disconnect()
      
      const interactiveElements = document.querySelectorAll('a, button, .portal, .start-button, .stat-row span, .world-card')
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [audioActive])

  const panelStyle = (index) => {
    const p = currentPage === 0 ? 0 : currentPage - 1
    const diff = p - index
    const absDiff = Math.abs(diff)
    
    // Apple-style Cinematic Depth Staging & Optical Dissolve
    const yOffset = diff === 0 ? 0 : (diff < 0 ? 40 : -40)
    const scale = diff === 0 ? 1 : (diff < 0 ? 0.95 : 1.05)
    const opacity = currentPage === 0 ? 0 : (absDiff === 0 ? 1 : 0)
    const blur = absDiff === 0 ? 0 : 10
    
    return {
      '--panel-y': `${yOffset}px`,
      '--panel-scale': scale,
      '--panel-opacity': opacity,
      '--panel-blur': `${blur}px`,
      'zIndex': absDiff === 0 ? 10 : (absDiff === 1 ? 5 : 1),
      'pointerEvents': absDiff === 0 ? 'auto' : 'none'
    }
  }

  return (
    <main className={inTransition ? 'in-transition' : ''} style={{ '--progress': `${progress}%` }}>
      {/* Interactive Liquid Canvas Atmosphere */}
      <canvas ref={canvasRef} className="interactive-canvas" />

      {/* Cinematic Overlays */}
      <div className="cinematic-grain" />
      <div className="cinematic-scanlines" />
      <svg style={{ display: 'none' }}>
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.065 0" />
        </filter>
      </svg>

      {/* Target Crosshair Cursor */}
      <div ref={cursorRef} className={`custom-cursor ${isHovering ? 'hovering' : ''}`} />
      <div ref={dotRef} className="custom-cursor-dot" />

      {/* Top Progress Line */}
      <div className="scroll-line"><i style={{ width: `${progress}%` }} /></div>
      
      <header>
        <a className="brand" href="#top" onClick={(e) => { e.preventDefault(); navigateToPage(0); }}>
          <span className="brand-mark" aria-hidden="true">
            <img src="/assets/mightybit-crimson-mark.png" alt="MIGHTYBIT Logo" />
          </span>
          <span>MIGHTYBIT</span>
        </a>
        
        {/* Cinematic Audio Control */}
        <button className={`audio-toggle ${audioActive ? 'active' : ''}`} onClick={toggleAudio}>
          <span className="audio-wave">
            <i /><i /><i />
          </span>
          <span>{audioActive ? 'AUDIO: AMBIENT' : 'AUDIO: MUTED'}</span>
        </button>

         <a 
          className={`menu-link ${currentPage >= 1 ? 'to-top' : ''}`} 
          href={currentPage >= 1 ? "#top" : "#story"} 
          onClick={(e) => { e.preventDefault(); navigateToPage(currentPage >= 1 ? 0 : 1); }}
        >
          {currentPage >= 1 ? 'BACK TO TOP' : 'ENTER STORY'} <Icon name="arrow" />
        </a>
      </header>

      {/* Hero Section */}
      <section className={`hero ${currentPage === 0 ? 'is-active' : 'inactive'}`} id="top">
        <div className="hero-art" />
        <div className="hero-vignette" />
        <div className="hero-laser-line" />
        <div className="type-ghost">MIGHTYBIT</div>
        <div className="type-stamp">MIGHTYBIT / CINEMA</div>
        <div className="hero-copy">
          <p className="eyebrow"><i /> PLAYER ONE — ONLINE</p>
          <h1 className="hero-headline">MIGHTYBIT<br /><em>BEYOND SANITY</em></h1>
          <p className="lede">ยินดีต้อนรับสู่โลกของ <b>MIGHTYBIT</b><br />ทุกเกมมีเรื่องราวที่รอให้เราเข้าไปค้นพบ</p>
          <a className="start-button" href="#story" onClick={(e) => { e.preventDefault(); navigateToPage(1); }}>
            <span>เริ่มต้นการเดินทาง</span>
            <b><Icon name="arrow" /></b>
          </a>
        </div>
        <div className="hero-meta">
          <span>SCROLL TO EXPLORE</span>
          <i />
          <b>CHAPTER 00</b>
        </div>
      </section>

      {/* Horizontal Story Panels */}
      <section className="horizontal-story" id="story">
        <div className="story-sticky">
          <div className="story-track">
            
            {/* Panel 1 - The Chaotic Rebel */}
            <article style={panelStyle(0)} className={`story-panel panel-call ${currentPage === 1 ? 'is-active' : ''}`}>
              <div className="chapter-portrait" aria-hidden="true">
                <div className="portrait-aura" />
              </div>
              <div className="panel-word">CALLING<br />ME</div>
              <div className="orbital"><Icon name="compass" /></div>
              <div className="panel-copy">
                <p className="kicker">THE CHAOTIC REBEL</p>
                <h2 className="glitch-title">เล่นไม่ชนะสักที<br /><em>เป็นที่เกมหรือ</em><br />เป็นที่กูว่ะ</h2>
                <p>ข้อดีของสกิลการ Buff เพื่อนร่วมทีม เป็นการสร้างขวัญและกำลังใจที่ดี<br />ข้อดีของสกิลการ Toxic ใครเล่นไม่ดั่งใจกู เจอกูด่า เป็นการคลายความเครียด โยนภาระให้ผู้อื่นรับแทน</p>
                <div className="stat-row">
                  <span className="stat-badge stat-toxic">
                    <b>{statToxic}%</b>
                    <small>ปากเก่ง</small>
                  </span>
                  <span className="stat-badge stat-skill">
                    <b>{statSkill}%</b>
                    <small>สกิลเพลย์</small>
                  </span>
                </div>
              </div>
            </article>

            {/* Panel 2 - Active Realm World Map */}
            <article style={panelStyle(1)} className={`story-panel panel-world ${currentPage === 2 ? 'is-active' : ''}`}>
              <div className="world-bg-image" />
              <div className="panel-word">WORLD<br />MAP</div>
              <div className="panel-copy">
                <p className="kicker">ACTIVE REALM</p>
                <h2 className="rune-title"><span className="line-nowrap">ทุกครั้งที่เข้าไปคือ</span><br /><em>เข้าเกมผิด</em></h2>
                <p>ตั้งแต่เข้าไปก็ตระหนักได้ ว่าเปิดเกมมาผิดค่าย เพราะงั้นกดออก</p>
              </div>
              <div className="world-card monolith-card">
                <div className="card-scan-line" />
                <div className="card-glare" />
                <span className="realm-badge">NOW EXPLORING</span>
                <strong>ELDEN RING<br />NIGHTREIGN</strong>
                <small>HARDCORE // RETRY AT 03:00 AM</small>
              </div>
              <div className="world-notes">
                <span className="waypoint-node">01 / สำรวจ</span>
                <span className="waypoint-node">02 / ล้มแล้วลุก</span>
                <span className="waypoint-node">03 / เล่าให้ฟัง</span>
              </div>
            </article>

            {/* Panel 3 - Open Portals (Vector Warp Gateways) */}
            <article style={panelStyle(2)} className={`story-panel panel-portals ${currentPage === 3 ? 'is-active' : ''}`}>
              <div className="panel-word">PORTAL</div>
              <div className="panel-copy">
                <p className="kicker">SELECT DESTINATION</p>
                <h2 className="portal-title">เลือกที่เจอ<br /><em>กันบ่อยๆ</em></h2>
                <p>คลิปสั้น คลิปยาว หรือคืนไลฟ์ เลือกประตูที่อยากเข้ามา</p>
              </div>
              <div className="portal-atmosphere" aria-hidden="true"><i /><i /><i /></div>
              <div className="portal-list">
                {portals.map(([name, handle, icon, url], i) => (
                  <a className={`portal ${portalVectors[i]}`} style={{ '--i': i }} key={name} href={url} target="_blank" rel="noreferrer">
                    <div className="card-glare" />
                    <span className="portal-index">0{i + 1}</span>
                    <span className="portal-icon"><Icon name={icon} /></span>
                    <span className="portal-copy">
                      <b>{name}</b>
                      <small>{handle}</small>
                    </span>
                    <span className="portal-go"><Icon name="arrow" /></span>
                    <span className="portal-beam" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </article>

            {/* Panel 4 - Next Transmission Finale (Supernova Nexus) */}
            <article style={panelStyle(3)} className={`story-panel panel-finale ${currentPage === 4 ? 'is-active' : ''}`}>
              <div className="panel-word play-split-word">
                <span className="play-letter letter-p">P</span>
                <span className="play-letter letter-l">L</span>
                <span className="play-letter letter-a">A</span>
                <span className="play-letter letter-y">Y</span>
              </div>
              <div className="finale-art" />
              <div className="finale-copy">
                <p className="kicker">NEXT TRANSMISSION</p>
                <h2 className="finale-title">พร้อมหรือยัง<br /><em>ไปเล่นกัน</em></h2>
                <p className="finale-lede">ไม่ว่าจะเข้ามาดูหนึ่งคลิป หรืออยู่ยาวจนจบด่าน<br />ทุกการกดเล่นคือจุดเริ่มของเรื่องราวใหม่</p>
                <div className="supernova-pulse" aria-hidden="true" />
                <div className="play-pulse-ring ring-1" aria-hidden="true" />
                <div className="play-pulse-ring ring-2" aria-hidden="true" />
                <div className="play-pulse-ring ring-3" aria-hidden="true" />
                <a
                  className="start-button"
                  href="https://www.youtube.com/@mightybit"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="รับชมตอนล่าสุดบน YouTube"
                >
                  <b><Icon name="play" /></b>
                </a>
                <span className="finale-cta-label">
                  WATCH THE LATEST EPISODE
                </span>
              </div>
            </article>

          </div>

          {/* Bottom Interactive HUD Chapter Route Bar */}
          <div className={`story-hint ${currentPage >= 1 ? 'visible' : ''}`}>
            <span className="hint-label">{currentPage >= 1 ? routes[currentPage - 1][1] : ''}</span>
            <span className="hint-track" aria-hidden="true">
              <i style={{ width: `${progress}%` }} />
            </span>
            <b className="hint-counter">{currentPage >= 1 ? `${routes[currentPage - 1][0]} / 04` : ''}</b>
          </div>
        </div>
      </section>

      <footer className={currentPage === 4 ? 'visible' : ''}>
        <span>© MIGHTYBIT</span>
      </footer>
    </main>
  )
}
