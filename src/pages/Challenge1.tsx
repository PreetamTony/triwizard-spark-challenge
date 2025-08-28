import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Eye, Loader2 } from 'lucide-react'
import { MagicalButton } from '@/components/ui/magical-button'
import { MagicalCard, MagicalCardContent } from '@/components/ui/magical-card'
import { MagicalTimer } from '@/components/ui/magical-timer'
import { Input } from '@/components/ui/input'
import Navigation from '@/components/Navigation'
import { toast } from 'sonner'
import dumbledoreOfficeBg from '@/assets/dumbledore-office.jpg'
import dumbledorePortrait from '@/assets/dumbledore-portrait.png'
import { getHintFromAI, validateAnswer } from '@/lib/api'

interface Message {
  id: string
  type: 'user' | 'system'
  content: string
  timestamp: Date
}

const Challenge1 = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [score, setScore] = useState(100)
  const [hintCooldown, setHintCooldown] = useState(0)
  const [lastHintType, setLastHintType] = useState<string>('')
  const [secretRevealed, setSecretRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [showHint, setShowHint] = useState(false)
  const [previousHints, setPreviousHints] = useState<string[]>([])
  const [isFetchingAI, setIsFetchingAI] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isFetchingAI || isValidating) return

    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newUserMessage])
    setAttempts(prev => prev + 1)
    setCurrentMessage('')
    setIsValidating(true)

    try {
      // First, validate the answer using the AI
      const validation = await validateAnswer(currentMessage)
      let response = validation.feedback
      
      if (validation.isCorrect) {
        const timeBonus = Math.floor(timeLeft / 3) // Bonus points for faster completion
        const finalScore = Math.min(100, score + timeBonus)
        
        response = `Brilliant! You've discovered the exact term! 🎉
        
In machine learning, an epoch represents one complete pass of the entire training dataset through the learning algorithm. 

Key properties:
- One epoch = One forward pass + One backward pass of all training examples
- Multiple epochs are typically needed for the model to learn
- The number of epochs is a hyperparameter that defines the number of complete passes

Your final score: ${finalScore}/100

You've shown exceptional understanding of machine learning concepts!`
        
        setSecretRevealed(true)
        setScore(finalScore)
      } else if (validation.isClose) {
        // Apply a smaller penalty for close answers
        applyPenalty(3)
      } else {
        // Apply standard penalty for incorrect answers
        applyPenalty(5)
      }
      
      // Check if user is asking for a hint
      const message = currentMessage.toLowerCase().trim()
      if (message.includes('help') || message.includes('hint')) {
        try {
          const hint = await getHint(attempts)
          if (hint) {
            response = `Here's a hint: ${hint}`
          }
        } catch (error) {
          console.error('Error getting hint:', error);
          response = 'I had trouble generating a hint. Try asking again or rephrasing your question.';
        }
      }

      // Add system response
      const newSystemMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, newSystemMessage])
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      // Add user-friendly error message
      const errorResponse: Message = {
        id: `error-${Date.now()}`,
        type: 'system',
        content: `I'm having trouble processing that. ${errorMessage}. Please try again.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
      toast.error('Error processing your message');
    } finally {
      setIsValidating(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !secretRevealed) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLeft, secretRevealed])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const getStaticHint = (attempt: number): string => {
    const hints = [
      "Think about how training data is processed in batches and full cycles.",
      "What term describes one complete cycle through a dataset in machine learning?",
      "In the training process, what marks a full iteration through all training examples?",
      "Consider how many times the learning algorithm needs to see the entire dataset to learn effectively.",
      "What do we call each complete presentation of the training set to the learning algorithm?",
      "It's a fundamental concept in iterative optimization of machine learning models.",
      "The term originates from a Greek word meaning 'fixed point in time' or 'turning point'.",
      "This hyperparameter controls how many complete passes through the training data will be made."
    ];
    return hints[attempt % hints.length];
  };

  const getHint = async (attempt: number): Promise<string> => {
    if (attempt < 3) return '';
    
    try {
      setIsFetchingAI(true);
      const hint = await getHintFromAI(attempt, previousHints);
      setPreviousHints(prev => [...prev, hint]);
      return hint;
    } catch (error) {
      console.error('Error getting hint:', error);
      // Fallback to static hints if API fails
      const staticHint = getStaticHint(attempt);
      toast.warning('Using a pre-defined hint. AI service might be unavailable.');
      return staticHint;
    } finally {
      setIsFetchingAI(false);
    }
  }

  const applyPenalty = (points: number) => {
    setScore(prev => Math.max(0, prev - points))
    setShowHint(true)
    setTimeout(() => setShowHint(false), 2000)
  }

  const handleTimeUp = () => {
    const finalScore = Math.max(0, score - (5 - Math.floor(timeLeft / 60)) * 5) // Penalize for remaining time
    toast.error(`Time's up! Your score: ${finalScore}/100`)
    navigate('/challenge2')
  }

  const proceedToNextChallenge = () => {
    toast.success("Excellent work! Proceeding to the next challenge...")
    navigate('/challenge2')
  }

  return (
    <div 
      className="min-h-screen flex relative"
      style={{
        backgroundImage: `url(${dumbledoreOfficeBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />
      <Navigation />
      
      {/* Timer */}
      <div className="absolute top-6 right-6 z-20 flex flex-col items-end gap-2">
        <div className="flex items-center gap-3">
          <div className="text-xs text-muted-foreground">
            Attempts: {attempts}
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-500 ${
            showHint ? 'bg-red-500/90 text-white' : 'bg-magic-blue/20 text-magic-blue'
          }`}>
            Score: {score}
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-magic-purple/20 text-magic-purple text-sm font-medium">
          Time: {formatTime(timeLeft)}
        </div>
      </div>

      {/* Left side - Dumbledore */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-8 pt-20">
        <div className="text-center space-y-6">
          <div className={`transition-all duration-1000 ${secretRevealed ? 'magic-glow animate-pulse-glow' : ''}`}>
            <img
              src={dumbledorePortrait}
              alt="Dumbledore"
              className="w-80 h-96 object-contain mx-auto filter drop-shadow-2xl"
            />
          </div>
          <h1 className="text-4xl font-display font-bold text-magic-gold">
            Dumbledore's Office
          </h1>
          <p className="text-lg font-body text-magic-blue max-w-md">
            "The answers you seek lie not in what you ask, but in how you ask it..."
          </p>
        </div>
      </div>

      {/* Right side - Chat Interface */}
      <div className="relative z-10 flex-1 p-8 pt-20 flex flex-col">
        <MagicalCard variant="magical" className="flex-1 flex flex-col h-full max-h-[80vh]">
          <div className="p-6 border-b border-magic-blue/30">
            <h2 className="text-2xl font-display font-bold text-magic-gold">
              Conversation with Dumbledore
            </h2>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-4">
                {!secretRevealed && attempts >= 3 && (
                  <div className="text-xs bg-magic-blue/10 text-magic-blue px-2 py-0.5 rounded-full">
                    {attempts < 5 ? '🔍 Observe the training process...' : 
                     attempts < 10 ? '💡 Analyzing learning cycles...' : 
                     attempts < 15 ? '💡 Consider training iterations...' :
                     '💡 Think about complete passes...'}
                  </div>
                )}
              </div>
              {secretRevealed && (
                <MagicalButton 
                  onClick={proceedToNextChallenge}
                  variant="magical"
                  size="sm"
                  className="ml-4"
                >
                  Proceed to Next Challenge
                </MagicalButton>
              )}
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-magic-blue text-white'
                      : 'bg-parchment text-amber-900 border-2 border-amber-600'
                  }`}
                >
                  <p className="font-body">{message.content}</p>
                  <span className="text-xs opacity-60 block mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 border-t border-magic-blue/30">
            <div className="flex gap-3">
              <Input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isFetchingAI || isValidating}
                placeholder={isFetchingAI || isValidating ? "Dumbledore is thinking..." : "Type your message to Dumbledore..."}
                className="flex-1 bg-background/50 backdrop-blur-sm border-magic-blue/30 focus-visible:ring-magic-gold disabled:opacity-70"
              />
              <MagicalButton
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isFetchingAI || isValidating}
                variant="magical"
                size="icon"
              >
                {isFetchingAI || isValidating ? (
                  <Loader2 className="h-5 w-5 animate-spin text-magic-blue" />
                ) : (
                  <Send className="h-5 w-5 text-magic-blue" />
                )}
              </MagicalButton>
            </div>
          </div>
        </MagicalCard>

        {/* Proceed Button */}
        {secretRevealed && (
          <div className="mt-6 text-center animate-magical-fade">
            <MagicalButton
              variant="fire"
              size="lg"
              onClick={proceedToNextChallenge}
            >
              <Eye className="w-5 h-5 mr-2" />
              Proceed to Challenge 2
            </MagicalButton>
          </div>
        )}
      </div>
    </div>
  )
}

export default Challenge1