import React, { useState, useEffect } from 'react';
import { ScreenType, TransitionType, AssessmentData } from '../types';
import { calculateRisk, classifyBP, getTopRecommendation, calculateBMI } from '../utils';
import { submitAssessment, BackendResponse } from '../api';
import { 
  HeartPulse, 
  Download, 
  Lightbulb, 
  Share2, 
  Calendar, 
  ChevronRight, 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Activity,
  Home,
  AlertTriangle,
  Award,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface RiskDashboardProps {
  data: AssessmentData;
  onNavigate: (screen: ScreenType, transition: TransitionType) => void;
  onReset: () => void;
  profileName: string;
  profileInitials: string;
  onProfileClick?: () => void;
}

export default function RiskDashboard({ data, onNavigate, onReset, profileName, profileInitials, onProfileClick }: RiskDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [backendResult, setBackendResult] = useState<BackendResponse | null>(null);

  useEffect(() => {
    async function getRisk() {
      try {
        const result = await submitAssessment(data);
        setBackendResult(result);
      } catch (err) {
        console.error('Failed to get backend risk', err);
      } finally {
        setLoading(false);
      }
    }
    getRisk();
  }, [data]);

  // Fallback to frontend calculation if backend is loading or unavailable
  const fallbackRiskResult = calculateRisk(data);
  const riskResult = backendResult ? {
    percentage: backendResult.risk_score,
    label: backendResult.risk_level + " Risk",
    colorClass: backendResult.color_code === "Green" ? "text-emerald-600" : backendResult.color_code === "Yellow" ? "text-amber-500" : "text-red-500",
    gaugeColor: backendResult.color_code === "Green" ? "#059669" : backendResult.color_code === "Yellow" ? "#f59e0b" : "#ef4444"
  } : fallbackRiskResult;

  const topRec = backendResult?.recommendation || getTopRecommendation(data);
  const bpResult = classifyBP(data.systolic, data.diastolic);
  const bmiInfo = calculateBMI(data.weight, data.height);

  // States to add user engagement or simulate actions
  const [downloaded, setDownloaded] = useState(false);
  const [shared, setShared] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [viewedPlan, setViewedPlan] = useState(false);

  // Math for SVG Circular Progress Gauge of Cardiovascular Risk
  // Radius is 40, Circumference is 2 * Math.PI * 40 = ~251.3
  const r = 40;
  const circ = 2 * Math.PI * r;
  // Offset calculated dynamically based on percentage
  const strokeOffset = circ - (circ * riskResult.percentage) / 100;

  const handleDownload = () => {
    setDownloaded(true);
    // Dynamic local text download simulation
    const docText = `
VitalsCare Bangladesh - Preventive Screening Report
--------------------------------------------------
Age: ${data.age}
Blood Pressure: ${data.systolic || 120}/${data.diastolic || 80} mmHg (${bpResult.label})
Body Mass Index (BMI): ${bmiInfo.bmi} (${bmiInfo.classification})
Physical Activity: ${data.activity.toUpperCase()}
Family Heredity Risk: ${data.familyHistory.join(', ')}
Diet rating: ${data.diet}/5
--------------------------------------------------
Calculated Cardiovascular Risk: ${riskResult.percentage}% (${riskResult.label})
Primary Clinical Warning: "${topRec}"
    `.trim();

    const element = document.createElement("a");
    const file = new Blob([docText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `VitalsCare-Health-Report-${data.age}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 text-neutral-800 font-sans selection:bg-teal-700 selection:text-white pb-16 md:pb-0">
      
      {/* Header conforming to standard brand details */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200/50 py-4 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div 
          onClick={() => onNavigate('landing', 'none')} 
          className="flex items-center gap-2.5 text-teal-800 cursor-pointer hover:opacity-95"
        >
          <HeartPulse className="w-8 h-8 text-teal-700" />
          <span className="text-2xl font-bold tracking-tight text-teal-800">VitalsCare</span>
        </div>
        
        {/* Nav block wrapping links conforming to xpath //nav//a */}
        <nav className="hidden md:flex items-center gap-8">
          <a 
            href="#" 
            className="text-neutral-600 hover:text-teal-700 transition-colors px-3 py-1.5 rounded-full hover:bg-neutral-100 font-medium"
            onClick={(e) => { e.preventDefault(); onNavigate('landing', 'none'); }}
          >
            Home
          </a>
          <a 
            href="#" 
            className="text-neutral-600 hover:text-teal-700 transition-colors px-3 py-1.5 rounded-full hover:bg-neutral-100 font-medium"
            onClick={(e) => { e.preventDefault(); onNavigate('assessment', 'none'); }}
          >
            Assess
          </a>
          <a 
            href="#" 
            className="text-teal-900 font-bold px-3 py-1.5 rounded-full bg-teal-50 transition-colors"
            onClick={(e) => { e.preventDefault(); onNavigate('dashboard', 'none'); }}
          >
            Insights
          </a>
        </nav>

        {/* Dynamic button wrapper */}
        <button 
          onClick={onReset}
          className="hidden md:block border border-teal-600/30 text-teal-800 font-semibold px-4.5 py-2 rounded-full text-xs hover:bg-teal-50 transition-all active:scale-95"
        >
          Reset Assessment
        </button>
      </header>

      {/* Main Insights Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col gap-8 relative z-10">
        
        {/* Title row */}
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-end">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-950 tracking-tight">
              Assessment Results
            </h1>
            <p className="text-sm text-neutral-500 mt-1 font-medium">
              Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <button 
            onClick={handleDownload}
            className="bg-neutral-100 hover:bg-teal-700 hover:text-white hover:scale-[1.01] active:scale-95 text-neutral-800 duration-250 transition-all font-bold px-5 py-3 rounded-2xl flex items-center justify-center gap-2 border border-neutral-300/60 shadow-sm text-sm"
          >
            <Download className="w-4 h-4" />
            {downloaded ? 'Report Seeded!' : 'Download Report'}
          </button>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Card 1: Risk Gauge circular visualization */}
          <div className="glass-card rounded-3xl p-6 md:p-8 md:col-span-8 flex flex-col items-center justify-center text-center relative overflow-hidden soft-shadow min-h-[355px]">
            {/* Top gradient highlight based on severity */}
            <div className={`absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-transparent to-teal-600`} style={{ backgroundColor: riskResult.gaugeColor }}></div>
            
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight w-full text-left mb-6 flex items-center gap-2">
              <TrendingUp className="w-5.5 h-5.5 text-teal-750" />
              Cardiovascular Risk Profile
            </h2>

            {/* Simulated Animated SVGs Ring */}
            <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r={r} 
                  fill="transparent" 
                  stroke="#eceef0" 
                  strokeWidth="8"
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r={r} 
                  fill="transparent" 
                  stroke={riskResult.gaugeColor} 
                  strokeWidth="8"
                  strokeDasharray={circ}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className={`text-4xl md:text-5xl font-extrabold tracking-tight ${riskResult.colorClass}`}>
                  {riskResult.percentage}%
                </span>
                <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mt-1">
                  {riskResult.label}
                </span>
              </div>
            </div>

            <p className="text-neutral-500 text-sm leading-relaxed max-w-lg mt-4 font-normal">
              Based on your age profile ({data.age} years), blood pressure metrics, calculated body weight indices ({bmiInfo.bmi} BMI), family heredity, and physical workloads, your cumulative risk indicator is analyzed as <strong className="font-semibold">{riskResult.label.toLowerCase()}</strong>. Continue to track routinely for diagnostic prevention.
            </p>
          </div>

          {/* Column with Actions & Recommended advice */}
          <div className="md:col-span-4 flex flex-col gap-8 h-full justify-between">
            
            {/* Advice Panel card */}
            <div className="glass-card rounded-3xl p-6 flex flex-col justify-between flex-grow border-l-4 border-l-teal-600 bg-gradient-to-br from-white to-teal-50/50 soft-shadow">
              <div>
                <div className="flex items-center gap-2 text-teal-800 mb-4 select-none">
                  <Lightbulb className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Top Recommendation</span>
                </div>
                <h3 className="text-md font-bold text-neutral-900 leading-normal mb-3">
                  "{topRec}"
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                  Dynamic analysis confirms structured cardiovascular interventions can help reduce vascular friction and maintain high stroke volume indexes over time.
                </p>
              </div>

              <div className="mt-6">
                <button 
                  onClick={() => setViewedPlan(!viewedPlan)} 
                  className="w-full bg-teal-700 hover:bg-teal-800 hover:scale-[1.01] active:scale-95 text-white py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  {viewedPlan ? '✓ Standard Plan Displayed' : 'View Exercise Plan'}
                  {!viewedPlan && <ArrowRight className="w-4 h-4" />}
                </button>
                {viewedPlan && (
                  <div className="mt-2 text-[11px] bg-teal-50 text-teal-800 p-2.5 rounded-xl border border-teal-100/60 leading-normal animate-pulse">
                    Standard protocol: 30 minutes of low-sodium moderate walk / 3x weekly + 10 mins diaphragmatic patterns.
                  </div>
                )}
              </div>
            </div>

            {/* Physical Next Steps List box */}
            <div className="glass-card rounded-3xl p-6 flex flex-col gap-4 soft-shadow">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest select-none">
                Next Steps
              </h3>

              <div 
                onClick={() => { setShared(true); setTimeout(() => setShared(false), 2000); }}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-50 cursor-pointer border border-neutral-100 transition-all select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    {shared ? <CheckCircle2 className="w-4.5 h-4.5" /> : <Share2 className="w-4.5 h-4.5" />}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-neutral-800">Share with Physician</span>
                    <span className="text-[10px] text-neutral-400 font-medium">Send secure export</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </div>

              <div 
                onClick={() => { setScheduled(true); setTimeout(() => setScheduled(false), 2000); }}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-50 cursor-pointer border border-neutral-100 transition-all select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                    {scheduled ? <CheckCircle2 className="w-4.5 h-4.5" /> : <Calendar className="w-4.5 h-4.5" />}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-neutral-800 font-sans">Schedule Follow-up</span>
                    <span className="text-[10px] text-neutral-400 font-medium">Book preventive clinic</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </div>
            </div>

          </div>

        </div>

        {/* Metric Breakdowns details */}
        <div className="glass-card rounded-3xl p-6 md:p-8 mt-4 soft-shadow">
          <h3 className="text-lg font-bold text-neutral-950 mb-6 flex items-center gap-2">
            <Activity className="w-5.5 h-5.5 text-teal-700" />
            Key Contributors Analyzed
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Blood Pressure Analysis */}
            <div className="p-5 rounded-2xl border border-neutral-200/80 bg-neutral-50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-neutral-500 uppercase">Blood Pressure</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                  bpResult.level === 'normal' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : bpResult.level === 'elevated' 
                    ? 'bg-yellow-101 bg-amber-100 text-amber-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {bpResult.label.split(' ')[0]}
                </span>
              </div>
              <div className="text-2xl font-bold text-neutral-900 mt-2">
                {data.systolic || 120}/{data.diastolic || 80}
                <span className="text-xs font-semibold text-neutral-400 ml-1.5">mmHg</span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-2.5 font-normal leading-normal">
                Based on active screening values. Elevated parameters increase resistance factors.
              </p>
            </div>

            {/* Custom calculated BMI metrics */}
            <div className="p-5 rounded-2xl border border-neutral-200/80 bg-neutral-50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-neutral-500 uppercase">Body Mass Index</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                  bmiInfo.classification === 'Normal' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {bmiInfo.classification}
                </span>
              </div>
              <div className="text-2xl font-bold text-neutral-900 mt-2">
                {bmiInfo.bmi}
                <span className="text-xs font-semibold text-neutral-400 ml-1.5">kg/m²</span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-2.5 font-normal leading-normal">
                Indicates overall fat percentage distribution. Target 18.5 - 24.9.
              </p>
            </div>

            {/* Exercise Contributors */}
            <div className="p-5 rounded-2xl border border-neutral-200/80 bg-neutral-50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-neutral-500 uppercase">Activity Scale</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                  data.activity === 'active' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : data.activity === 'moderate' 
                    ? 'bg-teal-50 text-teal-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {data.activity.toUpperCase()}
                </span>
              </div>
              <div className="text-2xl font-bold text-neutral-900 mt-2">
                {data.activity === 'active' ? 'High' : data.activity === 'moderate' ? 'Moderate' : 'Low'}
                <span className="text-xs font-semibold text-neutral-400 ml-1.5">exercise</span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-2.5 font-normal leading-normal">
                Sedentary style slows myocardial metabolism and affects dynamic recovery metrics.
              </p>
            </div>

            {/* Lifestyle scale */}
            <div className="p-5 rounded-2xl border border-neutral-200/80 bg-neutral-50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-neutral-500 uppercase">Diet rating</span>
                <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[9px] font-extrabold uppercase">
                  Class {data.diet}/5
                </span>
              </div>
              <div className="text-2xl font-bold text-neutral-900 mt-2">
                {data.diet >= 4 ? 'Whole Foods' : data.diet >= 3 ? 'Balanced' : 'Processed'}
                <span className="text-xs font-semibold text-neutral-400 ml-1.5">profile</span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-2.5 font-normal leading-normal">
                Consuming high levels of processed sodium impacts core blood elasticity variables.
              </p>
            </div>

          </div>
        </div>

      </main>

      {/* Navigation block (Mobile bottom nav conforming to xpath) wrapped inside a nav selector */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden bg-white/90 backdrop-blur-md border-t border-neutral-200/80 rounded-t-2xl shadow-[0_-10px_35px_rgba(0,0,0,0.06)]">
        <a 
          href="#" 
          className="flex flex-col items-center justify-center text-neutral-500 hover:text-teal-700 transition-colors"
          onClick={(e) => { e.preventDefault(); onNavigate('landing', 'none'); }}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Home</span>
        </a>
        <a 
          href="#" 
          className="flex flex-col items-center justify-center text-neutral-500 hover:text-teal-700 transition-colors"
          onClick={(e) => { e.preventDefault(); onNavigate('assessment', 'none'); }}
        >
          <Activity className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Assess</span>
        </a>
        <a 
          href="#" 
          className="flex flex-col items-center justify-center text-teal-800 bg-teal-50/80 px-4 py-1.5 rounded-full transition-transform"
          onClick={(e) => { e.preventDefault(); onNavigate('dashboard', 'none'); }}
        >
          <TrendingDown className="w-5 h-5 animate-bounce" />
          <span className="text-[10px] font-bold mt-1">Insights</span>
        </a>
        <div 
          onClick={() => onProfileClick?.() } 
          className="flex flex-col items-center justify-center text-neutral-400 hover:text-teal-700 cursor-pointer"
          title={profileName}
          aria-label={`Profile: ${profileName}`}
        >
          <div className="w-5.5 h-5.5 rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center font-bold text-[9px] text-neutral-600">
            {profileInitials}
          </div>
          <span className="text-[10px] font-semibold mt-1">Profile</span>
        </div>
      </nav>

      {/* Footer layout */}
      <footer className="bg-white py-12 px-6 md:px-12 border-t border-neutral-200/50 mt-auto select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-xl font-bold text-teal-900">VitalsCare</span>
            <p className="text-xs text-neutral-500 mt-2 max-w-lg leading-relaxed">
              © 2024 VitalsCare Bangladesh. All rights reserved. <br/>
              <span className="text-red-600 font-semibold">Disclaimer:</span> This tool provides preventive screening only and is not a medical diagnosis. Not a substitute for professional medical advice.
            </p>
          </div>

          <div className="flex flex-wrap gap-5">
            <span className="text-xs text-neutral-400 hover:text-teal-800 cursor-not-allowed">Privacy Policy</span>
            <span className="text-xs text-neutral-400 hover:text-teal-800 cursor-not-allowed">Terms of Service</span>
            <span className="text-xs text-neutral-400 hover:text-teal-800 cursor-not-allowed">Contact Support</span>
            <span className="text-xs text-neutral-400 hover:text-teal-800 cursor-not-allowed">About Us</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
