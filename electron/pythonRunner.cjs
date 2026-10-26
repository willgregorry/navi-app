const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Executes Python code in a sandboxed subprocess and validates against test cases.
 * @param {string} code - The user's Python source code.
 * @param {string} problemId - Identifier for problem test harness.
 * @returns {Promise<{ stdout: string, stderr: string, exitCode: number, isSuccess: boolean, hints: Array }>}
 */
function runPythonCode(code, problemId = 'prob-prime-01') {
  return new Promise((resolve) => {
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `navi_exec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.py`);

    // Socratic hints collected from static analysis
    const hints = [];
    const lines = code.split('\n');

    // 1. Detect missing colon on control headers
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (
        (trimmed.startsWith('for ') || trimmed.startsWith('if ') || trimmed.startsWith('while ') || trimmed.startsWith('def ') || trimmed.startsWith('elif ')) &&
        !trimmed.endsWith(':') &&
        !trimmed.endsWith('{')
      ) {
        hints.push({
          id: `syntax-colon-${index}`,
          type: 'syntax',
          line: index + 1,
          title: 'Block Statement Delimiter Missing',
          question: `Take a look at line ${index + 1} ("${trimmed}"). In Python, which character is mandatory at the end of a header line to begin an indented block?`,
          conceptHint: 'Compound statements like if, for, while, and def must always terminate with a colon (:).',
        });
      }
    });

    // 2. Detect divisor range inefficiency
    if (code.includes('range(2, n)')) {
      hints.push({
        id: 'logic-efficiency',
        type: 'logic',
        line: lines.findIndex(l => l.includes('range(2, n)')) + 1 || 6,
        title: 'Divisor Search Range Optimization',
        question: 'Your logic is functional, but do we truly need to test divisors all the way up to n - 1? What is the theoretical upper bound for the smallest non-trivial divisor of n?',
        conceptHint: 'Non-trivial factors always appear in complementary pairs and never exceed the square root of n (int(n**0.5) + 1).',
      });
    }

    // Dynamic problem verification harness
    let testHarnessPython = '';
    if (problemId === 'prob-twosum-02') {
      testHarnessPython = `
if 'two_sum' in globals() and callable(globals()['two_sum']):
    _test_cases = [
        (([2, 7, 11, 15], 9), [0, 1]),
        (([3, 2, 4], 6), [1, 2]),
        (([3, 3], 6), [0, 1]),
    ]
    _passed = 0
    print("\\n[Test Results]")
    for _i, ((_nums, _target), _expected) in enumerate(_test_cases, 1):
        try:
            _actual = two_sum(_nums, _target)
            if list(_actual) == list(_expected):
                _passed += 1
                print(f"  [PASS] Case {_i}: two_sum({_nums}, {_target}) == {_expected}")
            else:
                print(f"  [FAIL] Case {_i}: two_sum({_nums}, {_target}) -> Got {_actual}, expected {_expected}")
        except Exception as _err:
            print(f"  [FAIL] Case {_i}: Exception: {_err}")
    if _passed == len(_test_cases):
        print(f"\\nAll sample test cases passed! ({_passed}/{len(_test_cases)})")
    else:
        print(f"\\nSample test cases passed: {_passed}/{len(_test_cases)}")
        sys.exit(2)
else:
    print("\\n[Test Diagnostics]\\nTarget function 'two_sum(nums, target)' is not defined in your code.")
    print("Sample test cases passed: 0/3")
    sys.exit(3)
`;
    } else if (problemId === 'prob-parentheses-03') {
      testHarnessPython = `
if 'is_valid_brackets' in globals() and callable(globals()['is_valid_brackets']):
    _test_cases = [
        ("()[]{}", True),
        ("(]", False),
        ("{[]}", True),
    ]
    _passed = 0
    print("\\n[Test Results]")
    for _i, (_inp, _expected) in enumerate(_test_cases, 1):
        try:
            _actual = is_valid_brackets(_inp)
            if _actual == _expected:
                _passed += 1
                print(f"  [PASS] Case {_i}: is_valid_brackets('{_inp}') == {_expected}")
            else:
                print(f"  [FAIL] Case {_i}: is_valid_brackets('{_inp}') -> Got {_actual}, expected {_expected}")
        except Exception as _err:
            print(f"  [FAIL] Case {_i}: Exception: {_err}")
    if _passed == len(_test_cases):
        print(f"\\nAll sample test cases passed! ({_passed}/{len(_test_cases)})")
    else:
        print(f"\\nSample test cases passed: {_passed}/{len(_test_cases)}")
        sys.exit(2)
else:
    print("\\n[Test Diagnostics]\\nTarget function 'is_valid_brackets(s)' is not defined in your code.")
    print("Sample test cases passed: 0/3")
    sys.exit(3)
`;
    } else if (problemId === 'prob-palindrome-04') {
      testHarnessPython = `
if 'longest_palindrome' in globals() and callable(globals()['longest_palindrome']):
    _test_cases = [
        ("babad", ["bab", "aba"]),
        ("cbbd", ["bb"]),
        ("a", ["a"]),
    ]
    _passed = 0
    print("\\n[Test Results]")
    for _i, (_inp, _expected) in enumerate(_test_cases, 1):
        try:
            _actual = longest_palindrome(_inp)
            if _actual in _expected:
                _passed += 1
                print(f"  [PASS] Case {_i}: longest_palindrome('{_inp}') == '{_actual}'")
            else:
                print(f"  [FAIL] Case {_i}: longest_palindrome('{_inp}') -> Got '{_actual}', expected '{_expected[0]}'")
        except Exception as _err:
            print(f"  [FAIL] Case {_i}: Exception: {_err}")
    if _passed == len(_test_cases):
        print(f"\\nAll sample test cases passed! ({_passed}/{len(_test_cases)})")
    else:
        print(f"\\nSample test cases passed: {_passed}/{len(_test_cases)}")
        sys.exit(2)
else:
    print("\\n[Test Diagnostics]\\nTarget function 'longest_palindrome(s)' is not defined in your code.")
    print("Sample test cases passed: 0/3")
    sys.exit(3)
`;
    } else {
      // Default: prob-prime-01
      testHarnessPython = `
if 'is_prime' in globals() and callable(globals()['is_prime']):
    _test_cases = [
        (7, True),
        (1, False),
        (12, False),
    ]
    _passed = 0
    print("\\n[Test Results]")
    for _i, (_inp, _expected) in enumerate(_test_cases, 1):
        try:
            _actual = is_prime(_inp)
            if _actual == _expected:
                _passed += 1
                print(f"  [PASS] Case {_i}: is_prime({_inp}) == {_expected}")
            else:
                print(f"  [FAIL] Case {_i}: is_prime({_inp}) -> Got {_actual}, expected {_expected}")
        except Exception as _err:
            print(f"  [FAIL] Case {_i}: Exception: {_err}")
    if _passed == len(_test_cases):
        print(f"\\nAll sample test cases passed! ({_passed}/{len(_test_cases)})")
    else:
        print(f"\\nSample test cases passed: {_passed}/{len(_test_cases)}")
        sys.exit(2)
else:
    print("\\n[Test Diagnostics]\\nTarget function 'is_prime(n)' is not defined in your code.")
    print("Sample test cases passed: 0/3")
    sys.exit(3)
`;
    }

    // Wrap user code with test harness
    const wrappedScript = `
import sys

# ---- User Code Execution Start ----
try:
${code.split('\n').map(l => '    ' + l).join('\n')}
except Exception as _e:
    import traceback
    traceback.print_exc()
    sys.exit(1)
# ---- User Code Execution End ----

# ---- Automated Test Case Verification ----
${testHarnessPython}
`;

    try {
      fs.writeFileSync(tempFilePath, wrappedScript, 'utf8');
    } catch (writeErr) {
      return resolve({
        stdout: '',
        stderr: `Failed to create temporary execution file: ${writeErr.message}`,
        exitCode: 1,
        isSuccess: false,
        hints,
      });
    }

    // Try 'python', fallback to 'py' on Windows
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
    let stdoutData = '';
    let stderrData = '';
    let isSettled = false;

    const child = spawn(pythonCmd, ['-u', tempFilePath], {
      windowsHide: true,
      timeout: 3500,
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
    });

    const timeoutTimer = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        try { child.kill('SIGKILL'); } catch (e) {}
        cleanupTemp();
        resolve({
          stdout: stdoutData,
          stderr: 'Time Limit Exceeded: Execution took longer than 3.0 seconds. Check for infinite loops.',
          exitCode: 124,
          isSuccess: false,
          hints,
        });
      }
    }, 3500);

    child.stdout.on('data', (chunk) => {
      stdoutData += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderrData += chunk.toString();
    });

    function cleanupTemp() {
      try {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      } catch (e) {}
    }

    child.on('error', (err) => {
      if (isSettled) return;
      isSettled = true;
      clearTimeout(timeoutTimer);
      cleanupTemp();
      resolve({
        stdout: stdoutData,
        stderr: `Python environment error: ${err.message}`,
        exitCode: 1,
        isSuccess: false,
        hints,
      });
    });

    child.on('close', (code) => {
      if (isSettled) return;
      isSettled = true;
      clearTimeout(timeoutTimer);
      cleanupTemp();

      // Clean line numbers in tracebacks to match user's editor line numbers
      let cleanStderr = stderrData;
      if (cleanStderr) {
        cleanStderr = cleanStderr.replace(/File ".*?", line (\d+)/g, (match, lineNum) => {
          const adj = Math.max(1, parseInt(lineNum, 10) - 5);
          return `File "solution.py", line ${adj}`;
        });
      }

      resolve({
        stdout: stdoutData.trim(),
        stderr: cleanStderr.trim(),
        exitCode: code || 0,
        isSuccess: code === 0,
        hints,
      });
    });
  });
}

module.exports = {
  runPythonCode,
};
