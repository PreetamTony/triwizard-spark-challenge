import React, { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MagicalTimerProps {
  minutes: number
  onTimeUp?: () => void
  className?: string
  variant?: 'hourglass' | 'orb'
}

export const MagicalTimer: React.FC<MagicalTimerProps> = ({
  minutes,
  onTimeUp,
  className,
  variant = 'orb'
}) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60)

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp?.()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onTimeUp])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((minutes * 60 - timeLeft) / (minutes * 60)) * 100

  if (variant === 'hourglass') {
    return (
      <div className={cn("flex items-center gap-3 p-4 rounded-lg bg-magical backdrop-blur-sm border border-magic-gold/30", className)}>
        <div className="relative">
          <Clock className="w-8 h-8 text-magic-gold animate-pulse" />
          <div 
            className="absolute top-0 left-0 w-8 h-8 bg-magic-gold/20 rounded-full" 
            style={{ 
              background: `conic-gradient(from 0deg, hsl(var(--magic-gold)) ${progress}%, transparent ${progress}%)` 
            }}
          />
        </div>
        <div className="text-magic-gold font-fantasy font-bold text-xl">
          {formatTime(timeLeft)}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative p-6 rounded-full bg-gradient-to-br from-magic-blue/20 to-magic-purple/20 backdrop-blur-sm border-2 border-magic-gold magic-glow", className)}>
      <div className="absolute inset-2 rounded-full border-2 border-magic-gold/50" 
           style={{ 
             background: `conic-gradient(from 0deg, hsl(var(--magic-gold)) ${progress}%, transparent ${progress}%)` 
           }} 
      />
      <div className="relative z-10 text-center">
        <div className="text-magic-gold font-magical font-bold text-2xl mb-1">
          {formatTime(timeLeft)}
        </div>
        <div className="text-magic-gold/80 font-fantasy text-sm">
          Time Remaining
        </div>
      </div>
    </div>
  )
}