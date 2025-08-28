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

interface CodingProblem {
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
      title: "Two Sum",
      difficulty: "Easy",
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
        },
        {
          input: "nums = [3,2,4], target = 6", 
          output: "[1,2]"
        }
      ],
      testCases: [
        { input: "[2,7,11,15], 9", expectedOutput: "[0,1]" },
        { input: "[3,2,4], 6", expectedOutput: "[1,2]" },
        { input: "[3,3], 6", expectedOutput: "[0,1]" }
      ],
      starterCode: {
        python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your solution here
        pass`,
        javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your solution here
};`,
        java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
    }
}`
      },
      solution: {
        python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, num in enumerate(nums):
            if target - num in seen:
                return [seen[target - num], i]
            seen[num] = i
        return []`,
        javascript: `const twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
};`,
        java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        throw new IllegalArgumentException("No two sum solution");
    }
}`
      },
      functionName: "twoSum",
      parameters: [
        { name: "nums", type: "number[]" },
        { name: "target", type: "number" }
      ],
      returnType: "number[]",
      dataset: "Training Dataset: magical_arrays.csv"
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