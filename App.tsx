import React, { useState, useRef, useEffect } from 'react';
import { generateVideoPackage, generateVeoVideo } from './services/geminiService';
import { VideoPackage, AppStatus, ToolMode } from './types';
import {
  Search, Film, Clipboard, Sparkles, Mic, Image as ImageIcon,
  MicOff, Loader2, ArrowRight, TrendingUp, Zap, Boxes, FileText, Layout, Plus, Minus, ChevronRight,
  Copy, Check, Play, X, MapPin, Building2, TreePine, Waves, GraduationCap, Home, DollarSign, Clock, Users
} from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";

// Neighborhood data for quick select
const NEIGHBORHOODS = [
  { id: 'seaport', name: 'Seaport', icon: Waves, color: 'from-blue-500 to-cyan-400', desc: 'Waterfront luxury' },
  { id: 'back-bay', name: 'Back Bay', icon: Building2, color: 'from-amber-500 to-orange-400', desc: 'Historic brownstones' },
  { id: 'beacon-hill', name: 'Beacon Hill', icon: Home, color: 'from-purple-500 to-pink-400', desc: 'Gas lamp charm' },
  { id: 'south-end', name: 'South End', icon: TreePine, color: 'from-green-500 to-emerald-400', desc: 'Victorian rows' },
  { id: 'cambridge', name: 'Cambridge', icon: GraduationCap, color: 'from-red-500 to-rose-400', desc: 'Harvard & MIT' },
  { id: 'brookline', name: 'Brookline', icon: MapPin, color: 'from-indigo-500 to-violet-400', desc: 'Family estates' },
];

// Audio Helpers
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const useReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return ref;
};

// Video Modal Component
const VideoModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
      <div className="relative w-full max-w-4xl mx-4 aspect-video bg-[#0A0A0A] rounded-[32px] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all">
          <X className="w-6 h-6 text-white" />
        </button>
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <Play className="w-20 h-20 text-white/20 mx-auto mb-4" />
            <p className="text-white/40 text-sm uppercase tracking-widest">2026 Market Forecast</p>
            <p className="text-white/20 text-xs mt-2">Video coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Copy Button Component
const CopyButton: React.FC<{ text: string; label?: string }> = ({ text, label = "Copy" }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A0A0A]/5 hover:bg-[#3A5BFF]/10 rounded-full text-[10px] font-black uppercase tracking-widest transition-all group">
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-[#0A0A0A]/40 group-hover:text-[#3A5BFF]" />}
      <span className={copied ? 'text-green-500' : 'text-[#0A0A0A]/40 group-hover:text-[#3A5BFF]'}>{copied ? 'Copied!' : label}</span>
    </button>
  );
};

const FAQAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    {
      question: "How does the AI specifically handle Boston's local market data?",
      answer: "Our system uses Google Search Grounding with Gemini 3 Pro to scan current neighborhood inventory, interest rate fluctuations, and Seaport development reports in real-time to generate hyper-relevant scripts."
    },
    {
      question: "What is Veo 3.1 Animator?",
      answer: "Veo 3.1 is Google's latest generative video model. In our suite, it allows you to animate property stills into cinematic social clips with realistic lighting and camera motion."
    },
    {
      question: "What neighborhoods does the system specialize in?",
      answer: "We cover all Greater Boston luxury markets: Seaport, Back Bay, Beacon Hill, South End, Cambridge, Brookline, Newton, Wellesley, and more. Each neighborhood has specific positioning strategies built into our playbook."
    },
    {
      question: "How do I use the Live Consultant feature?",
      answer: "Click 'Establish Link' to start a real-time voice conversation with our AI market expert. Ask about pricing trends, neighborhood comparisons, buyer demographics, or get instant feedback on your listing strategy."
    },
    {
      question: "Can I export the generated content?",
      answer: "Yes! All scripts, captions, and visual prompts can be copied with one click. The VEO-generated videos can be downloaded directly for use on TikTok, Instagram Reels, or YouTube Shorts."
    }
  ];
  return (
    <div className="max-w-3xl mx-auto mt-12 px-4">
      {faqs.map((faq, idx) => (
        <div key={idx} className="border border-[#D7D3CD] rounded-[32px] overflow-hidden bg-white mb-6 shadow-sm">
          <button onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="w-full px-8 py-6 flex items-center justify-between text-left transition-colors hover:bg-gray-50">
            <span className="font-bold text-lg">{faq.question}</span>
            {openIndex === idx ? <Minus className="w-5 h-5 text-[#3A5BFF]" /> : <Plus className="w-5 h-5 text-gray-400" />}
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-40' : 'max-h-0'}`}>
            <div className="px-8 pb-8 text-[#0A0A0A]/70 serif leading-relaxed">{faq.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const [mode, setMode] = useState<ToolMode>('PRODUCER');
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<VideoPackage | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [veoVideoUrl, setVeoVideoUrl] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  const heroRef = useReveal();
  const statsRef = useReveal();
  const productionRef = useReveal();

  const handleNeighborhoodSelect = (neighborhood: typeof NEIGHBORHOODS[0]) => {
    setSelectedNeighborhood(neighborhood.id);
    setTopic(`${neighborhood.name} luxury properties`);
  };

  const handleProducerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setStatus(AppStatus.LOADING);
    setResult(null);
    try {
      const data = await generateVideoPackage(topic);
      setResult(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setStatus(AppStatus.ERROR);
    }
  };

  const scrollToProduction = () => {
    document.getElementById('production-desk')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleVeoSubmit = async () => {
    if (!selectedImage || !imagePrompt) return;
    setStatus(AppStatus.LOADING);
    try {
      const base64 = selectedImage.split(',')[1];
      const videoUrl = await generateVeoVideo(base64, imagePrompt, '9:16');
      setVeoVideoUrl(videoUrl);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setStatus(AppStatus.ERROR);
    }
  };

  const startLiveSession = async () => {
    if (isLive) {
      setIsLive(false);
      if (sessionRef.current) sessionRef.current.close();
      return;
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          setIsLive(true);
          const source = audioContextRef.current!.createMediaStreamSource(stream);
          const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
            const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
            sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(audioContextRef.current!.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          const base64 = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64 && outputAudioContextRef.current) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
            const audioBuffer = await decodeAudioData(decode(base64), outputAudioContextRef.current, 24000, 1);
            const source = outputAudioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputAudioContextRef.current.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            sourcesRef.current.add(source);
          }
        },
        onclose: () => setIsLive(false),
        onerror: () => setIsLive(false),
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        systemInstruction: 'You are a luxury real estate expert for the Boston market. Professional, insightful, and concise.'
      }
    });
    sessionRef.current = await sessionPromise;
  };

  return (
    <div className="min-h-screen selection:bg-[#3A5BFF]/10 overflow-x-hidden">
      {/* Video Modal */}
      <VideoModal isOpen={showVideoModal} onClose={() => setShowVideoModal(false)} />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] bg-[#FBF9F7]/95 backdrop-blur-xl border-b border-[#D7D3CD]/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="serif text-2xl md:text-3xl font-black tracking-tighter bg-gradient-to-r from-[#0A0A0A] to-[#3A5BFF] bg-clip-text text-transparent">B.L.A.</span>
            <div className="h-6 w-[1px] bg-[#D7D3CD]"></div>
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] font-black text-[#0A0A0A]/60">Boston Luxury Agency</span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <button onClick={() => { setMode('PRODUCER'); scrollToProduction(); }} className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-[#3A5BFF] ${mode === 'PRODUCER' ? 'nav-link-active' : ''}`}>PRODUCER</button>
            <button onClick={() => { setMode('LIVE_CONSULTANT'); scrollToProduction(); }} className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-[#3A5BFF] ${mode === 'LIVE_CONSULTANT' ? 'nav-link-active' : ''}`}>LIVE</button>
            <button onClick={() => { setMode('VEO_ANIMATOR'); scrollToProduction(); }} className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-[#3A5BFF] ${mode === 'VEO_ANIMATOR' ? 'nav-link-active' : ''}`}>VEO</button>
            <button onClick={scrollToProduction} className="bg-[#0A0A0A] text-white px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-[#3A5BFF] transition-all shadow-xl active:scale-95 hover:scale-105">JOIN SUITE</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="reveal pt-40 pb-20 px-6 max-w-7xl mx-auto min-h-[90vh] flex flex-col justify-center">
        <div className="glass-perimeter radiant-pulse rounded-[48px] p-8 md:p-20 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
             <img src="https://images.unsplash.com/photo-1542708993627-b6e5bbae43c4?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover grayscale" alt="Boston Skyline" />
          </div>
          <div className="max-w-4xl relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#F4BE3A]/10 border border-[#F4BE3A]/20 mb-10">
              <span className="w-2 h-2 rounded-full bg-[#F4BE3A] animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0A0A0A]">2026 MARKET INTELLIGENCE ACTIVE</span>
            </div>
            <h1 className="text-5xl md:text-[6.5rem] lg:text-[7.5rem] font-black mb-8 leading-[0.9] md:leading-[0.85] serif tracking-tighter">
              Winning Boston <br className="hidden md:block"/> Real Estate <span className="italic text-[#3A5BFF] block md:inline-block">in 2026.</span>
            </h1>
            <p className="text-lg md:text-2xl text-[#0A0A0A]/60 max-w-3xl mb-12 leading-relaxed font-light">
              The first AI-native production suite designed exclusively for the Greater Boston luxury landscape. Real-time insights from the <span className="font-bold text-[#0A0A0A]">Boston Garden</span> to the <span className="font-bold text-[#0A0A0A]">Seaport Skyline</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <button onClick={scrollToProduction} className="bg-[#0A0A0A] text-white px-10 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-[#3A5BFF] hover:scale-105 transition-all shadow-2xl group">
                ENTER PRODUCTION DESK <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => setShowVideoModal(true)} className="border border-[#D7D3CD] text-[#0A0A0A] px-10 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white hover:border-[#3A5BFF] transition-all flex items-center justify-center gap-3 group">
                <Play className="w-4 h-4 group-hover:text-[#3A5BFF]" /> WATCH FORECAST
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Market Stats */}
      <section ref={statsRef} className="reveal py-32 bg-[#0A0A0A] text-[#FBF9F7] relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3A5BFF]/5 via-transparent to-[#7000FF]/5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="mb-20">
            <h2 className="text-5xl md:text-[5.5rem] font-black serif italic tracking-tighter leading-[0.9]">2026 Market Pulse</h2>
            <p className="text-white/40 mt-6 text-lg max-w-lg uppercase tracking-widest font-black text-[10px]">Real-time intelligence from the Gemini 3 Pro Engine</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { label: 'AVG PRICE/SQFT', value: '$1,500+', icon: <DollarSign className="w-10 h-10" />, sub: 'Core Boston', color: 'text-[#F4BE3A]', iconBg: 'bg-[#F4BE3A]/10' },
              { label: 'DAYS ON MARKET', value: '22-32', icon: <Clock className="w-10 h-10" />, sub: 'High-demand areas', color: 'text-[#3A5BFF]', iconBg: 'bg-[#3A5BFF]/10' },
              { label: 'VIDEO PREFERENCE', value: '82%', icon: <TrendingUp className="w-10 h-10" />, sub: 'Buyer engagement', color: 'text-[#22C55E]', iconBg: 'bg-[#22C55E]/10' },
              { label: 'HOOK CAPTURE', value: '4.1s', icon: <Zap className="w-10 h-10" />, sub: 'Avg attention span', color: 'text-[#EC4899]', iconBg: 'bg-[#EC4899]/10' }
            ].map((stat, i) => (
              <div key={i} className="p-8 border border-white/10 rounded-[32px] flex flex-col group transition-all hover:bg-white/[0.02] hover:border-white/20 hover:scale-[1.02]">
                <div className={`text-[9px] uppercase tracking-[0.4em] font-black mb-6 ${stat.color}`}>{stat.label}</div>
                <div className={`w-16 h-16 ${stat.iconBg} rounded-2xl flex items-center justify-center mb-6 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="text-5xl font-black serif italic tracking-tighter">{stat.value}</div>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mt-2">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Affordability gap callout */}
          <div className="mt-12 p-8 border border-white/10 rounded-[32px] bg-gradient-to-r from-[#E4572E]/10 to-transparent">
            <div className="flex items-center gap-6">
              <Users className="w-12 h-12 text-[#E4572E]" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-[#E4572E] mb-2">The Affordability Gap</p>
                <p className="text-2xl font-black serif italic">Required income jumped from <span className="text-white">$98K</span> to <span className="text-[#E4572E]">$162K+</span> in 4 years</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Production Desk */}
      <section id="production-desk" ref={productionRef} className="py-32 px-6 max-w-6xl mx-auto reveal">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black serif italic mb-4">Production Suite</h2>
            <p className="text-[#0A0A0A]/40 uppercase tracking-[0.4em] font-black text-[10px]">Executive tools for high-production results</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-16">
          {[
            { id: 'PRODUCER', icon: <Boxes className="w-4 h-4" /> },
            { id: 'LIVE_CONSULTANT', icon: <Mic className="w-4 h-4" /> },
            { id: 'VEO_ANIMATOR', icon: <Film className="w-4 h-4" /> }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setMode(t.id as ToolMode)}
              className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center gap-3 shadow-md active:scale-95 ${mode === t.id ? 'bg-[#0A0A0A] text-white scale-105' : 'bg-white border border-[#D7D3CD]/50 text-[#0A0A0A]/60 hover:text-[#0A0A0A]'}`}
            >
              {t.icon}
              {t.id.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[64px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-[#D7D3CD]/50 overflow-hidden min-h-[600px] transition-all">
          {mode === 'PRODUCER' && (
            <div className="p-8 md:p-16 animate-in fade-in duration-700">
               {/* Neighborhood Quick Select */}
               <div className="mb-10">
                 <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-4 text-center">Quick Select Neighborhood</p>
                 <div className="flex flex-wrap justify-center gap-3">
                   {NEIGHBORHOODS.map((n) => {
                     const Icon = n.icon;
                     return (
                       <button
                         key={n.id}
                         onClick={() => handleNeighborhoodSelect(n)}
                         className={`px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                           selectedNeighborhood === n.id
                             ? `bg-gradient-to-r ${n.color} text-white shadow-lg scale-105`
                             : 'bg-white border border-[#D7D3CD]/50 text-[#0A0A0A]/60 hover:border-[#3A5BFF]/50 hover:text-[#0A0A0A]'
                         }`}
                       >
                         <Icon className="w-3.5 h-3.5" />
                         {n.name}
                       </button>
                     );
                   })}
                 </div>
               </div>

               {/* Results Display */}
               <div className="bg-[#FBF9F7] p-8 md:p-12 rounded-[48px] border border-[#D7D3CD]/40 relative overflow-hidden group mb-12 shadow-inner">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-5">
                      <div className="p-3 bg-white rounded-2xl shadow-sm border border-[#D7D3CD]/50">
                        <FileText className="w-6 h-6 text-[#3A5BFF]" />
                      </div>
                      <div>
                        <h3 className="serif text-2xl font-black italic">Video Scripts</h3>
                        <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">Generated Narrative Content</p>
                      </div>
                    </div>
                    {result && (
                      <CopyButton text={result.script_text} label="Copy Script" />
                    )}
                  </div>
                  <div className="bg-white p-8 md:p-10 rounded-[32px] border border-[#D7D3CD]/30 shadow-sm relative min-h-[200px] flex items-center justify-center">
                    {status === AppStatus.LOADING ? (
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 text-[#3A5BFF] animate-spin mx-auto mb-4" />
                        <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">Generating with your playbook strategies...</p>
                      </div>
                    ) : result ? (
                        <div className="w-full">
                             {result.title && (
                               <h4 className="text-[10px] uppercase tracking-widest font-black text-[#3A5BFF] mb-4">{result.title}</h4>
                             )}
                             <p className="serif text-lg md:text-2xl leading-[1.8] text-[#0A0A0A]/80 italic">
                                {result.script_text}
                             </p>
                             <div className="mt-10 pt-8 border-t border-gray-100 grid md:grid-cols-2 gap-8">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                      <h4 className="text-[10px] uppercase tracking-widest font-black text-[#3A5BFF]">SOCIAL CAPTION</h4>
                                      <CopyButton text={result.caption} label="Copy" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-600 leading-relaxed">{result.caption}</p>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                      <h4 className="text-[10px] uppercase tracking-widest font-black text-[#3A5BFF]">VEO PROMPTS</h4>
                                      <CopyButton text={result.visual_prompts.join('\n\n')} label="Copy All" />
                                    </div>
                                    <ul className="space-y-3">
                                        {result.visual_prompts.map((p, i) => (
                                            <li key={i} className="text-[11px] font-medium text-gray-500 flex items-start gap-2 bg-[#FBF9F7] p-3 rounded-xl">
                                                <span className="text-[#3A5BFF] font-black">{i + 1}.</span> {p}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                             </div>
                        </div>
                    ) : (
                        <div className="text-center">
                          <Sparkles className="w-12 h-12 text-[#D7D3CD] mx-auto mb-4" />
                          <p className="serif text-xl opacity-30 italic">Select a neighborhood or enter a topic to begin...</p>
                        </div>
                    )}
                  </div>
               </div>

               {/* Input Form */}
               <form onSubmit={handleProducerSubmit} className="flex flex-col md:flex-row gap-5 p-3 bg-[#FBF9F7] rounded-full border border-[#D7D3CD]/30 shadow-md">
                <input
                  type="text"
                  placeholder="Focus neighborhood (e.g., South End Brownstones)..."
                  className="flex-1 px-8 py-5 md:py-6 bg-transparent outline-none font-medium text-lg placeholder:text-gray-300"
                  value={topic}
                  onChange={(e) => { setTopic(e.target.value); setSelectedNeighborhood(null); }}
                />
                <button type="submit" disabled={status === AppStatus.LOADING || !topic.trim()} className="bg-[#3A5BFF] text-white px-10 py-5 rounded-full font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-4 transition-all shadow-xl hover:bg-[#0A0A0A] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105">
                  {status === AppStatus.LOADING ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                  GENERATE MEDIA
                </button>
              </form>

              {/* Error State */}
              {status === AppStatus.ERROR && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-center">
                  <p className="text-red-600 text-sm font-medium">Something went wrong. Please try again.</p>
                </div>
              )}
            </div>
          )}

          {mode === 'LIVE_CONSULTANT' && (
            <div className="p-16 md:p-32 text-center flex flex-col items-center justify-center h-full bg-[#0A0A0A] text-white animate-in zoom-in-95 duration-700">
              <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full flex items-center justify-center transition-all duration-1000 relative ${isLive ? 'bg-[#3A5BFF] shadow-[0_0_150px_rgba(58,91,255,0.4)] scale-110' : 'bg-white/5 border-2 border-dashed border-white/10'}`}>
                {isLive ? <Mic className="w-16 h-16 md:w-24 md:h-24 text-white animate-pulse" /> : <MicOff className="w-16 h-16 md:w-24 md:h-24 text-white/10" />}
              </div>
              <h3 className="serif text-4xl md:text-6xl mt-12 mb-6 font-black italic tracking-tight">Direct Intelligence Link</h3>
              <p className="text-white/30 max-w-sm mx-auto mb-10 text-sm md:text-base leading-relaxed">Engage in real-time vocal consultation for market trends and valuations.</p>
              <button onClick={startLiveSession} className={`px-16 py-6 rounded-full font-black text-[11px] uppercase tracking-[0.4em] transition-all shadow-2xl ${isLive ? 'bg-white text-[#0A0A0A] hover:bg-red-500 hover:text-white' : 'bg-[#3A5BFF] text-white hover:scale-105'}`}>
                {isLive ? 'TERMINATE SESSION' : 'ESTABLISH LINK'}
              </button>
            </div>
          )}

          {mode === 'VEO_ANIMATOR' && (
            <div className="grid md:grid-cols-2 h-full animate-in slide-in-from-right-10 duration-700">
              <div className="p-10 md:p-16 border-r border-[#D7D3CD]/50 flex flex-col justify-center">
                <div className="aspect-[4/3] bg-[#FBF9F7] rounded-[48px] border-4 border-dashed border-[#D7D3CD]/30 flex flex-col items-center justify-center relative overflow-hidden group/upload transition-all hover:border-[#3A5BFF]/50 cursor-pointer">
                  {selectedImage ? (
                    <img src={selectedImage} className="w-full h-full object-cover transition-transform group-hover/upload:scale-110 duration-700" alt="Selected" />
                  ) : (
                    <div className="text-center p-8">
                        <ImageIcon className="w-16 h-16 text-[#D7D3CD] mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Drop Listing Stills</p>
                    </div>
                  )}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setSelectedImage(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }} />
                </div>
                <textarea
                  className="w-full mt-8 p-8 bg-[#FBF9F7] border border-[#D7D3CD]/30 rounded-[32px] h-32 md:h-40 outline-none text-base font-medium resize-none placeholder:text-gray-300 focus:ring-2 focus:ring-[#3A5BFF]/10 transition-all"
                  placeholder="Define cinematic motion (e.g., Drone sweep across the floor-to-ceiling windows)..."
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                />
                <button onClick={handleVeoSubmit} disabled={status === AppStatus.LOADING} className="w-full mt-8 bg-[#0A0A0A] text-white py-6 rounded-full font-black uppercase tracking-[0.4em] text-[10px] shadow-xl hover:bg-[#3A5BFF] transition-all active:scale-95 disabled:opacity-50">
                  {status === AppStatus.LOADING ? <Loader2 className="animate-spin inline mr-3 w-4 h-4" /> : null}
                  ANIMATE SEQUENCE
                </button>
              </div>
              <div className="p-10 md:p-16 bg-[#FBF9F7] flex flex-col items-center justify-center relative">
                <div className="text-[9px] font-black uppercase tracking-widest text-gray-300 mb-8 absolute top-12">Production Output</div>
                {veoVideoUrl ? (
                  <div className="w-full rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-1000">
                    <video src={veoVideoUrl} controls autoPlay loop className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6 opacity-20">
                    <Film className="w-20 h-20 text-[#0A0A0A]" />
                    <span className="serif text-2xl italic tracking-tight">Awaiting generation...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ & Footer */}
      <footer className="bg-white border-t border-[#D7D3CD]/50 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black serif italic mb-4">Support Intelligence</h2>
            <p className="text-[#0A0A0A]/40 uppercase tracking-[0.4em] font-black text-[10px]">Technical Guidelines & FAQ</p>
          </div>
          <FAQAccordion />
          <div className="text-center mt-32 border-t border-[#D7D3CD]/30 pt-20">
            <div className="serif text-4xl font-black mb-6 italic tracking-tighter">B.L.A. Suite</div>
            <div className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] font-black text-gray-300 mb-8">Executive Production Environment | Greater Boston</div>
            <div className="text-[9px] uppercase tracking-[0.4em] font-black text-[#D7D3CD]">&copy; 2026 LUXURY MEDIA GROUP BOSTON. ALL RIGHTS RESERVED.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
