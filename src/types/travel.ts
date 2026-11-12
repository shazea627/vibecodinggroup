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

export type ActivityCategory = 
  | 'culture' 
  | 'food' 
  | 'nature' 
  | 'art' 
  | 'nightlife' 
  | 'shopping' 
  | 'sightseeing'
  | 'transport'
  | 'lodging';

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

export interface TripBudgetSettings {
  lodgingPerNight?: number;
  transportPerPerson?: number;
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
  budgetSettings?: TripBudgetSettings;
}
