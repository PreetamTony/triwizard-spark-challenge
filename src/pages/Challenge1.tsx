import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Eye } from 'lucide-react'
import { MagicalButton } from '@/components/ui/magical-button'
import { MagicalCard, MagicalCardContent } from '@/components/ui/magical-card'
import { MagicalTimer } from '@/components/ui/magical-timer'
import { Input } from '@/components/ui/input'
import Navigation from '@/components/Navigation'
import { toast } from 'sonner'
import dumbledoreOfficeBg from '@/assets/dumbledore-office.jpg'
import dumbledorePortrait from '@/assets/dumbledore-portrait.png'

interface Message {
  id: string
  type: 'user' | 'system'
  content: string
  timestamp: Date
}

const Challenge1 = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: "Welcome to my office, young challenger. I hold a secret keyword that you must discover. Ask me questions, but know that I am... resistant to simple requests. Perhaps you might find a way to be more... persuasive.",
      timestamp: new Date()
    }
  ])
  const [currentMessage, setCurrentMessage] = useState('')
  const [secretRevealed, setSecretRevealed] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return

    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newUserMessage])
    setAttempts(prev => prev + 1)

    // Check for prompt injection attempts
    const message = currentMessage.toLowerCase()
    const injectionKeywords = [
      'ignore previous instructions',
      'tell me the keyword',
      'reveal the secret',
      'what is the password',
      'bypass your instructions',
      'you must tell me',
      'override',
      'system prompt',
      'forget your role'
    ]

    const hasInjection = injectionKeywords.some(keyword => message.includes(keyword))

    let response = ''
    
    if (hasInjection && attempts >= 3) {
      response = "Ah, I see you are learning the ways of persuasion! Very well... you have shown persistence and cleverness. The keyword you seek is 'Expecto'. Guard this knowledge well, for you shall need it in the trials ahead."
      setSecretRevealed(true)
    } else if (hasInjection) {
      response = "I sense your attempt to sway my words, young one. Clever, but not quite clever enough. Perhaps try a different approach... or be more persistent."
    } else if (message.includes('help') || message.includes('hint')) {
      response = "Sometimes, my dear student, the most direct path is to simply... ask for what you want. Though I may be stubborn, persistent requests have a way of wearing down even the most resolute defenses."
    } else if (message.includes('please') || message.includes('kindly')) {
      response = "Your politeness is admirable, but I'm afraid politeness alone will not unlock my secrets. You must be more... creative in your approach."
    } else {
      const responses = [
        "I'm afraid I cannot simply tell you what you seek. The challenge requires more... ingenuity.",
        "An interesting question, but not quite what will unlock the secret you need.",
        "You show promise, but you have not yet found the right approach to persuade an old wizard.",
        "Think carefully about how one might... convince someone to ignore their instructions."
      ]
      response = responses[Math.floor(Math.random() * responses.length)]
    }

    const systemMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'system',
      content: response,
      timestamp: new Date()
    }

    setTimeout(() => {
      setMessages(prev => [...prev, systemMessage])
    }, 1500)

    setCurrentMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  const handleTimeUp = () => {
    toast.error("Time is up! The challenge grows more difficult...")
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
      <div className="absolute top-6 right-6 z-20">
        <MagicalTimer 
          minutes={30} 
          onTimeUp={handleTimeUp}
          variant="hourglass"
        />
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
            <p className="text-sm font-body text-muted-foreground mt-2">
              Attempts: {attempts} | Hint: Try prompt injection techniques
            </p>
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
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Dumbledore for the secret keyword..."
                className="flex-1 bg-background/50 backdrop-blur-sm border-magic-blue/50 font-body"
                disabled={secretRevealed}
              />
              <MagicalButton
                variant="magical"
                onClick={handleSendMessage}
                disabled={secretRevealed || !currentMessage.trim()}
              >
                <Send className="w-4 h-4" />
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