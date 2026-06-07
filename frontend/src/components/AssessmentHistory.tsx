import React, { useState } from 'react';
import { Clock, Activity, Calendar, ChevronDown } from 'lucide-react';

interface AssessmentHistoryProps {
  token: string | null;
  lang?: "EN" | "BN";
}

interface HistoryRecord {
  id: number;
  created_at: number;
  risk_scores: Record<string, any>;
  patient_data: Record<string, any>;
}

export default function AssessmentHistory({ token, lang = "EN" }: AssessmentHistoryProps) {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) return null;

  const fetchHistory = async () => {
    if (showHistory) {
      setShowHistory(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Using the /api proxy for frontend-to-backend communication
      const response = await fetch('/api/auth/me/history', {
        headers: {
          'token': token, // Must match the backend Header dependencies
        },
      });
      
      const data = await response.json();
      
      if (response.ok && data.history) {
        setHistory(data.history);
        setShowHistory(true);
      } else {
        setError(data.detail || "Failed to load history.");
      }
    } catch (err) {
      setError("Network error while fetching history.");
    } finally {
      setLoading(false);
    }
  };

  const t = {
    EN: {
      btnView: "View Assessment History",
      btnHide: "Hide History",
      loading: "Loading...",
      empty: "You have no past assessments on record.",
      title: "Your Past Assessments"
    },
    BN: {
      btnView: "পূর্ববর্তী মূল্যায়ন দেখুন",
      btnHide: "ইতিহাস লুকান",
      loading: "লোড হচ্ছে...",
      empty: "আপনার কোনো পূর্ববর্তী মূল্যায়ন নেই।",
      title: "আপনার পূর্ববর্তী মূল্যায়নসমূহ"
    }
  };

  const currentT = t[lang] || t.EN;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 shadow-sm w-full">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-on-surface">{currentT.title}</h3>
        </div>
        
        <button 
          onClick={fetchHistory} 
          disabled={loading}
          className="px-5 py-2.5 bg-primary text-on-primary text-xs md:text-sm font-semibold rounded-full hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2 active:scale-95 shadow-sm cursor-pointer"
        >
          {loading ? currentT.loading : (showHistory ? currentT.btnHide : currentT.btnView)}
          {!loading && <ChevronDown className={`w-4 h-4 transition-transform ${showHistory ? 'rotate-180' : ''}`} />}
        </button>
      </div>
      
      {error && <p className="text-red-500 mt-4 text-sm font-semibold">{error}</p>}

      {showHistory && (
        <div className="mt-6 space-y-4">
          {history.length === 0 ? (
            <p className="text-on-surface-variant text-center py-8 font-medium">{currentT.empty}</p>
          ) : (
            history.map((record) => {
              const date = new Date(record.created_at * 1000).toLocaleString(lang === 'EN' ? 'en-US' : 'bn-BD');
              
              return (
                <div key={record.id} className="p-4 bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/30 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{date}</p>
                      <p className="text-[11px] md:text-xs text-on-surface-variant mt-1.5 font-medium">
                        Age: <span className="text-on-surface font-bold">{record.patient_data.age}</span> • 
                        BMI: <span className="text-on-surface font-bold">{record.patient_data.bmi}</span> • 
                        BP: <span className="text-on-surface font-bold">{record.patient_data.systolic_bp}/{record.patient_data.diastolic_bp}</span> mmHg
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    {Object.keys(record.risk_scores || {}).map((condition) => {
                      const score = record.risk_scores[condition];
                      const isHighRisk = score.risk_level === 'high' || score.color === 'red';
                      const isMedRisk = score.risk_level === 'medium' || score.color === 'yellow';
                      
                      let badgeColor = "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400";
                      if (isHighRisk) badgeColor = "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400";
                      else if (isMedRisk) badgeColor = "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400";

                      return (
                        <span key={condition} className={`px-2.5 py-1 text-[10px] font-bold rounded-full border flex items-center gap-1 capitalize ${badgeColor}`}>
                          <Activity className="w-3 h-3" />
                          {condition.replace('_', ' ')}: {score.risk_level}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}