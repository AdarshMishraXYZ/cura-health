import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, FileText, CheckCircle2, ShieldCheck, Download } from 'lucide-react';

interface MetricTrend {
  id: string;
  name: string;
  unit: string;
  normalRange: string;
  dataPoints: { date: string; value: number; status: 'normal' | 'low' | 'high' }[];
  summary: string;
  trendDirection: 'improving' | 'stable' | 'declining';
}

const TREND_METRICS: MetricTrend[] = [
  {
    id: 'vit-d',
    name: 'Serum 25-OH Vitamin D',
    unit: 'ng/mL',
    normalRange: '30 - 100 ng/mL',
    dataPoints: [
      { date: 'Aug 10', value: 14, status: 'low' },
      { date: 'Aug 28', value: 18, status: 'low' },
      { date: 'Sep 26 (Today)', value: 24, status: 'low' },
    ],
    summary: 'Vitamin D has risen by 71% over the last 6 weeks following weekly cholecalciferol supplementation. You are approaching the 30 ng/mL optimal baseline.',
    trendDirection: 'improving'
  },
  {
    id: 'glucose',
    name: 'Fasting Blood Glucose',
    unit: 'mg/dL',
    normalRange: '70 - 99 mg/dL',
    dataPoints: [
      { date: 'Aug 10', value: 104, status: 'high' },
      { date: 'Aug 28', value: 96, status: 'normal' },
      { date: 'Sep 26 (Today)', value: 92, status: 'normal' },
    ],
    summary: 'Fasting plasma glucose has normalized into the healthy euglycemic range (<99 mg/dL). Excellent dietary response.',
    trendDirection: 'improving'
  },
  {
    id: 'hemoglobin',
    name: 'Total Hemoglobin (Hb)',
    unit: 'g/dL',
    normalRange: '13.0 - 17.5 g/dL',
    dataPoints: [
      { date: 'Aug 10', value: 13.2, status: 'normal' },
      { date: 'Aug 28', value: 13.5, status: 'normal' },
      { date: 'Sep 26 (Today)', value: 13.8, status: 'normal' },
    ],
    summary: 'Hemoglobin levels remain solidly optimal with stable red blood cell oxygenation capacity.',
    trendDirection: 'stable'
  },
  {
    id: 'ldl',
    name: 'Low-Density Lipoprotein (LDL)',
    unit: 'mg/dL',
    normalRange: '< 100 mg/dL',
    dataPoints: [
      { date: 'Aug 10', value: 168, status: 'high' },
      { date: 'Aug 28', value: 162, status: 'high' },
      { date: 'Sep 26 (Today)', value: 154, status: 'high' },
    ],
    summary: 'LDL cholesterol is trending downward but remains elevated above the 100 mg/dL target. Continued cardiovascular monitoring advised.',
    trendDirection: 'improving'
  },
];

export const HealthTrends: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('vit-d');
  const [exportNotice, setExportNotice] = useState(false);

  const activeMetric = TREND_METRICS.find(m => m.id === selectedId) || TREND_METRICS[0];

  const handleExport = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Biomarker Intelligence
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Health Analytics & Trends</h2>
          <p className="text-xs text-slate-400">Track longitudinal biomarker changes over multiple lab tests</p>
        </div>
        <button
          onClick={handleExport}
          className="p-2 bg-[#1A1F2E] hover:bg-[#22293C] text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-[#262F44] transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>

      {exportNotice && (
        <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
          Comprehensive Longitudinal Health PDF compiled & ready for physician review.
        </div>
      )}

      {/* Metric Selector Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {TREND_METRICS.map((metric) => (
          <button
            key={metric.id}
            onClick={() => setSelectedId(metric.id)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedId === metric.id
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                : 'bg-[#141721] text-slate-400 border-[#202534] hover:text-slate-200'
            }`}
          >
            {metric.name.split(' (')[0]}
          </button>
        ))}
      </div>

      {/* Main Interactive Graph Card */}
      <div className="bg-[#141721] border border-[#202534] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">{activeMetric.name}</h3>
            <p className="text-[11px] text-slate-400">Target Range: <span className="text-slate-300">{activeMetric.normalRange}</span></p>
          </div>
          <div className="flex items-center gap-1.5">
            {activeMetric.trendDirection === 'improving' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                <TrendingUp className="w-3 h-3" />
                Improving
              </span>
            )}
            {activeMetric.trendDirection === 'stable' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[10px] font-bold">
                <Minus className="w-3 h-3" />
                Stable
              </span>
            )}
            {activeMetric.trendDirection === 'declining' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[10px] font-bold">
                <TrendingDown className="w-3 h-3" />
                Needs Review
              </span>
            )}
          </div>
        </div>

        {/* Visual Bar / Sparkline Chart */}
        <div className="bg-[#0F1117] border border-[#1F2536] rounded-xl p-4">
          <div className="grid grid-cols-3 gap-3 items-end h-32 pt-4 pb-2 border-b border-[#1E2538]">
            {activeMetric.dataPoints.map((pt, idx) => {
              const maxVal = Math.max(...activeMetric.dataPoints.map(d => d.value)) * 1.25;
              const heightPercent = Math.min(100, Math.round((pt.value / maxVal) * 100));
              const isNormal = pt.status === 'normal';

              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                    {pt.value} <span className="text-[10px] font-normal text-slate-400">{activeMetric.unit}</span>
                  </span>
                  <div className="w-full max-w-[48px] bg-[#181D2A] rounded-t-lg overflow-hidden flex items-end p-0.5">
                    <div
                      className={`w-full rounded-t-md transition-all duration-700 ${
                        isNormal
                          ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-md shadow-emerald-500/30'
                          : 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-md shadow-amber-500/30'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium truncate max-w-full text-center">
                    {pt.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Longitudinal Interpretation Card */}
        <div className="bg-[#181D2B] border border-[#232D42] rounded-xl p-3.5 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block mb-0.5">AI Clinical Trend Analysis</span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {activeMetric.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Linked Reports Banner */}
      <div className="p-3.5 rounded-2xl bg-[#141721] border border-[#202534] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white">Aggregated from 3 Lab PDF Reports</span>
            <p className="text-[10px] text-slate-400">Automated OCR ingestion verified across visits</p>
          </div>
        </div>
        <span className="text-xs text-blue-400 font-semibold">Synced</span>
      </div>
    </div>
  );
};
