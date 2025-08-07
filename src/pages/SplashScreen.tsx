import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagicalButton } from '@/components/ui/magical-button'
import enchantedHallBg from '@/assets/enchanted-hall-bg.jpg'
import gobletOfFire from '@/assets/goblet-of-fire.png'

const SplashScreen = () => {
  const navigate = useNavigate()
  const [showScroll, setShowScroll] = useState(false)
  const [scrollText, setScrollText] = useState('')

  useEffect(() => {
    // Trigger scroll animation after 2 seconds
    const timer = setTimeout(() => {
      setShowScroll(true)
      // Typewriter effect for the scroll text
      const text = "Welcome to the Triwizard Challenge"
      let index = 0
      const typewriter = setInterval(() => {
        setScrollText(text.slice(0, index))
        index++
        if (index > text.length) {
          clearInterval(typewriter)
        }
      }, 100)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleBeginChallenge = () => {
    navigate('/challenge1')
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden magical-particles"
      style={{
        backgroundImage: `url(${enchantedHallBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Floating candles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-3 h-3 bg-magic-fire rounded-full animate-float shadow-lg`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.5}s`,
              boxShadow: '0 0 20px hsl(var(--magic-fire))'
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-6">
        {/* Title */}
        <div className="space-y-4 animate-magical-fade">
          <h1 className="text-6xl md:text-8xl font-magical font-black text-magic-gold drop-shadow-2xl">
            TRIWIZARD
          </h1>
          <h2 className="text-4xl md:text-6xl font-magical font-bold text-magic-blue drop-shadow-xl">
            CHALLENGE
          </h2>
        </div>

        {/* Goblet of Fire */}
        <div className="relative flex justify-center animate-float">
          <img
            src={gobletOfFire}
            alt="Goblet of Fire"
            className="w-64 h-96 object-contain filter drop-shadow-2xl"
          />
          {/* Fire glow effect */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-magic-fire/30 rounded-full blur-xl animate-pulse-glow" />
        </div>

        {/* Animated scroll */}
        {showScroll && (
          <div className="relative animate-scroll-reveal">
            <div className="bg-parchment border-2 border-amber-600 rounded-lg p-6 max-w-md mx-auto transform rotate-1 shadow-2xl">
              <div className="font-fantasy text-amber-900 text-xl font-semibold text-center">
                {scrollText}
                <span className="animate-pulse">|</span>
              </div>
            </div>
          </div>
        )}

        {/* Begin Challenge Button */}
        {showScroll && (
          <div className="animate-magical-fade" style={{ animationDelay: '1s' }}>
            <MagicalButton
              variant="goblet"
              size="xl"
              onClick={handleBeginChallenge}
              className="mt-8"
            >
              Begin Challenge
            </MagicalButton>
          </div>
        )}
      </div>

      {/* Magical particles overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-magic-blue rounded-full animate-pulse opacity-60" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-magic-gold rounded-full animate-pulse opacity-40" />
        <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-magic-purple rounded-full animate-pulse opacity-50" />
      </div>
    </div>
  )
}

export default SplashScreen