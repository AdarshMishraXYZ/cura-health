import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Check, 
  Upload, 
  Sparkles, 
  Calendar, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_REPORTS } from '../../data/sampleReports';
import { MedicalReport } from '../../types';
import { parseMedicalReport } from '../../services/reportAnalysisService';
import { HealthTrends } from '../health/HealthTrends';

export const ReportAnalyzer: React.FC = () => {
  const { navigateToSpecialty } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeSubTab, setActiveSubTab] = useState<'report' | 'trends'>('report');
  const [activeReportIndex, setActiveReportIndex] = useState<number>(0);
  const [reports, setReports] = useState<MedicalReport[]>(SAMPLE_REPORTS);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const currentReport = reports[activeReportIndex] || reports[0];
  const isNoApiKey = currentReport?.overallSummary === '__NO_API_KEY__';

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    try {
      const parsed = await parseMedicalReport(file);
      setReports(prev => [parsed, ...prev]);
      setActiveReportIndex(0);
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to analyze report. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getStatusBadge = (status: 'normal' | 'low' | 'high' | 'critical') => {
    switch (status) {
      case 'normal':
        return <span className="text-emerald-400 font-medium">— normal</span>;
      case 'low':
        return <span className="text-amber-400 font-semibold">— low</span>;
      case 'high':
        return <span className="text-rose-400 font-semibold">— high</span>;
      case 'critical':
        return <span className="text-red-500 font-bold animate-pulse">— critical</span>;
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Diagnostic Lab Extraction</span>
        <h2 className="text-lg font-bold text-white tracking-tight">AI Report Analyzer & Diagnostics</h2>
      </div>

      {/* Sub Tabs */}
      <div className="flex bg-[#141721] border border-[#202534] p-1 rounded-2xl gap-1">
        <button
          onClick={() => setActiveSubTab('report')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'report'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Lab PDF Analysis
        </button>
        <button
          onClick={() => setActiveSubTab('trends')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'trends'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Biomarker Trends
        </button>
      </div>

      {activeSubTab === 'trends' ? (
        <HealthTrends />
      ) : (
        /* Main AI Report Analyzer Card */
        <div className="bg-[#121622] border border-[#1E2536] rounded-2xl p-4 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">AI report analyzer</h3>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A202E] hover:bg-[#22293C] text-xs font-medium text-slate-300 rounded-xl border border-[#262F44] transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              <span>{isUploading ? 'Parsing...' : 'Upload PDF'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Uploaded File Card */}
          <div className="bg-[#161B28] border border-[#232B3D] rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#202738] text-blue-400 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white tracking-tight">{currentReport.fileName}</p>
                <p className="text-[11px] text-slate-400">Uploaded · {currentReport.fileSize}</p>
              </div>
            </div>

            <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Preset Sample Reports Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            <span className="text-slate-400 whitespace-nowrap font-medium text-[10px] uppercase">Reports:</span>
            {reports.map((rep, idx) => (
              <button
                key={rep.id}
                onClick={() => setActiveReportIndex(idx)}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium transition-all cursor-pointer ${
                  activeReportIndex === idx
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-[#181D2A] text-slate-400 hover:text-slate-200'
                }`}
              >
                {rep.fileName.replace('.pdf', '')}
              </button>
            ))}
          </div>

          {/* Upload Error */}
          {uploadError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 leading-relaxed">
              ⚠️ {uploadError}
            </div>
          )}

          {/* No API Key Warning */}
          {isNoApiKey ? (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>Gemini API Key Required</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                To analyze your lab report, the AI needs to actually <strong>read your document</strong>. Without a Gemini API key, showing fake results would be dangerous.
              </p>
              <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
                <li>Tap <strong className="text-white">⚡ AI Engine</strong> in the top bar</li>
                <li>Get a free key at <strong className="text-blue-400">aistudio.google.com/app/apikey</strong></li>
                <li>Paste the key and save — then upload your report</li>
              </ol>
            </div>
          ) : (
            <>
              {/* Summary Table */}
              <div className="space-y-2 pt-1 border-t border-[#1C2232]">
                <h4 className="text-xs font-semibold text-slate-400">Summary</h4>
                <div className="bg-[#161A26] rounded-xl border border-[#222838] overflow-hidden divide-y divide-[#1F2536]">
                  {currentReport.biomarkers.map((bio, index) => (
                    <div
                      key={index}
                      className="p-3 flex items-center justify-between text-xs hover:bg-[#1A1F2E] transition-colors"
                    >
                      <div>
                        <span className="font-semibold text-slate-200">{bio.name}</span>
                        <div className="text-[10px] text-slate-400 mt-0.5">Ref: {bio.referenceRange}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-100 font-mono font-medium mr-1.5">
                          {bio.value} {bio.unit}
                        </span>
                        {getStatusBadge(bio.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insight callout */}
              <div className="p-3.5 bg-[#141A27] border border-blue-500/20 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Clinical Insight</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentReport.aiRecommendation}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => navigateToSpecialty(currentReport.recommendedSpecialty)}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-semibold rounded-xl text-xs transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>
                  Book a {currentReport.recommendedSpecialty === 'general' ? 'general physician' : currentReport.recommendedSpecialty}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
