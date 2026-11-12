import { TripPlan } from '../types/travel';

export const sampleTrips: Record<string, TripPlan> = {
  tokyo: {
    id: 'tokyo-group-2026',
    title: 'Tokyo 3-Day Friend Odyssey: Neon, Shrines & Food',
    destination: 'Tokyo, Japan',
    groupMode: true,
    startDate: '2026-11-20',
    endDate: '2026-11-22',
    durationDays: 3,
    targetBudget: 'moderate',
    travelStyle: 'Balanced Culture, Gastronomy & Urban Exploration',
    createdAt: '2026-11-10T08:00:00.000Z',
    isLiveAI: true,
    budgetSettings: {
      lodgingPerNight: 95,
      transportPerPerson: 35
    },
    travelers: [
      {
        id: 'user-1',
        name: 'Alex Rivera',
        avatar: 'AR',
        color: 'from-amber-500 to-orange-600',
        pace: 'balanced',
        budget: 'moderate',
        interests: ['Food & Izakayas', 'Nightlife', 'Retro Tech'],
        foodPreference: 'Adventurous local street food & ramen',
        wakeUpTime: '10:00 AM (Late Riser)',
        mustHaves: 'Authentic yakitori alleyway and vintage vinyl shops'
      },
      {
        id: 'user-2',
        name: 'Maya Chen',
        avatar: 'MC',
        color: 'from-emerald-500 to-teal-600',
        pace: 'fast_paced',
        budget: 'moderate',
        interests: ['Temples & Shinto Shrines', 'Traditional Tea', 'Architecture'],
        foodPreference: 'Plant-forward & traditional kaiseki/soba',
        wakeUpTime: '07:30 AM (Early Bird)',
        mustHaves: 'Peaceful morning shrines before crowds arrive'
      },
      {
        id: 'user-3',
        name: 'Sam Taylor',
        avatar: 'ST',
        color: 'from-blue-500 to-indigo-600',
        pace: 'relaxed',
        budget: 'budget',
        interests: ['Scenic Viewpoints', 'City Parks', 'Photography'],
        foodPreference: 'Casual budget-friendly bites & convenience store hacks',
        wakeUpTime: '09:00 AM (Moderate)',
        mustHaves: 'Unobstructed sunset panoramic views of Mount Fuji'
      }
    ],
    groupSummary: {
      consensusScore: '94% Match',
      reconciliationNotes: 'Reconciled Maya’s early cultural appetite with Alex’s late-night foodie cravings. Mornings feature tranquil strolls, afternoons bridge scenic photo spots for Sam, and evenings revolve around communal Izakaya dining within mid-range budget caps.',
      sharedInterests: ['Local Gastronomy', 'Scenic Cityscapes', 'Historic Neighborhoods'],
      compromisePace: 'Moderate (Balanced 4-stop rhythm with generous cafe buffers)'
    },
    days: [
      {
        dayNumber: 1,
        date: 'Day 1 · Fri, Nov 20',
        title: 'Historic Asakusa & Riverside Gardens to Shinjuku Lights',
        areaSummary: 'Taito, Sumida & Shinjuku District',
        weather: {
          condition: 'Clear Autumn Sky',
          temp: '19°C / 66°F',
          icon: 'sun'
        },
        estimatedWalkingKm: 5.8,
        estimatedBudgetPerPerson: 78,
        activities: [
          {
            id: 'act-1-0',
            time: '08:45 AM',
            title: 'Keisei Skyliner Express & 72-Hour Tokyo Subway Pass',
            description: 'Pick up pre-booked unlimited Tokyo Metro/Toei Subway transit passes and direct train tickets into central Ueno and Asakusa.',
            category: 'transport',
            cost: 20,
            duration: '45 min',
            neighborhood: 'Narita / Asakusa',
            vibe: 'Seamless Transit',
            suggestedBy: 'Sam Taylor',
            votes: 3,
            userVoted: true,
            notes: 'Includes unlimited transit across all 13 central subway lines for the entire 3 days.',
            transitToNext: '5 min walk to Kaminarimon'
          },
          {
            id: 'act-1-1',
            time: '09:30 AM',
            title: 'Senso-ji Temple & Nakamise Historic Street',
            description: 'Tokyo’s oldest Buddhist sanctuary. Walk beneath the giant red lantern of Kaminarimon Gate and savor warm freshly-pressed ningyo-yaki sweets.',
            category: 'culture',
            cost: 0,
            duration: '2 hrs',
            neighborhood: 'Asakusa',
            vibe: 'Historic & Sensory',
            suggestedBy: 'Maya Chen',
            votes: 3,
            userVoted: true,
            notes: 'Accommodates Maya’s desire for early heritage without forcing Alex out at dawn.',
            transitToNext: '12 min walk to water bus pier'
          },
          {
            id: 'act-1-2',
            time: '12:00 PM',
            title: 'Century-Old Buckwheat Soba Lunch at Namiki Yabusoba',
            description: 'Founded in 1913, this revered noodle house serves hand-cut soba noodles with artisanal dashi dipping sauce and crispy tempura.',
            category: 'food',
            cost: 16,
            duration: '1.2 hrs',
            neighborhood: 'Asakusa',
            vibe: 'Authentic Gastronomy',
            suggestedBy: 'Alex Rivera',
            votes: 3,
            userVoted: true,
            notes: 'High satisfaction for Alex’s culinary passion while staying under Sam’s budget ceiling.',
            transitToNext: '5 min walk to Azumabashi pier'
          },
          {
            id: 'act-1-3',
            time: '02:00 PM',
            title: 'Sumida River Water Bus Cruise to Hamarikyu Gardens',
            description: 'Glide down the Sumida River passing beneath 12 iconic colored bridges, docking directly into the former shogun feudal landscaped gardens.',
            category: 'nature',
            cost: 12,
            duration: '2 hrs',
            neighborhood: 'Shiodome & Ginza',
            vibe: 'Tranquil & Scenic',
            suggestedBy: 'Sam Taylor',
            votes: 3,
            notes: 'Sam’s photography highlight. Includes a peaceful matcha tea rest over the tidal pond.',
            transitToNext: '20 min via Oedo Line to Shinjuku'
          },
          {
            id: 'act-1-4',
            time: '06:30 PM',
            title: 'Omoide Yokocho Lantern Alleyway & Craft Izakaya Dinner',
            description: 'Lantern-strewn alley with compact 6-seat izakayas grilling skewers over binchotan charcoal. Enjoy grilled tsukune, edamame, and local draught beer.',
            category: 'nightlife',
            cost: 30,
            duration: '2.5 hrs',
            neighborhood: 'Shinjuku',
            vibe: 'Electric Nightlife',
            suggestedBy: 'Alex Rivera',
            votes: 3,
            userVoted: true,
            notes: 'Communal celebration spot that satisfies everyone after a day of walking.',
            transitToNext: 'Walk to Shinjuku Station'
          }
        ]
      },
      {
        dayNumber: 2,
        date: 'Day 2 · Sat, Nov 21',
        title: 'Meiji Forest Sanctuary, Cat Street Design & Shibuya Sky Sunset',
        areaSummary: 'Harajuku, Omotesando & Shibuya District',
        weather: {
          condition: 'Partly Cloudy & Crisp',
          temp: '18°C / 64°F',
          icon: 'cloud-sun'
        },
        estimatedWalkingKm: 6.2,
        estimatedBudgetPerPerson: 62,
        activities: [
          {
            id: 'act-2-1',
            time: '10:00 AM',
            title: 'Meiji Jingu Sacred Forest & Wooden Torii Gate',
            description: 'Walk through 70 hectares of forested sanctuary containing over 100,000 evergreen trees right in the center of Tokyo.',
            category: 'culture',
            cost: 0,
            duration: '1.5 hrs',
            neighborhood: 'Harajuku',
            vibe: 'Serene & Majestic',
            suggestedBy: 'Maya Chen',
            votes: 3,
            userVoted: true,
            notes: 'Free entry preserves Sam’s budget while satisfying Maya’s spiritual heritage preference.',
            transitToNext: '5 min walk into Omotesando'
          },
          {
            id: 'act-2-2',
            time: '12:00 PM',
            title: 'Cat Street Independent Boutiques & Specialty Coffee',
            description: 'Stroll the quiet pedestrian spine linking Harajuku and Shibuya, lined with indie denim ateliers, concept stores, and artisanal coffee roasters.',
            category: 'shopping',
            cost: 14,
            duration: '2 hrs',
            neighborhood: 'Omotesando',
            vibe: 'Design & Culture',
            suggestedBy: 'Alex Rivera',
            votes: 2,
            notes: 'Flexible free-flow browsing allowing friends to separate for 45 mins if desired.',
            transitToNext: '10 min walk to Shibuya Scramble'
          },
          {
            id: 'act-2-3',
            time: '04:15 PM',
            title: 'SHIBUYA SKY Rooftop Panoramic Sunset Deck',
            description: 'Ascend 229 meters above Shibuya Crossing. The open-air sky deck offers 360-degree views stretching to Mount Fuji at twilight.',
            category: 'sightseeing',
            cost: 20,
            duration: '1.5 hrs',
            neighborhood: 'Shibuya',
            vibe: 'Breathtaking Vista',
            suggestedBy: 'Sam Taylor',
            votes: 3,
            userVoted: true,
            notes: 'Timed ticket scheduled for golden hour; top rated across all 3 travelers.',
            transitToNext: '5 min walk down to Dogenzaka'
          },
          {
            id: 'act-2-4',
            time: '07:00 PM',
            title: 'Dogenzaka Japanese Craft Beer & Gyoza Feast',
            description: 'Crispy gyoza platters paired with Japanese craft beers from Kyoto and Nagano in a lively neon-lit setting.',
            category: 'food',
            cost: 28,
            duration: '2 hrs',
            neighborhood: 'Shibuya',
            vibe: 'Casual Social',
            suggestedBy: 'Alex Rivera',
            votes: 3,
            notes: 'Easy bill split with digital tap-and-pay.',
            transitToNext: 'Night transit'
          }
        ]
      },
      {
        dayNumber: 3,
        date: 'Day 3 · Sun, Nov 22',
        title: 'Old Town Yanaka Artisan Alleys & Modern Roppongi Art',
        areaSummary: 'Yanaka, Ueno & Roppongi',
        weather: {
          condition: 'Sunny & Pleasant',
          temp: '20°C / 68°F',
          icon: 'sun'
        },
        estimatedWalkingKm: 5.1,
        estimatedBudgetPerPerson: 52,
        activities: [
          {
            id: 'act-3-1',
            time: '10:00 AM',
            title: 'Yanaka Ginza "Shitamachi" Heritage Stroll',
            description: 'One of the few neighborhoods that escaped WWII damage. Experience traditional craft workshops, ceramic studios, and cat statues.',
            category: 'culture',
            cost: 6,
            duration: '2 hrs',
            neighborhood: 'Yanaka',
            vibe: 'Nostalgic & Peaceful',
            suggestedBy: 'Maya Chen',
            votes: 3,
            notes: 'Sample menchi-katsu minced cutlets from a 70-year-old family butcher.',
            transitToNext: '25 min via Chiyoda Line to Roppongi'
          },
          {
            id: 'act-3-2',
            time: '01:00 PM',
            title: 'Mori Art Museum & 53rd Floor Sky Gallery',
            description: 'World-class contemporary Asian art exhibitions with sky-high views over Tokyo Tower and Tokyo Bay.',
            category: 'art',
            cost: 16,
            duration: '2 hrs',
            neighborhood: 'Roppongi',
            vibe: 'Inspiring Modern Art',
            suggestedBy: 'Sam Taylor',
            votes: 3,
            userVoted: true,
            notes: 'Indoor cultural highlight blending Sam and Maya’s aesthetic interests.',
            transitToNext: '10 min walk to Azabu-Juban'
          },
          {
            id: 'act-3-3',
            time: '06:00 PM',
            title: 'Azabu-Juban Farewell Ramen Tasting & Sake Flight',
            description: 'Celebratory final dinner with custom flights of Junmai Daiginjo sake and rich artisanal tonkotsu / vegan truffle ramen.',
            category: 'food',
            cost: 30,
            duration: '2 hrs',
            neighborhood: 'Azabu-Juban',
            vibe: 'Memorable Finale',
            suggestedBy: 'Alex Rivera',
            votes: 3,
            notes: 'Accommodates both meat lovers and vegan/vegetarian preferences.',
            transitToNext: 'Airport / Hotel'
          }
        ]
      }
    ]
  },
  bali: {
    id: 'bali-solo-2026',
    title: 'Bali 3-Day Soul, Surf & Rainforest Retreat',
    destination: 'Ubud & Canggu, Bali',
    groupMode: false,
    startDate: '2026-12-05',
    endDate: '2026-12-07',
    durationDays: 3,
    targetBudget: 'moderate',
    travelStyle: 'Wellness, Nature & Coastal Culture',
    createdAt: '2026-11-09T10:00:00.000Z',
    isLiveAI: true,
    budgetSettings: {
      lodgingPerNight: 65,
      transportPerPerson: 25
    },
    travelers: [
      {
        id: 'solo-1',
        name: 'Jordan Lee',
        avatar: 'JL',
        color: 'from-teal-500 to-cyan-600',
        pace: 'relaxed',
        budget: 'moderate',
        interests: ['Nature', 'Wellness & Yoga', 'Cafes & Local Markets'],
        foodPreference: 'Organic farm-to-table & smoothie bowls',
        wakeUpTime: '06:30 AM (Sunrise Lover)',
        mustHaves: 'Lush jungle views and authentic Balinese healing traditions'
      }
    ],
    groupSummary: {
      consensusScore: '100% Solo Alignment',
      reconciliationNotes: 'Optimized for unhurried flow, early sunrise walks before tropical humidity rises, and peaceful afternoons at open-air jungle cafes.',
      sharedInterests: ['Rainforest Trails', 'Holistic Wellness', 'Artisan Cafes'],
      compromisePace: 'Relaxed & Restorative'
    },
    days: [
      {
        dayNumber: 1,
        date: 'Day 1 · Sat, Dec 5',
        title: 'Campuhan Ridge Sunrise & Sacred Ubud Temples',
        areaSummary: 'Central Ubud',
        weather: { condition: 'Tropical Breeze', temp: '28°C / 82°F', icon: 'sun' },
        estimatedWalkingKm: 4.8,
        estimatedBudgetPerPerson: 42,
        activities: [
          {
            id: 'b-1-1',
            time: '06:45 AM',
            title: 'Campuhan Ridge Walk at Sunrise',
            description: 'Scenic hilltop walkway flanked by lush river valleys and waving elephant grass bathed in golden dawn light.',
            category: 'nature',
            cost: 0,
            duration: '1.5 hrs',
            neighborhood: 'Campuhan',
            vibe: 'Serene Dawn',
            suggestedBy: 'Jordan Lee',
            votes: 1,
            notes: 'Coolest time of day with misty jungle views.',
            transitToNext: '10 min walk to cafe'
          },
          {
            id: 'b-1-2',
            time: '08:45 AM',
            title: 'Karsa Cafe & Organic Tropical Breakfast',
            description: 'Open-air bamboo pavilions perched directly over lotus ponds and emerald rice paddies.',
            category: 'food',
            cost: 10,
            duration: '1.5 hrs',
            neighborhood: 'Keliki',
            vibe: 'Organic Sanctuary',
            suggestedBy: 'Jordan Lee',
            votes: 1,
            notes: 'Try the fresh dragonfruit smoothie bowl and Balinese single-origin coffee.',
            transitToNext: '15 min scooter ride'
          },
          {
            id: 'b-1-3',
            time: '02:00 PM',
            title: 'Tirta Empul Sacred Water Purification Ritual',
            description: 'Participate respectfully in the traditional Melukat cleansing ritual under 12 holy spring water fountains.',
            category: 'culture',
            cost: 8,
            duration: '2.5 hrs',
            neighborhood: 'Tampaksiring',
            vibe: 'Spiritual Heritage',
            suggestedBy: 'Jordan Lee',
            votes: 1,
            notes: 'Sarong provided at entrance; respectful cultural attire required.',
            transitToNext: '20 min scenic drive'
          },
          {
            id: 'b-1-4',
            time: '06:30 PM',
            title: 'Locavore Herbivore 5-Course Plant-Based Dinner',
            description: 'Award-winning sustainable tasting menu showcasing native Balinese herbs, wild mushrooms, and fermented heirloom vegetables.',
            category: 'food',
            cost: 24,
            duration: '2 hrs',
            neighborhood: 'Central Ubud',
            vibe: 'Culinary Art',
            suggestedBy: 'Jordan Lee',
            votes: 1,
            notes: 'Reservations recommended; 100% locally sourced.',
            transitToNext: 'Walk to retreat'
          }
        ]
      },
      {
        dayNumber: 2,
        date: 'Day 2 · Sun, Dec 6',
        title: 'Tegallalang Rice Terraces & Jungle Sound Healing',
        areaSummary: 'North Ubud & Petanu River',
        weather: { condition: 'Warm & Sunny', temp: '29°C / 84°F', icon: 'sun' },
        estimatedWalkingKm: 3.9,
        estimatedBudgetPerPerson: 48,
        activities: [
          {
            id: 'b-2-1',
            time: '08:00 AM',
            title: 'Tegallalang UNESCO Cascading Rice Terraces',
            description: 'Wander deep into the Subak traditional irrigation terraces before midday heat.',
            category: 'nature',
            cost: 5,
            duration: '2 hrs',
            neighborhood: 'Tegallalang',
            vibe: 'Emerald Landscapes',
            suggestedBy: 'Jordan Lee',
            votes: 1,
            notes: 'Support local farmers by tipping at footpath bamboo checkpoints.',
            transitToNext: '15 min drive'
          },
          {
            id: 'b-2-2',
            time: '11:30 AM',
            title: 'Pyramids of Chi Sound Frequency Bath',
            description: 'Deep restorative sound healing meditation inside sacred pyramid acoustic resonance chambers.',
            category: 'nature',
            cost: 22,
            duration: '2 hrs',
            neighborhood: 'Andong',
            vibe: 'Deep Relaxation',
            suggestedBy: 'Jordan Lee',
            votes: 1,
            notes: 'Ancient gongs, didgeridoos, and Himalayan quartz bowls.',
            transitToNext: '10 min walk'
          },
          {
            id: 'b-2-3',
            time: '06:00 PM',
            title: 'Sunset Coconut & Acoustic Fire Pit in the Paddies',
            description: 'Unwind with fresh young coconuts and wood-fired flatbreads overlooking waving rice stalks.',
            category: 'food',
            cost: 15,
            duration: '2 hrs',
            neighborhood: 'Penestanan',
            vibe: 'Peaceful Sundown',
            suggestedBy: 'Jordan Lee',
            votes: 1,
            notes: 'Fireflies appear right around 7:15 PM.',
            transitToNext: 'Scooter return'
          }
        ]
      },
      {
        dayNumber: 3,
        date: 'Day 3 · Mon, Dec 7',
        title: 'Coastward to Canggu: Ocean Stroll & Echo Beach Sunset',
        areaSummary: 'Canggu & Pererenan Coastline',
        weather: { condition: 'Sea Breeze & Golden Light', temp: '27°C / 81°F', icon: 'cloud-sun' },
        estimatedWalkingKm: 4.2,
        estimatedBudgetPerPerson: 55,
        activities: [
          {
            id: 'b-3-1',
            time: '09:00 AM',
            title: 'Coastal Drive & Pererenan Beach Surf Watching',
            description: 'Watch skilled longboarders dance on rolling reef breaks while walking black volcanic sands.',
            category: 'nature',
            cost: 0,
            duration: '2 hrs',
            neighborhood: 'Pererenan',
            vibe: 'Ocean Serenity',
            suggestedBy: 'Jordan Lee',
            votes: 1,
            notes: 'Warm tidal pools ideal for a relaxing morning dip.',
            transitToNext: '5 min walk'
          },
          {
            id: 'b-3-2',
            time: '12:30 PM',
            title: 'The Lawn Beachside Mezze & Iced Matcha',
            description: 'Daybed lounge overlooking the Indian Ocean break with Mediterranean mezze platters and iced matcha lattes.',
            category: 'food',
            cost: 25,
            duration: '2.5 hrs',
            neighborhood: 'Batu Bolong',
            vibe: 'Chic Coastal',
            suggestedBy: 'Jordan Lee',
            votes: 1,
            notes: 'Great spot to journal and reflect on the journey.',
            transitToNext: '10 min beach walk'
          },
          {
            id: 'b-3-3',
            time: '05:30 PM',
            title: 'Echo Beach Sunset Barbecue & Live Acoustic Set',
            description: 'Fresh grilled snapper with sambal matah cooked over coconut husks as the sun melts into the ocean.',
            category: 'nightlife',
            cost: 20,
            duration: '2 hrs',
            neighborhood: 'Echo Beach',
            vibe: 'Golden Hour Magic',
            suggestedBy: 'Jordan Lee',
            votes: 1,
            notes: 'Spectacular sunset vantage point with ocean waves breaking in the foreground.',
            transitToNext: 'Transfer to Denpasar'
          }
        ]
      }
    ]
  }
};
