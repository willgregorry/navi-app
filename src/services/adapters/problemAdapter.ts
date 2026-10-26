import type { PublicProblemResponse, PublicTestCase } from '../../types/api/models';
import type { Problem, TestCase } from '../../types/exam';

export function adaptPublicTestCase(tc: PublicTestCase): TestCase {
  return {
    id: tc.id,
    input: tc.input_data,
    expectedOutput: tc.expected_output,
    isHidden: false,
  };
}

export function adaptPublicProblem(p: PublicProblemResponse): Problem {
  return {
    id: String(p.id),
    numericId: p.id,
    title: p.title,
    difficulty: p.difficulty || 'Easy',
    points: p.points || 20,
    category: p.category || 'General',
    description: p.description,
    constraints: Array.isArray(p.constraints) ? p.constraints : [],
    starterCode: p.starter_code || 'def solution():\n    pass\n',
    sampleTestCases: Array.isArray(p.public_test_cases)
      ? p.public_test_cases.map(adaptPublicTestCase)
      : [],
  };
}

export function adaptPublicProblemsList(problems: PublicProblemResponse[] = []): Problem[] {
  return problems.map(adaptPublicProblem);
}
