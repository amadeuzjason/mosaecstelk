export const SUBJECTS = [
  'SPLDV',
  'MATRIKS',
  'KALKULUS',
  'ALJABAR',
  'GEOMETRI',
  'TRIGONOMETRI',
  'STATISTIKA',
  'PELUANG',
  'MOSAEC_EVALUATION',
  'LOGARITMA',
  'STATISTIKA BIVARIAT'
] as const;

export type SubjectType = string;

export const GRADE_LEVELS = ['CLASS_10', 'CLASS_11', 'CLASS_12'] as const;
export type GradeLevelType = typeof GRADE_LEVELS[number];
