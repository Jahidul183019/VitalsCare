import React, { useState, useEffect } from "react";
import { 
  User, 
  Settings, 
  Activity, 
  Scale, 
  Calendar, 
  CheckCircle, 
  Check, 
  Heart, 
  Info,
  ChevronLeft,
  Mail,
  Lock,
  LogOut,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { AssessmentData, ViewType } from "../types";

interface ProfilePanelProps {
  lang: "EN" | "BN";
  profileName: string;
  setProfileName: (name: string) => void;
  assessmentData: AssessmentData;
  onNavigate: (view: ViewType) => void;
  activeEmail: string;
  onLogin: (email: string, pass: string) => Promise<boolean | string> | boolean | string;
  onSignUp: (email: string, pass: string, name: string) => Promise<boolean | string> | boolean | string;
  onSignOut: () => void | Promise<void>;
}

export default function ProfilePanel({
  lang,
  profileName,
  setProfileName,
  assessmentData,
  onNavigate,
  activeEmail,
  onLogin,
  onSignUp,
  onSignOut,
}: ProfilePanelProps) {
  
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [emailText, setEmailText] = useState("");
  const [passwordText, setPasswordText] = useState("");
  const [nameText, setNameText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const [tempName, setTempName] = useState(profileName);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setTempName(profileName);
  }, [profileName]);

  const handleSaveProfile = () => {
    if (tempName.trim()) {
      setProfileName(tempName.trim());
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setAuthSuccess("");

    if (activeTab === "login") {
      const res = await onLogin(emailText, passwordText);
      if (typeof res === "string") {
        setErrorMessage(res);
      } else if (res === true) {
        setAuthSuccess(lang === "EN" ? "Welcome back!" : "স্বাগতম!");
        setEmailText("");
        setPasswordText("");
      }
    } else {
      const res = await onSignUp(emailText, passwordText, nameText);
      if (typeof res === "string") {
        setErrorMessage(res);
      } else if (res === true) {
        setAuthSuccess(lang === "EN" ? "Account created successfully!" : "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");
        setEmailText("");
        setPasswordText("");
        setNameText("");
      }
    }
  };

  const hM = (assessmentData.height || 175) / 100;
  const bmi = (assessmentData.weight || 70) / (hM * hM);

  const t = {
    EN: {
      header: "Patient Space & Registries",
      desc: "Authenticate to manage separate clinic records, or customize your local patient identity and historic biomarkers.",
      personalLabel: "Customize Profile",
      nameLabel: "Welcome Display Name",
      saveBtn: "Save Profile Header",
      saved: "Saved Successfully!",
      biometrics: "Latest Screened Biomarkers",
      bpVal: "Blood Pressure",
      bmiVal: "Body Mass Index (BMI)",
      activityVal: "Activity Level",
      dietVal: "Diet Quality",
      historyVal: "Hereditary Family Markers",
      hasMarker: "Active",
      noMarker: "Cleared",
      diabetes: "Diabetes Mellitus",
      hypertension: "Hypertension",
      stroke: "Arterial Stroke",
      heartDisease: "Coronary Heart Disease",
      authCardTitle: "Secure Patient Registry Access",
      emailPh: "E.g. sarah@domain.com",
      passPh: "Security Password",
      namePh: "Patient Display Name",
      loginTab: "Sign In",
      registerTab: "Sign Up",
      logoutBtn: "Log Out Profiles",
      activeAs: "Logged in securely as",
      guestNotice: "Browsing in Guest Mode. Connect or register an account to isolate screening logs and view trends over sessions."
    },
    BN: {
      header: "রোগী অঞ্চল এবং নিবন্ধন",
      desc: "নিবন্ধন পৃথক ক্লিনিক রেকর্ড করতে সাহায্য করে, অথবা আপনার বর্তমান প্রোফাইলের নাম এবং স্ক্রীনড বায়োমার্কার কাস্টমাইজ করুন।",
      personalLabel: "রোগীর নাম কাস্টমাইজ",
      nameLabel: "স্বাগতম নাম (ড্যাশবোর্ড)",
      saveBtn: "নাম সংরক্ষণ করুন",
      saved: "সফলভাবে সংরক্ষিত হয়েছে!",
      biometrics: "সর্বশেষ পরীক্ষিত স্বাস্থ্য নির্দেশক",
      bpVal: "রক্তচাপ (BP)",
      bmiVal: "বডি মাস ইনডেক্স (BMI)",
      activityVal: "শারীরিক পরিশ্রমের মাত্রা",
      dietVal: "খাদ্যতালিকাগত পুষ্টি মান",
      historyVal: "বংশগত বা ক্রনিক পারিবারিক ইতিহাস",
      hasMarker: "সক্রিয় ঝুঁকি ফোরাম",
      noMarker: "ঝুঁকিমুক্ত",
      diabetes: "ডায়াবেটিস মেলিটাস",
      hypertension: "গুরুতর উচ্চ রক্তচাপ",
      stroke: "মস্তিষ্কে স্ট্রোক",
      heartDisease: "হৃদরোগ (Coronary)",
      authCardTitle: "সুরক্ষিত রোগী রেকর্ড অ্যাক্সেস",
      emailPh: "উদাহরণ: patient@care.com",
      passPh: "নিরাপত্তা পাসওয়ার্ড",
      namePh: "রোগী প্রদর্শিত নাম",
      loginTab: "লগ ইন",
      registerTab: "নিবন্ধন করুন",
      logoutBtn: "লগ আউট করুন",
      activeAs: "সুরক্ষিত লগইন অ্যাকাউন্ট",
      guestNotice: "অতিথি মোডে ব্রাউজ করছেন। পৃথক স্বাস্থ্য রেকর্ড ট্র্যাক করতে এবং ড্যাশবোর্ড সেশন হিস্ট্রি ধরে রাখতে লগইন বা অ্যাকাউন্ট তৈরি করুন।"
    }
  };

  const currentT = t[lang];

  return (
    <div className="min-h-screen text-on-surface bg-background py-8 font-sans">
      <main className="max-w-4xl mx-auto px-4 space-y-8">
        
        {/* Navigation back and header */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate("dashboard")}
            id="back-to-dashboard-btn"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline bg-surface-container/50 px-4 py-2 rounded-full duration-150 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> {lang === "EN" ? "Back to Dashboard" : "ড্যাশবোর্ডে ফিরে যান"}
          </button>
        </div>

        {/* Title */}
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface flex items-center gap-2 justify-center md:justify-start">
            <User className="w-8 h-8 text-primary" /> {currentT.header}
          </h2>
          <p className="text-on-surface-variant text-sm leading-relaxed max-w-2xl mt-2">
            {currentT.desc}
          </p>
        </div>

        {/* Authenticate Notice or Guest Alert banner */}
        {!activeEmail && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3 text-xs text-primary max-w-4xl">
            <Info className="w-5 h-5 shrink-0" />
            <p>{currentT.guestNotice}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT CONTAINER: Auth Cards OR Customize Name card (Spans 5 columns) */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {activeEmail ? (
              /* IF LOGGED IN: Manage profile details */
              <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full gap-6">
                <div className="space-y-5">
                  <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20 pb-3 flex items-center justify-between">
                    <span>{currentT.personalLabel}</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-extrabold font-mono uppercase">
                      ONLINE
                    </span>
                  </h3>

                  <div className="bg-surface-container/50 rounded-2xl p-4 border border-outline-variant/10 text-xs">
                    <span className="text-on-surface-variant/80 block uppercase tracking-wider font-extrabold text-[10px]">
                      {currentT.activeAs}
                    </span>
                    <span className="text-primary font-bold block truncate mt-1 text-sm">
                      {activeEmail}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">
                      {currentT.nameLabel}
                    </label>
                    <input 
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="bg-background border border-outline-variant/50 focus:border-primary rounded-xl px-4 py-3 text-xs md:text-sm font-bold tracking-tight text-on-surface outline-none"
                      placeholder="E.g. Sarah"
                    />
                  </div>
                </div>

                <div className="space-y-3 mt-8">
                  <button 
                    onClick={handleSaveProfile}
                    id="save-profile-btn"
                    className="w-full bg-primary text-on-primary hover:bg-opacity-95 py-3 rounded-xl font-bold text-xs tracking-tight transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="w-4 h-4" /> {currentT.saved}
                      </>
                    ) : (
                      currentT.saveBtn
                    )}
                  </button>

                  <button 
                    onClick={onSignOut}
                    id="sign-out-btn"
                    className="w-full bg-surface-container hover:bg-surface-container-high text-red-500 dark:text-red-400 border border-outline-variant/20 py-2.5 rounded-xl font-bold text-xs tracking-tight transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> {currentT.logoutBtn}
                  </button>
                </div>
              </div>
            ) : (
              /* IF LOGGED OUT: Stack local personalized details & account login tabs */
              <>
                {/* Guest Personalizer */}
                <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20 pb-3 flex items-center justify-between">
                    <span>{currentT.personalLabel}</span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded font-extrabold font-mono uppercase">
                      GUEST MODE
                    </span>
                  </h3>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">
                      {currentT.nameLabel}
                    </label>
                    <input 
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="bg-background border border-outline-variant/50 focus:border-primary rounded-xl px-4 py-3 text-xs md:text-sm font-bold tracking-tight text-on-surface outline-none"
                      placeholder="E.g. Sarah Jameel"
                    />
                  </div>

                  <button 
                    onClick={handleSaveProfile}
                    id="save-guest-profile-btn"
                    className="w-full bg-primary text-on-primary hover:bg-opacity-95 py-2.5 rounded-xl font-bold text-xs tracking-tight transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="w-4 h-4" /> {currentT.saved}
                      </>
                    ) : (
                      currentT.saveBtn
                    )}
                  </button>
                </div>

                {/* Authentication Interface Tabs */}
                <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 shadow-sm flex flex-col gap-4 font-sans text-left">
                  <div>
                    <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20 pb-3">
                      {currentT.authCardTitle}
                    </h3>

                    {/* Tabs */}
                    <div className="flex bg-surface-container/50 border border-outline-variant/20 p-1.5 rounded-xl gap-2 mt-4">
                      <button 
                        onClick={() => { setActiveTab("login"); setErrorMessage(""); setAuthSuccess(""); }}
                        className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          activeTab === "login" 
                            ? "bg-primary text-on-primary shadow-sm" 
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        {currentT.loginTab}
                      </button>
                      <button 
                        onClick={() => { setActiveTab("signup"); setErrorMessage(""); setAuthSuccess(""); }}
                        className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          activeTab === "signup" 
                            ? "bg-primary text-on-primary shadow-sm" 
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        {currentT.registerTab}
                      </button>
                    </div>

                    <form onSubmit={handleAuthAction} className="space-y-4 mt-5">
                      {errorMessage && (
                        <div className="bg-red-500/10 border border-red-500/35 text-red-600 dark:text-red-400 p-3 rounded-xl flex gap-2 text-xs font-bold animate-fadeIn">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{errorMessage}</span>
                        </div>
                      )}

                      {authSuccess && (
                        <div className="bg-emerald-500/10 border border-emerald-500/35 text-emerald-600 p-3 rounded-xl flex gap-1.5 text-xs font-bold animate-fadeIn">
                          <Check className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{authSuccess}</span>
                        </div>
                      )}

                      {activeTab === "signup" && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wide">
                            {currentT.namePh}
                          </label>
                          <input 
                            type="text"
                            required
                            value={nameText}
                            onChange={(e) => setNameText(e.target.value)}
                            className="bg-background border border-outline-variant/50 focus:border-primary rounded-xl px-3.5 py-2.5 text-xs font-bold tracking-tight text-on-surface outline-none"
                            placeholder="E.g. Sarah Jameel"
                          />
                        </div>
                      )}

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wide">
                          Email Address
                        </label>
                        <div className="relative flex items-center">
                          <Mail className="w-4 h-4 text-on-surface-variant/70 absolute left-3" />
                          <input 
                            type="email"
                            required
                            value={emailText}
                            onChange={(e) => setEmailText(e.target.value)}
                            className="bg-background border border-outline-variant/50 focus:border-primary rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-bold tracking-tight text-on-surface outline-none w-full"
                            placeholder={currentT.emailPh}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wide">
                          {currentT.passPh}
                        </label>
                        <div className="relative flex items-center">
                          <Lock className="w-4 h-4 text-on-surface-variant/70 absolute left-3" />
                          <input 
                            type="password"
                            required
                            value={passwordText}
                            onChange={(e) => setPasswordText(e.target.value)}
                            className="bg-background border border-outline-variant/50 focus:border-primary rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-bold tracking-tight text-on-surface outline-none w-full"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        id="auth-submit-btn"
                        className="w-full bg-primary text-on-primary hover:bg-opacity-95 py-3 rounded-xl font-bold text-xs tracking-tight transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm mt-6 cursor-pointer"
                      >
                        {activeTab === "login" ? currentT.loginTab : currentT.registerTab}
                      </button>
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Card 2: List current Screening indicators (Spans 7 columns) */}
          <div className="md:col-span-7 bg-surface-container border border-outline-variant/30 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20 pb-3 flex items-center gap-1.5">
              <Activity className="w-4.5 h-4.5 text-primary" /> {currentT.biometrics}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              
              {/* BP stats */}
              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 flex flex-col justify-between h-24">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wide">{currentT.bpVal}</span>
                <span className="text-lg font-extrabold text-on-surface">
                  {assessmentData.systolic}/{assessmentData.diastolic} <span className="text-xs font-semibold text-on-surface-variant">mmHg</span>
                </span>
              </div>

              {/* BMI stats */}
              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 flex flex-col justify-between h-24">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wide">{currentT.bmiVal}</span>
                <span className="text-lg font-extrabold text-on-surface">
                  {bmi.toFixed(1)} <span className="text-xs font-semibold text-on-surface-variant">kg/m²</span>
                </span>
              </div>

              {/* Workout */}
              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 flex flex-col justify-between h-24">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wide">{currentT.activityVal}</span>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wider w-fit">
                  {assessmentData.activityLevel}
                </span>
              </div>

              {/* Diet */}
              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 flex flex-col justify-between h-24">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wide">{currentT.dietVal}</span>
                <span className="text-xs font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full uppercase tracking-wider w-fit">
                  {assessmentData.dietQuality}
                </span>
              </div>

            </div>
          </div>

          {/* Card 3: Hereditary Active risks lists (Spans 12 columns) */}
          <div className="col-span-1 md:col-span-12 bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-extrawide select-none">
              {currentT.historyVal}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                { label: currentT.diabetes, val: assessmentData.familyHistory.diabetes },
                { label: currentT.hypertension, val: assessmentData.familyHistory.hypertension },
                { label: currentT.stroke, val: assessmentData.familyHistory.stroke },
                { label: currentT.heartDisease, val: assessmentData.familyHistory.heartDisease }
              ].map((fh, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    fh.val
                      ? "border-red-400 bg-red-100/10 text-red-600 dark:text-red-400 font-bold"
                      : "border-outline-variant/30 text-on-surface-variant bg-background/25"
                  }`}
                >
                  <span className="text-xs tracking-tight">{fh.label}</span>
                  <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded ${
                    fh.val
                      ? "bg-red-500 text-white"
                      : "bg-surface-container text-on-surface-variant"
                  }`}>
                    {fh.val ? currentT.hasMarker : currentT.noMarker}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
