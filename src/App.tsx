import React, { useState, useEffect } from 'react';
import { TripPlan, Activity } from './types/travel';
import { sampleTrips } from './data/sampleTrips';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { TripWizard } from './components/TripWizard';
import { ItineraryView } from './components/ItineraryView';
import { ActivityBookingPage } from './components/ActivityBookingPage';
import { Compass, Sparkles, Heart } from 'lucide-react';

const STORAGE_KEY = 'vibevoyage_current_trip';

export default function App() {
  const [activeView, setActiveView] = useState<'landing' | 'wizard' | 'itinerary' | 'booking'>('landing');
  const [currentTrip, setCurrentTrip] = useState<TripPlan | null>(null);
  const [preselectedActivity, setPreselectedActivity] = useState<Activity | null>(null);
  const [preselectedExperienceId, setPreselectedExperienceId] = useState<string | null>(null);

  // Initialize from LocalStorage or default to Tokyo demo
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCurrentTrip(JSON.parse(saved));
      } else {
        // Pre-seed with Tokyo sample trip so users always have rich data to inspect
        setCurrentTrip(sampleTrips.tokyo);
      }
    } catch (e) {
      console.warn('Failed reading from localStorage', e);
      setCurrentTrip(sampleTrips.tokyo);
    }
  }, []);

  // Save current trip to LocalStorage whenever it updates
  const handleUpdateTrip = (updated: TripPlan) => {
    setCurrentTrip(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed writing to localStorage', e);
    }
  };

  const handleTripComplete = (newTrip: TripPlan) => {
    handleUpdateTrip(newTrip);
    setActiveView('itinerary');
  };

  const handleLoadSample = (key: string) => {
    if (sampleTrips[key]) {
      handleUpdateTrip(sampleTrips[key]);
      setActiveView('itinerary');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-rose-500 selection:text-white">
      {/* Strict 3-zone Header */}
      <Navbar
        onNewTrip={() => setActiveView('wizard')}
        onSelectSample={handleLoadSample}
        activeView={activeView}
        onGoHome={() => setActiveView('landing')}
        hasActiveTrip={Boolean(currentTrip)}
        onViewActiveTrip={() => setActiveView('itinerary')}
        onOpenBookings={() => {
          setPreselectedActivity(null);
          setPreselectedExperienceId(null);
          setActiveView('booking');
        }}
        bookingCount={currentTrip?.bookings?.length || 0}
        isLiveAI={currentTrip?.isLiveAI ?? true}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <LandingHero
            onStartNewTrip={() => setActiveView('wizard')}
            onLoadTokyoDemo={() => handleLoadSample('tokyo')}
            onLoadBaliDemo={() => handleLoadSample('bali')}
            onLoadSeoulDemo={() => handleLoadSample('seoul')}
            onLoadBangkokDemo={() => handleLoadSample('bangkok')}
            onLoadShanghaiDemo={() => handleLoadSample('shanghai')}
            onOpenBookings={() => setActiveView('booking')}
          />
        )}

        {activeView === 'wizard' && (
          <TripWizard
            onComplete={handleTripComplete}
            onCancel={() => setActiveView(currentTrip ? 'itinerary' : 'landing')}
          />
        )}

        {activeView === 'itinerary' && currentTrip && (
          <ItineraryView
            trip={currentTrip}
            onUpdateTrip={handleUpdateTrip}
            onNewTrip={() => setActiveView('wizard')}
            onBookActivity={(act) => {
              setPreselectedActivity(act);
              setPreselectedExperienceId(null);
              setActiveView('booking');
            }}
            onViewAllBookings={() => {
              setPreselectedActivity(null);
              setPreselectedExperienceId(null);
              setActiveView('booking');
            }}
          />
        )}

        {activeView === 'booking' && (
          <ActivityBookingPage
            trip={currentTrip}
            onUpdateTrip={handleUpdateTrip}
            onNavigateToItinerary={() => setActiveView('itinerary')}
            preselectedActivity={preselectedActivity}
            preselectedExperienceId={preselectedExperienceId}
          />
        )}
      </main>

      {/* Consumer Startup Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-800">VibeVoyage</span>
            <span>·</span>
            <span>Collaborative Travel Itinerary Engine</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hover:text-slate-700 cursor-pointer transition-colors">Privacy</span>
            <span>·</span>
            <span className="hover:text-slate-700 cursor-pointer transition-colors">Terms</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              Powered by <Sparkles className="w-3 h-3 text-amber-500" /> Gemini 3.8 Flash
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
