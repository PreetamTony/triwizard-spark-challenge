import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Trophy, Medal, Star, Download, RotateCcw, Share2 } from 'lucide-react'
import { MagicalButton } from '@/components/ui/magical-button'
import { MagicalCard, MagicalCardContent, MagicalCardHeader, MagicalCardTitle } from '@/components/ui/magical-card'
import Navigation from '@/components/Navigation'
import { toast } from 'sonner'
import greatHallBg from '@/assets/great-hall.jpg'

const Champions = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showFireworks, setShowFireworks] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const accuracy = location.state?.accuracy || 75
  const winner = location.state?.winner || 'harry'

  useEffect(() => {
    // Trigger celebrations
    setShowFireworks(true)
    setTimeout(() => setShowConfetti(true), 1000)
    
    // Auto-hide effects after 5 seconds
    setTimeout(() => {
      setShowFireworks(false)
      setShowConfetti(false)
    }, 5000)
  }, [])

  const getTitle = () => {
    if (accuracy >= 90) return "Triwizard Champion"
    if (accuracy >= 80) return "Magical Apprentice"
    if (accuracy >= 70) return "Brave Challenger"
    return "Determined Student"
  }

  const getMessage = () => {
    if (accuracy >= 90) return "You have mastered the magical arts of data science! Your skills rival those of the greatest wizards."
    if (accuracy >= 80) return "Excellent work! You've shown great promise in the magical realm of machine learning."
    if (accuracy >= 70) return "Well done! Your journey in magical data science has begun successfully."
    return "Every great wizard started as a student. Continue your magical learning journey!"
  }

  const downloadBadge = () => {
    // Create a simple badge download (in a real app, this would generate an actual image)
    const badgeData = {
      title: getTitle(),
      accuracy: accuracy,
      winner: winner,
      date: new Date().toLocaleDateString()
    }
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(badgeData, null, 2))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "triwizard-badge.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
    
    toast.success("Badge downloaded! Share your magical achievement!")
  }

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Triwizard Challenge Complete!',
        text: `I just completed the Triwizard Challenge with ${accuracy}% accuracy! 🏆`,
        url: window.location.origin
      })
    } else {
      navigator.clipboard.writeText(`I just completed the Triwizard Challenge with ${accuracy}% accuracy! Check it out at ${window.location.origin}`)
      toast.success("Results copied to clipboard!")
    }
  }

  const restartChallenge = () => {
    navigate('/')
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${greatHallBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />
      <Navigation />
      
      {/* Magical celebration effects */}
      {showFireworks && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-magic-gold rounded-full animate-ping"
              style={{
                left: `${20 + i * 10}%`,
                top: `${10 + (i % 4) * 20}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      )}

      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none magical-particles" />
      )}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto p-8 pt-20 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl w-full space-y-8">
          {/* Main celebration card */}
          <MagicalCard variant="magical" className="text-center animate-magical-fade gold-glow">
            <MagicalCardHeader className="space-y-6 pb-4">
              <div className="flex justify-center">
                <Trophy className="w-24 h-24 text-magic-gold animate-bounce" />
              </div>
              <div className="space-y-2">
                <h1 className="text-5xl font-display font-black text-magic-gold">
                  Congratulations!
                </h1>
                <h2 className="text-3xl font-display font-bold text-magic-blue">
                  {getTitle()}
                </h2>
              </div>
            </MagicalCardHeader>
            
            <MagicalCardContent className="space-y-8 pb-8">
              <div className="space-y-4">
                <p className="text-xl font-body text-foreground max-w-2xl mx-auto">
                  {getMessage()}
                </p>
                
                <div className="flex justify-center items-center gap-8 py-6">
                  <div className="text-center">
                    <div className="text-4xl font-display font-bold text-magic-gold mb-2">
                      {accuracy}%
                    </div>
                    <div className="font-body text-magic-blue">
                      Final Accuracy
                    </div>
                  </div>
                  
                  <div className="w-px h-16 bg-magic-blue/30" />
                  
                  <div className="text-center">
                    <div className="text-4xl font-display font-bold text-magic-gold mb-2">
                      {winner === 'harry' ? '🏆' : '⚔️'}
                    </div>
                    <div className="font-body text-magic-blue">
                      {winner === 'harry' ? 'Victory!' : 'Valiant Effort!'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievement badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-center gap-3 p-4 bg-magic-blue/20 rounded-lg border border-magic-blue/50">
                  <Medal className="w-6 h-6 text-magic-gold" />
                  <span className="font-body text-magic-blue">Challenge 1 Complete</span>
                </div>
                <div className="flex items-center justify-center gap-3 p-4 bg-magic-purple/20 rounded-lg border border-magic-purple/50">
                  <Star className="w-6 h-6 text-magic-gold" />
                  <span className="font-body text-magic-purple">Challenge 2 Complete</span>
                </div>
                <div className="flex items-center justify-center gap-3 p-4 bg-magic-fire/20 rounded-lg border border-magic-fire/50">
                  <Trophy className="w-6 h-6 text-magic-gold" />
                  <span className="font-body text-magic-fire">Final Duel Complete</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap justify-center gap-4 pt-6">
                <MagicalButton
                  variant="goblet"
                  size="lg"
                  onClick={downloadBadge}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Badge
                </MagicalButton>
                
                <MagicalButton
                  variant="magical"
                  size="lg"
                  onClick={shareResults}
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Achievement
                </MagicalButton>
                
                <MagicalButton
                  variant="fire"
                  size="lg"
                  onClick={restartChallenge}
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  New Challenge
                </MagicalButton>
              </div>
            </MagicalCardContent>
          </MagicalCard>

          {/* Quote from Dumbledore */}
          <MagicalCard variant="parchment" className="animate-magical-fade" style={{ animationDelay: '0.5s' }}>
            <MagicalCardContent className="text-center py-8">
              <blockquote className="text-xl font-elegant italic text-amber-800 max-w-2xl mx-auto">
                "It is our choices that show what we truly are, far more than our abilities. You have chosen to face these challenges with courage and determination."
              </blockquote>
              <cite className="block mt-4 text-lg font-display font-semibold text-amber-700">
                — Albus Dumbledore
              </cite>
            </MagicalCardContent>
          </MagicalCard>
        </div>
      </div>
    </div>
  )
}

export default Champions