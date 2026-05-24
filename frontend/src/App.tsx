import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType, TransitionType, AssessmentData } from './types';
import LandingPage from './components/LandingPage';
import AssessmentForm from './components/AssessmentForm';
import RiskDashboard from './components/RiskDashboard';
import Login from './components/Login';
import ProfileModal from './components/ProfileModal';
import ProfilePage from './components/ProfilePage';
import { API_BASE } from './api';

const PROFILE_STORAGE_KEY = 'vitalscare.profileName';

function getStoredProfileName(): string {
  if (typeof window === 'undefined') {
    return 'Community Member';
  }

  const storedName = window.localStorage.getItem(PROFILE_STORAGE_KEY)?.trim();
  return storedName || 'Community Member';
}

function getProfileInitials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return 'CM';
  }

  const initials = parts.slice(0, 2).map(part => part[0]?.toUpperCase() ?? '').join('');
  return initials || 'CM';
}

const INITIAL_FORM_STATE: AssessmentData = {
  age: 35,
  systolic: 120,
  diastolic: 80,
  height: 175,
  weight: 70,
  activity: 'moderate',
  familyHistory: ['None Known'],
  diet: 3, // Average
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('landing');
  const [transitionType, setTransitionType] = useState<TransitionType>('none');
  const [assessmentData, setAssessmentData] = useState<AssessmentData>(INITIAL_FORM_STATE);
  const [profileName, setProfileName] = useState(getStoredProfileName);
  const profileInitials = getProfileInitials(profileName);
  const [token, setToken] = useState(() => window.localStorage.getItem('vitalscare.token') || '');

  const handleLogout = () => {
    window.localStorage.removeItem('vitalscare.token');
    window.localStorage.removeItem('vitalscare.profileName');
    setToken('');
  };

  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleProfileClick = () => handleNavigation('profile', 'push');

  const handleProfileSave = (newName: string) => {
    const final = newName?.trim() || 'Community Member';
    setProfileName(final);
    window.localStorage.setItem('vitalscare.profileName', final);
    setProfileModalOpen(false);
  };

  const handleProfileLogout = async () => {
    try {
      const tokenLocal = window.localStorage.getItem('vitalscare.token');
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST', headers: tokenLocal ? { token: tokenLocal } : {} });
    } catch (e) {
      // ignore network errors
    }
    handleLogout();
    setCurrentScreen('landing');
    setProfileModalOpen(false);
  };

  const handleNavigation = (screen: ScreenType, transition: TransitionType) => {
    setTransitionType(transition);
    setCurrentScreen(screen);
    // Auto scroll back to the top of pages
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  const handleReset = () => {
    setAssessmentData(INITIAL_FORM_STATE);
    handleNavigation('landing', 'none');
  };

  // Determine transition animations based on transition specification settings
  const motionVariants = {
    initial: (type: TransitionType) => ({
      x: type === 'push' ? '100vw' : 0,
      opacity: type === 'push' ? 0.35 : 1,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 110,
        damping: 18,
        mass: 0.8,
      },
    },
    exit: (type: TransitionType) => ({
      x: type === 'push' ? '-100vw' : 0,
      opacity: type === 'push' ? 0.35 : 1,
      transition: {
        duration: 0.25,
      },
    }),
  };

  return (
    <div className="overflow-x-hidden min-h-screen bg-neutral-50">
      <AnimatePresence mode="wait" initial={false} custom={transitionType}>
        <motion.div
          key={currentScreen}
          custom={transitionType}
          variants={motionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="min-h-screen"
        >
          {!token ? (
            <Login onLogin={(t, name) => { setToken(t); setProfileName(name || 'Community Member'); handleNavigation('landing','none'); }} />
          ) : (
            <>
              {currentScreen === 'landing' && (
                <LandingPage onNavigate={handleNavigation} profileName={profileName} profileInitials={profileInitials} onProfileClick={handleProfileClick} />
              )}

              {currentScreen === 'assessment' && (
                <AssessmentForm 
                  data={assessmentData} 
                  onChange={setAssessmentData} 
                  onNavigate={handleNavigation}
                  profileName={profileName}
                  profileInitials={profileInitials}
                  onProfileClick={handleProfileClick}
                />
              )}

              {currentScreen === 'dashboard' && (
                <RiskDashboard 
                  data={assessmentData} 
                  onNavigate={handleNavigation} 
                  onReset={handleReset}
                  profileName={profileName}
                  profileInitials={profileInitials}
                  onProfileClick={handleProfileClick}
                />
              )}

              {currentScreen === 'profile' && (
                <ProfilePage onBack={() => handleNavigation('landing', 'push')} onLogout={handleProfileLogout} />
              )}

              <ProfileModal visible={profileModalOpen} name={profileName} onClose={() => setProfileModalOpen(false)} onSave={handleProfileSave} onLogout={handleProfileLogout} />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
