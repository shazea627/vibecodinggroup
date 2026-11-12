import React, { useState, useMemo } from 'react';
import { 
  Ticket, Compass, Calendar, Clock, MapPin, Users, Check, Sparkles, 
  ArrowRight, Search, Filter, Star, ShieldCheck, ChevronRight, X, 
  QrCode, AlertCircle, Trash2, Printer, Plus, Info, ExternalLink
} from 'lucide-react';
import { TripPlan, ActivityBooking, BookableExperience, TravelerProfile, Activity } from '../types/travel';
import { curatedExperiences } from '../data/bookableExperiences';

interface ActivityBookingPageProps {
  trip: TripPlan | null;
  onUpdateTrip: (updatedTrip: TripPlan) => void;
  onNavigateToItinerary: () => void;
  preselectedExperienceId?: string | null;
  preselectedActivity?: Activity | null;
}

export const ActivityBookingPage: React.FC<ActivityBookingPageProps> = ({
  trip,
  onUpdateTrip,
  onNavigateToItinerary,
  preselectedExperienceId,
  preselectedActivity
}) => {
  // Navigation / active tab
  const [activeTab, setActiveTab] = useState<'browse' | 'my-bookings'>(
    trip?.bookings && trip.bookings.length > 0 && !preselectedExperienceId && !preselectedActivity
      ? 'browse'
      : 'browse'
  );

  // Filters
  const currentTripDest = trip?.destination || 'Tokyo, Japan';
  const [selectedDestination, setSelectedDestination] = useState<string>(() => {
    if (preselectedActivity && trip) return trip.destination;
    const matched = curatedExperiences.find(e => 
      e.destination.toLowerCase().includes(currentTripDest.toLowerCase()) || 
      currentTripDest.toLowerCase().includes(e.destination.toLowerCase())
    );
    return matched ? matched.destination : 'Tokyo, Japan';
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Booking Modal State
  const [activeBookingExperience, setActiveBookingExperience] = useState<BookableExperience | null>(() => {
    if (preselectedExperienceId) {
      return curatedExperiences.find(e => e.id === preselectedExperienceId) || null;
    }
    return null;
  });

  // If initiated from an itinerary activity directly
  const [activeItineraryActivity, setActiveItineraryActivity] = useState<Activity | null>(preselectedActivity || null);

  // Booking Form Inputs
  const [bookingDate, setBookingDate] = useState<string>(trip?.startDate || '2026-11-20');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedTravelerIds, setSelectedTravelerIds] = useState<string[]>(() => {
    if (trip && trip.travelers.length > 0) {
      return trip.travelers.map(t => t.id);
    }
    return ['user-1'];
  });
  const [contactEmail, setContactEmail] = useState('traveler@example.com');
  const [bookingSuccessModal, setBookingSuccessModal] = useState<ActivityBooking | null>(null);

  // QR Code Voucher Modal State
  const [viewingVoucher, setViewingVoucher] = useState<ActivityBooking | null>(null);

  // All distinct destinations from catalog
  const availableDestinations = useMemo(() => {
    const set = new Set<string>();
    curatedExperiences.forEach(e => set.add(e.destination));
    return Array.from(set);
  }, []);

  // Filtered experiences
  const filteredExperiences = useMemo(() => {
    return curatedExperiences.filter(exp => {
      const matchDest = exp.destination.toLowerCase().includes(selectedDestination.toLowerCase()) ||
        selectedDestination.toLowerCase().includes(exp.destination.toLowerCase());
      
      const matchCat = selectedCategory === 'all' || exp.category === selectedCategory;
      const matchSearch = !searchQuery || 
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchDest && matchCat && matchSearch;
    });
  }, [selectedDestination, selectedCategory, searchQuery]);

  // Find ticketable activities from current active trip plan
  const tripTicketableActivities = useMemo(() => {
    if (!trip) return [];
    const list: { activity: Activity; dayNumber: number; date: string }[] = [];
    trip.days.forEach(day => {
      day.activities.forEach(act => {
        if (act.cost > 0) {
          list.push({ activity: act, dayNumber: day.dayNumber, date: day.date });
        }
      });
    });
    return list;
  }, [trip]);

  // Open booking modal for curated experience
  const handleOpenBooking = (exp: BookableExperience) => {
    setActiveItineraryActivity(null);
    setActiveBookingExperience(exp);
    setSelectedSlot(exp.availableSlots[0] || '10:00 AM');
    if (trip?.travelers?.length) {
      setSelectedTravelerIds(trip.travelers.map(t => t.id));
    }
  };

  // Open booking modal for custom activity from Itinerary
  const handleOpenActivityBooking = (act: Activity, defaultDate?: string) => {
    setActiveBookingExperience(null);
    setActiveItineraryActivity(act);
    setSelectedSlot(act.time || '10:00 AM');
    if (defaultDate) setBookingDate(defaultDate);
    if (trip?.travelers?.length) {
      setSelectedTravelerIds(trip.travelers.map(t => t.id));
    }
  };

  // Toggle traveler selection for tickets
  const toggleTraveler = (travelerId: string) => {
    if (selectedTravelerIds.includes(travelerId)) {
      if (selectedTravelerIds.length === 1) return; // Keep at least 1
      setSelectedTravelerIds(selectedTravelerIds.filter(id => id !== travelerId));
    } else {
      setSelectedTravelerIds([...selectedTravelerIds, travelerId]);
    }
  };

  // Confirm booking and persist to trip
  const handleConfirmBooking = () => {
    if (!trip) return;

    const currentTravelers = trip.travelers.length > 0
      ? trip.travelers
      : [{ id: 'user-1', name: 'Traveler', avatar: 'TR', color: 'from-amber-500 to-orange-600', pace: 'balanced' as const, budget: 'moderate' as const, interests: [], foodPreference: '', wakeUpTime: '', mustHaves: '' }];

    const participatingTravelers = currentTravelers
      .filter(t => selectedTravelerIds.includes(t.id))
      .map(t => ({ travelerId: t.id, travelerName: t.name }));

    const unitPrice = activeBookingExperience 
      ? activeBookingExperience.pricePerPerson 
      : (activeItineraryActivity ? activeItineraryActivity.cost : 25);

    const title = activeBookingExperience 
      ? activeBookingExperience.title 
      : (activeItineraryActivity ? activeItineraryActivity.title : 'Curated Activity Pass');

    const category = activeBookingExperience 
      ? activeBookingExperience.category 
      : (activeItineraryActivity ? activeItineraryActivity.category : 'sightseeing');

    const neighborhood = activeBookingExperience 
      ? activeBookingExperience.neighborhood 
      : (activeItineraryActivity ? activeItineraryActivity.neighborhood : 'Central');

    const meetingPoint = activeBookingExperience
      ? activeBookingExperience.meetingPoint
      : `Main entrance / Ticket gate at ${neighborhood}`;

    const perks = activeBookingExperience
      ? activeBookingExperience.included
      : ['Official digital voucher pass', 'Reserved group entry', 'Instant mobile check-in'];

    const newBooking: ActivityBooking = {
      id: `book-${Date.now()}`,
      activityId: activeBookingExperience?.id || activeItineraryActivity?.id,
      activityTitle: title,
      destination: trip.destination,
      date: bookingDate,
      timeSlot: selectedSlot || '10:00 AM',
      category,
      neighborhood,
      unitPrice,
      participants: participatingTravelers,
      totalPrice: unitPrice * participatingTravelers.length,
      bookingRef: `VV-${trip.destination.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      includedPerks: perks,
      cancellationPolicy: 'Free cancellation up to 24 hours prior to activity start',
      meetingPoint,
      contactEmail,
      qrCodeSeed: `VIBEVOYAGE-${Date.now()}`
    };

    const existingBookings = trip.bookings || [];
    const updatedTrip: TripPlan = {
      ...trip,
      bookings: [newBooking, ...existingBookings]
    };

    onUpdateTrip(updatedTrip);
    setActiveBookingExperience(null);
    setActiveItineraryActivity(null);
    setBookingSuccessModal(newBooking);
  };

  // Cancel booking
  const handleCancelBooking = (bookingId: string) => {
    if (!trip || !trip.bookings) return;
    const updatedBookings = trip.bookings.filter(b => b.id !== bookingId);
    onUpdateTrip({
      ...trip,
      bookings: updatedBookings
    });
  };

  // Add booked activity to Itinerary Day
  const handleAddBookedToItinerary = (booking: ActivityBooking, targetDayNumber = 1) => {
    if (!trip) return;

    const newActivity: Activity = {
      id: `act-booked-${Date.now()}`,
      time: booking.timeSlot,
      title: `[Booked] ${booking.activityTitle}`,
      description: `Confirmed reservation (Ref: ${booking.bookingRef}). Meeting Point: ${booking.meetingPoint}`,
      category: booking.category,
      cost: booking.unitPrice,
      duration: '2 hrs',
      neighborhood: booking.neighborhood,
      vibe: 'Reserved Experience',
      suggestedBy: booking.participants.map(p => p.travelerName).join(', ') || 'Group',
      votes: booking.participants.length,
      userVoted: true,
      notes: `Voucher Ref: ${booking.bookingRef} · ${booking.participants.length} Tickets Reserved`,
      transitToNext: '10 min walk'
    };

    const updatedDays = trip.days.map(d => {
      if (d.dayNumber === targetDayNumber) {
        return {
          ...d,
          activities: [...d.activities, newActivity]
        };
      }
      return d;
    });

    onUpdateTrip({
      ...trip,
      days: updatedDays
    });

    alert(`Successfully linked "${booking.activityTitle}" into Day ${targetDayNumber} of your itinerary!`);
  };

  const currentBookings = trip?.bookings || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200/80 rounded-full text-xs font-semibold text-indigo-900 shadow-2xs">
            <Ticket className="w-3.5 h-3.5 text-indigo-600" />
            <span>Fast-Track Tickets & VIP Group Reservations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            Book Activities & Experiences
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Reserve skip-the-line passes, guided foodie tours, and rooftop observatories. Split payments across your group with instant mobile vouchers.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl shrink-0 self-stretch sm:self-auto">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'browse'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>Explore Catalog</span>
          </button>

          <button
            onClick={() => setActiveTab('my-bookings')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 relative ${
              activeTab === 'my-bookings'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Ticket className="w-4 h-4 text-rose-600" />
            <span>My Bookings</span>
            {currentBookings.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                {currentBookings.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* VIEW 1: BROWSE EXPERIENCES */}
      {activeTab === 'browse' && (
        <div className="space-y-8">
          
          {/* Destination Selector Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Destination:</span>
              <div className="flex flex-wrap gap-1.5">
                {availableDestinations.map(dest => (
                  <button
                    key={dest}
                    onClick={() => setSelectedDestination(dest)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedDestination === dest
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {dest.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search activities, districts..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Experiences' },
              { id: 'culture', label: 'Culture & Temples' },
              { id: 'sightseeing', label: 'Observatories & Views' },
              { id: 'food', label: 'Food & Dining' },
              { id: 'nature', label: 'Nature & Canals' },
              { id: 'art', label: 'Art & Museums' },
              { id: 'shopping', label: 'Shopping & Workshops' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                  selectedCategory === cat.id
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Section: Itinerary Specific Ticketable Activities (If current trip has ticket items) */}
          {tripTicketableActivities.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50/70 via-rose-50/50 to-indigo-50/70 border border-amber-200/80 rounded-3xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                      Activities from Your Current Itinerary ({trip?.destination})
                    </h2>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    These items in your itinerary have admissions or dining costs. Reserve tickets here to lock in your spots.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tripTicketableActivities.map(({ activity, dayNumber, date }) => {
                  const alreadyBooked = currentBookings.some(b => b.activityId === activity.id || b.activityTitle.includes(activity.title));

                  return (
                    <div 
                      key={activity.id}
                      className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                            Day {dayNumber} · {activity.time}
                          </span>
                          <span className="font-bold text-slate-900">${activity.cost} / person</span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{activity.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{activity.description}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {activity.neighborhood}
                        </span>

                        {alreadyBooked ? (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Check className="w-3 h-3" /> Booked
                          </span>
                        ) : (
                          <button
                            onClick={() => handleOpenActivityBooking(activity, date)}
                            className="px-3 py-1 bg-slate-900 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <span>Reserve</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Curated Catalog Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Curated Experiences in {selectedDestination}
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {filteredExperiences.length} activities available
              </span>
            </div>

            {filteredExperiences.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <Compass className="w-10 h-10 text-slate-400 mx-auto animate-bounce" />
                <h3 className="text-base font-bold text-slate-800">No experiences match your search</h3>
                <p className="text-xs text-slate-500">Try adjusting your category filter or searching for another keyword.</p>
                <button
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExperiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-slate-300 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Header with Badge */}
                      <div className="relative h-48 overflow-hidden bg-slate-100">
                        <img
                          src={exp.image}
                          alt={exp.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                        
                        {exp.badge && (
                          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[10px] font-bold text-slate-900 px-2.5 py-0.5 rounded-full shadow-2xs">
                            {exp.badge}
                          </div>
                        )}

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                          <div className="flex items-center gap-1 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{exp.rating}</span>
                            <span className="text-slate-300 font-normal">({exp.reviewsCount})</span>
                          </div>
                          <span className="bg-slate-950/70 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] font-medium">
                            {exp.duration}
                          </span>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{exp.neighborhood}</span>
                          <span>·</span>
                          <span className="capitalize text-indigo-600 font-semibold">{exp.category}</span>
                        </div>

                        <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                          {exp.title}
                        </h3>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {exp.description}
                        </p>

                        {/* Highlights bullets */}
                        <div className="space-y-1 pt-1">
                          {exp.highlights.slice(0, 2).map((h, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-500">
                              <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer & Price Booking Bar */}
                    <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-extrabold text-slate-900 font-display">
                            ${exp.pricePerPerson}
                          </span>
                          {exp.originalPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              ${exp.originalPrice}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block -mt-1">per person / all fees incl.</span>
                      </div>

                      <button
                        onClick={() => handleOpenBooking(exp)}
                        className="px-4 py-2 bg-slate-900 hover:bg-rose-600 text-white font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Book Passes</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: MY BOOKINGS (CONFIRMED PASSES & QR CODES) */}
      {activeTab === 'my-bookings' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
                Your Confirmed Reservations & Vouchers
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Present these digital vouchers or QR codes upon arrival. No printed tickets required.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('browse')}
              className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book More Experiences</span>
            </button>
          </div>

          {currentBookings.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Ticket className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-800">No Bookings Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  You haven't reserved any activity tickets or experiences yet. Explore curated fast-track passes and book directly for your travel party.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('browse')}
                className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
              >
                Explore Activities
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {currentBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  {/* Top Ticket Header */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                            Ref: {b.bookingRef}
                          </span>
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Confirmed
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-slate-900 leading-snug pt-1">
                          {b.activityTitle}
                        </h3>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{b.neighborhood} · {b.destination}</span>
                        </div>
                      </div>

                      {/* Small QR Code Thumbnail Button */}
                      <button
                        onClick={() => setViewingVoucher(b)}
                        className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 flex flex-col items-center justify-center shrink-0 text-slate-700 transition-colors group"
                        title="View Digital QR Voucher"
                      >
                        <QrCode className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold mt-1 uppercase tracking-wider text-slate-500">View Pass</span>
                      </button>
                    </div>

                    {/* Booking Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Date</span>
                        <span className="font-semibold text-slate-800">{b.date}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Time Slot</span>
                        <span className="font-semibold text-slate-800">{b.timeSlot}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Paid</span>
                        <span className="font-bold text-slate-900">${b.totalPrice}</span>
                      </div>
                    </div>

                    {/* Participating Travelers */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Assigned Travelers ({b.participants.length} Passes)
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {b.participants.map(p => (
                          <div
                            key={p.travelerId}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 font-semibold"
                          >
                            <Users className="w-3 h-3 text-indigo-600" />
                            <span>{p.travelerName}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Meeting point notice */}
                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <span><strong>Meeting Point:</strong> {b.meetingPoint}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => handleAddBookedToItinerary(b, 1)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Link to Itinerary Day 1</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewingVoucher(b)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Show QR Pass</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Cancel booking ${b.bookingRef} for "${b.activityTitle}"? Full refund will be processed.`)) {
                            handleCancelBooking(b.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Cancel Booking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: INTERACTIVE BOOKING FLOW */}
      {(activeBookingExperience || activeItineraryActivity) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 space-y-6">
            
            {/* Modal Header */}
            <div className="p-6 pb-0 flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  Reserve Experience Tickets
                </span>
                <h3 className="text-xl font-bold font-display text-slate-900 mt-0.5">
                  {activeBookingExperience?.title || activeItineraryActivity?.title}
                </h3>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activeBookingExperience?.neighborhood || activeItineraryActivity?.neighborhood} · {trip?.destination}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveBookingExperience(null);
                  setActiveItineraryActivity(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 space-y-5">
              
              {/* Step 1: Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Preferred Time Slot
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={e => setSelectedSlot(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    {activeBookingExperience ? (
                      activeBookingExperience.availableSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))
                    ) : (
                      <>
                        <option value="09:30 AM">09:30 AM (Morning)</option>
                        <option value="12:30 PM">12:30 PM (Midday)</option>
                        <option value="04:00 PM">04:00 PM (Afternoon / Sunset)</option>
                        <option value="07:00 PM">07:00 PM (Evening)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Step 2: Traveler Participant Checkbox Selection */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Who is attending? (Group Split)</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {selectedTravelerIds.length} ticket{selectedTravelerIds.length > 1 ? 's' : ''} selected
                  </span>
                </label>

                <div className="space-y-2">
                  {(trip?.travelers || [{ id: 'user-1', name: 'You (Lead Traveler)', avatar: 'ME', color: 'from-amber-500 to-orange-600' }]).map((t: any) => {
                    const isSelected = selectedTravelerIds.includes(t.id);
                    return (
                      <div
                        key={t.id}
                        onClick={() => toggleTraveler(t.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-50/70 border-indigo-400 text-slate-900 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-tr ${t.color || 'from-indigo-500 to-purple-600'} text-white text-[10px] font-bold flex items-center justify-center`}>
                            {t.avatar}
                          </div>
                          <span className="text-xs font-bold text-slate-800">{t.name}</span>
                        </div>

                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Transparent Price Calculation */}
              {(() => {
                const unitPrice = activeBookingExperience 
                  ? activeBookingExperience.pricePerPerson 
                  : (activeItineraryActivity?.cost || 25);
                const count = selectedTravelerIds.length;
                const total = unitPrice * count;

                return (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Admission / Pass (${unitPrice} × {count} traveler{count > 1 ? 's' : ''})</span>
                      <span className="font-semibold text-slate-900">${total}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Booking & Service Fees</span>
                      <span className="text-emerald-700 font-semibold">$0.00 (Waived)</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
                      <span className="font-bold text-slate-900">Total Group Amount</span>
                      <span className="font-extrabold text-indigo-700 text-base font-display">${total}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Guarantees */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Instant Confirmation
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <Check className="w-3.5 h-3.5 text-indigo-600" /> Free cancellation (24h before)
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setActiveBookingExperience(null);
                  setActiveItineraryActivity(null);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmBooking}
                className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Generate Digital Passes</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: BOOKING CONFIRMATION & QR VOUCHER PASS */}
      {(bookingSuccessModal || viewingVoucher) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden space-y-6">
            
            {/* Boarding Pass Style Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>VibeVoyage Official Mobile Pass</span>
                </div>
                <button
                  onClick={() => {
                    setBookingSuccessModal(null);
                    setViewingVoucher(null);
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-1">
                <span className="text-[10px] text-indigo-300 font-mono tracking-wider uppercase">
                  Reservation Reference
                </span>
                <h3 className="text-2xl font-black font-mono tracking-tight text-white">
                  {(bookingSuccessModal || viewingVoucher)?.bookingRef}
                </h3>
                <h4 className="text-sm font-bold text-slate-200 line-clamp-1 pt-1">
                  {(bookingSuccessModal || viewingVoucher)?.activityTitle}
                </h4>
              </div>
            </div>

            {/* Pass Content Body */}
            <div className="px-6 space-y-5">
              
              {/* Simulated Authentic QR Code View */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-2">
                <div className="w-40 h-40 bg-white border border-slate-300 rounded-xl p-2 flex items-center justify-center shadow-xs">
                  <QrCode className="w-36 h-36 text-slate-900" />
                </div>
                <span className="text-[10px] font-mono font-medium text-slate-400">
                  Scan at entrance turnstile or show to guide
                </span>
              </div>

              {/* Pass details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Date & Time</span>
                  <span className="font-semibold text-slate-900">
                    {(bookingSuccessModal || viewingVoucher)?.date} · {(bookingSuccessModal || viewingVoucher)?.timeSlot}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Travelers</span>
                  <span className="font-semibold text-slate-900">
                    {(bookingSuccessModal || viewingVoucher)?.participants.length} Person(s)
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-600 bg-emerald-50/80 p-3 rounded-xl border border-emerald-200">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Fast-Track Admission Ready
                </div>
                <p className="text-[11px] text-emerald-950">
                  Meeting Point: {(bookingSuccessModal || viewingVoucher)?.meetingPoint}
                </p>
              </div>
            </div>

            {/* Pass Actions */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  alert('Voucher pass downloaded as offline PDF voucher.');
                }}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Save Offline Pass</span>
              </button>

              <button
                onClick={() => {
                  const pass = bookingSuccessModal || viewingVoucher;
                  if (pass) {
                    handleAddBookedToItinerary(pass, 1);
                  }
                  setBookingSuccessModal(null);
                  setViewingVoucher(null);
                  setActiveTab('my-bookings');
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>Link to Itinerary</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
