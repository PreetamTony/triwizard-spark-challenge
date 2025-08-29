import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle, XCircle, Code as CodeIcon, Loader2 } from 'lucide-react';
import { MagicalButton } from './ui/magical-button';
import { MagicalCard, MagicalCardContent, MagicalCardHeader, MagicalCardTitle } from './ui/magical-card';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { executeWithGroq } from '@/lib/groq';

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
  // State management
  const [language, setLanguage] = useState<Language>('python');
  const [code, setCode] = useState(problem.starterCode.python);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
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

  const executeCode = async (userCode: string, testCase: string, codeLanguage: Language): Promise<string> => {
    setIsExecuting(true);
    try {
      // First try to validate the test case
      try {
        JSON.parse(testCase); // Validate JSON without storing
      } catch (e) {
        throw new Error(`Invalid test case format: ${testCase}. Expected valid JSON.`);
      }

      // Use Groq API for code execution
      const { result, error } = await executeWithGroq(
        userCode,
        codeLanguage,
        testCase,
        problem.functionName
      );

      if (error) {
        throw new Error(error);
      }

      return result || 'No output';
    } catch (error) {
      console.error('Code execution error:', error);
      return `Error: ${error instanceof Error ? error.message : String(error)}`;
    } finally {
      setIsExecuting(false);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running tests...\n');
    setTestResults([]);
    
    try {
      const results = [];
      let allPassed = true;
      let executionTime = Date.now();

      // Execute each test case
      for (let i = 0; i < problem.testCases.length; i++) {
        const testCase = problem.testCases[i];
        
        // Update UI to show current test being executed
        setOutput(`Running test case ${i + 1}/${problem.testCases.length}...`);
        
        try {
          const startTime = performance.now();
          const actual = await executeCode(code, testCase.input, language);
          const executionTimeMs = (performance.now() - startTime).toFixed(2);
          
          // Normalize the actual and expected outputs for comparison
          const normalizeOutput = (output: string) => {
            try {
              // Try to parse as JSON and re-stringify to handle formatting differences
              const parsed = JSON.parse(output);
              return JSON.stringify(parsed);
            } catch {
              // If not valid JSON, trim whitespace and convert to string
              return String(output).trim();
            }
          };
          
          const normalizedActual = normalizeOutput(actual);
          const normalizedExpected = normalizeOutput(testCase.expectedOutput);
          
          const passed = normalizedActual === normalizedExpected;
          if (!passed) allPassed = false;
          
          results.push({
            passed,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: actual || 'undefined',
            executionTime: executionTimeMs,
            isHidden: (testCase as any).isHidden || false
          });
          
          // Update test results after each test case
          setTestResults([...results]);
          
        } catch (error) {
          console.error(`Error in test case ${i + 1}:`, error);
          results.push({
            passed: false,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: `Error: ${(error as Error).message}`,
            executionTime: 0,
            isHidden: (testCase as any).isHidden || false
          });
          allPassed = false;
          setTestResults([...results]);
        }
      }
      
      // Calculate total execution time
      executionTime = Date.now() - executionTime;
      
      // Update final state
      setTestResults(results);
      setAllTestsPassed(allPassed);
      
      // Prepare summary
      const passedCount = results.filter(r => r.passed).length;
      const totalTests = results.length;
      const successRate = Math.round((passedCount / totalTests) * 100);
      
      let outputMessage = `Test Results (${executionTime}ms):\n`;
      outputMessage += `✅ ${passedCount} passed • ❌ ${totalTests - passedCount} failed • ${successRate}% success\n\n`;
      
      // Add details for failed tests
      const failedTests = results.filter(r => !r.passed && !(r as any).isHidden);
      if (failedTests.length > 0) {
        outputMessage += `Failed Test Cases:\n`;
        failedTests.forEach((test, index) => {
          outputMessage += `\nTest #${index + 1} (${test.executionTime}ms):\n`;
          outputMessage += `Input: ${test.input}\n`;
          outputMessage += `Expected: ${test.expected}\n`;
          outputMessage += `Actual:   ${test.actual}\n`;
        });
      }
      
      setOutput(outputMessage);
      
      if (allPassed) {
        toast.success(`All ${totalTests} test cases passed! 🎉`);
        onSolved();
      } else {
        toast.error(`${totalTests - passedCount} test(s) failed. Keep trying!`);
      }
      
    } catch (error) {
      console.error('Error running tests:', error);
      setOutput(`Error running tests: ${(error as Error).message}\n\nPlease check your code for syntax errors.`);
      toast.error('Error running tests');
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

  // Render test case result item
  const renderTestCaseResult = (test: any, index: number) => (
    <div key={index} className={`p-3 rounded-lg border ${test.passed ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {test.passed ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500" />
          )}
          <span className="font-mono text-sm">Test Case {index + 1}</span>
        </div>
        <span className="text-xs text-muted-foreground">{test.executionTime}ms</span>
      </div>
      
      {!test.passed && (
        <div className="mt-2 space-y-1 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs text-muted-foreground">Input:</div>
              <div className="font-mono bg-background/50 p-1.5 rounded text-xs overflow-x-auto">
                {test.input}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Expected:</div>
              <div className="font-mono bg-background/50 p-1.5 rounded text-xs text-green-400">
                {test.expected}
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Actual:</div>
            <div className="font-mono bg-background/50 p-1.5 rounded text-xs text-red-400">
              {test.actual}
            </div>
          </div>
        </div>
      )}
    </div>
  );

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

      {/* Code Editor and Results */}
      <div className="flex flex-col space-y-4 h-full">
        <div className="relative flex-1 bg-background rounded-lg border border-border overflow-hidden">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-full font-mono text-sm bg-background text-foreground p-4 focus:outline-none resize-none"
            spellCheck="false"
            style={{ tabSize: 4 }}
          />
          <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
            {language.toUpperCase()}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-semibold">
              Test Results
              {testResults.length > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({testResults.filter(t => t.passed).length}/{testResults.length} passed)
                </span>
              )}
            </h4>
            {allTestsPassed && testResults.length > 0 && (
              <div className="flex items-center text-green-500 text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                All tests passed!
              </div>
            )}
          </div>
          
          <div className="bg-background/50 rounded-lg p-4 font-mono text-sm h-64 overflow-auto">
            {testResults.length > 0 ? (
              <div className="space-y-2">
                <div className="text-sm mb-2">
                  {output && <div className="mb-2 text-foreground/80">{output}</div>}
                  <div className="flex items-center space-x-2">
                    <div className="h-2 flex-1 bg-green-900/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{
                          width: `${(testResults.filter(t => t.passed).length / testResults.length) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {testResults.filter(t => t.passed).length}/{testResults.length} passed
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {testResults.map((test, index) => renderTestCaseResult(test, index))}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Run your code to see test results...
              </div>
            )}
          </div>
          
          {allTestsPassed && testResults.length > 0 && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="font-display font-semibold text-green-100">
                Congratulations! All tests passed! 🎉
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;