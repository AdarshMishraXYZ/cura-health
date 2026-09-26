import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Calendar, 
  Clock, 
  Check, 
  RotateCcw, 
  ShieldCheck, 
  Pill, 
  AlertTriangle, 
  ArrowRight, 
  Mic, 
  MicOff,
  Info,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { ChatMessage, Doctor, MedicineSuggestion, ChatAction } from '../../types';
import { DOCTORS } from '../../data/doctors';
import { processUserMessage, getInitialChatMessages } from '../../services/chatEngineService';
import { DoctorAvatar } from '../common/DoctorAvatar';

export const AiBookingChat: React.FC = () => {
  const { createAppointment, setActiveTab, setSelectedDoctor, navigateToSpecialty } = useApp();
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize with comprehensive smart assistant welcome messages
  const [messages, setMessages] = useState<ChatMessage[]>(() => getInitialChatMessages());
  const [inputVal, setInputVal] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    setInputVal('');
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const replies = await processUserMessage(text, [...messages, userMsg]);
      setMessages((prev) => [...prev, ...replies]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: ChatAction) => {
    if (action.actionType === 'propose_booking') {
      const doc: Doctor = action.payload?.doctor || DOCTORS[0];
      setMessages((prev) => [
        ...prev,
        {
          id: `u-act-${Date.now()}`,
          sender: 'user',
          text: `Yes, let's schedule an appointment with ${doc.name}.`,
          timestamp: 'Just now'
        },
        {
          id: `m-prop-${Date.now()}`,
          sender: 'assistant',
          text: `Here is the earliest available consultation slot with **${doc.name}** (${doc.specialtyName}):`,
          timestamp: 'Just now',
          proposedDoctor: doc,
          proposedSlot: {
            date: 'Sun, 27 · 9:30 AM',
            time: '09:30 AM',
            fee: doc.consultationFee
          }
        }
      ]);
    } else if (action.actionType === 'show_doctors') {
      if (action.payload?.specialtyId) {
        navigateToSpecialty(action.payload.specialtyId);
      } else {
        setActiveTab('doctors');
      }
    } else if (action.actionType === 'custom_prompt') {
      handleSend(action.payload);
    }
  };

  const handleConfirmBooking = (doctor: Doctor, slotInfo: { date: string; time: string; fee: number }) => {
    const newApt = createAppointment({
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialtyName,
      doctorInitials: doctor.initials,
      doctorAvatar: doctor.avatarUrl,
      dateStr: slotInfo.date.split('·')[0].trim(),
      slotTime: slotInfo.time,
      consultationFee: slotInfo.fee,
      type: 'video',
      patientName: 'Alex Mercer',
      patientEmail: 'alex.mercer@example.com',
      patientPhone: '+1 (555) 349-2180',
      symptomsNote: 'AI Triage & Clinical Consultation'
    });

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });

    setMessages((prev) => [
      ...prev,
      {
        id: `conf-${Date.now()}`,
        sender: 'assistant',
        text: `🎉 **Booking Confirmed!**\n\nYour appointment with **${doctor.name}** has been confirmed for **${slotInfo.date}** (Ref: #${newApt.id}).\n\nYou can access your digital pass or join the Telehealth consultation room directly from your **Bookings** tab.`,
        timestamp: 'Just now'
      }
    ]);
  };

  const handleResetChat = () => {
    setMessages(getInitialChatMessages());
  };

  const handleSimulateVoice = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    setTimeout(() => {
      handleSend("I have a persistent headache with light sensitivity for 3 days");
      setIsListening(false);
    }, 1600);
  };

  // Helper to format bot markdown text
  const formatText = (content: string) => {
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-xs font-bold text-blue-300 mt-2 mb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <p key={idx} className="text-xs text-slate-300 ml-2 my-0.5 flex items-start gap-1.5">
            <span className="text-blue-400 font-bold">•</span>
            <span>{line.replace(/^[•-]\s+/, '')}</span>
          </p>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }
      return <p key={idx} className="text-xs leading-relaxed my-0.5">{line}</p>;
    });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header matching user requirement */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Clinical Intelligence</span>
          <h2 className="text-lg font-bold text-white tracking-tight">Smart AI Health Assistant</h2>
          <p className="text-[11px] text-slate-400">General conversation, OTC medicine guidance & conditional booking</p>
        </div>
        <button
          onClick={handleResetChat}
          className="p-1.5 rounded-lg bg-[#141824] hover:bg-[#1C2232] text-slate-400 hover:text-white border border-[#222838] transition-colors text-xs flex items-center gap-1"
          title="Restart guided chat"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Main Chat Container */}
      <div className="bg-[#121622] border border-[#1E2536] rounded-2xl p-4 shadow-lg flex flex-col h-[560px]">
        {/* Assistant Header status bar */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1C2232]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                Cura Smart Assistant
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              </h3>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Clinical Knowledge & Dosage Active
              </p>
            </div>
          </div>

          <span className="text-[10px] font-semibold text-slate-400 bg-[#161B28] px-2 py-0.5 rounded-full border border-[#232B3D]">
            AI Medical Triage
          </span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-none">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
              >
                {/* Chat bubble */}
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white font-medium rounded-br-none shadow-md shadow-blue-600/30'
                      : 'bg-[#181D2A] text-slate-200 border border-[#232B3D] rounded-bl-none shadow-sm'
                  }`}
                >
                  {formatText(msg.text)}
                </div>

                {/* Medicine Suggestions Card (if suggested by AI) */}
                {msg.medicines && msg.medicines.length > 0 && (
                  <div className="w-full max-w-[390px] bg-[#141824] border border-[#242C3F] rounded-2xl p-3.5 space-y-2.5 shadow-xl mt-1 animate-in fade-in duration-300">
                    <div className="flex items-center gap-1.5 text-blue-400">
                      <Pill className="w-4 h-4" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Suggested OTC Medications & Remedies
                      </h4>
                    </div>

                    <div className="space-y-2">
                      {msg.medicines.map((med, i) => (
                        <div key={i} className="bg-[#181E2C] p-2.5 rounded-xl border border-[#232B3E] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-100">{med.name}</span>
                            <span className={`text-[10px] px-2 py-0.2 rounded-full font-medium ${
                              med.type === 'otc' 
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                                : med.type === 'home_remedy'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            }`}>
                              {med.type === 'otc' ? 'OTC Medicine' : med.type === 'home_remedy' ? 'Home Remedy' : 'Supplement'}
                            </span>
                          </div>

                          <p className="text-[11px] text-blue-300 font-medium">
                            <strong>Dosage:</strong> {med.dosage}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {med.indication}
                          </p>

                          <div className="flex items-start gap-1 pt-1 text-[10px] text-amber-400/90 border-t border-[#232B3E]">
                            <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                            <span><strong>Warning:</strong> {med.precautions}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-[10px] text-slate-500 italic text-center">
                      Always read packaging labels. Consult a pharmacist if pregnant or taking other medications.
                    </p>
                  </div>
                )}

                {/* Action Buttons if provided */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1 max-w-[90%]">
                    {msg.actions.map((act) => (
                      <button
                        key={act.id}
                        onClick={() => handleActionClick(act)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                          act.variant === 'primary'
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/40'
                            : 'bg-[#181E2C] hover:bg-[#202738] text-slate-300 border border-[#232B3D]'
                        }`}
                      >
                        <CalendarCheck className="w-3.5 h-3.5" />
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Embedded Proposed Booking Card matching Screenshot 5 */}
                {msg.proposedDoctor && msg.proposedSlot && (
                  <div className="w-full max-w-[340px] bg-[#141824] border border-[#232A3B] rounded-2xl p-3.5 shadow-xl space-y-3 mt-1.5 animate-in fade-in duration-300">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Proposed booking
                    </p>

                    {/* Doctor Info */}
                    <div className="flex items-center gap-3">
                      <DoctorAvatar
                        name={msg.proposedDoctor.name}
                        initials={msg.proposedDoctor.initials}
                        avatarUrl={msg.proposedDoctor.avatarUrl}
                        size="md"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <h4 className="text-white font-bold text-xs truncate">
                            {msg.proposedDoctor.name}
                          </h4>
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {msg.proposedDoctor.specialtyName}
                        </p>
                      </div>
                    </div>

                    {/* Slot & Price Row matching Screenshot 5 */}
                    <div className="flex items-center justify-between text-xs py-1 border-t border-[#1C2232]">
                      <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span>{msg.proposedSlot.date}</span>
                      </div>
                      <span className="font-bold text-white">${msg.proposedSlot.fee}</span>
                    </div>

                    {/* Dual Action Buttons matching Screenshot 5 */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#1C2232]">
                      <button
                        onClick={() => {
                          setSelectedDoctor(msg.proposedDoctor!);
                        }}
                        className="py-2 px-2 text-center bg-[#1B2130] hover:bg-[#22293C] text-slate-300 font-medium rounded-xl text-xs border border-[#283248] transition-colors"
                      >
                        Choose another
                      </button>

                      <button
                        onClick={() => handleConfirmBooking(msg.proposedDoctor!, msg.proposedSlot!)}
                        className="py-2 px-2 text-center bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm shadow-blue-600/40"
                      >
                        Confirm booking
                      </button>
                    </div>
                  </div>
                )}

                {/* Option Pills */}
                {msg.options && msg.options.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1 max-w-[95%]">
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(opt)}
                        className="text-[11px] bg-[#1A202E] hover:bg-blue-600 hover:text-white text-slate-300 border border-[#252E42] px-2.5 py-1.5 rounded-xl transition-all text-left"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs bg-[#181D2A] border border-[#232B3D] px-3 py-2 rounded-2xl w-fit">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" />
              <span>Analyzing symptoms & clinical guidelines...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar with text + voice input */}
        <div className="pt-3 border-t border-[#1C2232] flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about symptoms, medicines, lifestyle, or doctors..."
            className="flex-1 bg-[#181D2A] text-xs text-slate-100 placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-[#232B3D] focus:outline-none focus:border-blue-500"
          />

          <button
            type="button"
            onClick={handleSimulateVoice}
            className={`p-2.5 rounded-xl text-xs transition-all ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-[#181D2A] text-slate-400 hover:text-white border border-[#232B3D]'
            }`}
            title="Voice input"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            onClick={() => handleSend()}
            disabled={!inputVal.trim()}
            className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
