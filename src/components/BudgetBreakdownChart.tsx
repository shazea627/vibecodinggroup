import React, { useState, useMemo } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { 
  TripPlan, 
  ActivityCategory 
} from '../types/travel';
import { 
  Utensils, 
  Car, 
  Building, 
  Landmark, 
  Camera, 
  Trees, 
  Palette, 
  Wine, 
  ShoppingBag, 
  DollarSign, 
  Users, 
  SlidersHorizontal, 
  HelpCircle,
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  Layers,
  Sparkles
} from 'lucide-react';

interface BudgetBreakdownChartProps {
  trip: TripPlan;
  onUpdateTrip?: (updated: TripPlan) => void;
  compact?: boolean;
}

interface CategoryMeta {
  key: string;
  label: string;
  color: string;
  hoverColor: string;
  icon: React.ReactNode;
}

export const CATEGORY_DEFINITIONS: Record<string, CategoryMeta> = {
  // Core Groups
  lodging: {
    key: 'lodging',
    label: 'Lodging & Hotel',
    color: '#8b5cf6', // violet-500
    hoverColor: '#7c3aed',
    icon: <Building className="w-3.5 h-3.5" />
  },
  food: {
    key: 'food',
    label: 'Food & Dining',
    color: '#f43f5e', // rose-500
    hoverColor: '#e11d48',
    icon: <Utensils className="w-3.5 h-3.5" />
  },
  activities: {
    key: 'activities',
    label: 'Activities & Experiences',
    color: '#06b6d4', // cyan-500
    hoverColor: '#0891b2',
    icon: <Camera className="w-3.5 h-3.5" />
  },
  transport: {
    key: 'transport',
    label: 'Transit & Transport',
    color: '#3b82f6', // blue-500
    hoverColor: '#2563eb',
    icon: <Car className="w-3.5 h-3.5" />
  },
  // Detailed subcategories
  culture: {
    key: 'culture',
    label: 'Culture & Heritage',
    color: '#f59e0b', // amber-500
    hoverColor: '#d97706',
    icon: <Landmark className="w-3.5 h-3.5" />
  },
  sightseeing: {
    key: 'sightseeing',
    label: 'Sightseeing & Tours',
    color: '#0ea5e9', // sky-500
    hoverColor: '#0284c7',
    icon: <Camera className="w-3.5 h-3.5" />
  },
  nature: {
    key: 'nature',
    label: 'Nature & Parks',
    color: '#10b981', // emerald-500
    hoverColor: '#059669',
    icon: <Trees className="w-3.5 h-3.5" />
  },
  art: {
    key: 'art',
    label: 'Art & Museums',
    color: '#a855f7', // purple-500
    hoverColor: '#9333ea',
    icon: <Palette className="w-3.5 h-3.5" />
  },
  nightlife: {
    key: 'nightlife',
    label: 'Nightlife & Drinks',
    color: '#ec4899', // pink-500
    hoverColor: '#db2777',
    icon: <Wine className="w-3.5 h-3.5" />
  },
  shopping: {
    key: 'shopping',
    label: 'Shopping & Souvenirs',
    color: '#6366f1', // indigo-500
    hoverColor: '#4f46e5',
    icon: <ShoppingBag className="w-3.5 h-3.5" />
  }
};

export const BudgetBreakdownChart: React.FC<BudgetBreakdownChartProps> = ({
  trip,
  onUpdateTrip,
  compact = false
}) => {
  // Category Mode: 'core' (Lodging, Food, Activities, Transport) vs 'detailed' (all 9 categories)
  const [groupingMode, setGroupingMode] = useState<'core' | 'detailed'>('core');
  const [chartType, setChartType] = useState<'donut' | 'bar'>('donut');
  const [viewScope, setViewScope] = useState<'comprehensive' | 'activities_only'>('comprehensive');
  const [displayUnit, setDisplayUnit] = useState<'per_person' | 'entire_group'>('per_person');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isEditingEstimates, setIsEditingEstimates] = useState(false);

  // Baseline estimates
  const defaultLodgingPerNight = trip.targetBudget === 'budget' ? 45 : trip.targetBudget === 'luxury' ? 220 : 95;
  const defaultTransportPerPerson = trip.targetBudget === 'budget' ? 18 : trip.targetBudget === 'luxury' ? 85 : 35;

  const lodgingPerNight = trip.budgetSettings?.lodgingPerNight ?? defaultLodgingPerNight;
  const transportBaselinePerPerson = trip.budgetSettings?.transportPerPerson ?? defaultTransportPerPerson;

  const [tempLodging, setTempLodging] = useState(lodgingPerNight);
  const [tempTransport, setTempTransport] = useState(transportBaselinePerPerson);

  const travelerCount = Math.max(trip.travelers?.length || 1, 1);
  const nightsCount = Math.max((trip.durationDays || 3) - 1, 1);

  // Calculate aggregation
  const { chartData, totalPerPerson, totalGroup } = useMemo(() => {
    // 1. Gather all activity costs
    let foodCost = 0;
    let transportCost = 0;
    let lodgingCost = 0;
    let cultureCost = 0;
    let sightseeingCost = 0;
    let natureCost = 0;
    let artCost = 0;
    let nightlifeCost = 0;
    let shoppingCost = 0;

    const counts: Record<string, number> = {
      lodging: 0,
      food: 0,
      activities: 0,
      transport: 0,
      culture: 0,
      sightseeing: 0,
      nature: 0,
      art: 0,
      nightlife: 0,
      shopping: 0
    };

    trip.days.forEach(day => {
      day.activities.forEach(act => {
        const cat = act.category || 'sightseeing';
        const cost = Number(act.cost) || 0;

        if (cat === 'food') {
          foodCost += cost;
          counts.food += 1;
        } else if (cat === 'transport') {
          transportCost += cost;
          counts.transport += 1;
        } else if (cat === 'lodging') {
          lodgingCost += cost;
          counts.lodging += 1;
        } else if (cat === 'culture') {
          cultureCost += cost;
          counts.culture += 1;
          counts.activities += 1;
        } else if (cat === 'nature') {
          natureCost += cost;
          counts.nature += 1;
          counts.activities += 1;
        } else if (cat === 'art') {
          artCost += cost;
          counts.art += 1;
          counts.activities += 1;
        } else if (cat === 'nightlife') {
          nightlifeCost += cost;
          counts.nightlife += 1;
          counts.activities += 1;
        } else if (cat === 'shopping') {
          shoppingCost += cost;
          counts.shopping += 1;
          counts.activities += 1;
        } else {
          sightseeingCost += cost;
          counts.sightseeing += 1;
          counts.activities += 1;
        }
      });
    });

    // Add baseline lodging and transport if comprehensive view
    if (viewScope === 'comprehensive') {
      lodgingCost += Math.round(lodgingPerNight * nightsCount);
      transportCost += transportBaselinePerPerson;
    }

    let items: Array<{
      key: string;
      name: string;
      value: number;
      groupValue: number;
      color: string;
      hoverColor: string;
      icon: React.ReactNode;
      count: number;
      subtext?: string;
    }> = [];

    if (groupingMode === 'core') {
      // Core Categories: Lodging, Food, Activities, Transport
      const activitiesCost = cultureCost + sightseeingCost + natureCost + artCost + nightlifeCost + shoppingCost;

      items = [
        {
          key: 'lodging',
          name: 'Lodging & Stays',
          value: lodgingCost,
          groupValue: lodgingCost * travelerCount,
          color: CATEGORY_DEFINITIONS.lodging.color,
          hoverColor: CATEGORY_DEFINITIONS.lodging.hoverColor,
          icon: CATEGORY_DEFINITIONS.lodging.icon,
          count: counts.lodging,
          subtext: `${nightsCount} nights accommodation`
        },
        {
          key: 'food',
          name: 'Food & Dining',
          value: foodCost,
          groupValue: foodCost * travelerCount,
          color: CATEGORY_DEFINITIONS.food.color,
          hoverColor: CATEGORY_DEFINITIONS.food.hoverColor,
          icon: CATEGORY_DEFINITIONS.food.icon,
          count: counts.food,
          subtext: `${counts.food} scheduled dining spots`
        },
        {
          key: 'activities',
          name: 'Activities & Sightseeing',
          value: activitiesCost,
          groupValue: activitiesCost * travelerCount,
          color: CATEGORY_DEFINITIONS.activities.color,
          hoverColor: CATEGORY_DEFINITIONS.activities.hoverColor,
          icon: CATEGORY_DEFINITIONS.activities.icon,
          count: counts.activities,
          subtext: `${counts.activities} tours & landmarks`
        },
        {
          key: 'transport',
          name: 'Transit & Transport',
          value: transportCost,
          groupValue: transportCost * travelerCount,
          color: CATEGORY_DEFINITIONS.transport.color,
          hoverColor: CATEGORY_DEFINITIONS.transport.hoverColor,
          icon: CATEGORY_DEFINITIONS.transport.icon,
          count: counts.transport,
          subtext: 'Train, metro & transfers'
        }
      ].filter(it => it.value > 0);
    } else {
      // Detailed granularity
      const detailedMap: Record<string, { cost: number; count: number }> = {
        lodging: { cost: lodgingCost, count: counts.lodging },
        food: { cost: foodCost, count: counts.food },
        transport: { cost: transportCost, count: counts.transport },
        sightseeing: { cost: sightseeingCost, count: counts.sightseeing },
        culture: { cost: cultureCost, count: counts.culture },
        art: { cost: artCost, count: counts.art },
        nature: { cost: natureCost, count: counts.nature },
        nightlife: { cost: nightlifeCost, count: counts.nightlife },
        shopping: { cost: shoppingCost, count: counts.shopping }
      };

      items = Object.entries(detailedMap)
        .map(([key, data]) => {
          const meta = CATEGORY_DEFINITIONS[key] || {
            key,
            label: key.toUpperCase(),
            color: '#94a3b8',
            hoverColor: '#64748b',
            icon: <DollarSign className="w-3.5 h-3.5" />
          };
          return {
            key,
            name: meta.label,
            value: data.cost,
            groupValue: data.cost * travelerCount,
            color: meta.color,
            hoverColor: meta.hoverColor,
            icon: meta.icon,
            count: data.count,
            subtext: `${data.count} items`
          };
        })
        .filter(it => it.value > 0);
    }

    const sumPerPerson = items.reduce((acc, curr) => acc + curr.value, 0);
    const sumGroup = sumPerPerson * travelerCount;

    const enriched = items.map(item => ({
      ...item,
      percentage: sumPerPerson > 0 ? Math.round((item.value / sumPerPerson) * 100) : 0
    })).sort((a, b) => b.value - a.value);

    return {
      chartData: enriched,
      totalPerPerson: sumPerPerson,
      totalGroup: sumGroup
    };
  }, [trip, groupingMode, viewScope, lodgingPerNight, transportBaselinePerPerson, travelerCount, nightsCount]);

  const handleSaveEstimates = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateTrip) return;

    onUpdateTrip({
      ...trip,
      budgetSettings: {
        ...trip.budgetSettings,
        lodgingPerNight: Math.max(0, Number(tempLodging) || 0),
        transportPerPerson: Math.max(0, Number(tempTransport) || 0)
      }
    });
    setIsEditingEstimates(false);
  };

  const activeCategoryItem = useMemo(() => {
    if (!hoveredCategory) return null;
    return chartData.find(d => d.key === hoveredCategory) || null;
  }, [hoveredCategory, chartData]);

  // Compact Widget View
  if (compact) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Trip Budget by Category</div>
              <div className="text-[10px] text-slate-400">Recharts Visualizer</div>
            </div>
          </div>
          <span className="font-mono text-xs font-extrabold text-indigo-600">
            ${totalPerPerson} / person
          </span>
        </div>

        <div className="relative h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={68}
                paddingAngle={3}
                cornerRadius={5}
                stroke="#ffffff"
                strokeWidth={2}
                onMouseEnter={(_, index) => setHoveredCategory(chartData[index]?.key || null)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {chartData.map((entry) => (
                  <Cell 
                    key={`compact-${entry.key}`} 
                    fill={hoveredCategory === entry.key ? entry.hoverColor : entry.color} 
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {activeCategoryItem ? activeCategoryItem.name.split(' ')[0] : 'Total'}
            </span>
            <span className="text-sm font-extrabold text-slate-900 font-mono">
              ${activeCategoryItem ? activeCategoryItem.value : totalPerPerson}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
          {chartData.map(item => (
            <div key={item.key} className="flex items-center justify-between text-[11px] p-1.5 rounded-lg bg-slate-50">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-700 font-medium truncate">{item.name.split(' ')[0]}</span>
              </div>
              <span className="font-bold text-slate-900 font-mono shrink-0">${item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full Rich Dashboard Experience
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
      
      {/* Visualizer Top Bar & Toggles */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
              <PieIcon className="w-3.5 h-3.5 text-indigo-600" />
              Recharts Data Visualizer
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              Live Interactive Breakdown
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-1">
            Trip Budget Breakdown by Category
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Transparent distribution across lodging, dining, activities, and transportation.
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Chart Type Toggle: Donut vs Bar */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setChartType('donut')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                chartType === 'donut'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" />
              <span>Donut</span>
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                chartType === 'bar'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Bar Chart</span>
            </button>
          </div>

          {/* Grouping Toggle: Core (Lodging, Food, Activities) vs Detailed */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setGroupingMode('core')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                groupingMode === 'core'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Lodging, Food, Activities & Transport"
            >
              Core (Lodging, Food, Activities)
            </button>
            <button
              onClick={() => setGroupingMode('detailed')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                groupingMode === 'detailed'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Individual subcategories"
            >
              Detailed
            </button>
          </div>

          {/* Unit Toggle: Per Person vs Entire Group */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setDisplayUnit('per_person')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                displayUnit === 'per_person'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Per Person
            </button>
            <button
              onClick={() => setDisplayUnit('entire_group')}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                displayUnit === 'entire_group'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Group ({travelerCount})</span>
            </button>
          </div>

          {onUpdateTrip && (
            <button
              onClick={() => {
                setTempLodging(lodgingPerNight);
                setTempTransport(transportBaselinePerPerson);
                setIsEditingEstimates(true);
              }}
              className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 hover:text-indigo-600 transition-colors"
              title="Customize Lodging & Transit Rates"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Chart Container */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[300px]">
          {chartType === 'donut' ? (
            <div className="relative w-full max-w-[320px] aspect-square">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const val = displayUnit === 'per_person' ? data.value : data.groupValue;
                        return (
                          <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1 z-50">
                            <div className="flex items-center gap-2 font-bold">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
                              <span>{data.name}</span>
                            </div>
                            <div className="font-mono text-emerald-400 font-extrabold text-sm">
                              ${val} <span className="text-[10px] text-slate-400 font-normal">({data.percentage}%)</span>
                            </div>
                            <div className="text-[10px] text-slate-300">
                              {displayUnit === 'per_person' 
                                ? `Group total: $${data.groupValue}`
                                : `Per person: $${data.value}`}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={chartData}
                    dataKey={displayUnit === 'per_person' ? 'value' : 'groupValue'}
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={72}
                    outerRadius={108}
                    paddingAngle={3}
                    cornerRadius={6}
                    stroke="#ffffff"
                    strokeWidth={2}
                    animationDuration={800}
                    onMouseEnter={(_, index) => setHoveredCategory(chartData[index]?.key || null)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    {chartData.map((entry) => {
                      const isHovered = hoveredCategory === entry.key;
                      return (
                        <Cell
                          key={`cell-${entry.key}`}
                          fill={isHovered ? entry.hoverColor : entry.color}
                          className="transition-all duration-200 cursor-pointer"
                          style={{
                            filter: hoveredCategory && !isHovered ? 'opacity(0.5)' : 'none',
                            transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                            transformOrigin: 'center center'
                          }}
                        />
                      );
                    })}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Centered Donut Stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
                {activeCategoryItem ? (
                  <div className="space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block truncate max-w-[120px]">
                      {activeCategoryItem.name}
                    </span>
                    <span className="text-2xl font-black text-slate-900 font-mono tracking-tight block">
                      ${displayUnit === 'per_person' ? activeCategoryItem.value : activeCategoryItem.groupValue}
                    </span>
                    <span className="text-[11px] font-bold text-indigo-600 block">
                      {activeCategoryItem.percentage}% of budget
                    </span>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      {displayUnit === 'per_person' ? 'Per Person' : 'Total Group'}
                    </span>
                    <span className="text-3xl font-black text-slate-900 font-mono tracking-tight block">
                      ${displayUnit === 'per_person' ? totalPerPerson : totalGroup}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium block">
                      {chartData.length} Categories
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Bar Chart View */
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" tickFormatter={(v) => `$${v}`} stroke="#94a3b8" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={110} 
                    stroke="#475569" 
                    tick={{ fontSize: 11, fontWeight: 500 }}
                  />
                  <Tooltip
                    formatter={(val: any) => [`$${val}`, displayUnit === 'per_person' ? 'Per Person' : 'Group Total']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: 'none', color: '#fff' }}
                  />
                  <Bar
                    dataKey={displayUnit === 'per_person' ? 'value' : 'groupValue'}
                    radius={[0, 8, 8, 0]}
                    animationDuration={800}
                  >
                    {chartData.map((entry) => (
                      <Cell key={`bar-${entry.key}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="text-[11px] text-slate-400 font-medium text-center mt-2 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Interactive Recharts visualization · Hover over bars or donut slices</span>
          </div>
        </div>

        {/* Right Side: Category Breakdown Cards */}
        <div className="lg:col-span-7 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {chartData.map((item) => {
              const isHovered = hoveredCategory === item.key;
              const val = displayUnit === 'per_person' ? item.value : item.groupValue;
              
              return (
                <div
                  key={item.key}
                  onMouseEnter={() => setHoveredCategory(item.key)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isHovered
                      ? 'bg-slate-50 border-slate-400 shadow-sm ring-1 ring-slate-300'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 truncate">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {item.subtext || `${item.count} items scheduled`}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-xs text-slate-900">
                        ${val}
                      </div>
                      <div className="text-[10px] font-semibold text-slate-500">
                        {item.percentage}%
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Informational Footnote */}
          <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl text-[11px] text-indigo-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                Lodging at <strong className="font-bold">${lodgingPerNight}/night</strong> ({nightsCount} nights) · Transit at <strong className="font-bold">${transportBaselinePerPerson}</strong>/person.
              </span>
            </span>
            {onUpdateTrip && (
              <button
                onClick={() => {
                  setTempLodging(lodgingPerNight);
                  setTempTransport(transportBaselinePerPerson);
                  setIsEditingEstimates(true);
                }}
                className="font-bold text-indigo-700 hover:text-indigo-900 underline ml-2 shrink-0"
              >
                Customize
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit Rates Modal */}
      {isEditingEstimates && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                <h4 className="font-bold text-sm text-slate-900">Customize Trip Budget Rates</h4>
              </div>
              <button onClick={() => setIsEditingEstimates(false)} className="text-slate-400 hover:text-slate-700 text-lg">
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveEstimates} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center justify-between">
                  <span>Lodging Rate ($/night per person)</span>
                  <span className="text-slate-400 font-normal">Hotel, Ryokan or Airbnb</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-mono">$</span>
                  <input
                    type="number"
                    min="0"
                    value={tempLodging}
                    onChange={e => setTempLodging(Number(e.target.value) || 0)}
                    className="w-full pl-7 pr-3.5 py-2 border border-slate-300 rounded-xl text-slate-900 font-mono font-medium"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Total lodging for {nightsCount} nights: ${tempLodging * nightsCount} / person
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center justify-between">
                  <span>Transit & Ground Transport ($/person)</span>
                  <span className="text-slate-400 font-normal">Metro pass, rail, airport express</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-mono">$</span>
                  <input
                    type="number"
                    min="0"
                    value={tempTransport}
                    onChange={e => setTempTransport(Number(e.target.value) || 0)}
                    className="w-full pl-7 pr-3.5 py-2 border border-slate-300 rounded-xl text-slate-900 font-mono font-medium"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Applies to all {travelerCount} travelers: ${tempTransport * travelerCount} total
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingEstimates(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Apply & Recalculate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
