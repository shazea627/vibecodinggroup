export type ActivityCategory =
  | 'culture'
  | 'food'
  | 'nature'
  | 'art'
  | 'nightlife'
  | 'shopping'
  | 'sightseeing';
export type TravelPace = 'relaxed' | 'balanced' | 'fast_paced';
export type BudgetTier = 'budget' | 'moderate' | 'luxury';

export interface TravelerProfile {
  id: string;
  name: string;
  avatar: string;
  color: string;
  pace: TravelPace;
  budget: BudgetTier;
  interests: string[];
  foodPreference: string;
  wakeUpTime: string;
  mustHaves: string;
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  category: ActivityCategory;
  cost: number;
  duration: string;
  neighborhood: string;
  vibe: string;
  suggestedBy: string;
  votes: number;
  userVoted?: boolean;
  notes: string;
  transitToNext: string;
}

export interface DayPlan {
  dayNumber: number;
  date: string;
  title: string;
  areaSummary: string;
  weather: {
    condition: string;
    temp: string;
    icon: string;
  };
  estimatedWalkingKm: number;
  estimatedBudgetPerPerson: number;
  activities: Activity[];
}

export interface GroupSummary {
  consensusScore: string;
  reconciliationNotes: string;
  sharedInterests: string[];
  compromisePace: string;
}

export interface TripPlan {
  id: string;
  title: string;
  destination: string;
  groupMode: boolean;
  startDate: string;
  endDate: string;
  durationDays: number;
  targetBudget: BudgetTier;
  travelStyle: string;
  travelers: TravelerProfile[];
  groupSummary: GroupSummary;
  days: DayPlan[];
  createdAt: string;
  isLiveAI?: boolean;
  bookings?: ActivityBooking[];
  budgetSettings?: {
    lodgingPerNight?: number;
    transportPerPerson?: number;
  };
}

export interface ActivityBooking {
  id: string;
  activityId?: string;
  activityTitle: string;
  destination: string;
  date: string;
  timeSlot: string;
  category: Activity['category'];
  neighborhood: string;
  unitPrice: number;
  participants: {
    travelerId: string;
    travelerName: string;
  }[];
  totalPrice: number;
  bookingRef: string;
  status: 'confirmed' | 'pending' | 'completed';
  createdAt: string;
  includedPerks: string[];
  cancellationPolicy: string;
  meetingPoint: string;
  contactEmail: string;
  qrCodeSeed?: string;
}

export interface BookableExperience {
  id: string;
  title: string;
  destination: string;
  category: Activity['category'];
  duration: string;
  neighborhood: string;
  pricePerPerson: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  badge?: string;
  instantConfirmation: boolean;
  freeCancellation: boolean;
  description: string;
  highlights: string[];
  availableSlots: string[];
  included: string[];
  meetingPoint: string;
}
