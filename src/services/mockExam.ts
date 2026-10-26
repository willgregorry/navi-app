import type { Problem } from '../types/exam';
import type { SocraticHint } from '../types/hint';

export const SAMPLE_PROBLEM: Problem = {
  id: 'prob-prime-01',
  title: 'Prime Number Verification',
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
        
    for i in range(2, n)
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
};

/**
 * Local evaluator for instant hackathon demo feedback
 */
export function analyzeCodeLocally(code: string): {
  isSuccess: boolean;
  stdout: string;
  stderr: string;
  hints: SocraticHint[];
} {
  const hints: SocraticHint[] = [];

  // 1. Check for missing colon after control block
  const lines = code.split('\n');
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (
      (trimmed.startsWith('for ') || trimmed.startsWith('if ') || trimmed.startsWith('while ') || trimmed.startsWith('def ')) &&
      !trimmed.endsWith(':') &&
      !trimmed.endsWith('{')
    ) {
      hints.push({
        id: `syntax-colon-${index}`,
        type: 'syntax',
        line: index + 1,
        title: 'Block Statement Delimiter Missing',
        question: `Take a look at line ${index + 1} (${trimmed}). In Python syntax, what character is mandatory at the end of a loop, conditional, or function header?`,
        conceptHint: 'Every compound statement header (for/if/while/def) in Python must terminate with a colon (:).',
      });
    }
  });

  if (hints.length > 0) {
    return {
      isSuccess: false,
      stdout: '',
      stderr: `  File "solution.py", line ${hints[0].line}\n    ${lines[(hints[0].line || 1) - 1]}\n          ^\nSyntaxError: expected ':'`,
      hints,
    };
  }

  // 2. Check logic: e.g. using range(2, n) instead of range(2, int(n**0.5) + 1)
  if (code.includes('range(2, n)')) {
    hints.push({
      id: 'logic-efficiency',
      type: 'logic',
      line: 6,
      title: 'Divisor Search Range Optimization',
      question:
        'Your logic is functional, but do we truly need to test divisors all the way up to n - 1? What is the theoretical upper bound for the smallest non-trivial divisor of n?',
      conceptHint: 'Non-trivial factors always appear in complementary pairs and never exceed the square root of n (int(n**0.5) + 1).',
    });
  }

  return {
    isSuccess: true,
    stdout: 'True\nAll sample test cases passed! (3/3)',
    stderr: '',
    hints,
  };
}
