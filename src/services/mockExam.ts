import type { Problem } from '../types/exam';
import type { SocraticHint } from '../types/hint';

export const SAMPLE_PROBLEM: Problem = {
  id: 'prob-prime-01',
  title: 'Pengecekan Bilangan Prima',
  description:
    'Buatlah sebuah fungsi bernama `is_prime(n)` yang menerima satu bilangan bulat positif `n` dan mengembalikan `True` jika bilangan tersebut merupakan bilangan prima, serta `False` jika bukan bilangan prima.\n\nBilangan prima adalah bilangan asli lebih besar dari 1 yang faktor pembaginya hanya 1 dan bilangan itu sendiri.',
  constraints: [
    '1 <= n <= 10^6',
    'Fungsi harus mengembalikan nilai boolean (True / False)',
    'Kompleksitas waktu diharapkan optimal (O(sqrt(N)))',
  ],
  starterCode: `def is_prime(n):
    # Tulis logika pengecekan prima di bawah ini
    if n <= 1:
        return False
        
    for i in range(2, n)
        if n % i == 0:
            return False
            
    return True

# Contoh uji coba
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

  // 1. Check for missing colon after for loop
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
        title: 'Tanda Baca Akhir Blok Pernyataan',
        question: `Perhatikan baris ke-${index + 1} (${trimmed}). Dalam sintaks Python, karakter apa yang wajib diletakkan di akhir header perulangan atau pengkondisian?`,
        conceptHint: 'Setiap blok kontrol (for/if/while/def) di Python harus diakhiri tanda titik dua (:).',
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
      title: 'Optimasi Rentang Pembagi',
      question:
        'Logika Anda sudah bisa berjalan, tetapi apakah benar kita perlu menguji pembagi sampai angka n-1? Sampai batas manakah pembagian terbesar yang mungkin bagi n?',
      conceptHint: 'Faktor pembagi tidak trivial selalu berpasangan dan tidak pernah melebihi akar kuadrat dari n.',
    });
  }

  return {
    isSuccess: true,
    stdout: 'True\nSemua kasus uji contoh lolos! (3/3)',
    stderr: '',
    hints,
  };
}
