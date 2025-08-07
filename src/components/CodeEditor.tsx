import React, { useState, useRef, useEffect } from 'react'
import { Play, RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import { MagicalButton } from './ui/magical-button'
import { MagicalCard, MagicalCardContent, MagicalCardHeader, MagicalCardTitle } from './ui/magical-card'
import { toast } from 'sonner'

interface CodeEditorProps {
  problem: {
    id: number
    title: string
    difficulty: 'Easy' | 'Medium' | 'Hard'
    description: string
    examples: Array<{
      input: string
      output: string
      explanation?: string
    }>
    testCases: Array<{
      input: string
      expectedOutput: string
    }>
    starterCode: string
    solution: string
  }
  onSolved: () => void
}

const CodeEditor: React.FC<CodeEditorProps> = ({ problem, onSolved }) => {
  const [code, setCode] = useState(problem.starterCode)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<Array<{passed: boolean, input: string, expected: string, actual: string}>>([])
  const [allTestsPassed, setAllTestsPassed] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [code])

  const runCode = async () => {
    setIsRunning(true)
    setOutput('')
    setTestResults([])
    
    try {
      // Simulate code execution and testing
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const results = problem.testCases.map(testCase => {
        // Simple simulation - in real app this would execute actual code
        const passed = code.includes('return') && 
                      code.length > problem.starterCode.length + 10 &&
                      !code.includes('undefined') &&
                      !code.includes('null')
        
        return {
          passed,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: passed ? testCase.expectedOutput : 'undefined'
        }
      })
      
      setTestResults(results)
      const allPassed = results.every(r => r.passed)
      setAllTestsPassed(allPassed)
      
      if (allPassed) {
        setOutput('All test cases passed! ✅')
        toast.success('All tests passed! Challenge solved!')
        onSolved()
      } else {
        setOutput('Some test cases failed. Check your solution.')
        toast.error('Some tests failed. Keep trying!')
      }
      
    } catch (error) {
      setOutput('Error running code: ' + error)
      toast.error('Error running code')
    } finally {
      setIsRunning(false)
    }
  }

  const resetCode = () => {
    setCode(problem.starterCode)
    setOutput('')
    setTestResults([])
    setAllTestsPassed(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500'
      case 'Medium': return 'text-yellow-500'
      case 'Hard': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Problem Description */}
      <MagicalCard variant="magical" className="h-fit">
        <MagicalCardHeader>
          <div className="flex items-center justify-between">
            <MagicalCardTitle className="text-magic-gold">
              {problem.id}. {problem.title}
            </MagicalCardTitle>
            <span className={`font-body font-semibold ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
          </div>
        </MagicalCardHeader>
        <MagicalCardContent className="space-y-6">
          <div className="prose prose-invert max-w-none">
            <div className="font-body text-foreground whitespace-pre-line">
              {problem.description}
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-magic-blue">Examples:</h4>
            {problem.examples.map((example, index) => (
              <div key={index} className="bg-background/50 rounded-lg p-4 border border-border">
                <div className="font-mono text-sm space-y-2">
                  <div><span className="text-magic-gold">Input:</span> {example.input}</div>
                  <div><span className="text-magic-blue">Output:</span> {example.output}</div>
                  {example.explanation && (
                    <div><span className="text-magic-purple">Explanation:</span> {example.explanation}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </MagicalCardContent>
      </MagicalCard>

      {/* Code Editor */}
      <MagicalCard variant="floating" className="h-fit">
        <MagicalCardHeader>
          <div className="flex items-center justify-between">
            <MagicalCardTitle className="text-magic-blue">Code Editor</MagicalCardTitle>
            <div className="flex gap-2">
              <MagicalButton
                variant="nav"
                size="sm"
                onClick={resetCode}
                disabled={isRunning}
              >
                <RotateCcw className="w-4 h-4" />
              </MagicalButton>
              <MagicalButton
                variant="code"
                size="sm"
                onClick={runCode}
                disabled={isRunning}
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Running...' : 'Run Code'}
              </MagicalButton>
            </div>
          </div>
        </MagicalCardHeader>
        <MagicalCardContent className="space-y-4">
          {/* Code textarea */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full min-h-[300px] p-4 font-mono text-sm bg-slate-900 text-slate-100 border border-slate-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-magic-blue"
              placeholder="Write your solution here..."
              spellCheck={false}
            />
          </div>

          {/* Output */}
          {output && (
            <div className="space-y-3">
              <h5 className="font-display font-semibold text-magic-gold">Output:</h5>
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <pre className="font-mono text-sm text-slate-100 whitespace-pre-wrap">{output}</pre>
              </div>
            </div>
          )}

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="space-y-3">
              <h5 className="font-display font-semibold text-magic-gold">Test Results:</h5>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-lg border ${
                    result.passed 
                      ? 'bg-green-900/20 border-green-700 text-green-100' 
                      : 'bg-red-900/20 border-red-700 text-red-100'
                  }`}>
                    {result.passed ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <div className="font-mono text-sm flex-1">
                      <div>Input: {result.input}</div>
                      <div>Expected: {result.expected}</div>
                      {!result.passed && <div>Got: {result.actual}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {allTestsPassed && (
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="font-display font-semibold text-green-100">
                Congratulations! All tests passed! 🎉
              </p>
            </div>
          )}
        </MagicalCardContent>
      </MagicalCard>
    </div>
  )
}

export default CodeEditor