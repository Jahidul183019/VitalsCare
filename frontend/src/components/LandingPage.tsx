import { Heart, Activity, ShieldAlert, Users, TrendingDown, ArrowRight, ShieldCheck, HeartPulse, Home } from 'lucide-react';
import { ScreenType, TransitionType } from '../types';

interface LandingPageProps {
  onNavigate: (screen: ScreenType, transition: TransitionType) => void;
  profileName: string;
  profileInitials: string;
  onProfileClick?: () => void;
}

export default function LandingPage({ onNavigate, profileName, profileInitials, onProfileClick }: LandingPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 text-neutral-800 font-sans selection:bg-teal-700 selection:text-white pb-16 md:pb-0">
      {/* Header element conforming to xpaths */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200/50 py-4 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2.5 text-teal-800">
          <HeartPulse className="w-8 h-8 text-teal-700 animate-pulse" />
          <span className="text-2xl font-bold tracking-tight text-teal-800">VitalsCare</span>
        </div>
        
        {/* Navigation block containing anchors matching xpath selection */}
        <nav className="hidden md:flex items-center gap-8">
          <a 
            href="#" 
            className="text-teal-900 font-semibold px-3 py-1.5 rounded-full bg-teal-50 transition-colors"
            onClick={(e) => { e.preventDefault(); onNavigate('landing', 'none'); }}
          >
            Home
          </a>
          <a 
            href="#" 
            className="text-neutral-600 hover:text-teal-700 transition-colors px-3 py-1.5 rounded-full hover:bg-neutral-100"
            onClick={(e) => { e.preventDefault(); onNavigate('assessment', 'none'); }}
          >
            Assess
          </a>
          <a 
            href="#" 
            className="text-neutral-600 hover:text-teal-700 transition-colors px-3 py-1.5 rounded-full hover:bg-neutral-100"
            onClick={(e) => { e.preventDefault(); onNavigate('dashboard', 'none'); }}
          >
            Insights
          </a>
        </nav>

            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => onNavigate('assessment', 'push')}
                className="bg-teal-600 text-white font-medium hover:bg-teal-700 tracking-tight transition-all duration-200 px-6 py-2.5 rounded-full soft-shadow hover:-translate-y-0.5"
              >
                Check Risks
              </button>
              <div onClick={() => onProfileClick?.()} className="flex items-center bg-teal-50 text-teal-800 p-2 rounded-full cursor-pointer hover:bg-teal-100 transition-all" title={profileName} aria-label={`Profile: ${profileName}`}>
                <span className="text-xs font-semibold px-2">{profileInitials}</span>
              </div>
            </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 md:px-12 max-w-7xl mx-auto w-full py-12 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        {/* Glowing background circles */}
        <div className="absolute top-10 right-10 w-80 h-80 bg-teal-200 rounded-full filter blur-3xl opacity-30 animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-emerald-200 rounded-full filter blur-3xl opacity-35 animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

        <div className="flex flex-col gap-6 relative z-10 leading-normal">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-4 tracking-wide border border-teal-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Trusted in Bangladesh
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 leading-tight">
              Early Risk Detection for a Healthier Tomorrow
            </h1>
            <p className="text-lg text-neutral-600 mt-5 md:max-w-lg leading-relaxed">
              Empowering individuals with proactive health insights. Our platform uses advanced analytics to identify potential health risks before they become critical, guiding you towards better preventive care.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            {/* Button conforming to exact Landing Page xpath 1 */}
            <button 
              id="start-assessment-btn-top"
              onClick={() => onNavigate('assessment', 'push')}
              className="bg-teal-700 text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-teal-800 transition-all duration-200 soft-shadow hover:scale-[1.01]"
            >
              Start Assessment
              <ArrowRight className="w-5 h-5" />
            </button>

            <a 
              href="#why-it-matters"
              className="bg-white text-teal-800 border border-neutral-200 hover:border-neutral-300 px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-neutral-50 transition-all duration-200 text-center"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Interactive mockup preview container */}
        <div className="relative mt-6 md:mt-0 glass-card rounded-[2.5rem] p-4 soft-shadow">
          <img 
            alt="Healthcare professional reviewing analytics on a tablet" 
            className="rounded-[2rem] w-full object-cover h-[350px] md:h-[450px]" 
            referrerPolicy="no-referrer"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuZF0xiorCdUXsEho6A9KM80sGIeAK_SVKIwxWGOge1MlExQjKS_Cj8ZG6rPzBen22yyvKg8DCkLxIDY3_lHlyrBDkCfisVne7jOkltbiPLHF7mDkdPm3czuDZVjaoX12y2_p58sATVPn7NJCx9Oo17iC9cFUUnzgcATTkBp8nuxy4q6JCrA8bnU6jNEhifdqr-CPGMZb3d6b6Ru40CrHCT8e0u89VliXdYlZaBJM0Sq5C46GJrpCE2axGyf7y0XyUUe_cmgjRL6c" 
          />
          {/* Floating badge */}
          <div className="absolute -bottom-4 left-6 md:-left-6 glass-card p-4 rounded-2xl soft-shadow flex items-center gap-3 border-l-4 border-emerald-500 animate-bounce" style={{ animationDuration: '4s' }}>
            <div className="bg-emerald-100 text-emerald-800 p-2.5 rounded-full">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 font-medium">Risk Reduction</p>
              <p className="text-xl font-bold text-neutral-900">30%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: Why Health Early Detection Matters in Bangladesh */}
      <section id="why-it-matters" className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full scroll-mt-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
            Why Early Detection Matters in Bangladesh
          </h2>
          <p className="text-neutral-600 mt-4 max-w-2xl mx-auto leading-relaxed">
            Non-communicable diseases are rising rapidly. Preventive screening is the most effective way to manage health outcomes and reduce long-term medical burdens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Card 1: Rising NCD crisis */}
          <div className="glass-card soft-shadow rounded-2xl p-8 md:col-span-2 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-neutral-900">Rising NCD Crisis</h3>
                <p className="text-sm text-neutral-600 mt-2 max-w-lg leading-relaxed">
                  Over 67% of total deaths in Bangladesh are currently attributed to Non-Communicable Diseases (NCDs) like cardiovascular issues and diabetes.
                </p>
              </div>
              <div className="bg-red-50 text-red-600 p-3 rounded-full">
                <ShieldAlert className="w-7 h-7" />
              </div>
            </div>
            
            <div className="mt-4">
              <div className="w-full h-3.5 bg-neutral-200/70 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 rounded-full" style={{ width: '67%' }}></div>
              </div>
              <p className="text-xs font-semibold text-neutral-500 mt-2 text-right">
                67% Cardiovascular & Diabetes Mortality Rate
              </p>
            </div>
          </div>

          {/* Card 2: Small status card */}
          <div className="glass-card soft-shadow rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <div className="bg-teal-50 text-teal-800 p-4 rounded-full mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-extrabold text-neutral-900">1 in 4</h3>
            <p className="text-sm text-neutral-500 mt-2 font-medium">
              Adults affected by hypertension across Bangladesh
            </p>
          </div>

          {/* Card 3: Prevention Cost cost card */}
          <div className="glass-card soft-shadow rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="inline-flex p-3 rounded-xl bg-teal-50 text-teal-800 mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Prevention Cost</h3>
              <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                Preventive care costs a fraction of reactive treatments, saving families significant financial stress and preventing chronic damage.
              </p>
            </div>
            <div className="text-xs text-teal-800 font-semibold bg-teal-50/50 py-1 px-3.5 rounded-full inline-block mt-4 w-fit">
              ★ Active Savings
            </div>
          </div>

          {/* Card 4: Cozy doctor image banner card */}
          <div className="glass-card soft-shadow rounded-2xl overflow-hidden md:col-span-2 relative h-64 md:h-auto min-h-[250px]">
            <img 
              alt="Doctor consulting with a patient in a modern clinic" 
              className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105" 
              referrerPolicy="no-referrer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtgeMGwS3gu4swpa0YXpipM7eqBy7PLIH_uoQ3lTxgCPYrRzXExHUWPUlM-0hKPDmdTTpHg4MFJstnOGP2v49K4F02dsaTPtJlmSHHBUCHDOe6EE0pajSspTmnwSnqG6ASf8sAdZ3vgppebb9hXYvBVATgNt9ylXsd6sTQAdOTiGdAJwblmkCRZ_cTjrK_36Na0RR0nWU8ilir3sKdhCX33HzoT1JzbmlPRzY3dH8wi4QUbVohtyz5i1pN0j2E6Ie1SCihrZ0XvqY" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h4 className="text-xl font-bold">Shifting the Paradigm</h4>
              <p className="text-sm text-white/90 mt-1">From reactive treatment to proactive wellness management.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section id="features" className="py-20 bg-teal-900/5 border-y border-teal-800/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-950 tracking-tight">Core Capabilities</h2>
            <p className="text-neutral-600 mt-4 max-w-2xl mx-auto leading-relaxed">
              Designed to integrate seamlessly into your life, providing actionable insights without overwhelming medical jargon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Smart Tracking */}
            <div className="glass-card hover:-translate-y-1 duration-350 transition-all p-8 rounded-2xl soft-shadow bg-white/90">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-6">
                <TrendingDown className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Smart Tracking</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Log vitals easily. Our system identifies subtle trends over time, highlighting deviations from your baseline before they become symptoms.
              </p>
            </div>

            {/* Personalized Advice */}
            <div className="glass-card hover:-translate-y-1 duration-350 transition-all p-8 rounded-2xl soft-shadow bg-white/90">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-6">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Personalized Advice</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Receive tailored lifestyle and dietary recommendations based on your specific risk profile and Bangladeshi demographic data.
              </p>
            </div>

            {/* Privacy First */}
            <div className="glass-card hover:-translate-y-1 duration-350 transition-all p-8 rounded-2xl soft-shadow bg-white/90">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Privacy First</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Your health data is encrypted end-to-end. We adhere to strict data protection standards to ensure your personal information remains confidential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Wrapper */}
      <section className="py-24 px-6 md:px-12 text-center">
        <div className="max-w-3xl mx-auto glass-card p-8 md:p-12 rounded-[2rem] soft-shadow bg-gradient-to-br from-white to-teal-50">
          <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 mb-4 select-none">
            Take Control of Your Health Today
          </h2>
          <p className="text-sm md:text-md text-neutral-600 mb-8 max-w-xl mx-auto leading-relaxed">
            Join thousands of others in Bangladesh who are prioritizing proactive wellness. The assessment takes less than 5 minutes.
          </p>
          
          {/* Button conforming to exact Landing Page xpath 2 */}
          <button 
            id="start-assessment-btn-cta"
            onClick={() => onNavigate('assessment', 'push')}
            className="bg-teal-700 hover:bg-teal-800 text-white font-semibold px-10 py-4 rounded-full inline-flex items-center gap-2 transform transition-all duration-200 hover:scale-[1.01] soft-shadow"
          >
            Start Free Assessment
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Navigation block (Mobile bottom nav conforming to xpath) wrapped inside a nav selector */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden bg-white/90 backdrop-blur-md border-t border-neutral-200/80 rounded-t-2xl shadow-[0_-10px_35px_rgba(0,0,0,0.06)]">
        <a 
          href="#" 
          className="flex flex-col items-center justify-center text-teal-800 bg-teal-50/80 px-4 py-1.5 rounded-full transition-transform"
          onClick={(e) => { e.preventDefault(); onNavigate('landing', 'none'); }}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Home</span>
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
          className="flex flex-col items-center justify-center text-neutral-500 hover:text-teal-700 transition-colors"
          onClick={(e) => { e.preventDefault(); onNavigate('dashboard', 'none'); }}
        >
          <TrendingDown className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Insights</span>
        </a>
            <div 
              onClick={() => onProfileClick?.()} 
              className="flex flex-col items-center justify-center text-neutral-600 hover:text-teal-700 cursor-pointer"
            >
              <div className="w-5.5 h-5.5 rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center font-bold text-[9px] text-neutral-600">
                {profileInitials}
              </div>
              <span className="text-[10px] font-semibold mt-1">Profile</span>
            </div>
      </nav>

      {/* Footer conform layout */}
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
