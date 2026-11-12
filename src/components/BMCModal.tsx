import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Sparkles, Layers, ArrowRight, ExternalLink, Lightbulb, Users, Compass } from 'lucide-react';
import { bmcAnalysisData } from '../data/bmcData';

interface BMCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTryDemo: () => void;
}

export const BMCModal: React.FC<BMCModalProps> = ({ isOpen, onClose, onTryDemo }) => {
  const [activeTab, setActiveTab] = useState<'canvas' | 'analysis' | 'mvp'>('canvas');
  const [showFullBoard, setShowFullBoard] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
                Business Model Canvas & Product Strategy
                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                  Miro Artifact Step 1-2
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Synthesis of target segments, pain points, UVP & workshop MVP scope
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-white flex items-center gap-4">
          <button
            onClick={() => setActiveTab('canvas')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'canvas'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Miro Board & Canvas Blocks
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'analysis'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Segments, Pain Points & Differentiators
          </button>
          <button
            onClick={() => setActiveTab('mvp')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'mvp'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Workshop MVP Prioritization (3-5 Features)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'canvas' && (
            <div className="space-y-6">
              {/* Miro Board Visual Preview Card */}
              <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-xl text-white flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" /> Source Document Attached
                  </div>
                  <h3 className="text-base font-bold">Miro Business Model Canvas Board</h3>
                  <p className="text-xs text-slate-300 max-w-xl">
                    The attached Miro board outlines key partners (airlines, Klook, TripAdvisor), activities (preference matching, split costs), value props (time saving, route optimization), and segments (solo, group of friends).
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setShowFullBoard(!showFullBoard)}
                    className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium border border-white/20 transition-colors flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{showFullBoard ? 'Hide Miro Image' : 'View Miro Image'}</span>
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onTryDemo();
                    }}
                    className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Launch Live Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Collapsible Image View */}
              {showFullBoard && (
                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 mb-2 font-medium">Original Miro Board Canvas Artifact:</p>
                  <img
                    src="/assets/aistudio/Travel_Itinerary_Planner_9b928d09.jpg"
                    alt="Miro Business Model Canvas"
                    className="w-full h-auto max-h-[480px] object-contain rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              )}

              {/* Canvas Blocks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bmcAnalysisData.canvasBlocks.map((block) => (
                  <div
                    key={block.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5"
                  >
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5">
                      {block.title}
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {block.notes.map((note, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-indigo-500 font-bold leading-none mt-1">·</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {/* Target Segments & Pain Points */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Step 1: Customer Segments & Identified Pain Points
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bmcAnalysisData.targetSegments.map((seg, i) => (
                    <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-600" />
                        <h4 className="font-semibold text-sm text-slate-900">{seg.segment}</h4>
                      </div>
                      <div className="text-xs space-y-1">
                        <p className="text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-100">
                          <span className="font-semibold">Pain Point: </span>{seg.painPoint}
                        </p>
                        <p className="text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                          <span className="font-semibold">Our Value Prop: </span>{seg.ourSolution}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Differentiators */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Key Differentiators From Existing Apps (Wanderlog, TripIt, Google Trips)
                </h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
                  {bmcAnalysisData.differentiators.map((diff, i) => (
                    <div key={i} className="p-4 bg-white flex flex-col md:flex-row gap-4 justify-between">
                      <div className="md:w-1/3">
                        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Capability</span>
                        <h4 className="text-sm font-bold text-slate-900">{diff.feature}</h4>
                      </div>
                      <div className="md:w-1/3 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700 block mb-0.5">Existing Solutions:</span>
                        {diff.existingApps}
                      </div>
                      <div className="md:w-1/3 text-xs text-emerald-700 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100">
                        <span className="font-semibold block mb-0.5">VibeVoyage Advantage:</span>
                        {diff.vibeVoyage}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mvp' && (
            <div className="space-y-5">
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-950 text-xs leading-relaxed">
                <span className="font-bold">Step 2 MVP Scope Definition: </span>
                To demonstrate maximum unique value during the workshop without overwhelming users, we prioritized the 4 core pillars that directly solve group trip friction:
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">Multi-Traveler Preference Reconciliation Engine</h4>
                    <p className="text-xs text-slate-600">
                      Allows multiple friends (e.g. Alex the late-rising foodie, Maya the early cultural explorer, Sam the budget shutterbug) to submit individual styles. The app computes an explicit Consensus Score (e.g. 94%) and applies a compromise rhythm so no one feels ignored.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">Route-Optimized Logical Daily Sequencing</h4>
                    <p className="text-xs text-slate-600">
                      Eliminates zigzagging across huge cities. AI clusters activities strictly by neighborhood with calculated transit times, realistic costs per person, and insider tips.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">Full Interactive Customization & Group Voting</h4>
                    <p className="text-xs text-slate-600">
                      Users can reorder activities up/down, edit timings, remove items, swap with curated hidden gems, and upvote options with friends.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    4
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">In-Trip Adaptive Replanner ("Rainy Day / Slow Morning / Budget Trim")</h4>
                    <p className="text-xs text-slate-600">
                      Trips rarely go strictly according to plan. With 1 click, the itinerary adapts for rainy weather (indoor covered gems), delayed mornings, or budget adjustments.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    onClose();
                    onTryDemo();
                  }}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-rose-600 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-2"
                >
                  <span>Experience This in Action (Tokyo Demo Trip)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
