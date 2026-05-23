export type ScreenType = 'landing' | 'assessment' | 'dashboard' | 'profile';

export interface AssessmentData {
  age: number;
  systolic: number | '';
  diastolic: number | '';
  height: number | '';
  weight: number | '';
  activity: 'low' | 'moderate' | 'active';
  familyHistory: string[];
  diet: number; // 1 to 5 scale
}

export type TransitionType = 'push' | 'none';
