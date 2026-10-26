import type { Problem } from '../types/exam';

export const SAMPLE_PROBLEMS: Problem[] = [
  {
    id: 'prob-prime-01',
    title: 'Prime Number Verification',
    difficulty: 'Easy',
    points: 20,
    category: 'Number Theory',
    description:
      'Write a function named `is_prime(n)` that accepts a positive integer `n` and returns `True` if `n` is a prime number, and `False` otherwise.\n\nA prime number is a natural number greater than 1 whose only divisors are 1 and itself.',
    constraints: [
      '1 <= n <= 10^6',
      'The function must return a boolean value (True / False)',
      'Time complexity is expected to be optimal (O(sqrt(N)))',
    ],
    starterCode: `def is_prime(n):
    # Implement prime check logic below
    if n <= 1:
        return False
        
    for i in range(2, n):
        if n % i == 0:
            return False
            
    return True

# Sample execution
print(is_prime(7))
`,
    sampleTestCases: [
      { id: 'tc-1', input: 'n = 7', expectedOutput: 'True' },
      { id: 'tc-2', input: 'n = 1', expectedOutput: 'False' },
      { id: 'tc-3', input: 'n = 12', expectedOutput: 'False' },
    ],
  },
  {
    id: 'prob-twosum-02',
    title: 'Two Sum: Target Pair Index',
    difficulty: 'Easy',
    points: 25,
    category: 'Arrays & Hash Maps',
    description:
      'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input has exactly one solution, and you may not use the same element twice. Return the indices as a list `[index1, index2]`.',
    constraints: [
      '2 <= len(nums) <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Exactly one valid answer exists.',
    ],
    starterCode: `def two_sum(nums, target):
    # Implement two sum lookup
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Sample execution
print(two_sum([2, 7, 11, 15], 9))
`,
    sampleTestCases: [
      { id: 'tc-1', input: 'nums = [2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]' },
      { id: 'tc-2', input: 'nums = [3, 2, 4], target = 6', expectedOutput: '[1, 2]' },
      { id: 'tc-3', input: 'nums = [3, 3], target = 6', expectedOutput: '[0, 1]' },
    ],
  },
  {
    id: 'prob-parentheses-03',
    title: 'Valid Parentheses Sequence',
    difficulty: 'Medium',
    points: 30,
    category: 'Stack & Parsing',
    description:
      'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if open brackets are closed by the same type of brackets and closed in the correct order.',
    constraints: [
      '1 <= len(s) <= 10^4',
      's consists of parentheses only: ()[]{}',
    ],
    starterCode: `def is_valid_brackets(s):
    # Implement stack bracket matching logic
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in pairs.values():
            stack.append(char)
        elif char in pairs:
            if not stack or stack.pop() != pairs[char]:
                return False
                
    return len(stack) == 0

# Sample execution
print(is_valid_brackets("()[]{}"))
`,
    sampleTestCases: [
      { id: 'tc-1', input: 's = "()[]{}"', expectedOutput: 'True' },
      { id: 'tc-2', input: 's = "(]"', expectedOutput: 'False' },
      { id: 'tc-3', input: 's = "{[]}"', expectedOutput: 'True' },
    ],
  },
  {
    id: 'prob-palindrome-04',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    points: 35,
    category: 'Dynamic Programming',
    description:
      'Given a string `s`, return the longest palindromic substring in `s`.\n\nA string is palindromic if it reads the same forward and backward.',
    constraints: [
      '1 <= len(s) <= 1000',
      's consist of only digits and English letters.',
    ],
    starterCode: `def longest_palindrome(s):
    # Implement longest palindrome search
    if not s:
        return ""
        
    start, max_len = 0, 1
    for i in range(len(s)):
        # Odd-length check
        l, r = i, i
        while l >= 0 and r < len(s) and s[l] == s[r]:
            if r - l + 1 > max_len:
                start = l
                max_len = r - l + 1
            l -= 1
            r += 1
            
    return s[start:start + max_len]

# Sample execution
print(longest_palindrome("babad"))
`,
    sampleTestCases: [
      { id: 'tc-1', input: 's = "babad"', expectedOutput: '"bab" or "aba"' },
      { id: 'tc-2', input: 's = "cbbd"', expectedOutput: '"bb"' },
      { id: 'tc-3', input: 's = "a"', expectedOutput: '"a"' },
    ],
  },
];

export const SAMPLE_PROBLEM: Problem = SAMPLE_PROBLEMS[0];
