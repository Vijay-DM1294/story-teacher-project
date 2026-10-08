import React from 'react';
import { Sliders, Zap, RotateCcw, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface SidebarProps {
  temperature: number;
  onTemperatureChange: (temp: number) => void;
  onLoadDemo: (demoKey: string) => void;
  onReset: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  hasApiKey: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  temperature,
  onTemperatureChange,
  onLoadDemo,
  onReset,
  isOpen,
  onClose,
  hasApiKey,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 right-0 z-50 w-80 bg-white border-l md:border border-slate-200 md:rounded-2xl p-5 shadow-lg md:shadow-sm overflow-y-auto transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        } ${!isOpen ? 'hidden md:block' : ''}`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <span>Engine Settings</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Server status indicator */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 mb-5 text-xs">
          <div className="flex items-center gap-2 font-semibold text-slate-700 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Gemini Service Proxy</span>
          </div>
          <p className="text-slate-500">
            {hasApiKey ? (
              <span className="text-emerald-700 font-medium">🟢 Connected to Gemini API</span>
            ) : (
              <span className="text-amber-700 font-medium">🟡 Offline / Demo Mode active</span>
            )}
          </p>
        </div>

        {/* Model parameters */}
        <div className="space-y-4 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Model Parameters</h4>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Gemini Model
            </label>
            <div className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-700">
              gemini-3.8-flash
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Gemini Flash delivers rapid generation and rich pedagogical storytelling.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
              <span>Creativity (Temperature)</span>
              <span className="text-indigo-600 font-mono">{temperature.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={temperature}
              onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>Precise (0.2)</span>
              <span>Balanced (0.7)</span>
              <span>Imaginative (1.0)</span>
            </div>
          </div>
        </div>

        {/* 1-Click Interactive Demos */}
        <div className="pt-4 border-t border-slate-100 mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>1-Click Interactive Demos</span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Experience the complete 4-step adventure instantly with pre-compiled curriculum modules:
          </p>

          <div className="space-y-2">
            <button
              onClick={() => {
                onLoadDemo('Ages 5–7 (Early Explorers 🌱) - Photosynthesis');
                onClose?.();
              }}
              className="w-full text-left p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-900 transition-colors text-xs"
            >
              <div className="font-bold flex items-center justify-between">
                <span>🌱 Ages 5–7</span>
                <span className="text-[10px] uppercase font-semibold text-emerald-700 px-1.5 py-0.5 bg-emerald-200/60 rounded">Ready</span>
              </div>
              <div className="text-emerald-700 mt-0.5">Photosynthesis (Pip the Pixie)</div>
            </button>

            <button
              onClick={() => {
                onLoadDemo('Ages 8–10 (Adventurers 🔍) - Gravity');
                onClose?.();
              }}
              className="w-full text-left p-2.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-blue-900 transition-colors text-xs"
            >
              <div className="font-bold flex items-center justify-between">
                <span>🔍 Ages 8–10</span>
                <span className="text-[10px] uppercase font-semibold text-blue-700 px-1.5 py-0.5 bg-blue-200/60 rounded">Ready</span>
              </div>
              <div className="text-blue-700 mt-0.5">Gravity & Free Fall (Detective Maya)</div>
            </button>

            <button
              onClick={() => {
                onLoadDemo('Ages 11–13 (Trailblazers 🚀) - Fractions & Ratios');
                onClose?.();
              }}
              className="w-full text-left p-2.5 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100/70 text-purple-900 transition-colors text-xs"
            >
              <div className="font-bold flex items-center justify-between">
                <span>🚀 Ages 11–13</span>
                <span className="text-[10px] uppercase font-semibold text-purple-700 px-1.5 py-0.5 bg-purple-200/60 rounded">Ready</span>
              </div>
              <div className="text-purple-700 mt-0.5">Fractions & Ratios (Cmdr. Alex Vance)</div>
            </button>
          </div>
        </div>

        {/* Reset button */}
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={() => {
              onReset();
              onClose?.();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Adventure</span>
          </button>
        </div>
      </aside>
    </>
  );
};
