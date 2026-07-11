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
  ['TikTok', '@mightybit', 'tiktok', 'https://www.tiktok.com/'],
  ['Facebook', 'MIGHTYBIT', 'facebook', 'https://www.facebook.com/'],
  ['YouTube', 'MIGHTYBIT Gaming', 'youtube', 'https://www.youtube.com/'],
  ['SoundCloud', 'MIGHTYBIT Sounds', 'soundcloud', 'https://soundcloud.com/']
]

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
  const [booting, setBooting] = useState(false)
  const [audioActive, setAudioActive] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // Cursor Refs
  const cursorRef = useRef(null)
  const dotRef = useRef(null)

  // Audio Engine Refs
  const audioContextRef = useRef(null)
  const droneOsc1Ref = useRef(null)
  const droneOsc2Ref = useRef(null)
  const filterNodeRef = useRef(null)
  const gainNodeRef = useRef(null)
  const musicRef = useRef(null)

  // 2. Web Audio Synth Engine
  const initAudio = () => {
    if (musicRef.current) return
    const music = new Audio('/assets/Sound.mp3')
    music.loop = true
    music.preload = 'auto'
    music.volume = 0.32
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
      await music.play()
      setAudioActive(true)
    } catch (error) {
      console.warn('Unable to start audio playback.', error)
    }
  }

  const playHoverSound = () => {
    if (!audioContextRef.current || !audioActive) return
    const ctx = audioContextRef.current
    if (ctx.state === 'suspended') return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(850, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08)

    gain.gain.setValueAtTime(0.02, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.08)
  }

  const navigateToPage = (pageNumber) => {
    if (pageNumber === currentPage || isScrollingRef.current || booting) return
    setCurrentPage(pageNumber)
    playHoverSound()
    setInTransition(true)
    isScrollingRef.current = true
    
    const nextProgress = pageNumber === 0 ? 0 : (pageNumber - 1) * 33.3333
    setProgress(nextProgress)

    setTimeout(() => {
      setInTransition(false)
    }, 1000)
    setTimeout(() => {
      isScrollingRef.current = false
    }, 1100)
  }

  // 3. Wheel and Touch event listener for full page navigation
  useEffect(() => {
    const handleWheel = (e) => {
      if (booting) return
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
      if (booting || isScrollingRef.current) return
      
      const currentY = e.touches[0].clientY
      const diffY = startY - currentY

      if (Math.abs(diffY) > 55) {
        const direction = diffY > 0 ? 1 : -1
        const nextPage = Math.max(0, Math.min(4, currentPage + direction))

        if (nextPage !== currentPage) {
          navigateToPage(nextPage)
        }
      }
    }

    const preventDefault = (e) => {
      if (!booting) e.preventDefault()
    }

    addEventListener('wheel', handleWheel, { passive: false })
    addEventListener('touchstart', handleTouchStart, { passive: true })
    addEventListener('touchmove', handleTouchMove, { passive: false })
    addEventListener('touchmove', preventDefault, { passive: false })

    return () => {
      removeEventListener('wheel', handleWheel)
      removeEventListener('touchstart', handleTouchStart)
      removeEventListener('touchmove', handleTouchMove)
      removeEventListener('touchmove', preventDefault)
    }
  }, [currentPage, booting, audioActive])

  useEffect(() => () => { musicRef.current?.pause() }, [])

  // 4. Modulate synth filter frequency depending on active page
  useEffect(() => {
    if (filterNodeRef.current && audioContextRef.current && audioActive) {
      const ctx = audioContextRef.current
      const targetFreq = 180 + currentPage * 100

      if (inTransition) {
        filterNodeRef.current.frequency.cancelScheduledValues(ctx.currentTime)
        filterNodeRef.current.frequency.setValueAtTime(filterNodeRef.current.frequency.value, ctx.currentTime)
        filterNodeRef.current.frequency.exponentialRampToValueAtTime(Math.max(120, targetFreq - 150), ctx.currentTime + 0.25)
        filterNodeRef.current.frequency.exponentialRampToValueAtTime(targetFreq, ctx.currentTime + 1.0)
      } else {
        filterNodeRef.current.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.2)
      }
    }
  }, [currentPage, inTransition, audioActive])

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
      cursorX += dx * 0.15
      cursorY += dy * 0.15

      cursor.style.left = `${cursorX}px`
      cursor.style.top = `${cursorY}px`

      animationFrameId = requestAnimationFrame(tick)
    }

    addEventListener('mousemove', onMouseMove)
    tick()

    const handleMouseEnter = () => {
      setIsHovering(true)
      playHoverSound()
    }
    const handleMouseLeave = () => {
      setIsHovering(false)
    }

    const attachListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, .portal, .start-button')
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter)
        el.addEventListener('mouseleave', handleMouseLeave)
      })
    }

    attachListeners()
    const observer = new MutationObserver(attachListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(animationFrameId)
      observer.disconnect()
      
      const interactiveElements = document.querySelectorAll('a, button, .portal, .start-button')
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [audioActive, booting])

  const panelStyle = (index) => {
    const p = currentPage === 0 ? 0 : currentPage - 1
    const diff = p - index
    const absDiff = Math.abs(diff)
    const easeFactor = absDiff === 0 ? 0 : 1
    
    const xDirs = [-1, -1, 1, -1]
    const yDirs = [-1, 1, 1, -1]
    const sign = diff < 0 ? -1 : 1
    
    const xOffset = easeFactor * 80 * xDirs[index] * sign
    const yOffset = easeFactor * 24 * yDirs[index] * sign
    const rotate = easeFactor * 6 * xDirs[index] * sign
    const scale = Math.max(0.65, Math.min(1.4, 1 - diff * 0.45 * easeFactor))
    const opacity = currentPage === 0 ? 0 : (absDiff === 0 ? 1 : 0)
    const blur = easeFactor * 14
    
    return {
      '--panel-x': `${xOffset}vw`,
      '--panel-y': `${yOffset}vh`,
      '--panel-rotate': `${rotate}deg`,
      '--panel-scale': scale,
      '--panel-opacity': opacity,
      '--panel-blur': `${blur}px`,
      'zIndex': absDiff === 0 ? 10 : 1
    }
  }

  return (
    <main className={inTransition ? 'in-transition' : ''} style={{ '--progress': `${progress}%` }}>
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

      {/* Main Website Content */}
      <div className="scroll-line"><i style={{ width: `${progress}%` }} /></div>
      
      <header>
        <a className="brand" href="#top" onClick={(e) => { e.preventDefault(); navigateToPage(0); }}>
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none">
              <defs><linearGradient id="brandGlow" x1="7" y1="6" x2="33" y2="35" gradientUnits="userSpaceOnUse"><stop stopColor="#FFE1C2" /><stop offset=".55" stopColor="#FF765C" /><stop offset="1" stopColor="#A31E35" /></linearGradient></defs>
              <circle cx="20" cy="20" r="15.5" stroke="url(#brandGlow)" />
              <circle cx="20" cy="20" r="11.5" stroke="rgba(255,225,198,.22)" strokeWidth=".7" />
              <path d="M10.8 25.6V14.1l4.1 6.3 4.1-6.3v11.5" stroke="url(#brandGlow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21.6 14.1h3.4c3.9 0 4.2 5.1.4 5.6 4.5.4 3.8 5.9-.2 5.9h-3.6V14.1Z" stroke="url(#brandGlow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M31.2 9.5 34 6.7M8.8 30.5 6 33.3" stroke="#FFD07D" strokeWidth="1" strokeLinecap="round" />
            </svg>
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
      <section className={`hero ${currentPage >= 1 ? 'inactive' : ''}`} id="top">
        <div className="hero-art" />
        <div className="hero-vignette" />
        <div className="type-ghost">MIGHTYBIT</div>
        <div className="type-stamp">MIGHTYBIT / CINEMA</div>
        <div className="hero-copy">
          <p className="eyebrow"><i /> PLAYER ONE — ONLINE</p>
          <h1>MIGHTYBIT<br /><em>BEYOND SANITY</em></h1>
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
            
            {/* Panel 1 */}
            <article style={panelStyle(0)} className="story-panel panel-call">
              <div className="panel-word">CALLING<br />ME</div>
              <div className="panel-copy">
                <p className="kicker">THE CHAOTIC REBEL</p>
                <h2>เล่นไม่ชนะสักที<br /><em>เป็นที่เกมหรือเป็นที่กูว่ะ</em></h2>
                <p>ข้อดีของสกิลการ Buff เพื่อนร่วมทีม เป็นการสร้างขวัญและกำลังใจที่ดี<br />ข้อดีของสกิลการ Toxic ใครเล่นไม่ดั่งใจกู เจอกูด่า เป็นการคลายความเครียด โยนภาระให้ผู้อื่นรับแทน</p>
                <div className="stat-row">
                  <span><b>99%</b>ปากเก่ง</span>
                  <span><b>-5%</b>สกิลเพลย์</span>
                </div>
              </div>
              <div className="chapter-portrait" aria-hidden="true">
                <div className="portrait-frame" />
                <span className="portrait-label">MIGHTYBIT / CHAOS ARCHIVE</span>
                <span className="portrait-mark">MB<br />01</span>
              </div>
              <div className="orbital"><Icon name="compass" /></div>
            </article>

            {/* Panel 2 */}
            <article style={panelStyle(1)} className="story-panel panel-world">
              <div className="world-bg-image" />
              <div className="panel-word">WORLD<br />MAP</div>
              <div className="panel-copy">
                <p className="kicker">ACTIVE REALM</p>
                <h2>ทุกครั้งที่เข้าไปคือ<br /><em>เข้าเกมผิด</em></h2>
                <p>ตั้งแต่เข้าไปก็ตระหนักได้ ว่าเปิดเกมมาผิดค่าย เพราะงั้นกดออก</p>
              </div>
              <div className="world-card">
                <span>NOW EXPLORING</span>
                <strong>ELDEN RING<br />NIGHTREIGN</strong>
                <small>HARDCORE // RETRY AT 03:00 AM</small>
              </div>
              <div className="world-notes"><span>01 / สำรวจ</span><span>02 / ล้มแล้วลุก</span><span>03 / เล่าให้ฟัง</span></div>
            </article>

            {/* Panel 3 */}
            <article style={panelStyle(2)} className="story-panel panel-portals">
              <div className="panel-word">PORTAL</div>
              <div className="panel-copy">
                <p className="kicker">SELECT DESTINATION</p>
                <h2>เลือกที่เจอ<br /><em>กันบ่อยๆ</em></h2>
                <p>คลิปสั้น คลิปยาว หรือคืนไลฟ์ เลือกประตูที่อยากเข้ามา</p>
              </div>
              <div className="portal-atmosphere" aria-hidden="true"><i /><i /><i /></div>
              <div className="portal-list">
                {portals.map(([name, handle, icon, url], i) => (
                  <a className="portal" style={{ '--i': i }} key={name} href={url} target="_blank" rel="noreferrer">
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

            {/* Panel 4 */}
            <article style={panelStyle(3)} className="story-panel panel-finale">
              <div className="panel-word">PLAY</div>
              <div className="finale-art" />
              <div className="finale-copy">
                <p className="kicker">NEXT TRANSMISSION</p>
                <h2>พร้อมหรือยัง<br /><em>ไปเล่นกัน</em></h2>
                <p className="finale-lede">ไม่ว่าจะเข้ามาดูหนึ่งคลิป หรืออยู่ยาวจนจบด่าน<br />ทุกการกดเล่นคือจุดเริ่มของเรื่องราวใหม่</p>
                <a
                  className="start-button"
                  href="https://www.youtube.com/"
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
          <div className={`story-hint ${currentPage >= 1 ? 'visible' : ''}`}>
            <span>{currentPage >= 1 ? routes[currentPage - 1][1] : ''}</span>
            <i style={{ width: 'var(--progress)' }}></i>
            <b>{currentPage >= 1 ? `${routes[currentPage - 1][0]} / 04` : ''}</b>
          </div>
        </div>
      </section>

      <footer className={currentPage === 4 ? 'visible' : ''}>
        <span>© MIGHTYBIT</span>
      </footer>
    </main>
  )
}
