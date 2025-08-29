import { cn } from '@/lib/utils'
import { ArrowLeft, ArrowRight, Home, Wand2 } from 'lucide-react'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MagicalButton } from './ui/magical-button'

interface NavigationProps {
  className?: string
}

const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Only allow navigation up to Challenge 1
  const challenges = [
    { path: '/', label: 'Start', icon: Home },
    { path: '/challenge1', label: 'Dumbledore\'s Test', icon: Wand2 },
    // Disabled: Challenge 2, Challenge 3
    // { path: '/challenge2', label: 'Coding Trials', icon: Code },
    // { path: '/challenge3', label: 'Final Duel', icon: ArrowRight },
    //{ path: '/champions', label: 'Champions', icon: Trophy },
  ]
  
  const currentIndex = challenges.findIndex(c => c.path === location.pathname)
  const canGoBack = currentIndex > 0
  // Only allow forward navigation if next is not a disabled challenge
  const canGoForward = currentIndex < challenges.length - 1 && currentIndex !== -1
    && challenges[currentIndex + 1].path !== '/challenge2'
    && challenges[currentIndex + 1].path !== '/challenge3'
  
  const goBack = () => {
    if (canGoBack) {
      navigate(challenges[currentIndex - 1].path)
    }
  }
  
  const goForward = () => {
    if (canGoForward) {
      navigate(challenges[currentIndex + 1].path)
    }
  }
  
  const goHome = () => {
    navigate('/')
  }

  return (
    <div className={cn("fixed top-6 left-6 z-50 flex items-center gap-3", className)}>
      {/* Home button */}
      <MagicalButton
        variant="nav"
        size="icon"
        onClick={goHome}
        className="shadow-lg"
      >
        <Home className="w-4 h-4" />
      </MagicalButton>
      
      {/* Back button */}
      <MagicalButton
        variant="nav"
        size="icon"
        onClick={goBack}
        disabled={!canGoBack}
        className="shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
      </MagicalButton>
      
      {/* Current challenge indicator */}
      {currentIndex !== -1 && (
        <div className="px-4 py-2 bg-background/90 backdrop-blur-sm rounded-lg border border-border shadow-lg">
          <div className="flex items-center gap-2">
            {React.createElement(challenges[currentIndex].icon, { className: "w-4 h-4 text-magic-blue" })}
            <span className="font-body font-medium text-sm text-foreground">
              {challenges[currentIndex].label}
            </span>
          </div>
        </div>
      )}
      
      {/* Forward button */}
      <MagicalButton
        variant="nav"
        size="icon"
        onClick={goForward}
        disabled={!canGoForward}
        className="shadow-lg"
      >
        <ArrowRight className="w-4 h-4" />
      </MagicalButton>
    </div>
  )
}

export default Navigation