import React, { useState } from 'react';
import { ScreenType, TransitionType, AssessmentData } from '../types';
import { calculateBMI } from '../utils';
import { 
  HeartPulse, 
  Activity, 
  ChevronRight, 
  User, 
  Cake, 
  Activity as ActivityIcon, 
  Dna, 
  ChefHat, 
  PlusCircle, 
  Home, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';

interface AssessmentFormProps {
  data: AssessmentData;
  onChange: (newData: AssessmentData) => void;
  onNavigate: (screen: ScreenType, transition: TransitionType) => void;
  profileName: string;
  profileInitials: string;
  onProfileClick?: () => void;
}

export default function AssessmentForm({ data, onChange, onNavigate, profileName, profileInitials, onProfileClick }: AssessmentFormProps) {
  const [bmiInfo, setBmiInfo] = useState(() => calculateBMI(data.weight, data.height));

  const updateField = (field: keyof AssessmentData, val: any) => {
    const nextData = { ...data, [field]: val };
    onChange(nextData);

    if (field === 'weight' || field === 'height') {
      const w = field === 'weight' ? val : data.weight;
      const h = field === 'height' ? val : data.height;
      setBmiInfo(calculateBMI(w, h));
    }
  };

  const handleFamilyHistoryChange = (condition: string) => {
    let nextHistory = [...data.familyHistory];
    if (condition === 'None Known') {
      nextHistory = ['None Known'];
    } else {
      // Remove 'None Known' if any other symptom is clicked
      nextHistory = nextHistory.filter(x => x !== 'None Known');
      if (nextHistory.includes(condition)) {
        nextHistory = nextHistory.filter(x => x !== condition);
      } else {
        nextHistory.push(condition);
      }
      if (nextHistory.length === 0) {
        nextHistory = ['None Known'];
      }
    }
    updateField('familyHistory', nextHistory);
  };

  const getDietLabel = (val: number) => {
    switch (val) {
      case 1: return 'Poor';
      case 2: return 'Below Average';
      case 3: return 'Average';
      case 4: return 'Good';
      case 5: return 'Excellent';
      default: return 'Average';
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('dashboard', 'push');
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 text-neutral-800 font-sans selection:bg-teal-700 selection:text-white pb-16 md:pb-0">
      
      {/* Header conforming to header xpaths (//header//a[contains(., 'Home')] and //header//a[contains(., 'Insights')]) */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200/50 py-4 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div 
          onClick={() => onNavigate('landing', 'none')} 
          className="flex items-center gap-2.5 text-teal-800 cursor-pointer hover:opacity-95 transition-opacity"
        >
          <HeartPulse className="w-8 h-8 text-teal-700" />
          <span className="text-2xl font-bold tracking-tight text-teal-800">VitalsCare</span>
        </div>
        
        {/* Navigation list conforming exactly to xpath: //header//a */}
        <div className="hidden md:flex items-center gap-8">
          <a 
            href="#" 
            className="text-neutral-600 hover:text-teal-700 transition-colors px-3 py-1.5 rounded-full hover:bg-neutral-100 font-medium"
            onClick={(e) => { e.preventDefault(); onNavigate('landing', 'none'); }}
          >
            Home
          </a>
          <a 
            href="#" 
            className="text-teal-900 font-bold px-3 py-1.5 rounded-full bg-teal-50 transition-colors"
            onClick={(e) => { e.preventDefault(); onNavigate('assessment', 'none'); }}
          >
            Assess
          </a>
          <a 
            href="#" 
            className="text-neutral-600 hover:text-teal-700 transition-colors px-3 py-1.5 rounded-full hover:bg-neutral-100 font-medium"
            onClick={(e) => { e.preventDefault(); onNavigate('dashboard', 'none'); }}
          >
            Insights
          </a>
        </div>

        {/* Dynamic button wrapper */}
        <div className="flex items-center bg-teal-50 text-teal-800 p-2 rounded-full cursor-pointer hover:bg-teal-100 transition-all" title={profileName} aria-label={`Profile: ${profileName}`} onClick={() => onProfileClick?.()}>
          <span className="text-xs font-semibold px-2">{profileInitials}</span>
        </div>
      </header>

      {/* Main Form content */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-6 md:px-12 py-12 flex flex-col gap-8 relative z-10">
        
        {/* Form Title & Progress block */}
        <div className="flex flex-col gap-4 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-950 tracking-tight">
              Comprehensive Health Assessment
            </h1>
            <p className="text-md text-neutral-500 leading-relaxed max-w-2xl">
              Step 1 of 3: Vitals & Lifestyle. Please provide accurate information for the best risk evaluation.
            </p>
          </div>

          {/* Stepper visual indicators */}
          <div className="w-full flex flex-col gap-2 mt-4 max-w-2xl">
            <div className="flex justify-between text-xs font-semibold text-neutral-400 px-1">
              <span className="text-teal-800 font-bold">1. Vitals & Lifestyle</span>
              <span>2. Medical History</span>
              <span>3. Review & Submit</span>
            </div>
            <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div className="h-full bg-teal-700 rounded-full transition-all duration-500 ease-out" style={{ width: '33.3%' }}></div>
            </div>
          </div>
        </div>

        {/* Direct execution form tag */}
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-4">
          
          {/* Bento Side: Core Vitals Form (Spans 8 columns) */}
          <div className="md:col-span-8 bg-white/95 border border-neutral-200/60 rounded-3xl p-6 md:p-8 flex flex-col gap-6 soft-shadow">
            <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
              <HeartPulse className="w-6 h-6 text-teal-600" />
              <h2 className="text-xl font-bold text-neutral-900">Core Vitals</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Age Range scale */}
              <div className="flex flex-col gap-2.5">
                <label className="text-sm font-semibold text-neutral-600 flex justify-between pr-2">
                  <span>Age</span>
                  <span className="text-teal-800 font-bold text-base" id="age-display">{data.age}</span>
                </label>
                <div className="flex items-center gap-4 bg-neutral-50 rounded-2xl px-4 py-3.5 border border-neutral-200/50 hover:border-neutral-300 transition-colors">
                  <Cake className="w-5 h-5 text-neutral-400 shrink-0" />
                  <input 
                    type="range"
                    min="18"
                    max="100"
                    value={data.age}
                    onChange={(e) => updateField('age', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* BP Readings (Sys/Dia) */}
              <div className="flex flex-col gap-2.5">
                <label className="text-sm font-semibold text-neutral-600">Blood Pressure (mmHg)</label>
                <div className="flex gap-2 items-center">
                  <div className="flex-1 flex items-center gap-2 bg-neutral-50 rounded-2xl px-4 py-3 border border-neutral-200/50 focus-within:bg-white focus-within:border-teal-600/60 focus-within:ring-2 focus-within:ring-teal-5/10 transition-colors">
                    <span className="text-xs font-bold text-neutral-400 select-none uppercase shrink-0">SYS:</span>
                    <input 
                      type="number"
                      placeholder="120"
                      value={data.systolic}
                      onChange={(e) => updateField('systolic', e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-transparent border-none p-0 focus:outline-none text-sm font-semibold text-neutral-800 focus:ring-0"
                    />
                  </div>
                  <span className="text-neutral-300 font-light text-xl select-none">/</span>
                  <div className="flex-1 flex items-center gap-2 bg-neutral-50 rounded-2xl px-3.5 py-3 border border-neutral-200/50 focus-within:bg-white focus-within:border-teal-600/60 focus-within:ring-2 focus-within:ring-teal-5/10 transition-colors">
                    <span className="text-xs font-bold text-neutral-400 select-none uppercase shrink-0">DIA:</span>
                    <input 
                      type="number"
                      placeholder="80"
                      value={data.diastolic}
                      onChange={(e) => updateField('diastolic', e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-transparent border-none p-0 focus:outline-none text-sm font-semibold text-neutral-800 focus:ring-0"
                    />
                  </div>
                </div>
              </div>

              {/* Body Metric Settings (Height, Weight) & BMI dynamic calculate */}
              <div className="sm:col-span-2 flex flex-col gap-2.5">
                <div className="flex justify-between items-center pr-2">
                  <label className="text-sm font-semibold text-neutral-600">Body Metrics</label>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-100 flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                    BMI Auto-calc: <strong className="font-bold text-teal-900">{bmiInfo.bmi} ({bmiInfo.classification})</strong>
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-neutral-50 rounded-2xl px-4 py-3 border border-neutral-200/50 focus-within:bg-white focus-within:border-teal-600/60 transition-colors">
                    <div className="flex flex-col w-full">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-extrabold select-none">Height (cm)</span>
                      <input 
                        type="number"
                        placeholder="175"
                        value={data.height}
                        onChange={(e) => updateField('height', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-transparent border-none p-0 mt-0.5 focus:outline-none font-semibold text-sm text-neutral-800 focus:ring-0"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-neutral-50 rounded-2xl px-4 py-3 border border-neutral-200/50 focus-within:bg-white focus-within:border-teal-600/60 transition-colors">
                    <div className="flex flex-col w-full">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-extrabold select-none">Weight (kg)</span>
                      <input 
                        type="number"
                        placeholder="70"
                        value={data.weight}
                        onChange={(e) => updateField('weight', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-transparent border-none p-0 mt-0.5 focus:outline-none font-semibold text-sm text-neutral-800 focus:ring-0"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Bento Side: Lifestyle Parameters (Spans 4 columns) */}
          <div className="md:col-span-4 bg-white/95 border border-neutral-200/60 rounded-3xl p-6 md:p-8 flex flex-col gap-6 soft-shadow">
            <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
              <ActivityIcon className="w-6 h-6 text-teal-600" />
              <h2 className="text-xl font-bold text-neutral-900">Activity Level</h2>
            </div>

            <div className="flex flex-col gap-3 justify-center h-full">
              {[
                { id: 'low', label: 'Low', desc: 'Rarely exercise', icon: '🛋️' },
                { id: 'moderate', label: 'Moderate', desc: '1-3 times a week', icon: '🚶' },
                { id: 'active', label: 'Highly Active', desc: '4+ times a week', icon: '🏃' }
              ].map((actOpts) => (
                <label key={actOpts.id} className="cursor-pointer group">
                  <input 
                    type="radio"
                    name="activity"
                    value={actOpts.id}
                    checked={data.activity === actOpts.id}
                    onChange={() => updateField('activity', actOpts.id)}
                    className="sr-only"
                  />
                  <div className={`w-full p-4 rounded-2xl border transition-all duration-200 flex items-center gap-4 ${
                    data.activity === actOpts.id
                      ? 'border-teal-600 bg-teal-50/50 text-teal-900 ring-1 ring-teal-500/20'
                      : 'border-neutral-200/60 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-neutral-600'
                  }`}>
                    <span className="text-2xl select-none">{actOpts.icon}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold tracking-tight text-neutral-900">{actOpts.label}</span>
                      <span className="text-[11px] text-neutral-500 mt-0.5">{actOpts.desc}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Bento Side: Family History Checkboxes (Spans 6 columns) */}
          <div className="md:col-span-6 bg-white/95 border border-neutral-200/60 rounded-3xl p-6 md:p-8 flex flex-col gap-6 soft-shadow">
            <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
              <Dna className="w-6 h-6 text-teal-600" />
              <h2 className="text-xl font-bold text-neutral-900">Family History</h2>
            </div>
            
            <p className="text-xs text-neutral-500 font-medium tracking-tight">
              Select any chronic conditions present in your immediate family or ancestors:
            </p>

            <div className="flex flex-wrap gap-2.5 mt-2">
              {['Diabetes', 'Heart Disease', 'Hypertension', 'Stroke', 'None Known'].map((condVal) => {
                const isChecked = data.familyHistory.includes(condVal);
                return (
                  <label key={condVal} className="cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleFamilyHistoryChange(condVal)}
                      className="sr-only"
                    />
                    <div className={`px-4.5 py-2.5 text-xs font-semibold rounded-full border transition-all duration-200 ${
                      isChecked
                        ? 'bg-teal-700 text-white border-teal-700 soft-shadow ring-2 ring-teal-500/10'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300'
                    }`}>
                      {condVal}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Bento Side: Diet Quality Slider (Spans 6 columns) */}
          <div className="md:col-span-6 bg-white/95 border border-neutral-200/60 rounded-3xl p-6 md:p-8 flex flex-col gap-6 soft-shadow">
            <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
              <ChefHat className="w-6 h-6 text-teal-600" />
              <h2 className="text-xl font-bold text-neutral-900">Diet Quality</h2>
            </div>

            <div className="flex flex-col gap-5 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-neutral-500">How would you rate your diet?</span>
                <span className="text-xs font-bold bg-teal-50 text-teal-800 border border-teal-100/80 px-2.5 py-1 rounded-md">
                  {getDietLabel(data.diet)}
                </span>
              </div>

              {/* Node-based custom sliding slider progress indicator */}
              <div className="relative w-full py-4 px-1">
                <input 
                  type="range"
                  min="1"
                  max="5"
                  value={data.diet}
                  onChange={(e) => updateField('diet', Number(e.target.value))}
                  className="w-full relative z-20 h-full opacity-100 cursor-pointer"
                />
                
                {/* Node visualization line behind track */}
                <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-neutral-200 rounded-full -translate-y-1/2 pointer-events-none">
                  <div 
                    className="h-full bg-teal-700 rounded-full transition-all duration-150"
                    style={{ width: `${((data.diet - 1) / 4) * 100}%` }}
                  ></div>
                </div>

                {/* Individual level dot nodes indicators */}
                <div className="absolute top-1/2 left-0 right-0 flex justify-between px-1 -translate-y-1/2 pointer-events-none">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div 
                      key={level}
                      className={`w-3.5 h-3.5 rounded-full border transition-transform duration-200 ${
                        level <= data.diet
                          ? 'bg-teal-700 border-teal-700 scale-110'
                          : 'bg-white border-neutral-300'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                <span>Mostly Processed</span>
                <span>Balanced</span>
                <span>Whole Foods</span>
              </div>
            </div>
          </div>

          {/* Continue button tag exactly conforming to spec //button[contains(., 'Continue')] */}
          <div className="col-span-1 md:col-span-12 flex justify-end mt-4">
            <button 
              type="submit"
              id="submit-form-continue-btn"
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-3.5 px-8 rounded-full shadow-md flex items-center gap-2 transform active:scale-95 transition-all text-sm tracking-tight hover:scale-[1.01]"
            >
              Continue to Insights
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </form>
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
          className="flex flex-col items-center justify-center text-teal-800 bg-teal-50/80 px-4 py-1.5 rounded-full transition-transform"
          onClick={(e) => { e.preventDefault(); onNavigate('assessment', 'none'); }}
        >
          <Activity className="w-5 h-5 animate-pulse" />
          <span className="text-[10px] font-bold mt-1">Assess</span>
        </a>
        <a 
          href="#" 
          className="flex flex-col items-center justify-center text-neutral-500 hover:text-teal-700 transition-colors"
          onClick={(e) => { e.preventDefault(); onNavigate('dashboard', 'none'); }}
        >
          <TrendingDown className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Insights</span>
        </a>
        <div 
          onClick={() => onNavigate('landing', 'none')} 
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
