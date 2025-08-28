import magicalCodingRoomBg from '@/assets/magical-coding-room.jpg'
import CodeEditor from '@/components/CodeEditor'
import Navigation from '@/components/Navigation'
import { Input } from '@/components/ui/input'
import { MagicalButton } from '@/components/ui/magical-button'
import { MagicalCard, MagicalCardContent, MagicalCardHeader, MagicalCardTitle } from '@/components/ui/magical-card'
import { MagicalTimer } from '@/components/ui/magical-timer'
import { ArrowRight, CheckCircle, Code, Key } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface CodeSnippets {
  python: string;
  javascript: string;
  java: string;
}

type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
  generateInput?: () => string;
}

interface CodingProblem {
  id: number;
  title: string;
  difficulty: Difficulty;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  testCases: TestCase[];
  hiddenTestCases?: TestCase[];
  starterCode: CodeSnippets;
  solution: CodeSnippets;
  functionName: string;
  parameters: Array<{ name: string; type: string }>;
  returnType: string;
  dataset: string;
}

const Challenge2 = () => {
  const navigate = useNavigate()
  const [currentProblem, setCurrentProblem] = useState<number | null>(null)
  const [keyword, setKeyword] = useState('')
  const [solvedProblems, setSolvedProblems] = useState<Set<number>>(new Set())
  const [allProblemsUnlocked, setAllProblemsUnlocked] = useState(false)
  const [runeGateOpen, setRuneGateOpen] = useState(false)

  const problems: CodingProblem[] = [
    {
      id: 1,
      title: "Best Time to Buy and Sell Stock",
      difficulty: "Easy",
      description: `You are given an array prices where prices[i] is the price of a given stock on the i-th day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.`,
      examples: [
        {
          input: "prices = [7,1,5,3,6,4]",
          output: "5",
          explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5."
        },
        {
          input: "prices = [7,6,4,3,1]",
          output: "0",
          explanation: "In this case, no transactions are done and the max profit = 0."
        }
      ],
      testCases: [
        // Basic test cases
        { input: "[7,1,5,3,6,4]", expectedOutput: "5" },
        { input: "[7,6,4,3,1]", expectedOutput: "0" },
        // Hidden test cases
        { input: "[5]", expectedOutput: "0" },  // Single element array
        { input: "[2,1]", expectedOutput: "0" },  // Two elements, no profit
        { input: "[1,2]", expectedOutput: "1" },  // Two elements, small profit
        { input: "[3,3,3,3,3]", expectedOutput: "0" },  // All same prices
        { input: "[1,100,1]", expectedOutput: "99" },  // Single peak and valley
        { input: "[1,2,1,2,1,2]", expectedOutput: "1" },  // Alternating prices
        { input: "[5,5,5,100,5,5,5]", expectedOutput: "95" },  // Long plateau with one spike
        { input: "[10000,0,10000,0,10000]", expectedOutput: "10000" }  // Prices at maximum value
      ],
      hiddenTestCases: [
        // Large input test cases
        { 
          input: "[10000, 9999, 9998, ...]",
          description: "Large array with strictly decreasing prices",
          expectedOutput: "0"
        },
        { 
          input: "[1, 2, 3, ...]",
          description: "Large array with strictly increasing prices",
          expectedOutput: "99999"
        }
      ],
      starterCode: {
        python: `class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        # Write your solution here
        pass`,
        javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    // Write your solution here
};`,
        java: `class Solution {
    public int maxProfit(int[] prices) {
        // Write your solution here
    }
}`
      },
      solution: {
        python: `class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        if not prices:
            return 0
        min_price = prices[0]
        max_profit = 0
        for price in prices:
            if price < min_price:
                min_price = price
            elif price - min_price > max_profit:
                max_profit = price - min_price
        return max_profit`,
        javascript: `const maxProfit = function(prices) {
    if (prices.length === 0) {
        return 0;
    }
    let minPrice = prices[0];
    let maxProfit = 0;
    for (let price of prices) {
        if (price < minPrice) {
            minPrice = price;
        } else if (price - minPrice > maxProfit) {
            maxProfit = price - minPrice;
        }
    }
    return maxProfit;
};`,
        java: `class Solution {
    public int maxProfit(int[] prices) {
        if (prices.length == 0) {
            return 0;
        }
        int minPrice = prices[0];
        int maxProfit = 0;
        for (int price : prices) {
            if (price < minPrice) {
                minPrice = price;
            } else if (price - minPrice > maxProfit) {
                maxProfit = price - minPrice;
            }
        }
        return maxProfit;
    }
}`
      },
      functionName: "maxProfit",
      parameters: [
        { name: "prices", type: "number[]" }
      ],
      returnType: "number",
      dataset: "Training Dataset: magical_stocks.csv"
    },
    {
      id: 2,
      title: "Valid Parentheses",
      difficulty: "Easy",
      description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
      examples: [
        {
          input: 's = "()"',
          output: "true"
        },
        {
          input: 's = "()[]{}"',
          output: "true"
        },
        {
          input: 's = "(]"',
          output: "false"
        }
      ],
      testCases: [
        { input: '"()"', expectedOutput: "true" },
        { input: '"()[]{}"', expectedOutput: "true" },
        { input: '"(]"', expectedOutput: "false" },
        { input: '"([)]"', expectedOutput: "false" }
      ],
      starterCode: {
        python: `class Solution:
    def isValid(self, s: str) -> bool:
        # Write your solution here
        pass`,
        javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    // Write your solution here
};`,
        java: `class Solution {
    public boolean isValid(String s) {
        // Write your solution here
    }
}`
      },
      solution: {
        python: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {")": "(", "}": "{", "]": "["}
        for char in s:
            if char in mapping:
                top_element = stack.pop() if stack else '#'
                if mapping[char] != top_element:
                    return False
            else:
                stack.append(char)
        return not stack`,
        javascript: `const isValid = function(s) {
    const stack = [];
    const mapping = { ")": "(", "}": "{", "]": "[" };
    for (let char of s) {
        if (char in mapping) {
            const topElement = stack.length ? stack.pop() : '#';
            if (mapping[char] !== topElement) {
                return false;
            }
        } else {
            stack.push(char);
        }
    }
    return stack.length === 0;
};`,
        java: `class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        Map<Character, Character> mapping = new HashMap<>();
        mapping.put(')', '(');
        mapping.put('}', '{');
        mapping.put(']', '[');
        
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (mapping.containsKey(c)) {
                char topElement = stack.isEmpty() ? '#' : stack.pop();
                if (topElement != mapping.get(c)) {
                    return false;
                }
            } else {
                stack.push(c);
            }
        }
        return stack.isEmpty();
    }
}`
      },
      functionName: "isValid",
      parameters: [
        { name: "s", type: "string" }
      ],
      returnType: "boolean",
      dataset: "Validation Dataset: magical_strings.csv"
    },
    {
      id: 3,
      title: "Binary Tree Inorder Traversal",
      difficulty: "Medium",
      description: `Given the root of a binary tree, return the inorder traversal of its nodes' values.

Follow up: Recursive solution is trivial, could you do it iteratively?`,
      examples: [
        {
          input: "root = [1,null,2,3]",
          output: "[1,3,2]"
        },
        {
          input: "root = []",
          output: "[]"
        },
        {
          input: "root = [1]", 
          output: "[1]"
        }
      ],
      testCases: [
        { input: "[1,null,2,3]", expectedOutput: "[1,3,2]" },
        { input: "[]", expectedOutput: "[]" },
        { input: "[1]", expectedOutput: "[1]" }
      ],
      starterCode: {
        python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        # Write your solution here
        pass`,
        javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function(root) {
    // Write your solution here
};`,
        java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        // Write your solution here
    }
}`
      },
      solution: {
        python: `class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        result = []
        stack = []
        current = root
        while current or stack:
            while current:
                stack.append(current)
                current = current.left
            current = stack.pop()
            result.append(current.val)
            current = current.right
        return result`,
        javascript: `const inorderTraversal = function(root) {
    const result = [];
    const stack = [];
    let current = root;
    
    while (current || stack.length) {
        while (current) {
            stack.push(current);
            current = current.left;
        }
        current = stack.pop();
        result.push(current.val);
        current = current.right;
    }
    
    return result;
};`,
        java: `class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        Stack<TreeNode> stack = new Stack<>();
        TreeNode current = root;
        
        while (current != null || !stack.isEmpty()) {
            while (current != null) {
                stack.push(current);
                current = current.left;
            }
            current = stack.pop();
            result.add(current.val);
            current = current.right;
        }
        
        return result;
    }
}`
      },
      functionName: "inorderTraversal",
      parameters: [
        { name: "root", type: "TreeNode" }
      ],
      returnType: "number[]",
      dataset: "Test Dataset: magical_trees.csv"
    }
  ]

  const handleProblemSolved = (problemId: number) => {
    const newSolved = new Set(solvedProblems)
    newSolved.add(problemId)
    setSolvedProblems(newSolved)
    
    if (newSolved.size === problems.length) {
      setAllProblemsUnlocked(true)
      setCurrentProblem(null)
      toast.success("All coding challenges completed! The Rune Gate appears...")
    } else {
      toast.success(`Problem ${problemId} solved! Dataset unlocked!`)
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

  // If viewing a specific problem
  if (currentProblem !== null) {
    const problem = problems.find(p => p.id === currentProblem)
    if (!problem) {
      setCurrentProblem(null)
      return null
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
        <div className="absolute inset-0 bg-black/80" />
        <Navigation />
        
        <div className="absolute top-6 right-6 z-20">
          <MagicalTimer minutes={45} onTimeUp={handleTimeUp} />
        </div>

        <div className="relative z-10 container mx-auto p-8 pt-20">
          <div className="flex items-center gap-4 mb-6">
            <MagicalButton
              variant="nav"
              onClick={() => setCurrentProblem(null)}
            >
              ← Back to Problems
            </MagicalButton>
            <h1 className="text-3xl font-display font-bold text-magic-gold">
              Coding Challenge {problem.id}
            </h1>
          </div>

          <CodeEditor
            problem={problem}
            onSolved={() => handleProblemSolved(problem.id)}
          />
        </div>
      </div>
    )
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
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 magical-particles" />
      <Navigation />

      <div className="absolute top-6 right-6 z-20">
        <MagicalTimer minutes={45} onTimeUp={handleTimeUp} />
      </div>

      <div className="relative z-10 container mx-auto p-8 pt-20 min-h-screen flex flex-col">
        <div className="text-center mb-8 animate-magical-fade">
          <h1 className="text-5xl font-display font-black text-magic-gold mb-4">
            Magical Coding Chamber
          </h1>
          <p className="text-xl font-body text-magic-blue">
            Solve LeetCode-style challenges to unlock the ancient datasets
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {problems.map((problem) => {
            const isSolved = solvedProblems.has(problem.id)
            const getDifficultyColor = (difficulty: string) => {
              switch (difficulty) {
                case 'Easy': return 'text-green-400'
                case 'Medium': return 'text-yellow-400'
                case 'Hard': return 'text-red-400'
                default: return 'text-gray-400'
              }
            }

            return (
              <MagicalCard
                key={problem.id}
                variant={isSolved ? "floating" : "magical"}
                className={`transition-all duration-500 cursor-pointer hover:scale-105 ${
                  isSolved ? 'gold-glow ' : ''
                }`}
                onClick={() => !isSolved && setCurrentProblem(problem.id)}
              >
                <MagicalCardHeader className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    {isSolved ? (
                      <CheckCircle className="w-8 h-8 text-magic-gold animate-pulse" />
                    ) : (
                      <Code className="w-8 h-8 text-magic-blue" />
                    )}
                  </div>
                  <MagicalCardTitle className="text-magic-gold text-lg">
                    {problem.id}. {problem.title}
                  </MagicalCardTitle>
                  <div className={`font-body font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </div>
                </MagicalCardHeader>
                <MagicalCardContent className="space-y-4">
                  {isSolved ? (
                    <div className="text-center space-y-4 animate-scroll-reveal">
                      <div className="p-4 bg-magic-gold/20 rounded-lg border border-magic-gold">
                        <p className="font-body font-semibold text-magic-gold">
                          {problem.dataset}
                        </p>
                      </div>
                      <p className="text-green-400 font-body font-semibold">
                        ✅ Solved!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <p className="font-body text-slate-200 text-sm line-clamp-3">
                          {problem.description}
                        </p>
                      </div>
                      <MagicalButton
                        variant="code"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentProblem(problem.id)
                        }}
                      >
                        Start Challenge
                      </MagicalButton>
                    </div>
                  )}
                </MagicalCardContent>
              </MagicalCard>
            )
          })}
        </div>

        {allProblemsUnlocked && (
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
                <p className="text-center font-body text-foreground">
                  Enter the secret keyword to unlock the final challenge
                </p>
                
                {!runeGateOpen && (
                  <div className="space-y-4">
                    <Input
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="Enter the keyword from Dumbledore..."
                      className="text-center font-body text-lg"
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
                    <p className="text-magic-gold font-body font-bold text-xl">
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

export default Challenge2