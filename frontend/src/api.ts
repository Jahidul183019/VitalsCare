import { AssessmentData } from './types';
import { calculateBMI } from './utils';

export interface BackendResponse {
  risk_level: string;
  color_code: string;
  risk_score: number;
  dominant_condition: string;
  condition_scores: {
    Hypertension: number;
    Diabetes: number;
  };
  recommendation: string;
}

export async function submitAssessment(data: AssessmentData): Promise<BackendResponse> {
  const { bmi } = calculateBMI(data.weight, data.height);

  // Map frontend types to backend payload
  const payload = {
    age: data.age,
    systolic_bp: data.systolic || 120, // default if empty
    diastolic_bp: data.diastolic || 80,
    bmi: bmi,
    family_history: data.familyHistory.length > 0 && !data.familyHistory.includes('None Known'),
    activity_level: data.activity === 'active' ? 'high' : data.activity === 'moderate' ? 'medium' : 'low',
    diet_quality: data.diet >= 4 ? 'good' : data.diet >= 3 ? 'average' : 'poor',
  };

  const token = window.localStorage.getItem('vitalscare.token');
  const headers: Record<string,string> = { 'Content-Type': 'application/json' };
  if (token) headers['token'] = token;

  const response = await fetch('/api/assess', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to calculate risk from backend');
  }

  return response.json();
}
