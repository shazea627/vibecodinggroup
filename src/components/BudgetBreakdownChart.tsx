import React, { useState, useMemo } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
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
  Percent,
  Check
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
  food: {
    key: 'food',
    label: 'Food & Dining',
    color: '#f43f5e', // rose-500
    hoverColor: '#e11d48',
    icon: <Utensils className="w-3.5 h-3.5" />
  },
  lodging: {
    key: 'lodging',
    label: 'Lodging & Hotel',
    color: '#8b5cf6', // violet-500
    hoverColor: '#7c3aed',
    icon: <Building className="w-3.5 h-3.5" />
  },
  transport: {
    key: 'transport',
    label: 'Transit & Transport',
    color: '#3b82f6', // blue-500
    hoverColor: '#2563eb',
    icon: <Car className="w-3.5 h-3.5" />
  },
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
    color: '#06b6d4', // cyan-500
    hoverColor: '#0891b2',
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
  const [viewScope, setViewScope] = useState<'comprehensive' | 'activities_only'>('comprehensive');
  const [displayUnit, setDisplayUnit] = useState<'per_person' | 'entire_group'>('per_person');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isEditingEstimates, setIsEditingEstimates] = useState(false);

  // Default baseline estimations based on budget tier if not explicitly set
  const defaultLodgingPerNight = trip.targetBudget === 'budget' ? 45 : trip.targetBudget === 'luxury' ? 220 : 95;
  const defaultTransportPerPerson = trip.targetBudget === 'budget' ? 18 : trip.targetBudget === 'luxury' ? 85 : 35;

  const lodgingPerNight = trip.budgetSettings?.lodgingPerNight ?? defaultLodgingPerNight;
  const transportBaselinePerPerson = trip.budgetSettings?.transportPerPerson ?? defaultTransportPerPerson;

  const [tempLodging, setTempLodging] = useState(lodgingPerNight);
  const [tempTransport, setTempTransport] = useState(transportBaselinePerPerson);

  const travelerCount = Math.max(trip.travelers?.length || 1, 1);
  const nightsCount = Math.max((trip.durationDays || 3) - 1, 1);

  // Compute breakdown across all scheduled activities
  const { chartData, totalPerPerson, totalGroup, categoryCounts } = useMemo(() => {
    const totals: Record<string, number> = {
      food: 0,
      transport: 0,
      lodging: 0,
      culture: 0,
      sightseeing: 0,
      nature: 0,
      art: 0,
      nightlife: 0,
      shopping: 0
    };

    const counts: Record<string, number> = {
      food: 0,
      transport: 0,
      lodging: 0,
      culture: 0,
      sightseeing: 0,
      nature: 0,
      art: 0,
      nightlife: 0,
      shopping: 0
    };

    // Aggregate from days & activities
    trip.days.forEach(day => {
      day.activities.forEach(act => {
        const cat = act.category || 'sightseeing';
        const cost = Number(act.cost) || 0;
        if (totals[cat] !== undefined) {
          totals[cat] += cost;
          counts[cat] += 1;
        } else {
          totals.sightseeing += cost;
          counts.sightseeing += 1;
        }
      });
    });

    // If comprehensive scope is active, include the estimated lodging & transport baseline
    if (viewScope === 'comprehensive') {
      const estimatedLodgingPerPerson = Math.round((lodgingPerNight * nightsCount));
      totals.lodging += estimatedLodgingPerPerson;

      totals.transport += transportBaselinePerPerson;
    }

    // Filter out categories with 0 cost, or keep at least lodging, food, transport if 0
    const rawData = Object.entries(totals)
      .map(([key, value]) => {
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
          value: Math.round(value),
          groupValue: Math.round(value * travelerCount),
          color: meta.color,
          hoverColor: meta.hoverColor,
          icon: meta.icon,
          count: counts[key] || 0
        };
      })
      .filter(item => item.value > 0);

    const sumPerPerson = rawData.reduce((acc, curr) => acc + curr.value, 0);
    const sumGroup = sumPerPerson * travelerCount;

    // Attach percentage
    const enrichedData = rawData.map(item => ({
      ...item,
      percentage: sumPerPerson > 0 ? Math.round((item.value / sumPerPerson) * 100) : 0
    })).sort((a, b) => b.value - a.value);

    return {
      chartData: enrichedData,
      totalPerPerson: sumPerPerson,
      totalGroup: sumGroup,
      categoryCounts: counts
    };
  }, [trip, viewScope, lodgingPerNight, transportBaselinePerPerson, travelerCount, nightsCount]);

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

  // If no data yet (all costs 0 and scope is activities_only)
  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
        <DollarSign className="w-10 h-10 text-slate-300 mx-auto" />
        <h4 className="font-bold text-slate-800 text-sm">No expenses logged yet</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Add activities with prices or switch to "Comprehensive Budget" to view estimated transport, food, and lodging.
        </p>
        <button
          onClick={() => setViewScope('comprehensive')}
          className="px-4 py-2 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-xl hover:bg-indigo-100 transition-colors"
        >
          Show Comprehensive Budget
        </button>
      </div>
    );
  }

  // Compact rendering (for sidebars or quick cards)
  if (compact) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Budget by Category</span>
          </div>
          <span className="text-[11px] font-mono font-bold text-indigo-600">
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
                innerRadius={45}
                outerRadius={68}
                paddingAngle={3}
                stroke="#ffffff"
                strokeWidth={2}
                onMouseEnter={(_, index) => setHoveredCategory(chartData[index]?.key || null)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {chartData.map((entry) => (
                  <Cell 
                    key={`cell-compact-${entry.key}`} 
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

        <div className="space-y-1.5 pt-1">
          {chartData.slice(0, 4).map(item => (
            <div key={item.key} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate max-w-[110px]">{item.name}</span>
              </div>
              <span className="font-semibold text-slate-900 font-mono">${item.value} ({item.percentage}%)</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full Rich Dashboard Experience
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Budget Distribution
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
              Recharts Interactive Donut
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-1">
            Trip Expense Breakdown by Category
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Transparent split across transport, meals, lodging, activities, and shopping.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Unit Toggle: Per Person vs Entire Group */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setDisplayUnit('per_person')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                displayUnit === 'per_person'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Per Person
            </button>
            <button
              onClick={() => setDisplayUnit('entire_group')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                displayUnit === 'entire_group'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>All {travelerCount} Friends</span>
            </button>
          </div>

          {/* Scope Toggle: Comprehensive (Includes Lodging & Transit) vs Activities Only */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setViewScope('comprehensive')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewScope === 'comprehensive'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Includes estimated hotel/lodging and local transport passes"
            >
              Full Trip Budget
            </button>
            <button
              onClick={() => setViewScope('activities_only')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewScope === 'activities_only'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Strictly scheduled activities in the itinerary"
            >
              Activities Only
            </button>
          </div>

          {onUpdateTrip && viewScope === 'comprehensive' && (
            <button
              onClick={() => {
                setTempLodging(lodgingPerNight);
                setTempTransport(transportBaselinePerPerson);
                setIsEditingEstimates(true);
              }}
              className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 hover:text-indigo-600 transition-colors"
              title="Customize Lodging & Transit Estimates"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Visual Content: Chart + Category Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Donut Chart with Centered Dynamic Stat */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
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

            {/* Centered Donut Label */}
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

          <div className="text-[11px] text-slate-400 font-medium text-center mt-2 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Hover over any segment to inspect category costs</span>
          </div>
        </div>

        {/* Right Side: Category Breakdown Grid with Interactive Hover */}
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
                        <div className="text-[10px] text-slate-400">
                          {item.key === 'lodging' && viewScope === 'comprehensive'
                            ? `${nightsCount} nights estimated`
                            : item.key === 'transport' && viewScope === 'comprehensive'
                            ? `Transit passes & airport link`
                            : `${item.count} activity scheduled`}
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

                  {/* Visual Percentage Progress Bar */}
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

          {/* Quick Summary Footnote */}
          {viewScope === 'comprehensive' && (
            <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl text-[11px] text-indigo-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-indigo-600" />
                <span>
                  Lodging estimated at <strong className="font-bold">${lodgingPerNight}/night</strong> · Transit at <strong className="font-bold">${transportBaselinePerPerson}</strong> per traveler.
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
                  Edit Rates
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Lodging & Transit Modal */}
      {isEditingEstimates && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                <h4 className="font-bold text-sm text-slate-900">Customize Trip Budget Rates</h4>
              </div>
              <button onClick={() => setIsEditingEstimates(false)} className="text-slate-400 hover:text-slate-700">
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
