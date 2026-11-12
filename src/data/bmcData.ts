export interface BMCSection {
  title: string;
  subtitle: string;
  color: string;
  items: { text: string; tag?: string }[];
}

export const bmcAnalysisData = {
  title: "Business Model Canvas Analysis",
  source: "Miro Board Workshop Artifact",
  summary: "A next-generation travel itinerary application addressing the friction of coordinating group trips and solving routing chaos through automated preference reconciliation and adaptive AI plans.",
  targetSegments: [
    {
      segment: "Friends Traveling Together",
      painPoint: "Endless WhatsApp debates, mismatched budgets, conflicting wake-up times, and decision paralysis.",
      ourSolution: "Collaborative preference matching engine, private budget reconciliation, and multi-option activity voting."
    },
    {
      segment: "Solo Travelers",
      painPoint: "Hours spent combing through scattered blogs, fear of missing hidden gems, and route backtracking.",
      ourSolution: "Automated route-optimized itineraries tailored to personal pace and interests with 1-click generation."
    },
    {
      segment: "Busy Professionals & Couples",
      painPoint: "Limited free time to plan high-quality, balanced vacations without logistical headaches.",
      ourSolution: "Curated end-to-end itineraries with transit logistics, dining reservations, and zero planning friction."
    },
    {
      segment: "Budget Travelers & Students",
      painPoint: "Fear of unexpected costs and awkward financial conversations among travel companions.",
      ourSolution: "Private budget matching, transparent per-person cost breakdowns, and shared expense splitting."
    }
  ],
  differentiators: [
    {
      feature: "Preference Reconciliation Engine",
      existingApps: "Single-user lists or messy shared Google Docs with no conflict resolution.",
      vibeVoyage: "Intelligently identifies shared passions and balances conflicting paces into a single harmonious day."
    },
    {
      feature: "Route-Optimized Logical Sequencing",
      existingApps: "Chronological lists that cause travelers to zigzag across huge cities.",
      vibeVoyage: "Clusters activities geographically by neighborhood with calculated transit times to eliminate wasted hours."
    },
    {
      feature: "In-Trip Adaptive Replanner",
      existingApps: "Static PDF or fixed calendar that breaks when it rains or someone wakes up late.",
      vibeVoyage: "One-tap contextual adaptations (Rainy Day switch, Slow Morning push, Budget Trim) with live AI regeneration."
    },
    {
      feature: "Inclusive Group Voting & Alternatives",
      existingApps: "Dominant planner decides everything; others feel left out.",
      vibeVoyage: "Every traveler has equal voice, with automatic alternative branches if votes split."
    }
  ],
  canvasBlocks: [
    {
      id: "key-propositions",
      title: "Key Value Propositions",
      notes: [
        "Save time and effort - generate personalized itineraries in seconds",
        "Personalized experiences based on interests, budget & travel styles",
        "Optimize routes to reduce back-and-forth travel time",
        "Inclusive group planning & private budget matching",
        "Adaptive travel companion based on energy levels and unexpected weather",
        "Uncover authentic hidden gems travelers might otherwise miss"
      ]
    },
    {
      id: "key-activities",
      title: "Key Activities",
      notes: [
        "Develop and improve the AI itinerary generator",
        "Match recommendations to traveler style, budget and pace",
        "Reconcile individual preferences & shared interests across friends",
        "Enable voting and rank options with split-vote alternatives",
        "Support real-time in-trip itinerary changes",
        "Curate and verify local recommendations",
        "Track shared expenses and split costs per person"
      ]
    },
    {
      id: "customer-segments",
      title: "Customer Segments",
      notes: [
        "Friends who travel together",
        "Solo travelers",
        "Busy professionals with limited time",
        "Students and budget travelers",
        "Couples and honeymooners",
        "Families with children"
      ]
    },
    {
      id: "customer-relationships",
      title: "Customer Relationships",
      notes: [
        "24/7 AI travel assistant for quick replans",
        "In-trip alerts for delays and weather with one-tap replanning",
        "Share trips and invite friends to plan together",
        "Timely push tips before and during trips",
        "Learn preferences from each completed trip"
      ]
    },
    {
      id: "key-partners",
      title: "Key Partners",
      notes: [
        "Travel bloggers for authentic local tips",
        "Attraction partners (Klook, TripAdvisor)",
        "Booking platforms (Booking.com, Trip.com, Airbnb)",
        "Airlines (Singapore Airlines, Scoot, AirAsia)",
        "Maps & location data (Google Maps, Naver, Waze)",
        "Payment & currency providers (Wise, Stripe)",
        "Local tour guides & tourism boards"
      ]
    },
    {
      id: "revenue-streams",
      title: "Revenue Streams",
      notes: [
        "Freemium model: basic itineraries free",
        "Affiliate commissions from travel bookings",
        "Premium subscription for advanced collaborative features",
        "Sponsored travel recommendations (clearly labeled)",
        "Specialist curated group trips"
      ]
    }
  ]
};
