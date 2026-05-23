import { AssessmentData } from './types';

export function calculateBMI(weight: number | '', height: number | ''): { bmi: number; classification: string } {
  if (!weight || !height) {
    return { bmi: 22.9, classification: 'Normal' };
  }
  const heightM = height / 100;
  const bmiVal = Number((weight / (heightM * heightM)).toFixed(1));
  let clas = 'Normal';
  if (bmiVal < 18.5) {
    clas = 'Underweight';
  } else if (bmiVal < 25) {
    clas = 'Normal';
  } else if (bmiVal < 30) {
    clas = 'Overweight';
  } else {
    clas = 'Obese';
  }
  return { bmi: bmiVal, classification: clas };
}

export function classifyBP(sys: number | '', dia: number | ''): { label: string; level: 'normal' | 'elevated' | 'high' } {
  const s = sys || 120;
  const d = dia || 80;
  if (s < 120 && d < 80) {
    return { label: 'Normal', level: 'normal' };
  }
  if (s >= 140 || d >= 90) {
    return { label: 'High (Stage 2 Hypertension)', level: 'high' };
  }
  if ((s >= 130 && s < 140) || (d >= 80 && d < 90)) {
    return { label: 'High (Stage 1 Hypertension)', level: 'high' };
  }
  return { label: 'Elevated', level: 'elevated' };
}

export function calculateRisk(data: AssessmentData): {
  percentage: number;
  label: 'Low Risk' | 'Medium Risk' | 'High Risk';
  colorClass: string;
  gaugeColor: string;
} {
  // Start base risk on Age
  let basePoints = 15; // default scale
  
  if (data.age > 60) {
    basePoints += 25;
  } else if (data.age > 45) {
    basePoints += 15;
  } else if (data.age > 30) {
    basePoints += 5;
  }

  // Blood Pressure risk points
  const s = data.systolic || 120;
  const d = data.diastolic || 80;
  if (s >= 140 || d >= 90) {
    basePoints += 25;
  } else if (s >= 130 || d >= 80) {
    basePoints += 15;
  } else if (s >= 120 || d >= 80) {
    basePoints += 5;
  }

  // BMI calculation
  const { bmi } = calculateBMI(data.weight, data.height);
  if (bmi >= 30) {
    basePoints += 15;
  } else if (bmi >= 25) {
    basePoints += 5;
  }

  // Activity Level impact
  if (data.activity === 'low') {
    basePoints += 20;
  } else if (data.activity === 'moderate') {
    basePoints += 5;
  } else {
    basePoints -= 5; // highly active drops risk
  }

  // Family History impact
  if (data.familyHistory.length > 0 && !data.familyHistory.includes('None Known')) {
    // Add points for each family disease (max 20 points)
    const activeDiseases = data.familyHistory.filter(d => d !== 'None Known');
    basePoints += Math.min(activeDiseases.length * 8, 20);
  }

  // Diet contribution
  if (data.diet === 1) {
    basePoints += 12; // Mostly processed
  } else if (data.diet === 2) {
    basePoints += 8;
  } else if (data.diet === 3) {
    basePoints += 4; // Average/Balanced
  } else if (data.diet === 4) {
    basePoints += 0;
  } else {
    basePoints -= 5; // Excellent whole foods
  }

  // Constrain boundary
  let percentage = Math.max(10, Math.min(basePoints, 95));

  // Determine label and style
  let label: 'Low Risk' | 'Medium Risk' | 'High Risk' = 'Medium Risk';
  let colorClass = 'text-amber-500';
  let gaugeColor = '#f59e0b'; // Tailwind amber-500

  if (percentage < 35) {
    label = 'Low Risk';
    colorClass = 'text-teal-600';
    gaugeColor = '#00796b'; // Core primary-container
  } else if (percentage >= 70) {
    label = 'High Risk';
    colorClass = 'text-red-500 hover:text-red-600';
    gaugeColor = '#ba1a1a'; // Core error code
  }

  return { percentage, label, colorClass, gaugeColor };
}

export function getTopRecommendation(data: AssessmentData): string {
  if (data.activity === 'low') {
    return 'Increase physical activity to at least 30 minutes daily by incorporating brisk walks.';
  }
  const s = data.systolic || 120;
  const d = data.diastolic || 80;
  if (s >= 130 || d >= 80) {
    return 'Adopt a high-fiber, low-sodium dietary pattern to maintain optimal vascular compliance.';
  }
  if (data.diet <= 2) {
    return 'Transition diets away from highly processed sugars and increase intake of traditional whole foods.';
  }
  const { bmi } = calculateBMI(data.weight, data.height);
  if (bmi >= 25) {
    return 'Strive towards calorie moderation and light strength exercises to optimize metabolic index levels.';
  }
  if (data.familyHistory.length > 0 && !data.familyHistory.includes('None Known')) {
    return 'Schedule simple routine electrocardiograms or blood screenings given active family histories.';
  }
  return 'Maintain your current high activity scores and balanced whole-foods routine to preserve excellent trends.';
}
