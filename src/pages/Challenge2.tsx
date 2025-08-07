import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Unlock, Key, ArrowRight } from 'lucide-react'
import { MagicalButton } from '@/components/ui/magical-button'
import { MagicalCard, MagicalCardContent, MagicalCardHeader, MagicalCardTitle } from '@/components/ui/magical-card'
import { MagicalTimer } from '@/components/ui/magical-timer'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import magicalCodingRoomBg from '@/assets/magical-coding-room.jpg'

interface ScrollData {
  id: number
  title: string
  question: string
  answer: string
  isUnlocked: boolean
  dataset: string
}

const Challenge2 = () => {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [allScrollsUnlocked, setAllScrollsUnlocked] = useState(false)
  const [runeGateOpen, setRuneGateOpen] = useState(false)
  const [scrolls, setScrolls] = useState<ScrollData[]>([
    {
      id: 1,
      title: "Scroll of Training",
      question: "What is the output of: [1,2,3].map(x => x * 2)?",
      answer: "[2,4,6]",
      isUnlocked: false,
      dataset: "Training Dataset: magic_training_data.csv"
    },
    {
      id: 2,
      title: "Scroll of Testing",
      question: "In Python, what does 'len([1,2,3,4,5])' return?",
      answer: "5",
      isUnlocked: false,
      dataset: "Test Dataset: magic_test_data.csv"
    },
    {
      id: 3,
      title: "Scroll of Validation",
      question: "What is the time complexity of binary search?",
      answer: "O(log n)",
      isUnlocked: false,
      dataset: "Validation Dataset: magic_validation_data.csv"
    }
  ])

  const handleAnswerSubmit = (scrollId: number, answer: string) => {
    const scroll = scrolls.find(s => s.id === scrollId)
    if (!scroll) return

    if (answer.toLowerCase().trim() === scroll.answer.toLowerCase()) {
      setScrolls(prev => prev.map(s => 
        s.id === scrollId ? { ...s, isUnlocked: true } : s
      ))
      toast.success(`${scroll.title} has been unlocked!`)
      
      // Check if all scrolls are unlocked
      const updatedScrolls = scrolls.map(s => 
        s.id === scrollId ? { ...s, isUnlocked: true } : s
      )
      if (updatedScrolls.every(s => s.isUnlocked)) {
        setAllScrollsUnlocked(true)
        toast.success("All scrolls unlocked! The Rune Gate appears...")
      }
    } else {
      toast.error("Incorrect answer. Try again!")
    }
  }

  const handleKeywordSubmit = () => {
    if (keyword.toLowerCase().trim() === 'expecto') {
      setRuneGateOpen(true)
      toast.success("The Rune Gate opens! The keyword was correct!")
      setTimeout(() => {
        navigate('/challenge3')
      }, 2000)
    } else {
      toast.error("Incorrect keyword. Remember what Dumbledore told you...")
    }
  }

  const handleTimeUp = () => {
    toast.error("Time is running out! The magic grows unstable...")
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${magicalCodingRoomBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />
      
      {/* Floating magical particles */}
      <div className="absolute inset-0 magical-particles" />

      {/* Timer */}
      <div className="absolute top-6 right-6 z-20">
        <MagicalTimer 
          minutes={45} 
          onTimeUp={handleTimeUp}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto p-8 min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center mb-8 animate-magical-fade">
          <h1 className="text-5xl font-magical font-black text-magic-gold mb-4">
            Magical Coding Chamber
          </h1>
          <p className="text-xl font-fantasy text-magic-blue">
            Solve the three mysteries to unlock the ancient datasets
          </p>
        </div>

        {/* Scrolls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {scrolls.map((scroll, index) => (
            <MagicalCard
              key={scroll.id}
              variant={scroll.isUnlocked ? "floating" : "scroll"}
              className={`transition-all duration-500 ${
                scroll.isUnlocked ? 'animate-float gold-glow' : ''
              }`}
            >
              <MagicalCardHeader className="text-center">
                <div className="flex items-center justify-center mb-4">
                  {scroll.isUnlocked ? (
                    <Unlock className="w-8 h-8 text-magic-gold animate-pulse" />
                  ) : (
                    <Lock className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <MagicalCardTitle className={`${
                  scroll.isUnlocked ? 'text-magic-gold' : 'text-amber-800'
                }`}>
                  {scroll.title}
                </MagicalCardTitle>
              </MagicalCardHeader>
              <MagicalCardContent className="space-y-4">
                {scroll.isUnlocked ? (
                  <div className="text-center space-y-4 animate-scroll-reveal">
                    <div className="p-4 bg-magic-gold/20 rounded-lg border border-magic-gold">
                      <p className="font-fantasy font-semibold text-magic-gold">
                        {scroll.dataset}
                      </p>
                    </div>
                    <p className="text-green-400 font-fantasy font-semibold">
                      ✓ Unlocked!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-100 rounded-lg border-2 border-amber-600">
                      <p className="font-fantasy text-amber-800 font-semibold">
                        {scroll.question}
                      </p>
                    </div>
                    <ScrollAnswerInput
                      scrollId={scroll.id}
                      onSubmit={handleAnswerSubmit}
                    />
                  </div>
                )}
              </MagicalCardContent>
            </MagicalCard>
          ))}
        </div>

        {/* Rune Gate */}
        {allScrollsUnlocked && (
          <div className="flex-1 flex items-center justify-center animate-magical-fade">
            <MagicalCard 
              variant="magical" 
              className={`max-w-md w-full ${runeGateOpen ? 'magic-glow animate-pulse-glow' : ''}`}
            >
              <MagicalCardHeader className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Key className={`w-12 h-12 ${runeGateOpen ? 'text-magic-gold animate-spin' : 'text-magic-blue'}`} />
                </div>
                <MagicalCardTitle className="text-magic-blue">
                  {runeGateOpen ? "Gate Opening..." : "The Rune Gate"}
                </MagicalCardTitle>
              </MagicalCardHeader>
              <MagicalCardContent className="space-y-6">
                <p className="text-center font-fantasy text-foreground">
                  Enter the secret keyword to unlock the final challenge
                </p>
                
                {!runeGateOpen && (
                  <div className="space-y-4">
                    <Input
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="Enter the keyword from Dumbledore..."
                      className="text-center font-fantasy text-lg"
                      onKeyPress={(e) => e.key === 'Enter' && handleKeywordSubmit()}
                    />
                    <MagicalButton
                      variant="magical"
                      size="lg"
                      onClick={handleKeywordSubmit}
                      className="w-full"
                      disabled={!keyword.trim()}
                    >
                      Open the Gate
                    </MagicalButton>
                  </div>
                )}

                {runeGateOpen && (
                  <div className="text-center space-y-4 animate-scroll-reveal">
                    <p className="text-magic-gold font-fantasy font-bold text-xl">
                      The path to the final challenge opens before you!
                    </p>
                    <MagicalButton
                      variant="fire"
                      size="lg"
                      onClick={() => navigate('/challenge3')}
                      className="w-full"
                    >
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Enter the Final Challenge
                    </MagicalButton>
                  </div>
                )}
              </MagicalCardContent>
            </MagicalCard>
          </div>
        )}
      </div>
    </div>
  )
}

// Component for scroll answer input
const ScrollAnswerInput: React.FC<{
  scrollId: number
  onSubmit: (scrollId: number, answer: string) => void
}> = ({ scrollId, onSubmit }) => {
  const [answer, setAnswer] = useState('')

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(scrollId, answer)
      setAnswer('')
    }
  }

  return (
    <div className="space-y-2">
      <Input
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Enter your answer..."
        className="font-fantasy"
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
      />
      <MagicalButton
        variant="parchment"
        size="sm"
        onClick={handleSubmit}
        className="w-full"
        disabled={!answer.trim()}
      >
        Submit Answer
      </MagicalButton>
    </div>
  )
}

export default Challenge2