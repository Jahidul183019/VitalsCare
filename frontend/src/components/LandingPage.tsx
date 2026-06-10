import React from "react";
import { 
  HeartHandshake, 
  ChevronRight, 
  ArrowRight, 
  Check, 
  Activity, 
  Users, 
  FileText, 
  HelpCircle,
  HelpCircle as QuestionIcon,
  Shield, 
  PhoneCall, 
  Activity as MapIcon,
  Globe,
  Sun,
  Moon,
  MessageSquare,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { ViewType } from "../types";

interface LandingPageProps {
  lang: "EN" | "BN";
  setLang: (lang: "EN" | "BN") => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  onNavigate: (view: ViewType) => void;
}

export default function LandingPage({
  lang,
  setLang,
  theme,
  setTheme,
  onNavigate,
}: LandingPageProps) {
  
  const [activeSlide, setActiveSlide] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 6);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // High fidelity translations dictionary
  const t = {
    EN: {
      tag: "AI-POWERED PREVENTIVE CARE",
      heroTitle: "Identify Health Risks Before They Appear.",
      heroDesc: "Using advanced biometric analysis and regional data, VitalCare maps your health trajectory to provide actionable, clinical-grade risk assessments.",
      btnCheck: "Check Your Health Risk",
      btnRadar: "View Live Radar",
      diagTitle: "Precision Diagnostics",
      diagSubtitle: "Science-backed tools for proactive health management.",
      feat1Title: "Predictive Risk Modeling",
      feat1Desc: "Our algorithms analyze 150+ variables including genetics, lifestyle, and local environmental data to forecast potential metabolic and cardiovascular risks.",
      feat2Title: "Community Health",
      feat2Desc: "Engage with localized health trends and support groups monitored by certified clinicians.",
      feat2Count: "12 Active Threads Near You",
      feat3Title: "Custom Action Plans",
      feat3Desc: "Personalized nutrition and activity protocols designed to mitigate your specific high-risk factors.",
      feat4Title: "Real-time Clinic Integration",
      feat4Desc: "Directly sync your assessment results with partner clinics for seamless consultation.",
      feat4Action: "Find a clinic",
      stepsTitle: "3 Steps to Health Clarity",
      step1Name: "Data Intake",
      step1Desc: "Complete a 5-minute health profile and sync your wearable data.",
      step2Name: "AI Synthesis",
      step2Desc: "Our HIPAA-compliant engine cross-references clinical databases.",
      step3Name: "Risk Report",
      step3Desc: "Receive a prioritized dashboard with lifestyle interventions.",
      alertTitle: "Dengue Alert: High Risk Zone Detected",
      alertDesc: "Preventive measures updated for your current area. View latest guidelines.",
      alertAction: "Update Awareness",
      faqTitle: "Frequently Asked",
      faqQ1: "Is my health data secure?",
      faqA1: "We use AES-256 encryption and are fully HIPAA and GDPR compliant. Your data is yours; we never sell it to third parties.",
      faqQ2: "How accurate are the predictions?",
      faqA2: "Our models maintain a 92% sensitivity rate based on retrospective clinical trials. However, they are for awareness and do not replace professional medical advice.",
      faqQ3: "Can I sync with my Apple Watch?",
      faqA3: "Yes, VitalCare supports native integration with Apple Health, Google Fit, and Garmin devices.",
      ctaTitle: "Start Your Proactive Health Journey Today.",
      ctaDesc: "Join thousands of users taking control of their future health with VitalCare's Clinical Radar.",
      ctaBtn: "Create Free Health Profile",
      outcomes: "Patient Outcomes",
      quote1: "VitalCare flagged a potential hypertension risk three months before I felt any symptoms. The early intervention plan literally changed my life.",
      user1: "Ahmed Khan",
      user1Desc: "Active User, 42",
      quote2: "As a practitioner, having patients arrive with these risk data points makes our consultations 10x more efficient and data-driven.",
      user2: "Dr. Sarah Pervez",
      user2Desc: "Cardiologist",
    },
    BN: {
      tag: "এআই-চালিত প্রতিরোধমূলক যত্ন",
      heroTitle: "উদ্বেগ এড়াতে আগেই স্বাস্থ্যঝুঁকি জানুন।",
      heroDesc: "উন্নত বায়োমেট্রিক বিশ্লেষণ এবং আঞ্চলিক ডাটা ব্যবহার করে, ভাইটালকেয়ার আপনার স্বাস্থ্য গতিপথ নির্ধারণ করে এবং বাস্তবমুখী, ক্লিনিকাল-গ্রেড ঝুঁকি মূল্যায়ন প্রদান করে।",
      btnCheck: "স্বাস্থ্যঝুঁকি পরীক্ষা করুন",
      btnRadar: "লাইভ রাডার দেখুন",
      diagTitle: "নির্ভুল ডায়াগনস্টিকস",
      diagSubtitle: "সক্রিয় স্বাস্থ্য ব্যবস্থাপনার জন্য বিজ্ঞান সমর্থিত ডায়াগনস্টিকস টুলস।",
      feat1Title: "অনুমতিমূলক পূর্বাভাস মডেলিং",
      feat1Desc: "আমাদের গাণিতিক অ্যালগরিদম জেনেটিক্স, জীবনধারা এবং পরিবেশগত ডাটা সহ ১৫০টিরও বেশি ভেরিয়েবল বিশ্লেষণ করে সম্ভাব্য হৃদরোগের ঝুঁকি পূর্বাভাস দিতে সক্ষম।",
      feat2Title: "কমিউনিটি স্বাস্থ্য ফোরাম",
      feat2Desc: "প্রত্যয়িত চিকিৎসকদের দ্বারা স্থানীয় স্বাস্থ্য প্রবণতা এবং সহায়তা গোষ্ঠীগুলিতে যুক্ত হোন।",
      feat2Count: "আপনার পার্শ্ববর্তী ১২টি সক্রিয় আলোচনা ফোরাম",
      feat3Title: "ব্যক্তিগতকৃত জীবনধারা পরিকল্পনা",
      feat3Desc: "আপনার নির্দিষ্ট ঝুঁকি হ্রাস করার উদ্দেশ্যে কাস্টমাইজড পুষ্টি এবং ক্রিয়াকলাপের পরিকল্পনা।",
      feat4Title: "রিয়েল-টাইম ক্লিনিক ইন্টিগ্রেশন",
      feat4Desc: "সহজ পরামর্শের জন্য অংশীদার ক্লিনিকগুলোর সাথে সরাসরি আপনার স্বাস্থ্য পরীক্ষার ফল সিঙ্ক করুন।",
      feat4Action: "নিকটস্থ ক্লিনিক খুঁজুন",
      stepsTitle: "স্পষ্ট স্বাস্থ্য ধারণায় ৩টি সহজ ধাপ",
      step1Name: "ডাটা সংগ্রহ",
      step1Desc: "একটি ৫-মিনিটের স্বাস্থ্য প্রোফাইল পূরণ করুন এবং পরিধানযোগ্য ফিটনেস ব্যান্ড সিঙ্ক করুন।",
      step2Name: "এআই সংশ্লেষণ",
      step2Desc: "আমাদের সুরক্ষিত ইঞ্জিন ক্লিনিকাল ট্রায়ালের ডাটাবেসের সাথে তথ্য বিশ্লেষণ ও তুলনা করে।",
      step3Name: "ঝুঁকি প্রতিবেদন",
      step3Desc: "জীবনযাত্রার পরিবর্তন সংবলিত একটি অগ্রাধিকারমূলক ঝুঁকি পরিমাপ ড্যাশবোর্ড পান।",
      alertTitle: "ডেঙ্গু সতর্কতা: অতি ঝুঁকিপূর্ণ এলাকা চিহ্নিত",
      alertDesc: "আপনার বর্তমান এলাকার স্বাস্থ্য নির্দেশিকা আপডেট করা হয়েছে। সর্বশেষ গাইডলাইন দেখুন।",
      alertAction: "সচেতনতা আপডেট করুন",
      faqTitle: "সাধারণ প্রশ্নাবলী",
      faqQ1: "আমার স্বাস্থ্য সংক্রান্ত তথ্য কি নিরাপদ?",
      faqA1: "আমরা এইএস-২৫৬ এনক্রিপশন ব্যবহার করি এবং সম্পূর্ণ হিপা (HIPAA) ও জিডিপিআর কমপ্লায়েন্ট। আপনার তথ্য সম্পূর্ণ আপনার; আমরা কখনো তা বিক্রয় করি না।",
      faqQ2: "কতটা নির্ভুলভাবে পূর্বাভাস দেওয়া যায়?",
      faqA2: "আমাদের ক্লিনিক্যাল ট্রায়ালের ভিত্তিতে ৯২% পর্যন্ত সার্থকতা ধরে রাখা সম্ভব। তবে, এটি কেবল সচেতনতার জন্য এবং চিকিৎসকের সরাসরি প্রতিস্থাপন নয়।",
      faqQ3: "আমি কি অ্যাপল ওয়াচের সাথে সিঙ্ক করতে পারি?",
      faqA3: "হ্যাঁ, ভাইটালকেয়ার অ্যাপল হেলথ, গুগল ফিট এবং গারমিন ডিভাইসের সাথে সিঙ্ক করা সমর্থন করে।",
      ctaTitle: "আজই আপনার দীর্ঘমেয়াদী স্বাস্থ্যঝুঁকি মুক্ত যাত্রা শুরু করুন।",
      ctaDesc: "ভাইটালকেয়ার ক্লিনিকাল রাডার প্রযুক্তি ব্যবহার করে নিজের ভবিষ্যৎ সুস্থ জীবন নিয়ন্ত্রণকারী হাজারো মানুষের সাথে যোগ দিন।",
      ctaBtn: "ফ্রি হেলথ প্রোফাইল তৈরি করুন",
      outcomes: "রোগী ও বিশেষজ্ঞের অভিজ্ঞতা",
      quote1: "ভাইটালকেয়ার কোনো লক্ষণ প্রকাশের তিন মাস আগেই উচ্চ রক্তচাপের ঝুঁকি চিহ্নিত করেছিল। এই আগাম প্রতিরোধ পরিকল্পনা আমার জীবনকে সুস্থ রেখেছে।",
      user1: "আহমেদ খান",
      user1Desc: "সক্রিয় ব্যবহারকারী, ৪২",
      quote2: "একজন কার্ডিওলজিস্ট হিসেবে রোগীদের এই গুরুত্বপূর্ণ চার্ট এবং ঝুঁকি ডাটা হাতে নিয়ে আসতে দেখলে আমার রোগ নির্ণয় ১০ গুণ সহজ ও ডাটা-চালিত হয়ে যায়।",
      user2: "ডা. সারাহ পারভেজ",
      user2Desc: "হৃদরোগ বিশেষজ্ঞ",
    }
  };

  const currentT = t[lang];

  return (
    <div className="min-h-screen text-on-surface bg-background transition-colors duration-200">
      
      {/* Hero Section */}
      <section className="relative min-h-[700px] flex items-center pt-8 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-low/50 via-transparent to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Text Content */}
          <div className="max-w-3xl lg:w-[45%]">
            <span className="inline-block px-3 py-1 bg-primary-container text-on-primary-container font-semibold rounded-full text-xs tracking-wider mb-6 uppercase">
              {currentT.tag}
            </span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-on-surface mb-6 leading-tight">
              {currentT.heroTitle}
            </h2>
            <p className="text-lg md:text-xl text-on-surface-variant mb-8 max-w-xl leading-relaxed">
              {currentT.heroDesc}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                id="btn-landing-assess"
                onClick={() => onNavigate("assess")}
                className="bg-primary text-on-primary hover:bg-opacity-90 px-8 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-center flex items-center justify-center gap-2"
              >
                {currentT.btnCheck} <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                id="btn-landing-dashboard"
                onClick={() => onNavigate("dashboard")}
                className="border border-primary text-primary hover:bg-primary-container/10 px-8 py-4 rounded-xl font-bold transition-all active:scale-95 text-center"
              >
                {currentT.btnRadar}
              </button>
            </div>
            
            <div className="flex items-center gap-4 text-on-surface-variant">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-dim overflow-hidden">
                  <img 
                    alt="Doctor 1" 
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvaxSPCVyuVl8lerLZWuxIg_RSYgpye24-jH1ZACp7IaGlRHpKsz7H39vTtrW4GFT9cO6qFOlk2G57Tlk6q_gqAh1_E5hTEPvvHQRp92LPyvFbXJwb12O8CgNm2ufOJ9ZVgkV6x0ipaEHElM4Pd-2K2qqUYwqIbjsRNKIL87REtXGgAfgWNsfBxXvZrEdVYHioPvzvk_u767LTt8yqJkP1YvqNzAUVp0nSuaKlNPK9oO1q0T2pKwnzLoEsNkdKzdiUysz3Q-pR4Q-Y"
                  />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-dim overflow-hidden">
                  <img 
                    alt="Doctor 2" 
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8-Sv9_CeD_K2wqSA8cQ4Br56ETwYV9PbuYqFHejEYkWbSLxGXCC-e6P6riE0PWnBhh6PveQe0FeLMlNSJbpCPToYIyRIPWrHrKPgz4bXmZ44GRIl7IQj0Zb7UMMdUN4aC7RzIfRiEASavo4LOgnNkOno11ysmpRvIAdgcMajbojbppJiu2fQQQzNAlxZrBxOD0X4qcOYxdKJRrkIEYyBcVEQXDxjBCJm0fUtUqpTHJBz13juHnt1EMoIoj4Z6ylgghUi0QRSaJpyN"
                  />
                </div>
              </div>
              <p className="text-sm font-semibold">{currentT.trusted}</p>
            </div>
          </div>

          {/* Right Visual Content (Carousel) */}
          <div className="hidden lg:flex lg:w-[55%] relative justify-center items-center h-[600px] w-full">
            {/* Background Soft Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl transition-all duration-1000"></div>
            
            {/* Slide 1: Animated Radar */}
            <div className={`absolute flex items-center justify-center w-full transition-all duration-1000 transform ${activeSlide === 0 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
              <div className="relative w-[400px] h-[400px] rounded-full border border-primary/30 flex items-center justify-center bg-surface/40 backdrop-blur-sm shadow-[0_0_40px_rgba(0,107,95,0.15)] overflow-hidden">
                <div className="absolute w-[320px] h-[320px] rounded-full border border-primary/20"></div>
                <div className="absolute w-[240px] h-[240px] rounded-full border border-primary/20"></div>
                <div className="absolute w-[160px] h-[160px] rounded-full border border-primary/30"></div>
                <div className="absolute w-[80px] h-[80px] rounded-full border border-primary/40 bg-primary/10"></div>
                <div className="absolute w-full h-[1px] bg-primary/20"></div>
                <div className="absolute w-[1px] h-full bg-primary/20"></div>
                <div 
                  className="absolute w-1/2 h-1/2 origin-bottom-right animate-spin" 
                  style={{
                    top: 0,
                    left: 0,
                    background: 'conic-gradient(from 180deg at 100% 100%, transparent 0deg, rgba(20, 184, 166, 0.4) 90deg)',
                    animationDuration: '4s'
                  }}
                ></div>
                <div className="absolute top-1/4 left-1/3 w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_12px_#34d399] animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
                <div className="absolute top-[28%] left-[34%] w-1.5 h-1.5 bg-emerald-200 rounded-full"></div>
                <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-amber-400 rounded-full shadow-[0_0_12px_#fbbf24] animate-ping" style={{ animationDuration: '4s', animationDelay: '1.2s' }}></div>
                <div className="absolute top-[68%] right-[26%] w-1.5 h-1.5 bg-amber-200 rounded-full"></div>
                <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-primary rounded-full shadow-[0_0_12px_#006b5f] animate-ping" style={{ animationDuration: '2.5s', animationDelay: '2s' }}></div>
                <div className="absolute bottom-[26%] left-[26%] w-1 h-1 bg-primary-container rounded-full"></div>
                <Activity className="w-8 h-8 text-primary absolute z-10" />
              </div>
              <div 
                className="absolute bottom-4 right-8 bg-surface/90 backdrop-blur-md border border-outline-variant/40 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-3 animate-bounce" 
                style={{ animationDuration: '3s' }}
              >
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </div>
                <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider">Scanning Vitals</span>
              </div>
            </div>

            {/* Slide 2: Biometrics Dashboard */}
            <div className={`absolute flex items-center justify-center w-full transition-all duration-1000 transform ${activeSlide === 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
              <div className="relative w-[400px] bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/40 rounded-3xl p-8 shadow-2xl flex flex-col gap-5">
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-5">
                  <h4 className="font-bold text-on-surface text-lg">Live Biometrics</h4>
                  <Activity className="text-emerald-500 w-6 h-6 animate-pulse" />
                </div>
                {/* Heart Rate */}
                <div className="bg-surface-container-low rounded-xl p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-on-surface-variant font-bold tracking-wider">Heart Rate</p>
                      <p className="text-lg font-bold text-on-surface">72 <span className="text-xs font-normal">bpm</span></p>
                    </div>
                  </div>
                  <div className="h-8 w-12 flex items-end justify-between gap-1 opacity-80">
                    <div className="w-full bg-error rounded-t-sm h-[60%]"></div>
                    <div className="w-full bg-error rounded-t-sm h-[100%]"></div>
                    <div className="w-full bg-error rounded-t-sm h-[40%]"></div>
                    <div className="w-full bg-error rounded-t-sm h-[80%]"></div>
                  </div>
                </div>
                {/* Blood Pressure */}
                <div className="bg-surface-container-low rounded-xl p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                      <MapIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-on-surface-variant font-bold tracking-wider">Blood Pressure</p>
                      <p className="text-lg font-bold text-on-surface">118/75</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/50 px-2 py-1 rounded-md">Optimal</span>
                </div>
                {/* Risk Score */}
                <div className="mt-2 bg-surface-container-high rounded-xl p-4 shadow-sm border border-outline-variant/10">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant">Overall Risk Score</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Low Risk</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full w-[25%] rounded-full shadow-[0_0_10px_#34d399]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 3: AI Agent Chat */}
            <div className={`absolute flex items-center justify-center w-full transition-all duration-1000 transform ${activeSlide === 2 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
              <div className="relative w-[400px] bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/40 rounded-3xl p-6 shadow-2xl flex flex-col">
                <div className="flex items-center gap-4 border-b border-outline-variant/20 pb-5 mb-5">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface text-base">VitalCare Agent</h4>
                    <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="bg-surface-container-high p-3.5 rounded-2xl rounded-tl-sm text-xs text-on-surface shadow-sm self-start max-w-[85%] leading-relaxed">
                    Hello! I analyzed your recent biometric sync. Your resting heart rate has improved by 5% this week.
                  </div>
                  <div className="bg-primary text-on-primary p-3.5 rounded-2xl rounded-tr-sm text-xs shadow-sm self-end max-w-[85%] mt-1">
                    That's great! Should I adjust my cardio routine?
                  </div>
                  <div className="bg-surface-container-high p-3.5 rounded-2xl rounded-tl-sm text-xs text-on-surface shadow-sm self-start max-w-[85%] mt-1 relative">
                    Yes! Based on your low cardiovascular risk profile, I recommend increasing zone 2 training to 45 mins.
                    <span className="absolute -bottom-5 right-1 text-[9px] text-on-surface-variant font-medium">Just now</span>
                  </div>
                </div>
                {/* Typing indicator */}
                <div className="mt-8 flex items-center gap-1.5 text-on-surface-variant/50 p-2.5 border border-outline-variant/20 rounded-full bg-surface-container-lowest/50">
                  <div className="flex gap-1 pl-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{animationDelay: "0ms"}}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{animationDelay: "150ms"}}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{animationDelay: "300ms"}}></div>
                  </div>
                  <span className="text-[10px] ml-2 font-medium">Agent is typing...</span>
                </div>
              </div>
            </div>

            {/* Slide 4: Custom Action Plan */}
            <div className={`absolute flex items-center justify-center w-full transition-all duration-1000 transform ${activeSlide === 3 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
              <div className="relative w-[400px] h-[450px] bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/40 rounded-3xl p-8 shadow-2xl flex flex-col gap-5 overflow-hidden">
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-secondary/10 rounded-full blur-2xl"></div>
                
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-5 relative z-10">
                  <h4 className="font-bold text-on-surface text-lg">Action Plan</h4>
                  <FileText className="text-secondary w-6 h-6" />
                </div>
                
                <div className="space-y-4 mt-2 relative z-10">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-4 h-4" /></div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">Reduce Sodium</p>
                      <p className="text-[10px] text-on-surface-variant leading-tight mt-1">Limit intake to {"<"}1500mg daily to manage BP risk.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-4 h-4" /></div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">Evening Walks</p>
                      <p className="text-[10px] text-on-surface-variant leading-tight mt-1">25 mins daily. Great for metabolic health and lowering stress.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center shrink-0 mt-0.5"><Activity className="w-4 h-4" /></div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">Hydration Target</p>
                      <p className="text-[10px] text-on-surface-variant leading-tight mt-1">2.5L water minimum. You're currently at 1.8L.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto border-t border-outline-variant/20 pt-4 flex justify-between items-center relative z-10">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-on-surface-variant">Synthesized by AI</p>
                    <p className="text-xs font-bold text-primary mt-0.5 flex items-center gap-1"><Shield className="w-3 h-3" /> Clinically Validated</p>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-outline-variant/30 bg-surface flex items-center justify-center shadow-sm">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 5: Comprehensive Report */}
            <div className={`absolute flex items-center justify-center w-full transition-all duration-1000 transform ${activeSlide === 4 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
              <div className="relative w-[400px] h-[450px] bg-surface-container-lowest/90 backdrop-blur-xl border border-outline-variant/40 rounded-3xl p-8 shadow-2xl flex flex-col gap-4 overflow-hidden">
                <div className="flex justify-between items-start border-b border-outline-variant/20 pb-4">
                  <div>
                    <h4 className="font-bold text-on-surface text-lg">Comprehensive Report</h4>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">Generated: Today, 08:30 AM</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">92</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Overall Health Index</p>
                    <p className="text-[10px] text-on-surface-variant leading-tight mt-1">Top 15% for your demographic. Excellent cardiovascular parameters.</p>
                  </div>
                </div>

                {/* Simulated Chart */}
                <div className="mt-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 flex-1 flex flex-col">
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-4">Risk Factors Breakdown</p>
                  <div className="relative flex items-end justify-between flex-1 gap-4 h-24">
                    {/* Chart Grid Lines */}
                    <div className="absolute inset-x-0 top-0 border-t border-outline-variant/20 border-dashed"></div>
                    <div className="absolute inset-x-0 top-1/3 border-t border-outline-variant/20 border-dashed"></div>
                    <div className="absolute inset-x-0 top-2/3 border-t border-outline-variant/20 border-dashed"></div>
                    
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-end gap-2">
                      <div className="w-full bg-emerald-500 rounded-t-sm h-[30%] shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-pulse"></div>
                      <span className="text-[9px] text-on-surface-variant font-medium">Cardio</span>
                    </div>
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-end gap-2">
                      <div className="w-full bg-amber-500 rounded-t-sm h-[60%] shadow-[0_0_10px_rgba(245,158,11,0.3)] animate-pulse" style={{animationDelay: '0.5s'}}></div>
                      <span className="text-[9px] text-on-surface-variant font-medium">Metabolic</span>
                    </div>
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-end gap-2">
                      <div className="w-full bg-emerald-500 rounded-t-sm h-[20%] shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-pulse" style={{animationDelay: '1s'}}></div>
                      <span className="text-[9px] text-on-surface-variant font-medium">Genetic</span>
                    </div>
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-end gap-2">
                      <div className="w-full bg-error rounded-t-sm h-[85%] shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-pulse" style={{animationDelay: '1.5s'}}></div>
                      <span className="text-[9px] text-on-surface-variant font-bold text-error">Stress</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="w-full py-3 rounded-xl border border-primary text-primary text-xs font-bold hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    Download Full PDF <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 6: Historical Trends */}
            <div className={`absolute flex items-center justify-center w-full transition-all duration-1000 transform ${activeSlide === 5 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
              <div className="relative w-[400px] h-[450px] bg-surface-container-lowest/90 backdrop-blur-xl border border-outline-variant/40 rounded-3xl p-8 shadow-2xl flex flex-col gap-4 overflow-hidden">
                <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
                
                <div className="flex justify-between items-start border-b border-outline-variant/20 pb-4 relative z-10">
                  <div>
                    <h4 className="font-bold text-on-surface text-lg">Historical Trends</h4>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">Previous Assessments</p>
                  </div>
                  <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex-1 mt-2 relative z-10 flex flex-col">
                  {/* Y-axis Labels */}
                  <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[9px] text-on-surface-variant py-4">
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                    <span>0%</span>
                  </div>

                  {/* Chart Area */}
                  <div className="ml-8 flex-1 relative border-l border-b border-outline-variant/30 flex items-end">
                    {/* Horizontal Grid Lines */}
                    <div className="absolute inset-x-0 top-0 border-t border-outline-variant/20 border-dashed"></div>
                    <div className="absolute inset-x-0 top-1/4 border-t border-outline-variant/20 border-dashed"></div>
                    <div className="absolute inset-x-0 top-2/4 border-t border-outline-variant/20 border-dashed"></div>
                    <div className="absolute inset-x-0 top-3/4 border-t border-outline-variant/20 border-dashed"></div>
                    
                    {/* SVG Line Chart */}
                    <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path 
                        d="M 0,80 C 15,80 15,50 33,50 C 50,50 50,60 66,60 C 80,60 85,20 100,20" 
                        fill="none" 
                        stroke="url(#trendGradient)" 
                        strokeWidth="3" 
                        className="animate-[dash_3s_ease-out_forwards]"
                        strokeDasharray="300"
                        strokeDashoffset="300"
                        vectorEffect="non-scaling-stroke"
                      />
                      <defs>
                        <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ef4444" /> {/* error */}
                          <stop offset="50%" stopColor="#f59e0b" /> {/* amber */}
                          <stop offset="100%" stopColor="#10b981" /> {/* emerald */}
                        </linearGradient>
                        <style>
                          {`
                            @keyframes dash {
                              to {
                                stroke-dashoffset: 0;
                              }
                            }
                          `}
                        </style>
                      </defs>
                    </svg>

                    {/* Data Points */}
                    <div className="absolute left-[0%] bottom-[20%] w-3 h-3 bg-surface border-2 border-error rounded-full shadow-lg shadow-error/20 transform -translate-x-1/2 translate-y-1/2 animate-ping" style={{animationDuration: '3s'}}></div>
                    <div className="absolute left-[0%] bottom-[20%] w-3 h-3 bg-surface border-2 border-error rounded-full shadow-lg shadow-error/20 transform -translate-x-1/2 translate-y-1/2 z-10"></div>
                    
                    <div className="absolute left-[33%] bottom-[50%] w-3 h-3 bg-surface border-2 border-amber-500 rounded-full shadow-lg shadow-amber-500/20 transform -translate-x-1/2 translate-y-1/2 z-10 transition-all"></div>
                    
                    <div className="absolute left-[66%] bottom-[40%] w-3 h-3 bg-surface border-2 border-amber-400 rounded-full shadow-lg transform -translate-x-1/2 translate-y-1/2 z-10"></div>
                    
                    <div className="absolute left-[100%] bottom-[80%] w-4 h-4 bg-surface border-[3px] border-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] transform -translate-x-1/2 translate-y-1/2 z-10"></div>
                    <div className="absolute left-[100%] bottom-[80%] w-4 h-4 bg-surface border-[3px] border-emerald-500 rounded-full transform -translate-x-1/2 translate-y-1/2 animate-ping" style={{animationDuration: '2s'}}></div>
                  </div>

                  {/* X-axis Labels */}
                  <div className="ml-8 mt-2 flex justify-between text-[9px] text-on-surface-variant">
                    <span>Jan</span>
                    <span>Mar</span>
                    <span>May</span>
                    <span>Jul</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl relative z-10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Risk Reduced by 45%</p>
                    <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 leading-tight mt-0.5">Your hypertension risk has steadily declined over 6 months.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <button 
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${activeSlide === i ? 'w-8 bg-primary' : 'w-2 bg-outline-variant/40 hover:bg-outline-variant'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Precision Diagnostics Features Section */}
      <section className="py-16 bg-surface-container-low border-y border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold tracking-tight mb-2 text-on-surface">
              {currentT.diagTitle}
            </h3>
            <p className="text-on-surface-variant">{currentT.diagSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="md:col-span-2 bg-surface-container-lowest border border-outline-variant/40 hover:border-primary/50 p-8 rounded-2xl transition-all duration-300 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 mb-6">
                  <Activity className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-on-surface">{currentT.feat1Title}</h4>
                <p className="text-on-surface-variant max-w-xl leading-relaxed">{currentT.feat1Desc}</p>
              </div>
            </div>

            {/* Feature 2: High intensity block */}
            <div onClick={() => onNavigate("assess")} className="cursor-pointer bg-primary text-on-primary p-8 rounded-2xl flex flex-col justify-between hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/20 text-on-primary mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold mb-3">{currentT.feat2Title}</h4>
                <p className="opacity-90 text-sm leading-relaxed">{currentT.feat2Desc}</p>
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-white/20 pt-4">
                <span className="text-xs font-semibold">{currentT.feat2Count}</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface-container-lowest border border-outline-variant/40 hover:border-primary/50 p-8 rounded-2xl flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 mb-6">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-on-surface">{currentT.feat3Title}</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed">{currentT.feat3Desc}</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="md:col-span-2 bg-surface-container-lowest border border-outline-variant/40 hover:border-primary/50 p-8 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center shadow-sm">
              <div className="flex flex-col h-full justify-between py-2">
                <div>
                  <h4 className="text-xl font-bold mb-3 text-on-surface">{currentT.feat4Title}</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{currentT.feat4Desc}</p>
                </div>
                <button 
                  onClick={() => onNavigate("dashboard")}
                  className="text-primary font-bold text-sm flex items-center gap-1.5 hover:underline text-left"
                >
                  {currentT.feat4Action} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="h-44 rounded-xl overflow-hidden border border-outline-variant bg-surface-dim relative">
                <img 
                  alt="Map location" 
                  className="w-full h-full object-cover brightness-95 opacity-80" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWk3kfwcViSbhlmzvY_FtLNpujo5ALT9G6NtHUCvzmTTW3T3Pi1qYUrK6ZDH76Medgj4a_JMgrXDfQT-hqht-wZYngD6ae5WxmkQs1iNTtARF1-uahTI5FClFj7H-G89hW1NMMhNIickExm3b8jWifXuGXcst5KxfbzgnuO3SVdiptgrM0YtrV21WmWsjMmoVkCrgVLsyUGtRRRezXXXw_2hFKNQSzBObXb-LQ-cbNfOhaFql2eDJ-zvppsTCBwE1SO6SXTXWg4j6e"
                />
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                  <span className="bg-surface text-primary px-4 py-2 rounded-full font-bold text-xs shadow hover:scale-105 duration-200">
                    {currentT.feat4Action}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works section */}
      <section className="py-20 bg-secondary-container/30 text-on-secondary-container">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h3 className="text-3xl font-bold text-center mb-16 text-on-secondary-container">
            {currentT.stepsTitle}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-8 left-16 right-16 h-[2px] bg-secondary/20 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-2xl mb-6 shadow-md">
                1
              </div>
              <h4 className="text-xl font-bold mb-3">{currentT.step1Name}</h4>
              <p className="text-on-surface-variant max-w-xs">{currentT.step1Desc}</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-2xl mb-6 shadow-md">
                2
              </div>
              <h4 className="text-xl font-bold mb-3">{currentT.step2Name}</h4>
              <p className="text-on-surface-variant max-w-xs">{currentT.step2Desc}</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-2xl mb-6 shadow-md">
                3
              </div>
              <h4 className="text-xl font-bold mb-3">{currentT.step3Name}</h4>
              <p className="text-on-surface-variant max-w-xs">{currentT.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Awareness Emergency Danger Banner */}
      <section className="py-6 bg-error text-on-error relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-on-error shrink-0 animate-pulse">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-lg font-bold">{currentT.alertTitle}</p>
              <p className="opacity-95 text-sm mt-1">{currentT.alertDesc}</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate("assess")} 
            className="bg-white text-error font-bold px-6 py-3 rounded-full hover:bg-white/90 active:scale-95 transition-all text-sm shrink-0"
          >
            {currentT.alertAction}
          </button>
        </div>
      </section>

      {/* Patient Outcomes & Testimonials / FAQ Screen */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Patient outcomes testimonials */}
          <div className="flex flex-col gap-6">
            <h3 className="text-3xl font-bold text-on-surface mb-4">{currentT.outcomes}</h3>
            
            <div className="p-6 bg-surface-container border border-outline-variant/30 rounded-2xl relative flex flex-col justify-between min-h-[160px] shadow-sm">
              <p className="italic text-on-surface-variant mb-6 pl-4 border-l-2 border-primary">
                "{currentT.quote1}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center font-bold text-on-secondary-container">
                  AK
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm">{currentT.user1}</p>
                  <p className="text-xs text-on-surface-variant">{currentT.user1Desc}</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-surface-container border border-outline-variant/30 rounded-2xl relative flex flex-col justify-between min-h-[160px] shadow-sm">
              <p className="italic text-on-surface-variant mb-6 pl-4 border-l-2 border-primary">
                "{currentT.quote2}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center font-bold text-on-primary-container">
                  SP
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm">{currentT.user2}</p>
                  <p className="text-xs text-on-surface-variant">{currentT.user2Desc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ panel toggle layout */}
          <div className="flex flex-col gap-6">
            <h3 className="text-3xl font-bold text-on-surface mb-4">{currentT.faqTitle}</h3>
            <div className="space-y-4">
              
              <details className="group bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 cursor-pointer hover:bg-surface-container transition-colors shadow-sm" open>
                <summary className="font-bold flex justify-between items-center list-none text-on-surface">
                  <span>{currentT.faqQ1}</span>
                  <HelpCircle className="w-5 h-5 text-primary group-open:rotate-180 duration-200 transition-transform" />
                </summary>
                <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                  {currentT.faqA1}
                </p>
              </details>

              <details className="group bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 cursor-pointer hover:bg-surface-container transition-colors shadow-sm">
                <summary className="font-bold flex justify-between items-center list-none text-on-surface">
                  <span>{currentT.faqQ2}</span>
                  <HelpCircle className="w-5 h-5 text-primary group-open:rotate-180 duration-200 transition-transform" />
                </summary>
                <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                  {currentT.faqA2}
                </p>
              </details>

              <details className="group bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 cursor-pointer hover:bg-surface-container transition-colors shadow-sm">
                <summary className="font-bold flex justify-between items-center list-none text-on-surface">
                  <span>{currentT.faqQ3}</span>
                  <HelpCircle className="w-5 h-5 text-primary group-open:rotate-180 duration-200 transition-transform" />
                </summary>
                <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                  {currentT.faqA3}
                </p>
              </details>

            </div>
          </div>
        </div>
      </section>

      {/* Final Section CTAs */}
      <section className="py-24 bg-inverse-surface text-inverse-on-surface relative">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            {currentT.ctaTitle}
          </h2>
          <p className="text-lg opacity-85 max-w-2xl mx-auto mb-10 leading-relaxed">
            {currentT.ctaDesc}
          </p>
          <button 
            id="btn-landing-profile"
            onClick={() => onNavigate("assess")}
            className="bg-primary hover:bg-opacity-95 text-on-primary px-10 py-5 rounded-full font-bold transition-all shadow-2xl hover:scale-105 active:scale-95 text-lg"
          >
            {currentT.ctaBtn}
          </button>
        </div>
      </section>

    </div>
  );
}
