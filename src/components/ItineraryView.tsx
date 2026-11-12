import React, { useState } from 'react';
import { 
  TripPlan, 
  Activity, 
  DayPlan 
} from '../types/travel';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  ThumbsUp, 
  ArrowUp, 
  ArrowDown, 
  Edit3, 
  Trash2, 
  Plus, 
  Share2, 
  Sparkles, 
  CloudRain, 
  Coffee, 
  Wallet, 
  Check, 
  Users, 
  Info, 
  Calendar, 
  Layers, 
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sun,
  X,
  Compass,
  Ticket
} from 'lucide-react';

interface ItineraryViewProps {
  trip: TripPlan;
  onUpdateTrip: (updated: TripPlan) => void;
  onNewTrip: () => void;
  onBookActivity?: (activity: Activity) => void;
  onViewAllBookings?: () => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  trip,
  onUpdateTrip,
  onNewTrip,
  onBookActivity,
  onViewAllBookings
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [activeTab, setActiveTab] = useState<'timeline' | 'consensus' | 'expenses'>('timeline');
  
  // Modals
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAdapting, setIsAdapting] = useState(false);
  const [adaptNotice, setAdaptNotice] = useState<string | null>(null);

  // Date changing state
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(trip.startDate || '2026-11-20');
  const [tempDuration, setTempDuration] = useState(trip.durationDays || 3);

  // Day detail edit state
  const [isDayEditModalOpen, setIsDayEditModalOpen] = useState(false);
  const [tempDayDate, setTempDayDate] = useState('');
  const [tempDayTitle, setTempDayTitle] = useState('');
  const [tempDayArea, setTempDayArea] = useState('');

  // New activity form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTime, setNewTime] = useState('02:00 PM');
  const [newCost, setNewCost] = useState('15');
  const [newCategory, setNewCategory] = useState<Activity['category']>('sightseeing');
  const [newNeighborhood, setNewNeighborhood] = useState('Central District');

  const currentDay = trip.days.find(d => d.dayNumber === selectedDayNumber) || trip.days[0];

  // Robust timezone-safe date parsing & formatting helpers
  const parseLocalDate = (dateStr?: string): Date => {
    if (!dateStr) return new Date();
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      return new Date(y, m, d);
    }
    return new Date(dateStr);
  };

  const formatLocalDate = (dateObj: Date): string => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const formatTripRange = (startDateStr?: string, endDateStr?: string): string => {
    if (!startDateStr) return 'Flexible Dates';
    try {
      const s = parseLocalDate(startDateStr);
      const sStr = s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (endDateStr) {
        const e = parseLocalDate(endDateStr);
        const eStr = e.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return `${sStr} – ${eStr}`;
      }
      return `${sStr}, ${s.getFullYear()}`;
    } catch {
      return startDateStr;
    }
  };

  const calculateDayLabel = (startDateStr: string, dayIndex: number): string => {
    try {
      const d = parseLocalDate(startDateStr);
      d.setDate(d.getDate() + dayIndex);
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
      return `Day ${dayIndex + 1}`;
    }
  };

  // Handler: Change whole trip departure date and recalculate all day schedules
  const handleSaveTripDates = () => {
    const newStartDate = tempStartDate;
    const newDuration = Math.max(1, Math.min(14, Number(tempDuration) || trip.durationDays));
    
    const startObj = parseLocalDate(newStartDate);
    const endObj = new Date(startObj);
    endObj.setDate(startObj.getDate() + (newDuration - 1));
    const newEndDate = formatLocalDate(endObj);

    const updatedDays = [];
    for (let i = 0; i < newDuration; i++) {
      const dayNum = i + 1;
      const dayDateLabel = calculateDayLabel(newStartDate, i);
      const existing = trip.days[i];

      if (existing) {
        updatedDays.push({
          ...existing,
          dayNumber: dayNum,
          date: `Day ${dayNum} (${dayDateLabel})`
        });
      } else {
        // Automatically scaffold new day if duration was expanded
        updatedDays.push({
          dayNumber: dayNum,
          date: `Day ${dayNum} (${dayDateLabel})`,
          title: `Day ${dayNum}: Neighborhood Exploration & Local Flavors`,
          areaSummary: 'Downtown District',
          weather: { condition: 'Sunny & Pleasant', temp: '21°C', icon: 'sun' },
          estimatedWalkingKm: 5.4,
          estimatedBudgetPerPerson: 40,
          activities: [
            {
              id: `act-${dayNum}-new-1`,
              time: '10:00 AM',
              title: `${trip.destination.split(',')[0]} Scenic Heritage Walk`,
              description: 'Explore scenic landmarks, public parks, and neighborhood architecture.',
              category: 'sightseeing' as const,
              cost: 10,
              duration: '2 hrs',
              neighborhood: 'Historic District',
              vibe: 'Scenic & Relaxed',
              suggestedBy: trip.travelers[0]?.name || 'Traveler',
              votes: 3,
              notes: 'Added via trip date extension.',
              transitToNext: '10 min walk'
            },
            {
              id: `act-${dayNum}-new-2`,
              time: '01:00 PM',
              title: 'Artisanal Lunch & Cafe Respite',
              description: 'Sample local culinary specialties in the market quarter.',
              category: 'food' as const,
              cost: 18,
              duration: '1.5 hrs',
              neighborhood: 'Market Quarter',
              vibe: 'Local Food',
              suggestedBy: trip.travelers[1]?.name || trip.travelers[0]?.name || 'Traveler',
              votes: 4,
              notes: 'Great spot for relaxed conversation.',
              transitToNext: '15 min transit'
            }
          ]
        });
      }
    }

    const updatedTrip: TripPlan = {
      ...trip,
      startDate: newStartDate,
      endDate: newEndDate,
      durationDays: newDuration,
      days: updatedDays
    };

    onUpdateTrip(updatedTrip);
    setIsDateModalOpen(false);
  };

  // Handler: Save customized day details
  const handleSaveDayDetails = () => {
    const updatedDays = trip.days.map(d => {
      if (d.dayNumber === selectedDayNumber) {
        return {
          ...d,
          date: tempDayDate || d.date,
          title: tempDayTitle || d.title,
          areaSummary: tempDayArea || d.areaSummary
        };
      }
      return d;
    });

    onUpdateTrip({
      ...trip,
      days: updatedDays
    });
    setIsDayEditModalOpen(false);
  };

  // Header background image matching
  const destLower = trip.destination.toLowerCase();
  let headerImage = '/assets/images/dest_barcelona_quarter_1794467680665.jpg';
  if (destLower.includes('tokyo') || destLower.includes('japan')) {
    headerImage = '/assets/images/hero_tokyo_twilight_1794467674929.jpg';
  } else if (destLower.includes('seoul') || destLower.includes('korea')) {
    headerImage = '/assets/images/dest_seoul_hanok_1794470606780.jpg';
  } else if (destLower.includes('bangkok') || destLower.includes('thailand')) {
    headerImage = '/assets/images/dest_bangkok_temple_1794470620264.jpg';
  } else if (destLower.includes('shanghai') || destLower.includes('china')) {
    headerImage = '/assets/images/dest_shanghai_bund_1794470633976.jpg';
  } else if (destLower.includes('bali') || destLower.includes('indonesia')) {
    headerImage = '/assets/images/dest_bali_ubud_1794467676019.jpg';
  } else if (destLower.includes('paris') || destLower.includes('france')) {
    headerImage = '/assets/images/dest_paris_terrace_1794467676789.jpg';
  }

  // Voting interaction
  const handleVote = (actId: string) => {
    const updatedDays = trip.days.map(d => {
      if (d.dayNumber !== selectedDayNumber) return d;
      return {
        ...d,
        activities: d.activities.map(a => {
          if (a.id !== actId) return a;
          const userVoted = !a.userVoted;
          return {
            ...a,
            userVoted,
            votes: userVoted ? a.votes + 1 : a.votes - 1
          };
        })
      };
    });
    onUpdateTrip({ ...trip, days: updatedDays });
  };

  // Move activity up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const activities = [...currentDay.activities];
    const temp = activities[index - 1];
    activities[index - 1] = activities[index];
    activities[index] = temp;

    const updatedDays = trip.days.map(d =>
      d.dayNumber === selectedDayNumber ? { ...d, activities } : d
    );
    onUpdateTrip({ ...trip, days: updatedDays });
  };

  // Move activity down
  const handleMoveDown = (index: number) => {
    if (index === currentDay.activities.length - 1) return;
    const activities = [...currentDay.activities];
    const temp = activities[index + 1];
    activities[index + 1] = activities[index];
    activities[index] = temp;

    const updatedDays = trip.days.map(d =>
      d.dayNumber === selectedDayNumber ? { ...d, activities } : d
    );
    onUpdateTrip({ ...trip, days: updatedDays });
  };

  // Delete activity
  const handleDeleteActivity = (actId: string) => {
    const activities = currentDay.activities.filter(a => a.id !== actId);
    const updatedDays = trip.days.map(d =>
      d.dayNumber === selectedDayNumber
        ? {
            ...d,
            activities,
            estimatedBudgetPerPerson: activities.reduce((acc, a) => acc + (a.cost || 0), 0)
          }
        : d
    );
    onUpdateTrip({ ...trip, days: updatedDays });
  };

  // Save edited activity
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity) return;

    const activities = currentDay.activities.map(a =>
      a.id === editingActivity.id ? editingActivity : a
    );
    const updatedDays = trip.days.map(d =>
      d.dayNumber === selectedDayNumber
        ? {
            ...d,
            activities,
            estimatedBudgetPerPerson: activities.reduce((acc, a) => acc + (a.cost || 0), 0)
          }
        : d
    );
    onUpdateTrip({ ...trip, days: updatedDays });
    setEditingActivity(null);
  };

  // Add custom activity
  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newAct: Activity = {
      id: `custom-${Date.now()}`,
      title: newTitle,
      description: newDesc || 'Custom planned experience added by traveler.',
      time: newTime,
      cost: Number(newCost) || 0,
      duration: '1.5 hrs',
      category: newCategory,
      neighborhood: newNeighborhood,
      vibe: 'Personalized Pick',
      suggestedBy: trip.travelers[0]?.name || 'Traveler',
      votes: 1,
      userVoted: true,
      notes: 'Added directly into day schedule.',
      transitToNext: '10 min walk'
    };

    const activities = [...currentDay.activities, newAct];
    const updatedDays = trip.days.map(d =>
      d.dayNumber === selectedDayNumber
        ? {
            ...d,
            activities,
            estimatedBudgetPerPerson: activities.reduce((acc, a) => acc + (a.cost || 0), 0)
          }
        : d
    );

    onUpdateTrip({ ...trip, days: updatedDays });
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  // Quick In-Trip Adaptive Replanner (Miro Canvas sticky)
  const handleAdaptiveReplan = async (conditionType: 'rain' | 'slow_morning' | 'budget_trim') => {
    setIsAdapting(true);
    setAdaptNotice(`Optimizing Day ${selectedDayNumber} for ${conditionType === 'rain' ? 'indoor rainy-day spots' : conditionType === 'slow_morning' ? 'a slower, relaxed morning' : 'maximum budget efficiency'}...`);

    try {
      const response = await fetch('/api/replan-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day: currentDay,
          conditionType,
          destination: trip.destination
        })
      });

      const res = await response.json();
      if (res.success && res.day) {
        const updatedDays = trip.days.map(d =>
          d.dayNumber === selectedDayNumber ? res.day : d
        );
        onUpdateTrip({ ...trip, days: updatedDays });
        setAdaptNotice(`Day ${selectedDayNumber} successfully adapted!`);
        setTimeout(() => setAdaptNotice(null), 3500);
      }
    } catch (err) {
      console.error('Failed to replan day:', err);
    } finally {
      setIsAdapting(false);
    }
  };

  // Total trip cost per person calculation
  const totalCostPerPerson = trip.days.reduce(
    (acc, day) => acc + day.activities.reduce((dAcc, act) => dAcc + (act.cost || 0), 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Visual Destination Header Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200">
        <div className="h-64 sm:h-80 w-full relative">
          <img
            src={headerImage}
            alt={trip.destination}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        {/* Content Overlaid on Image */}
        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-amber-300 bg-amber-950/60 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/30">
                {trip.destination}
              </span>
              <button
                onClick={() => {
                  setTempStartDate(trip.startDate || '2026-11-20');
                  setTempDuration(trip.durationDays || 3);
                  setIsDateModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900/70 hover:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 transition-all cursor-pointer group shadow-xs"
                title="Click to change trip dates"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-300 transition-transform group-hover:scale-110" />
                <span>{formatTripRange(trip.startDate, trip.endDate)}</span>
                <span className="text-[10px] text-amber-300 font-bold ml-1 uppercase underline decoration-amber-400/50">Change</span>
              </button>
              <span className="text-xs font-semibold text-slate-200">
                {trip.durationDays} Days · {trip.groupMode ? `${trip.travelers.length} Friends` : 'Solo Traveler'}
              </span>
              <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-400/30">
                {trip.groupSummary?.consensusScore || '94% Consensus Match'}
              </span>
              <span className="text-[11px] font-semibold text-indigo-200 bg-indigo-950/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-indigo-400/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Smart Route Sync
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white drop-shadow-sm">
              {trip.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
              {trip.groupSummary?.reconciliationNotes}
            </p>
          </div>

          {/* Action Group */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setTempStartDate(trip.startDate || '2026-11-20');
                setTempDuration(trip.durationDays || 3);
                setIsDateModalOpen(true);
              }}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition-colors flex items-center gap-2"
              title="Change trip departure date or duration"
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>Change Dates</span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition-colors flex items-center gap-2"
            >
              <Share2 className="w-4 h-4 text-slate-200" />
              <span>Share & Export</span>
            </button>

            {onViewAllBookings && (
              <button
                onClick={onViewAllBookings}
                className="px-4 py-2.5 bg-indigo-600/90 hover:bg-indigo-600 text-white backdrop-blur-md font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-md flex items-center gap-2"
              >
                <Ticket className="w-4 h-4 text-white" />
                <span>Book Activities</span>
                {trip.bookings && trip.bookings.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-white text-indigo-700 text-[10px] font-bold flex items-center justify-center">
                    {trip.bookings.length}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={onNewTrip}
              className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Itinerary</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Workspace Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 gap-4 overflow-x-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'timeline'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Daily Schedule</span>
          </button>

          <button
            onClick={() => setActiveTab('consensus')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'consensus'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Friend Consensus Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'expenses'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Split-Cost Tracker</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium whitespace-nowrap hidden sm:block">
          Estimated Trip Cost: <span className="font-bold text-slate-900">${totalCostPerPerson}</span> / person
        </div>
      </div>

      {/* Adapt Notice Banner */}
      {adaptNotice && (
        <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs text-indigo-900 font-medium flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>{adaptNotice}</span>
          </div>
          <button onClick={() => setAdaptNotice(null)} className="text-indigo-400 hover:text-indigo-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: Daily Timeline View */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          {/* Day Selector Pills Bar with Calendar Dates */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {trip.days.map((d, idx) => {
              const isSelected = d.dayNumber === selectedDayNumber;
              const formattedDayDate = calculateDayLabel(trip.startDate, idx);
              return (
                <button
                  key={d.dayNumber}
                  onClick={() => setSelectedDayNumber(d.dayNumber)}
                  className={`px-4 py-3 rounded-2xl text-left border transition-all shrink-0 min-w-[170px] ${
                    isSelected
                      ? 'bg-white border-indigo-600 ring-2 ring-indigo-600/20 shadow-sm'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="font-bold text-slate-900">Day {d.dayNumber}</span>
                    <span className="text-[11px] text-indigo-700 font-semibold bg-indigo-50 px-1.5 py-0.2 rounded">
                      {formattedDayDate}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                    {d.areaSummary}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Current Day Header & In-Trip Adaptive Replanner Bar */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    {currentDay.date} · {currentDay.areaSummary}
                  </span>
                  <button
                    onClick={() => {
                      setTempDayDate(currentDay.date);
                      setTempDayTitle(currentDay.title);
                      setTempDayArea(currentDay.areaSummary);
                      setIsDayEditModalOpen(true);
                    }}
                    className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
                    title="Customize Day Date & Title"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-0.5">
                  {currentDay.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1 font-medium">
                    <Sun className="w-3.5 h-3.5 text-amber-500" /> {currentDay.weather?.condition}
                  </span>
                  <span>·</span>
                  <span>~{currentDay.estimatedWalkingKm} km walking</span>
                  <span>·</span>
                  <span className="font-semibold text-slate-800">
                    Est. ${currentDay.estimatedBudgetPerPerson} / person
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Activity</span>
              </button>
            </div>

            {/* Adaptive Replanner Widget (Miro Canvas Key Proposition) */}
            <div className="p-4 bg-gradient-to-r from-slate-50 to-indigo-50/50 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>In-Trip Adaptive Replanner</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Unforeseen weather or schedule change? Re-optimize this day with 1 tap:
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  disabled={isAdapting}
                  onClick={() => handleAdaptiveReplan('rain')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
                  title="Swap outdoor spots with covered markets and art galleries"
                >
                  <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                  <span>Rainy Day Safe</span>
                </button>

                <button
                  disabled={isAdapting}
                  onClick={() => handleAdaptiveReplan('slow_morning')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
                  title="Push start to 10:45 AM for a sleep-in"
                >
                  <Coffee className="w-3.5 h-3.5 text-amber-600" />
                  <span>Slower Morning (+1.5h)</span>
                </button>

                <button
                  disabled={isAdapting}
                  onClick={() => handleAdaptiveReplan('budget_trim')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
                  title="Cut paid admissions in half"
                >
                  <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Trim Budget (-50%)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Activity Cards Timeline */}
          <div className="space-y-4">
            {currentDay.activities.map((act, index) => {
              const categoryColors: Record<string, string> = {
                culture: 'bg-amber-50 text-amber-700 border-amber-200',
                food: 'bg-rose-50 text-rose-700 border-rose-200',
                nature: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                art: 'bg-purple-50 text-purple-700 border-purple-200',
                nightlife: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                shopping: 'bg-cyan-50 text-cyan-700 border-cyan-200',
                sightseeing: 'bg-blue-50 text-blue-700 border-blue-200'
              };

              return (
                <div key={act.id} className="relative group">
                  <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col md:flex-row items-start justify-between gap-5">
                    
                    {/* Time & Category Pill */}
                    <div className="md:w-36 shrink-0 space-y-1.5">
                      <div className="text-sm font-bold text-slate-900 font-mono">
                        {act.time}
                      </div>
                      <div className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${categoryColors[act.category] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {act.category.toUpperCase()}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {act.duration}
                      </div>
                    </div>

                    {/* Main Description */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900">
                          {act.title}
                        </h3>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {act.neighborhood}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {act.description}
                      </p>

                      {act.notes && (
                        <div className="text-[11px] text-indigo-900 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100 flex items-start gap-1.5">
                          <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                          <span>{act.notes}</span>
                        </div>
                      )}

                      {/* Travel Attribution Tag & Booking CTA */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px]">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 font-medium">
                            Inspired by: <span className="text-slate-900 font-semibold">{act.suggestedBy}</span>
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="text-slate-500">
                            Cost: <span className="font-semibold text-slate-900">{act.cost === 0 ? 'Free' : `$${act.cost} / person`}</span>
                          </span>
                        </div>

                        {onBookActivity && act.cost > 0 && (
                          <button
                            onClick={() => onBookActivity(act)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-200 transition-colors shadow-2xs"
                          >
                            <Ticket className="w-3.5 h-3.5" />
                            <span>
                              {trip.bookings?.some(b => b.activityId === act.id || b.activityTitle.includes(act.title))
                                ? 'Pass Booked'
                                : 'Book Passes'}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Interactive Controls & Upvote */}
                    <div className="flex md:flex-col items-center justify-between md:justify-start gap-2 shrink-0 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                      {/* Voting Button */}
                      <button
                        onClick={() => handleVote(act.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                          act.userVoted
                            ? 'bg-rose-50 border-rose-200 text-rose-700'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Vote for this activity"
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${act.userVoted ? 'fill-rose-600 text-rose-600' : ''}`} />
                        <span>{act.votes}</span>
                      </button>

                      {/* Reorder and Edit Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          disabled={index === 0}
                          onClick={() => handleMoveUp(index)}
                          className="p-1.5 text-slate-400 hover:text-slate-800 disabled:opacity-20 rounded-md transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={index === currentDay.activities.length - 1}
                          onClick={() => handleMoveDown(index)}
                          className="p-1.5 text-slate-400 hover:text-slate-800 disabled:opacity-20 rounded-md transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingActivity(act)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md transition-colors"
                          title="Edit Activity"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteActivity(act.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                          title="Remove Activity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Calculated Transit Indicator between activities */}
                  {index < currentDay.activities.length - 1 && act.transitToNext && (
                    <div className="py-2.5 px-6 flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span>Transit: {act.transitToNext}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Friend Consensus Inspector */}
      {activeTab === 'consensus' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Group Preference Reconciliation
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-1">
                How VibeVoyage Reconciled Everyone’s Passions
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Transparent view of how competing travel speeds, wake-up hours, and budget tiers were synthesized.
              </p>
            </div>

            {/* Compromise Engine Card */}
            <div className="p-5 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                  Harmonized Group Rhythm
                </span>
                <span className="text-xs font-bold text-indigo-700 bg-white px-3 py-1 rounded-full border border-indigo-200 shadow-2xs">
                  {trip.groupSummary?.compromisePace}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-950 leading-relaxed">
                {trip.groupSummary?.reconciliationNotes}
              </p>
            </div>

            {/* Individual Travelers Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trip.travelers.map(t => (
                <div key={t.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${t.color} text-white font-bold text-xs flex items-center justify-center shadow-xs`}>
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{t.name}</div>
                      <div className="text-[11px] text-slate-500">Wake-up: {t.wakeUpTime}</div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="text-slate-600">
                      <span className="font-semibold text-slate-800">Pace: </span>{t.pace}
                    </div>
                    <div className="text-slate-600">
                      <span className="font-semibold text-slate-800">Budget Limit: </span>{t.budget}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800 block mb-1">Top Passions:</span>
                      <div className="flex flex-wrap gap-1">
                        {t.interests.map((int, i) => (
                          <span key={i} className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                            {int}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Shared Expenses & Split Cost Calculator */}
      {activeTab === 'expenses' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Transparent Budget Tracker
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-1">
                Trip Expense & Group Split Breakdown
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Itemized calculations based on scheduled meals, admissions, and estimated transit.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-xs font-semibold text-slate-500">Estimated Total Trip Cost</span>
                <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                  ${totalCostPerPerson * trip.travelers.length}
                </div>
                <span className="text-[11px] text-slate-400">For all {trip.travelers.length} travelers</span>
              </div>

              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <span className="text-xs font-semibold text-emerald-800">Per Person Share</span>
                <div className="text-2xl font-bold text-emerald-900 mt-1 font-mono">
                  ${totalCostPerPerson}
                </div>
                <span className="text-[11px] text-emerald-700">~${Math.round(totalCostPerPerson / trip.durationDays)} / person / day</span>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-xs font-semibold text-slate-500">Target Budget Tier</span>
                <div className="text-2xl font-bold text-slate-900 mt-1 capitalize font-display">
                  {trip.targetBudget}
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">Within target range</span>
              </div>
            </div>

            {/* Daily Breakdown Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 bg-slate-50 font-bold text-xs uppercase tracking-wider text-slate-700 border-b border-slate-200 flex justify-between">
                <span>Day & Theme</span>
                <span>Est. Per Person</span>
              </div>
              <div className="divide-y divide-slate-100">
                {trip.days.map(d => (
                  <div key={d.dayNumber} className="px-5 py-3.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-900">Day {d.dayNumber}: {d.title}</span>
                      <span className="text-slate-400 block text-[11px]">{d.activities.length} activities scheduled</span>
                    </div>
                    <span className="font-bold text-slate-900 font-mono">
                      ${d.activities.reduce((sum, a) => sum + (a.cost || 0), 0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Activity Modal */}
      {editingActivity && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Edit Activity</h3>
              <button onClick={() => setEditingActivity(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Title</label>
                <input
                  type="text"
                  value={editingActivity.title}
                  onChange={e => setEditingActivity({ ...editingActivity, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Description</label>
                <textarea
                  rows={3}
                  value={editingActivity.description}
                  onChange={e => setEditingActivity({ ...editingActivity, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Time</label>
                  <input
                    type="text"
                    value={editingActivity.time}
                    onChange={e => setEditingActivity({ ...editingActivity, time: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Cost ($/person)</label>
                  <input
                    type="number"
                    value={editingActivity.cost}
                    onChange={e => setEditingActivity({ ...editingActivity, cost: Number(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Neighborhood / Area</label>
                <input
                  type="text"
                  value={editingActivity.neighborhood}
                  onChange={e => setEditingActivity({ ...editingActivity, neighborhood: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingActivity(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white font-semibold rounded-xl shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Custom Activity Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Add Activity to Day {selectedDayNumber}</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddActivity} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Activity Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vintage Record Shopping in Shimokitazawa"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Description / Local Tip</label>
                <textarea
                  rows={2}
                  placeholder="What makes this spot special?"
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Time</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Cost ($/person)</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={e => setNewCost(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 bg-white"
                  >
                    <option value="sightseeing">Sightseeing</option>
                    <option value="culture">Culture</option>
                    <option value="food">Food & Dining</option>
                    <option value="art">Art & Museum</option>
                    <option value="nature">Nature</option>
                    <option value="shopping">Shopping</option>
                    <option value="nightlife">Nightlife</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Neighborhood</label>
                  <input
                    type="text"
                    value={newNeighborhood}
                    onChange={e => setNewNeighborhood(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Add to Itinerary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share / Export Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Share Itinerary with Friends</h3>
              <button onClick={() => setIsShareModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Send this link to your group so friends can view the day schedule and upvote activities directly.
            </p>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Trip Invitation Link
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://vibevoyage.app/join/${trip.id}`}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-700 font-mono"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://vibevoyage.app/join/${trip.id}`);
                    alert('Share link copied to clipboard!');
                  }}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold shrink-0"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                WhatsApp Ready Summary
              </div>
              <textarea
                readOnly
                rows={4}
                value={`✈️ ${trip.title}\n📍 ${trip.destination} (${trip.durationDays} Days)\n👥 Group Match: ${trip.groupSummary?.consensusScore}\n💰 Est: $${totalCostPerPerson}/person\n\nCheck out our itinerary here: https://vibevoyage.app/join/${trip.id}`}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-700 font-mono"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`✈️ ${trip.title}\n📍 ${trip.destination}\nCheck it out: https://vibevoyage.app/join/${trip.id}`);
                  alert('WhatsApp text copied!');
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
              >
                Copy for WhatsApp / Group Chat
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CHANGE TRIP DATES & DURATION */}
      {isDateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    Schedule Controller
                  </span>
                </div>
                <h3 className="text-xl font-bold font-display text-slate-900">
                  Change Itinerary Dates
                </h3>
                <p className="text-xs text-slate-500">
                  Select a new departure date. Your existing activities and daily timelines will seamlessly shift to align with your new travel calendar.
                </p>
              </div>

              <button
                onClick={() => setIsDateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Inputs */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Trip Departure Date</span>
                  <span className="text-[11px] text-indigo-600 font-semibold">
                    {parseLocalDate(tempStartDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </label>
                <input
                  type="date"
                  value={tempStartDate}
                  onChange={e => setTempStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-slate-900 font-medium"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const d = parseLocalDate(tempStartDate);
                      d.setDate(d.getDate() - 7);
                      setTempStartDate(formatLocalDate(d));
                    }}
                    className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
                  >
                    -1 Week
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = parseLocalDate(tempStartDate);
                      d.setDate(d.getDate() + 7);
                      setTempStartDate(formatLocalDate(d));
                    }}
                    className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
                  >
                    +1 Week
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = parseLocalDate(tempStartDate);
                      d.setMonth(d.getMonth() + 1);
                      setTempStartDate(formatLocalDate(d));
                    }}
                    className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
                  >
                    +1 Month
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      setTempStartDate(formatLocalDate(now));
                    }}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors ml-auto"
                  >
                    Today
                  </button>
                </div>
              </div>

              {/* Duration selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Trip Length (Days)</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    Ends on {(() => {
                      const end = parseLocalDate(tempStartDate);
                      end.setDate(end.getDate() + (tempDuration - 1));
                      return end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    })()}
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  {[2, 3, 4, 5, 7].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTempDuration(num)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                        tempDuration === num
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {num} Days
                    </button>
                  ))}
                </div>
              </div>

              {/* Day-by-Day Recalculation Preview */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  New Calendar Schedule Preview
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {Array.from({ length: tempDuration }).map((_, i) => {
                    const dayNum = i + 1;
                    const dateFormatted = calculateDayLabel(tempStartDate, i);
                    const existingTitle = trip.days[i]?.title || `Day ${dayNum}: City Exploration`;

                    return (
                      <div
                        key={i}
                        className="p-2 bg-white rounded-xl border border-slate-200/70 text-xs flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">Day {dayNum}</span>
                          <span className="text-indigo-600 font-semibold">({dateFormatted})</span>
                        </div>
                        <span className="text-[11px] text-slate-500 truncate max-w-[180px]">
                          {existingTitle.replace(/^Day \d+:\s*/, '')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDateModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveTripDates}
                className="px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save & Apply New Dates</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT SPECIFIC DAY DETAILS */}
      {isDayEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Day {selectedDayNumber} Customization
                </span>
                <h3 className="text-xl font-bold font-display text-slate-900 mt-0.5">
                  Edit Day Date & Theme
                </h3>
              </div>
              <button
                onClick={() => setIsDayEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Date Label
                </label>
                <input
                  type="text"
                  value={tempDayDate}
                  onChange={e => setTempDayDate(e.target.value)}
                  placeholder="e.g. Day 1 (Fri, Nov 20) or Saturday, Dec 12"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Day Theme / Title
                </label>
                <input
                  type="text"
                  value={tempDayTitle}
                  onChange={e => setTempDayTitle(e.target.value)}
                  placeholder="e.g. Historic Asakusa & Modern Akihabara"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Neighborhood / Area Summary
                </label>
                <input
                  type="text"
                  value={tempDayArea}
                  onChange={e => setTempDayArea(e.target.value)}
                  placeholder="e.g. Taito & Chiyoda"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDayEditModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDayDetails}
                className="px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Day Details</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
