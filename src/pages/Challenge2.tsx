import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Code, CheckCircle, Lock, Unlock, Key, ArrowRight } from 'lucide-react'
import { MagicalButton } from '@/components/ui/magical-button'
import { MagicalCard, MagicalCardContent, MagicalCardHeader, MagicalCardTitle } from '@/components/ui/magical-card'
import { MagicalTimer } from '@/components/ui/magical-timer'
import { Input } from '@/components/ui/input'
import CodeEditor from '@/components/CodeEditor'
import Navigation from '@/components/Navigation'
import { toast } from 'sonner'
import magicalCodingRoomBg from '@/assets/magical-coding-room.jpg'

interface CodingProblem {
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
  dataset: string
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
      starterCode: `def twoSum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # Write your solution here
    pass`,
      solution: `def twoSum(nums, target):
    hashmap = {}
    for i, num in enumerate(nums):
        if target - num in hashmap:
            return [hashmap[target - num], i]
        hashmap[num] = i
    return []`,
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
      starterCode: `def isValid(s):
    """
    :type s: str
    :rtype: bool
    """
    # Write your solution here
    pass`,
      solution: `def isValid(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            stack.append(char)
    return not stack`,
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
      starterCode: `# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorderTraversal(root):
    """
    :type root: TreeNode
    :rtype: List[int]
    """
    # Write your solution here
    pass`,
      solution: `def inorderTraversal(root):
    result = []
    stack = []
    current = root
    while stack or current:
        while current:
            stack.append(current)
            current = current.left
        current = stack.pop()
        result.append(current.val)
        current = current.right
    return result`,
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
                  isSolved ? 'gold-glow animate-float' : ''
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