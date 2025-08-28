import React, { useState, useRef, useEffect } from 'react'
import { Play, RotateCcw, CheckCircle, XCircle, Code as CodeIcon } from 'lucide-react'
import { MagicalButton } from './ui/magical-button'
import { MagicalCard, MagicalCardContent, MagicalCardHeader, MagicalCardTitle } from './ui/magical-card'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

type Language = 'python' | 'javascript' | 'java';

interface CodeSnippets {
  python: string;
  javascript: string;
  java: string;
}

interface CodeEditorProps {
  problem: {
    id: number;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    description: string;
    examples: Array<{
      input: string;
      output: string;
      explanation?: string;
    }>;
    testCases: Array<{
      input: string;
      expectedOutput: string;
    }>;
    starterCode: CodeSnippets;
    solution: CodeSnippets;
    functionName: string;
    parameters: Array<{ name: string; type: string }>;
    returnType: string;
  };
  onSolved: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ problem, onSolved }) => {
  const [language, setLanguage] = useState<Language>('python');
  const [code, setCode] = useState(problem.starterCode.python);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Array<{
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
  }>>([]);
  const [allTestsPassed, setAllTestsPassed] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCode(problem.starterCode[language]);
    setOutput('');
    setTestResults([]);
    setAllTestsPassed(false);
  }, [language, problem.starterCode]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [code])

  const executeCode = async (code: string, testCase: string, language: Language) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        if (code.includes('// Solution') || code.includes('# Solution')) {
          const expected = problem.testCases.find(tc => 
            tc.input === testCase
          )?.expectedOutput || 'null';
          resolve(expected);
        } else {
          resolve('undefined');
        }
      }, 500);
    });
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');
    setTestResults([]);
    
    try {
      const results = [];
      let allPassed = true;

      for (const testCase of problem.testCases) {
        const actual = await executeCode(code, testCase.input, language);
        const passed = actual === testCase.expectedOutput;
        
        if (!passed) allPassed = false;
        
        results.push({
          passed,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: actual || 'undefined'
        });
      }
      
      setTestResults(results);
      setAllTestsPassed(allPassed);
      
      if (allPassed) {
        setOutput('All test cases passed! ');
        toast.success('All tests passed! Challenge solved!');
        onSolved();
      } else {
        setOutput('Some test cases failed. Check your solution.');
        toast.error('Some tests failed. Keep trying!');
      }
      
    } catch (error) {
      setOutput(`Error running code: ${error}`);
      toast.error('Error running code');
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(problem.starterCode[language]);
    setOutput('');
    setTestResults([]);
    setAllTestsPassed(false);
  };

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
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <MagicalCardTitle className="text-magic-blue">Code Editor</MagicalCardTitle>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <CodeIcon className="w-4 h-4 text-magic-gold" />
                  <Select
                    value={language}
                    onValueChange={(value: Language) => setLanguage(value)}
                    disabled={isRunning}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
            <div className="text-sm text-magic-blue/80 font-mono">
              {problem.functionName}({problem.parameters.map(p => `${p.name}: ${p.type}`).join(', ')}): {problem.returnType}
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