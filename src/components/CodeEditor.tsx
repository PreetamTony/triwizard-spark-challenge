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

  // Handle tab key in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 4;
          textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  const executeCode = async (code: string, testCase: string, language: Language) => {
    return new Promise<string>((resolve) => {
      try {
        const inputArray = JSON.parse(testCase);
        let result: string;

        // Create a function from the user's code
        const func = new Function('prices', {
          [language === 'python' ? 'python' : 'javascript']: `
            ${language === 'python' ? code.replace('class Solution:', '').replace('def maxProfit', 'function maxProfit') : code}
            return maxProfit(${testCase});
          `
        }[language === 'python' ? 'python' : 'javascript']);

        // Execute the function with the test case
        const output = func(inputArray);
        result = typeof output === 'number' ? output.toString() : 'undefined';
        
        resolve(result);
      } catch (error) {
        console.error('Execution error:', error);
        resolve('Error: ' + (error as Error).message);
      }
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[600px]">
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
      <MagicalCard variant="magical" className="h-full flex flex-col shadow-lg">
        <MagicalCardHeader className="pb-2">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <MagicalCardTitle className="text-xl text-magic-gold">
                Code Editor
              </MagicalCardTitle>
              <div className="flex items-center space-x-4">
                <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                  <SelectTrigger className="w-[140px] bg-magic-darker border-magic-blue/40 hover:border-magic-blue/60 transition-colors">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent className="bg-magic-darker border-magic-blue/40">
                    <SelectItem value="python" className="hover:bg-magic-dark/50">Python</SelectItem>
                    <SelectItem value="javascript" className="hover:bg-magic-dark/50">JavaScript</SelectItem>
                    <SelectItem value="java" className="hover:bg-magic-dark/50">Java</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex space-x-3">
                  <MagicalButton
                    variant="magical"
                    size="sm"
                    onClick={runCode}
                    disabled={isRunning}
                    className="px-5 h-9 text-sm font-medium hover:scale-105 transition-transform"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isRunning ? 'Running...' : 'Run Code'}
                  </MagicalButton>
                  <MagicalButton
                    variant="secondary"
                    size="sm"
                    onClick={resetCode}
                    className="px-4 h-9 text-sm font-medium border-magic-blue/20 hover:border-magic-blue/40"
                  >
                    <RotateCcw className="w-4 h-4 mr-1.5" />
                    Reset
                  </MagicalButton>
                </div>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-magic-blue/20 to-transparent w-full"></div>
          </div>
        </MagicalCardHeader>
        <MagicalCardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          {/* Code textarea */}
          <div className="flex-1 p-4 overflow-auto">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-full min-h-[400px] font-mono text-base leading-relaxed bg-transparent text-foreground resize-none focus:outline-none focus:ring-0"
              placeholder="// Write your solution here..."
              spellCheck="false"
              style={{
                lineHeight: '1.6',
                tabSize: 4,
              }}
            />
          </div>

          {/* Output */}
          <div className="border-t border-magic-blue/20 px-4 py-3 bg-magic-darker/30">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-display font-semibold text-magic-gold text-sm uppercase tracking-wider">Output</h5>
              {testResults.length > 0 && (
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  allTestsPassed ? 'bg-green-900/30 text-green-400' : 'bg-amber-900/30 text-amber-400'
                }`}>
                  {testResults.filter(t => t.passed).length} / {testResults.length} tests passed
                </span>
              )}
            </div>
            {output ? (
              <div className="bg-magic-darker/50 border border-magic-blue/20 rounded-lg p-4 max-h-48 overflow-y-auto">
                <pre className={`font-mono text-sm ${
                  allTestsPassed ? 'text-green-300' : 'text-slate-200'
                } whitespace-pre-wrap`}>
                  {output}
                </pre>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-magic-blue/60 text-sm">Run your code to see the output here</p>
              </div>
            )}
          </div>

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