import React, { useState, useEffect } from "react";
import { 
  HeartHandshake, 
  ChevronRight, 
  MessageSquare, 
  User, 
  Activity, 
  FileText, 
  Globe, 
  Sun, 
  Moon,
  LayoutDashboard,
  Home,
  Menu,
  HeartPulse
} from "lucide-react";
import { ViewType, AssessmentData } from "./types";
import LandingPage from "./components/LandingPage";
import RiskDashboard from "./components/RiskDashboard";
import AssessmentForm from "./components/AssessmentForm";
import ChatbotPanel from "./components/ChatbotPanel";
import ProfilePanel from "./components/ProfilePanel";

// Default standard baseline screening data matching low risk screens
const DEFAULT_ASSESSMENT: AssessmentData = {
  age: 35,
  systolic: 120,
  diastolic: 80,
  height: 175,
  weight: 70,
  activityLevel: "medium",
  familyHistory: {
    diabetes: false,
    hypertension: false,
    stroke: false,
    heartDisease: false,
  },
  dietQuality: "average",
  saltIntake: "medium",
  stressLevel: "medium",
  smoking: false,
  gender: "female",
  fastingBloodSugar: "normal",
  cholesterol: "normal",
  sleepDuration: "optimal",
  alcohol: "never",
};

export default function App() {
  const [view, setView] = useState<ViewType>("landing");
  const [lang, setLang] = useState<"EN" | "BN">("EN");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  const [activeEmail, setActiveEmail] = useState<string>("");
  const [usersDb, setUsersDb] = useState<{ [key: string]: any }>(() => {
    const saved = localStorage.getItem("vitalcare_accounts");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    // Bootstrap database with Sarah
    const initialDb = {
      "sarah@vitalcare.com": {
        displayName: "Sarah",
        password: "password123",
        assessmentData: DEFAULT_ASSESSMENT,
        assessmentHistory: [
          {
            date: "Feb 15",
            hypertensionRisk: 64,
            diabetesRisk: 58,
            overallRisk: 61,
            systolic: 145,
            diastolic: 92,
            weight: 76,
          },
          {
            date: "Apr 10",
            hypertensionRisk: 48,
            diabetesRisk: 44,
            overallRisk: 46,
            systolic: 132,
            diastolic: 85,
            weight: 73,
          }
        ],
        riskResults: {
          hypertensionRisk: 35,
          diabetesRisk: 32,
          overallRisk: 34,
          overallRiskLabel: "Medium",
          findings: ["Excellent overall metabolic and arterial biomarkers observed."],
          recommendations: ["Continue your positive hydration, custom diet, and workout habits!"]
        }
      }
    };
    localStorage.setItem("vitalcare_accounts", JSON.stringify(initialDb));
    return initialDb;
  });

  const [assessmentData, setAssessmentData] = useState<AssessmentData>(DEFAULT_ASSESSMENT);
  const [profileName, setProfileName] = useState<string>("");
  const [riskResults, setRiskResults] = useState<any>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync active states whenever changing accounts
  useEffect(() => {
    if (activeEmail && usersDb[activeEmail]) {
      const u = usersDb[activeEmail];
      setProfileName(u.displayName);
      setAssessmentData(u.assessmentData || DEFAULT_ASSESSMENT);
      setAssessmentHistory(u.assessmentHistory || []);
      setRiskResults(u.riskResults);
    } else {
      setProfileName("");
      setAssessmentData(DEFAULT_ASSESSMENT);
      setAssessmentHistory([]);
      setRiskResults(null);
    }
  }, [activeEmail]);

  // Save changes inside local database on updates to current states
  useEffect(() => {
    if (activeEmail && usersDb[activeEmail]) {
      const updatedUser = {
        ...usersDb[activeEmail],
        displayName: profileName,
        assessmentData,
        assessmentHistory,
        riskResults
      };
      const newDb = {
        ...usersDb,
        [activeEmail]: updatedUser
      };
      setUsersDb(newDb);
      localStorage.setItem("vitalcare_accounts", JSON.stringify(newDb));
    }
  }, [profileName, assessmentData, assessmentHistory, riskResults]);

  // Auth flow callbacks passed to ProfilePanel
  const handleLogin = (email: string, pass: string): boolean | string => {
    const formattedEmail = email.toLowerCase().trim();
    const user = usersDb[formattedEmail];
    if (!user) {
      return lang === "EN" 
        ? "No patient account located under this email." 
        : "এই ইমেইলে কোনো নিবন্ধিত রোগীর অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।";
    }
    if (user.password !== pass) {
      return lang === "EN" 
        ? "Incorrect security credentials password configuration." 
        : "ভুল পাসওয়ার্ড দেওয়া হয়েছে, পুনরায় চেষ্টা করুন।";
    }
    setActiveEmail(formattedEmail);
    return true;
  };

  const handleSignUp = (email: string, pass: string, name: string): boolean | string => {
    const formattedEmail = email.toLowerCase().trim();
    if (usersDb[formattedEmail]) {
      return lang === "EN" 
        ? "An account is already configured with this email." 
        : "এই ইমেইল অ্যাকাউন্টটি দিয়ে ইতিমধ্যেই একটি প্রোফাইল তৈরি করা আছে।";
    }
    if (!name.trim()) {
      return lang === "EN" ? "Display name cannot be blank." : "রোগীর প্রদর্শিত নাম ফাঁকা রাখা যাবে না।";
    }
    if (!email.includes("@")) {
      return lang === "EN" ? "Invalid email address format." : "অনুগ্রহ করে একটি সঠিক ইমেইল প্রদান করুন।";
    }
    if (pass.length < 5) {
      return lang === "EN" ? "Password must contain at least 5 letters." : "পাসওয়ার্ড অবশ্যই কমপক্ষে ৫ অক্ষরের হতে হবে।";
    }

    const newDb = {
      ...usersDb,
      [formattedEmail]: {
        displayName: name.trim(),
        password: pass,
        assessmentData: DEFAULT_ASSESSMENT,
        assessmentHistory: [],
        riskResults: null
      }
    };
    setUsersDb(newDb);
    localStorage.setItem("vitalcare_accounts", JSON.stringify(newDb));
    setActiveEmail(formattedEmail);
    return true;
  };

  const handleSignOut = () => {
    setActiveEmail("");
  };

  // Initialize light/dark theme class on mount and update
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (theme === "dark") {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  }, [theme]);

  // Initial risk computation local baseline on mount
  useEffect(() => {
    // Post initial data to populate the dashboard immediately if no results preloaded
    const fetchInitialRisk = async () => {
      if (activeEmail && usersDb[activeEmail]?.riskResults) {
        setRiskResults(usersDb[activeEmail].riskResults);
        return;
      }
      try {
        const response = await fetch("/api/assess", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(DEFAULT_ASSESSMENT),
        });
        if (response.ok) {
          const res = await response.json();
          setRiskResults(res);
        }
      } catch (err) {
        console.warn("Could not pre-fetch clinical assessment values, using initial layout indicators.");
      }
    };
    fetchInitialRisk();
  }, [activeEmail]);

  // Form submission handler to fetch server/local risk evaluation
  const handleAssessmentSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assessmentData),
      });

      if (!response.ok) {
        throw new Error("Assessment submission failed.");
      }

      const results = await response.json();
      setRiskResults(results);

      // Append new assessment score to trends array in state
      const formatMonth = new Date().toLocaleDateString(lang === "EN" ? "en-US" : "bn-BD", {
        month: "short",
        day: "numeric"
      });
      
      setAssessmentHistory(prev => [
        ...prev,
        {
          date: formatMonth,
          hypertensionRisk: results.hypertensionRisk,
          diabetesRisk: results.diabetesRisk,
          overallRisk: results.overallRisk,
          systolic: assessmentData.systolic,
          diastolic: assessmentData.diastolic,
          weight: assessmentData.weight,
        }
      ]);

      setView("dashboard");
    } catch (err) {
      console.error("Assessment submit failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const profileInitials = profileName
    ? profileName.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase() ?? "").join("")
    : "S";

  return (
    <div className="min-h-screen text-on-surface bg-background flex flex-col justify-between transition-colors duration-200">
      
      {/* Universal TopAppBar Navigation Header */}
      <header className="sticky top-0 bg-surface border-b border-outline-variant/35 z-40">
        <div className="flex justify-between items-center px-4 md:px-8 h-16 w-full max-w-7xl mx-auto">
          
          {/* Logo */}
          <div 
            onClick={() => setView("landing")} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <HeartPulse className="w-5 h-5 animate-pulse" />
            </span>
            <span className="text-xl font-bold tracking-tight text-primary font-sans select-none">
              VitalCare
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button 
              onClick={() => setView("landing")}
              className={`px-4 py-2 rounded-full font-bold text-xs tracking-tight transition-all uppercase ${
                view === "landing"
                  ? "bg-primary-container text-on-primary-container shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {lang === "EN" ? "Home" : "মূল পাতা"}
            </button>
            <button 
              onClick={() => setView("assess")}
              className={`px-4 py-2 rounded-full font-bold text-xs tracking-tight transition-all uppercase ${
                view === "assess"
                  ? "bg-primary-container text-on-primary-container shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {lang === "EN" ? "Assess" : "স্ক্রীনিং পরীক্ষা"}
            </button>
            <button 
              onClick={() => setView("dashboard")}
              className={`px-4 py-2 rounded-full font-bold text-xs tracking-tight transition-all uppercase ${
                view === "dashboard"
                  ? "bg-primary-container text-on-primary-container shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {lang === "EN" ? "Risks & Insights" : "ঝুঁকি ও অন্তর্দৃষ্টি"}
            </button>
            <button 
              onClick={() => setView("chat")}
              className={`px-4 py-2 rounded-full font-bold text-xs tracking-tight transition-all uppercase ${
                view === "chat"
                  ? "bg-primary-container text-on-primary-container shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {lang === "EN" ? "Health Agent" : "এআই সহায়ক"}
            </button>
          </nav>

          {/* Utility Toolbar Toggles */}
          <div className="flex items-center gap-3">
            
            {/* BN/EN Translation Button */}
            <button 
              id="lang-toggle-nav"
              onClick={() => setLang(lang === "EN" ? "BN" : "EN")}
              className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant hover:bg-surface-container rounded-full px-3 py-1.5 transition-colors border border-outline-variant/35"
              title={lang === "EN" ? "Switch to Bengali" : "ইংরেজি করুন"}
            >
              {lang === "EN" ? "BN / EN" : "EN / BN"}
            </button>

            {/* Theme Toggle */}
            <button 
              id="theme-toggle-nav"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container transition-all"
              title={theme === "light" ? "Switch to Dark Mode" : "লাইট মোড"}
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Profile Avatar Entry */}
            <div 
              onClick={() => setView("profile")}
              className="flex items-center gap-2 cursor-pointer hover:bg-surface-container/60 p-1.5 rounded-full transition-all border border-outline-variant/35"
              title="Health Profile Settings"
            >
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm tracking-tight">
                {profileInitials}
              </div>
              <span className="hidden md:inline text-xs font-bold text-on-surface pr-1.5 select-none hover:underline">
                {profileName}
              </span>
            </div>

          </div>

        </div>
      </header>

      {/* Main Pages Router wrapper */}
      <div className="flex-grow pb-16 md:pb-0">
        {view === "landing" && (
          <LandingPage 
            lang={lang} 
            setLang={setLang} 
            theme={theme} 
            setTheme={setTheme} 
            onNavigate={setView} 
          />
        )}
        
        {view === "dashboard" && (
          <RiskDashboard 
            lang={lang} 
            assessmentData={assessmentData} 
            riskResults={riskResults} 
            onNavigate={setView} 
            assessmentHistory={assessmentHistory}
            setAssessmentHistory={setAssessmentHistory}
            profileName={profileName}
            activeEmail={activeEmail}
          />
        )}

        {view === "assess" && (
          <AssessmentForm 
            lang={lang}
            data={assessmentData}
            setData={setAssessmentData}
            onNavigate={setView}
            onSubmit={handleAssessmentSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {view === "chat" && (
          <ChatbotPanel 
            lang={lang}
            onNavigate={setView}
          />
        )}

        {view === "profile" && (
          <ProfilePanel 
            lang={lang}
            profileName={profileName}
            setProfileName={setProfileName}
            assessmentData={assessmentData}
            onNavigate={setView}
            activeEmail={activeEmail}
            onLogin={handleLogin}
            onSignUp={handleSignUp}
            onSignOut={handleSignOut}
          />
        )}
      </div>

      {/* Universal Sticky AI Chatbot FAB Action representation */}
      {view !== "chat" && (
        <div className="fixed bottom-24 right-5 md:bottom-8 md:right-8 z-50">
          <button 
            onClick={() => setView("chat")}
            className="w-14 h-14 md:w-16 md:h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all group relative border border-on-primary/10"
            title={lang === "EN" ? "Chat with AI" : "এআই সহায়ক চ্যাট"}
          >
            <MessageSquare className="w-6 h-6 md:w-7 md:h-7 stroke-[2.5]" />
            <span className="absolute right-full mr-3 bg-inverse-surface text-inverse-on-surface px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
              {lang === "EN" ? "Speak to AI Counselor" : "এআই সহকারীর সাথে কথা বলুন"}
            </span>
          </button>
        </div>
      )}

      {/* Footer block (Desktop only) */}
      <footer className="hidden md:block w-full py-8 border-t border-outline-variant/35 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">VitalCare</span>
            <span className="text-on-surface-variant text-xs select-none">|</span>
            <span className="text-xs text-on-surface-variant font-medium">
              {lang === "EN" ? "NCD Health Risk Radar" : "এনসিডি স্বাস্থ্যঝুঁকি স্কীনিং রাডার"}
            </span>
          </div>
          
          <div className="flex gap-6 text-xs text-on-surface-variant font-medium">
            <span className="hover:underline cursor-not-allowed">Privacy Policy</span>
            <span className="hover:underline cursor-not-allowed">Terms of Service</span>
            <span className="hover:underline cursor-not-allowed">Help Center</span>
          </div>

          <p className="text-[11px] text-on-surface-variant">
            © 2026 VitalCare Health. All rights reserved. <strong className="text-red-500">{lang === "EN" ? "Disclaimer:" : "সতর্কতা:"}</strong> {lang === "EN" ? "For screening awareness only." : "কেবলমাত্র সচেতনতার জন্য।"}
          </p>
        </div>
      </footer>

      {/* Universal Mobile Bottom Navigation Bar conforming exactly to the user xpaths */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-20 bg-surface border-t border-outline-variant/35 px-2 pb-safe z-40 shadow-lg">
        
        {/* Home target */}
        <button 
          onClick={() => setView("landing")}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            view === "landing" ? "text-primary bg-primary-container/15 font-bold" : "text-on-surface-variant"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">{lang === "EN" ? "Home" : "হোম"}</span>
        </button>

        {/* Assess Form target */}
        <button 
          onClick={() => setView("assess")}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            view === "assess" ? "text-primary bg-primary-container/15 font-bold" : "text-on-surface-variant"
          }`}
        >
          <Activity className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">{lang === "EN" ? "Assess" : "স্ক্রীনিং"}</span>
        </button>

        {/* Dashboard target */}
        <button 
          onClick={() => setView("dashboard")}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            view === "dashboard" ? "text-primary bg-primary-container/15 font-bold" : "text-on-surface-variant"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">{lang === "EN" ? "Risks" : "ঝুঁকি"}</span>
        </button>

        {/* Chatbot target */}
        <button 
          onClick={() => setView("chat")}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            view === "chat" ? "text-primary bg-primary-container/15 font-bold" : "text-on-surface-variant"
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">{lang === "EN" ? "Agent" : "সহায়ক"}</span>
        </button>

        {/* Profile target */}
        <button 
          onClick={() => setView("profile")}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            view === "profile" ? "text-primary bg-primary-container/15 font-bold" : "text-on-surface-variant"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">{lang === "EN" ? "Profile" : "প্রোফাইল"}</span>
        </button>

      </nav>

    </div>
  );
}
