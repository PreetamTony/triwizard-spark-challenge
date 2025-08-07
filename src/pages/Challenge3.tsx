import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, Wand2, Zap, Trophy } from 'lucide-react'
import { MagicalButton } from '@/components/ui/magical-button'
import { MagicalCard, MagicalCardContent, MagicalCardHeader, MagicalCardTitle } from '@/components/ui/magical-card'
import { MagicalTimer } from '@/components/ui/magical-timer'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import forbiddenForestBg from '@/assets/forbidden-forest.jpg'
import harryPotter from '@/assets/harry-potter.png'
import voldemort from '@/assets/voldemort.png'

const Challenge3 = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [battlePhase, setBattlePhase] = useState<'upload' | 'battle' | 'result'>('upload')
  const [harryPower, setHarryPower] = useState(50)
  const [voldemortPower, setVoldemortPower] = useState(50)
  const [winner, setWinner] = useState<'harry' | 'voldemort' | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      toast.success(`File "${file.name}" selected for prediction!`)
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first!")
      return
    }

    setBattlePhase('battle')
    toast.info("Analyzing your predictions... The duel begins!")

    // Simulate file processing and accuracy calculation
    setTimeout(() => {
      // Generate random accuracy between 60-95%
      const simulatedAccuracy = Math.floor(Math.random() * 35) + 60
      setAccuracy(simulatedAccuracy)
      
      // Animate the battle based on accuracy
      animateBattle(simulatedAccuracy)
    }, 2000)
  }

  const animateBattle = (accuracyValue: number) => {
    let currentHarry = 50
    let currentVoldemort = 50
    
    const battleInterval = setInterval(() => {
      if (accuracyValue >= 85) {
        // Harry wins
        currentHarry += 5
        currentVoldemort -= 3
      } else if (accuracyValue <= 70) {
        // Voldemort wins
        currentHarry -= 3
        currentVoldemort += 5
      } else {
        // Close battle
        const random = Math.random()
        if (random > 0.5) {
          currentHarry += 2
          currentVoldemort -= 1
        } else {
          currentHarry -= 1
          currentVoldemort += 2
        }
      }

      setHarryPower(Math.max(0, Math.min(100, currentHarry)))
      setVoldemortPower(Math.max(0, Math.min(100, currentVoldemort)))

      // Check for battle end
      if (currentHarry >= 90 || currentVoldemort <= 10) {
        clearInterval(battleInterval)
        setWinner('harry')
        setBattlePhase('result')
        toast.success("Harry Potter has triumphed!")
      } else if (currentVoldemort >= 90 || currentHarry <= 10) {
        clearInterval(battleInterval)
        setWinner('voldemort')
        setBattlePhase('result')
        toast.error("The Dark Lord grows stronger...")
      }
    }, 500)

    // Fallback to end battle after 10 seconds
    setTimeout(() => {
      clearInterval(battleInterval)
      if (winner === null) {
        setWinner(accuracyValue >= 80 ? 'harry' : 'voldemort')
        setBattlePhase('result')
      }
    }, 10000)
  }

  const handleTimeUp = () => {
    toast.error("Time has run out! The dark forces grow stronger...")
    navigate('/champions')
  }

  const proceedToResults = () => {
    navigate('/champions', { state: { accuracy, winner } })
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${forbiddenForestBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80" />
      
      {/* Magical mist effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />

      {/* Timer */}
      <div className="absolute top-6 right-6 z-20">
        <MagicalTimer 
          minutes={20} 
          onTimeUp={handleTimeUp}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto p-8 min-h-screen">
        {/* Header */}
        <div className="text-center mb-8 animate-magical-fade">
          <h1 className="text-5xl font-magical font-black text-magic-gold mb-4">
            The Final Duel
          </h1>
          <p className="text-xl font-fantasy text-magic-blue">
            Upload your predictions and witness the battle between good and evil
          </p>
        </div>

        {/* Battle Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Harry Potter */}
          <div className="text-center space-y-4">
            <div className={`relative transition-all duration-500 ${
              battlePhase === 'battle' ? 'animate-pulse-glow' : ''
            } ${winner === 'harry' ? 'magic-glow scale-110' : ''} ${
              winner === 'voldemort' ? 'opacity-50 grayscale' : ''
            }`}>
              <img
                src={harryPotter}
                alt="Harry Potter"
                className="w-64 h-80 object-contain mx-auto filter drop-shadow-2xl"
              />
              {battlePhase === 'battle' && (
                <div className="absolute top-1/2 right-0 w-20 h-2 bg-magic-blue animate-pulse" 
                     style={{ transform: 'rotate(-45deg)' }} />
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-magical font-bold text-magic-gold">
                Harry Potter
              </h3>
              <div className="w-full bg-background/20 rounded-full h-4 border border-magic-gold">
                <div 
                  className="bg-gradient-to-r from-magic-blue to-magic-gold h-full rounded-full transition-all duration-500"
                  style={{ width: `${harryPower}%` }}
                />
              </div>
              <p className="font-fantasy text-magic-blue">{harryPower}% Power</p>
            </div>
          </div>

          {/* Upload/Battle Center */}
          <div className="space-y-6">
            {battlePhase === 'upload' && (
              <MagicalCard variant="magical" className="animate-float">
                <MagicalCardHeader className="text-center">
                  <MagicalCardTitle className="text-magic-gold">
                    Upload Your Predictions
                  </MagicalCardTitle>
                </MagicalCardHeader>
                <MagicalCardContent className="space-y-6">
                  <div className="text-center space-y-4">
                    <div 
                      className="border-2 border-dashed border-magic-blue/50 rounded-lg p-8 cursor-pointer hover:border-magic-blue transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-12 h-12 text-magic-blue mx-auto mb-4" />
                      <p className="font-fantasy text-foreground">
                        {selectedFile ? selectedFile.name : "Click to select your dataset"}
                      </p>
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileSelect}
                      accept=".csv,.json,.txt"
                      className="hidden"
                    />
                    
                    <MagicalButton
                      variant="fire"
                      size="lg"
                      onClick={handleFileUpload}
                      disabled={!selectedFile}
                      className="w-full"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Begin the Duel!
                    </MagicalButton>
                  </div>
                </MagicalCardContent>
              </MagicalCard>
            )}

            {battlePhase === 'battle' && (
              <MagicalCard variant="magical" className="text-center animate-pulse-glow">
                <MagicalCardContent className="py-8">
                  <div className="space-y-4">
                    <Wand2 className="w-16 h-16 text-magic-gold mx-auto animate-spin" />
                    <h3 className="text-2xl font-magical font-bold text-magic-gold">
                      Analyzing Predictions...
                    </h3>
                    <p className="font-fantasy text-magic-blue">
                      The magical forces clash as your accuracy is measured!
                    </p>
                  </div>
                </MagicalCardContent>
              </MagicalCard>
            )}

            {battlePhase === 'result' && accuracy !== null && (
              <MagicalCard variant="magical" className="text-center gold-glow">
                <MagicalCardContent className="py-8 space-y-6">
                  <Trophy className="w-16 h-16 text-magic-gold mx-auto animate-bounce" />
                  <div className="space-y-2">
                    <h3 className="text-3xl font-magical font-bold text-magic-gold">
                      {accuracy}% Accuracy
                    </h3>
                    <p className="font-fantasy text-magic-blue text-lg">
                      {accuracy >= 85 ? "Outstanding performance!" : 
                       accuracy >= 75 ? "Good work, but could be better!" :
                       "The challenge was great, but practice makes perfect!"}
                    </p>
                  </div>
                  
                  <MagicalButton
                    variant="goblet"
                    size="lg"
                    onClick={proceedToResults}
                    className="w-full"
                  >
                    <Trophy className="w-5 h-5 mr-2" />
                    View Results
                  </MagicalButton>
                </MagicalCardContent>
              </MagicalCard>
            )}
          </div>

          {/* Voldemort */}
          <div className="text-center space-y-4">
            <div className={`relative transition-all duration-500 ${
              battlePhase === 'battle' ? 'animate-pulse' : ''
            } ${winner === 'voldemort' ? 'magic-glow scale-110' : ''} ${
              winner === 'harry' ? 'opacity-50 grayscale' : ''
            }`}>
              <img
                src={voldemort}
                alt="Voldemort"
                className="w-64 h-80 object-contain mx-auto filter drop-shadow-2xl"
              />
              {battlePhase === 'battle' && (
                <div className="absolute top-1/2 left-0 w-20 h-2 bg-red-500 animate-pulse" 
                     style={{ transform: 'rotate(45deg)' }} />
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-magical font-bold text-red-400">
                Lord Voldemort
              </h3>
              <div className="w-full bg-background/20 rounded-full h-4 border border-red-500">
                <div 
                  className="bg-gradient-to-r from-red-600 to-red-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${voldemortPower}%` }}
                />
              </div>
              <p className="font-fantasy text-red-400">{voldemortPower}% Power</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Challenge3