import React, { useState, useEffect, lazy, Suspense } from 'react';
import Scene3D from './components/Scene3D';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import VaultLoader from './components/VaultLoader';
import AircraftCoreEntrance from './components/AircraftCoreEntrance';
import ReticleCursor from './components/ReticleCursor';
import DialScrollHUD from './components/DialScrollHUD';
import Footer from './components/Footer';
import OfflineHUD from './components/OfflineHUD';
import ScrollToTopButton from './components/ScrollToTopButton';
import { scrollDirector } from './utils/scrollDirector';

// Lazy-load below-the-fold sections
const ServicesSection = lazy(() => import('./components/ServicesSection'));
const WorkSection = lazy(() => import('./components/WorkSection'));
const MetricsSection = lazy(() => import('./components/MetricsSection'));
const TechStackSection = lazy(() => import('./components/TechStackSection'));
const ContactModal = lazy(() => import('./components/ContactModal'));

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEntranceActive, setIsEntranceActive] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Initialize Master Scroll Director once astrolabe calibration & aircraft entrance finish
  useEffect(() => {
    if (!isLoaded || isEntranceActive) {
      document.body.style.overflow = 'hidden';
      return;
    }

    document.body.style.overflow = 'auto';
    scrollDirector.init();

    const unsubscribe = scrollDirector.subscribe((state) => {
      if (state.activeSection && state.activeSection !== activeSection) {
        setActiveSection(state.activeSection);
      }
    });

    return () => {
      unsubscribe();
      scrollDirector.destroy();
    };
  }, [isLoaded, isEntranceActive]);

  const handleLoaderComplete = () => {
    setIsLoaded(true);
    setIsEntranceActive(true);
  };

  const handleEntranceComplete = () => {
    setIsEntranceActive(false);
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  const handleNavigate = (sectionId) => {
    if (sectionId === 'hero') {
      scrollDirector.scrollTo(0);
    } else {
      scrollDirector.scrollTo(`#${sectionId}`);
    }
  };

  const handleExplore = () => {
    scrollDirector.scrollTo('#services');
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-[#0b0e14] text-[#f4eee2] font-sans selection:bg-[#c59b56] selection:text-[#0b0e14]">
      {/* 1. Astrolabe Celestial Calibration & Kinetic Manifesto Loading Sequence */}
      {!isLoaded && <VaultLoader onComplete={handleLoaderComplete} />}

      {/* 2. Cinematic Supersonic Aircraft & Golden Core Entrance Sequence */}
      {isLoaded && isEntranceActive && (
        <AircraftCoreEntrance
          isReady={isLoaded}
          onComplete={handleEntranceComplete}
        />
      )}

      {/* Offline PWA Network Status Badge */}
      <OfflineHUD />

      {/* 3. Context-Aware Optical Lens Reticle Cursor */}
      <ReticleCursor />

      {/* 4. Physical Vernier Scroll Dial HUD */}
      {isLoaded && !isEntranceActive && <DialScrollHUD activeSection={activeSection} />}

      {/* 5. Full-screen 3D Brass Armillary Astrolabe Canvas */}
      <Scene3D
        activeService={activeSection}
        onSectionChange={handleSectionChange}
        isLoaded={isLoaded}
      />

      {/* 6. Restrained Archival Plate Header */}
      <Navbar
        onOpenContact={() => setIsContactOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isLoaded={isLoaded}
      />

      {/* 7. Foreground UI Content Layer */}
      <main className="relative z-10 w-full min-h-screen pointer-events-none">
        <HeroSection
          onExplore={handleExplore}
          onOpenContact={() => setIsContactOpen(true)}
          isLoaded={isLoaded && !isEntranceActive}
        />

        <Suspense fallback={null}>
          <ServicesSection
            activeService={activeSection}
            onSelectService={handleNavigate}
            onOpenContact={() => setIsContactOpen(true)}
          />

          <WorkSection onOpenContact={() => setIsContactOpen(true)} />

          <MetricsSection />

          <TechStackSection />

          <Footer onOpenContact={() => setIsContactOpen(true)} />
        </Suspense>
      </main>

      {/* Floating Side Scroll To Top Button */}
      <ScrollToTopButton />

      {/* 8. Archival Commission Brief Modal */}
      <Suspense fallback={null}>
        <ContactModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
        />
      </Suspense>
    </div>
  );
}

export default App;
