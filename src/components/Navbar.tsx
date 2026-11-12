import React from 'react';
import { Compass, Sparkles, Users, Plus, Globe, Ticket } from 'lucide-react';

interface NavbarProps {
  onNewTrip: () => void;
  onSelectSample: (tripKey: string) => void;
  activeView: 'landing' | 'wizard' | 'itinerary' | 'booking';
  onGoHome: () => void;
  hasActiveTrip: boolean;
  onViewActiveTrip: () => void;
  onOpenBookings: () => void;
  bookingCount?: number;
  isLiveAI?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewTrip,
  onSelectSample,
  activeView,
  onGoHome,
  hasActiveTrip,
  onViewActiveTrip,
  onOpenBookings,
  bookingCount = 0,
  isLiveAI = true
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button 
          onClick={onGoHome}
          className="flex items-center gap-2.5 text-left text-slate-900 group whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-rose-500/20">
            <Compass className="w-5 h-5 transition-transform group-hover:rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight font-display text-slate-900">
              VibeVoyage
            </span>
            <span className="text-[10px] font-medium text-slate-500 tracking-wider uppercase -mt-1">
              Collaborative Travel AI
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={onGoHome}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeView === 'landing' ? 'text-rose-600 font-semibold' : ''
            }`}
          >
            Overview
          </button>
          
          {hasActiveTrip && (
            <button
              onClick={onViewActiveTrip}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
                activeView === 'itinerary' ? 'text-rose-600 font-semibold' : ''
              }`}
            >
              Current Itinerary
            </button>
          )}

          <button
            onClick={onOpenBookings}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 flex items-center gap-1.5 ${
              activeView === 'booking' ? 'text-rose-600 font-semibold' : ''
            }`}
          >
            <Ticket className="w-4 h-4 text-slate-400" />
            <span>Book Activities</span>
            {bookingCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                {bookingCount}
              </span>
            )}
          </button>

          <div className="relative group">
            <button className="flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-slate-900">
              <Globe className="w-4 h-4 text-slate-400" />
              <span>Explore Trips</span>
            </button>
            <div className="absolute top-full left-0 mt-2 w-64 p-1.5 bg-white rounded-xl shadow-xl border border-slate-200 hidden group-hover:block z-50">
              <button
                onClick={() => onSelectSample('tokyo')}
                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 rounded-lg flex flex-col"
              >
                <span className="font-semibold text-slate-800">Tokyo 3-Day Group Odyssey</span>
                <span className="text-slate-500 text-[11px]">3 Friends · 94% Consensus Match</span>
              </button>
              <button
                onClick={() => onSelectSample('seoul')}
                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 rounded-lg flex flex-col"
              >
                <span className="font-semibold text-slate-800">Seoul 3-Day Hanok & K-Food</span>
                <span className="text-slate-500 text-[11px]">3 Friends · 95% Consensus Match</span>
              </button>
              <button
                onClick={() => onSelectSample('bangkok')}
                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 rounded-lg flex flex-col"
              >
                <span className="font-semibold text-slate-800">Bangkok 3-Day Temples & Canals</span>
                <span className="text-slate-500 text-[11px]">3 Friends · 96% Consensus Match</span>
              </button>
              <button
                onClick={() => onSelectSample('shanghai')}
                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 rounded-lg flex flex-col"
              >
                <span className="font-semibold text-slate-800">Shanghai 3-Day Bund & Concession</span>
                <span className="text-slate-500 text-[11px]">3 Friends · 93% Consensus Match</span>
              </button>
              <button
                onClick={() => onSelectSample('bali')}
                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 rounded-lg flex flex-col"
              >
                <span className="font-semibold text-slate-800">Bali 3-Day Wellness & Surf</span>
                <span className="text-slate-500 text-[11px]">Solo Explorer · Unhurried Pace</span>
              </button>
            </div>
          </div>

          <button
            onClick={onNewTrip}
            className="transition-colors whitespace-nowrap shrink-0 hover:text-slate-900"
          >
            Group Planner
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Gemini 3.8 Flash</span>
          </div>

          <button
            onClick={onNewTrip}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 rounded-xl hover:bg-rose-600 transition-colors shadow-sm whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Plan New Trip</span>
          </button>
        </div>
      </div>
    </header>
  );
};
