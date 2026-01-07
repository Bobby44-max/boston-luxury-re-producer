import React, { useState, useRef, useEffect } from 'react';
import {
  generateVideoPackage,
  generateVeoVideo,
  generateContentSuite,
  generateCompetitorAnalysis,
  generateSalesAce,
  generateSocialPost,
  generateProposal
} from './services/geminiService';
import {
  VideoPackage,
  AppStatus,
  ToolMode,
  ContentSuiteResult,
  CompetitorIQResult,
  SalesAceResult,
  SocialPostResult,
  ProposalResult
} from './types';
import {
  Search, Film, Clipboard, Sparkles, Mic, Image as ImageIcon,
  MicOff, Loader2, ArrowRight, TrendingUp, Zap, Boxes, FileText, Layout, Plus, Minus, ChevronRight,
  Copy, Check, Play, X, MapPin, Building2, TreePine, Waves, GraduationCap, Home, DollarSign, Clock, Users,
  Target, Shield, MessageSquare, FileCheck, Linkedin, Video, BarChart3, Swords, Settings, ChevronDown
} from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";

// Neighborhood data for quick select
const NEIGHBORHOODS = [
  { id: 'seaport', name: 'Seaport', icon: Waves, color: 'from-cyan-500 to-cyan-400', desc: 'Waterfront luxury' },
  { id: 'back-bay', name: 'Back Bay', icon: Building2, color: 'from-orange-500 to-orange-400', desc: 'Historic brownstones' },
  { id: 'beacon-hill', name: 'Beacon Hill', icon: Home, color: 'from-violet-500 to-violet-400', desc: 'Gas lamp charm' },
  { id: 'south-end', name: 'South End', icon: TreePine, color: 'from-green-500 to-green-400', desc: 'Victorian rows' },
  { id: 'cambridge', name: 'Cambridge', icon: GraduationCap, color: 'from-pink-500 to-pink-400', desc: 'Harvard & MIT' },
  { id: 'brookline', name: 'Brookline', icon: MapPin, color: 'from-violet-500 to-pink-400', desc: 'Family estates' },
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

// Video Modal Component
const VideoModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl" onClick={onClose}>
      <div className="relative w-full max-w-4xl mx-4 aspect-video glass-panel overflow-hidden" onClick={e => e.stopPropagation()}>
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
    <button onClick={handleCopy} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold transition-all border border-white/10">
      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-white/50" />}
      <span className={copied ? 'text-green-400' : 'text-white/50'}>{copied ? 'Copied!' : label}</span>
    </button>
  );
};

// Status Badge Component
const StatusBadge: React.FC<{ label: string; live?: boolean }> = ({ label, live }) => (
  <div className={`status-badge ${live ? 'status-live' : 'bg-white/5 text-white/50 border border-white/10'}`}>
    {live && <span className="status-pulse"></span>}
    {label}
  </div>
);

// Glass Card Component
const GlassCard: React.FC<{ children: React.ReactNode; className?: string; interactive?: boolean }> = ({ children, className = '', interactive }) => (
  <div className={`glass-panel ${interactive ? 'card-interactive cursor-pointer' : ''} ${className}`}>
    {children}
  </div>
);

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

  // Content Suite State
  const [contentSuiteResult, setContentSuiteResult] = useState<ContentSuiteResult | null>(null);
  const [contentSuiteTab, setContentSuiteTab] = useState<'video' | 'slides' | 'infographic' | 'podcast' | 'quiz' | 'data'>('video');

  // Competitor IQ State
  const [companyName, setCompanyName] = useState('');
  const [competitors, setCompetitors] = useState(['', '', '']);
  const [competitorResult, setCompetitorResult] = useState<CompetitorIQResult | null>(null);
  const [competitorTab, setCompetitorTab] = useState<'matrix' | 'pricing' | 'messaging' | 'counter' | 'battlecard'>('matrix');

  // Sales Ace State
  const [salesProduct, setSalesProduct] = useState('');
  const [salesIndustry, setSalesIndustry] = useState('Luxury Real Estate');
  const [salesDealSize, setSalesDealSize] = useState('$50K-$100K');
  const [salesValueProps, setSalesValueProps] = useState('');
  const [salesCompetitors, setSalesCompetitors] = useState('');
  const [salesResult, setSalesResult] = useState<SalesAceResult | null>(null);
  const [salesTab, setSalesTab] = useState<'objections' | 'battlecard' | 'voicemail' | 'roleplay' | 'cheatsheet'>('objections');

  // Social Posts State
  const [socialTopic, setSocialTopic] = useState('');
  const [socialPostStyle, setSocialPostStyle] = useState('Insight');
  const [socialVideoStyle, setSocialVideoStyle] = useState('Talking Head');
  const [socialCtaGoal, setSocialCtaGoal] = useState('Engagement');
  const [socialResult, setSocialResult] = useState<SocialPostResult | null>(null);

  // Proposals State
  const [prospectName, setProspectName] = useState('');
  const [prospectCompany, setProspectCompany] = useState('');
  const [prospectIndustry, setProspectIndustry] = useState('');
  const [prospectPainPoints, setProspectPainPoints] = useState('');
  const [proposedSolution, setProposedSolution] = useState('');
  const [proposalPricing, setProposalPricing] = useState('');
  const [proposalResult, setProposalResult] = useState<ProposalResult | null>(null);
  const [proposalTab, setProposalTab] = useState<'summary' | 'problem' | 'scope' | 'timeline' | 'investment' | 'next'>('summary');

  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

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

  // Content Suite Handler
  const handleContentSuiteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setStatus(AppStatus.LOADING);
    setContentSuiteResult(null);
    try {
      const data = await generateContentSuite(topic);
      setContentSuiteResult(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setStatus(AppStatus.ERROR);
    }
  };

  // Competitor IQ Handler
  const handleCompetitorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !competitors.some(c => c.trim())) return;
    setStatus(AppStatus.LOADING);
    setCompetitorResult(null);
    try {
      const data = await generateCompetitorAnalysis(companyName, competitors.filter(c => c.trim()));
      setCompetitorResult(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setStatus(AppStatus.ERROR);
    }
  };

  // Sales Ace Handler
  const handleSalesAceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salesProduct.trim()) return;
    setStatus(AppStatus.LOADING);
    setSalesResult(null);
    try {
      const data = await generateSalesAce(salesProduct, salesIndustry, salesDealSize, salesValueProps, salesCompetitors);
      setSalesResult(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setStatus(AppStatus.ERROR);
    }
  };

  // Social Posts Handler
  const handleSocialPostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialTopic.trim()) return;
    setStatus(AppStatus.LOADING);
    setSocialResult(null);
    try {
      const data = await generateSocialPost(socialTopic, socialPostStyle, 'Luxury Real Estate', socialVideoStyle, socialCtaGoal);
      setSocialResult(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setStatus(AppStatus.ERROR);
    }
  };

  // Proposal Handler
  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prospectName.trim() || !prospectCompany.trim()) return;
    setStatus(AppStatus.LOADING);
    setProposalResult(null);
    try {
      const data = await generateProposal(prospectName, prospectCompany, prospectIndustry, prospectPainPoints, proposedSolution, proposalPricing);
      setProposalResult(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setStatus(AppStatus.ERROR);
    }
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

  // Navigation items for bottom nav
  const navItems = [
    { id: 'PRODUCER', icon: Boxes, label: 'Producer' },
    { id: 'LIVE_CONSULTANT', icon: Mic, label: 'Live' },
    { id: 'VEO_ANIMATOR', icon: Film, label: 'Veo' },
    { id: 'CONTENT_SUITE', icon: Layout, label: 'Content' },
    { id: 'COMPETITOR_IQ', icon: Target, label: 'Intel' },
    { id: 'SALES_ACE', icon: Swords, label: 'Sales' },
    { id: 'SOCIAL_POSTS', icon: Linkedin, label: 'Social' },
    { id: 'PROPOSALS', icon: FileCheck, label: 'Proposals' }
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-white relative z-10 pb-32">
      {/* Video Modal */}
      <VideoModal isOpen={showVideoModal} onClose={() => setShowVideoModal(false)} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-violet-500 to-orange-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">Boston Luxury</h1>
              <p className="text-xs text-white/40">RE Producer Suite</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge label="Gemini 3 Pro" live />
            <button onClick={() => setShowVideoModal(true)} className="btn-secondary text-sm">
              <Play className="w-4 h-4" /> Demo
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="mb-12">
          <GlassCard className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  <span className="gradient-text">AI-Powered</span> Production Suite
                </h2>
                <p className="text-white/50 max-w-xl">
                  Generate video scripts, VEO animations, content packages, and sales materials for the Greater Boston luxury market.
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setMode('PRODUCER')} className="btn-primary">
                  <Sparkles className="w-4 h-4" /> Start Creating
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'AVG PRICE/SQFT', value: '$1,500+', color: 'text-orange-400', icon: DollarSign },
                { label: 'DAYS ON MARKET', value: '22-32', color: 'text-cyan-400', icon: Clock },
                { label: 'VIDEO PREFERENCE', value: '82%', color: 'text-green-400', icon: TrendingUp },
                { label: 'HOOK CAPTURE', value: '4.1s', color: 'text-pink-400', icon: Zap }
              ].map((stat, i) => (
                <div key={i} className="glass-panel p-4 card-interactive">
                  <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-wider text-white/40">{stat.label}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* Tool Panels */}
        <section className="mb-12">
          {/* PRODUCER MODE */}
          {mode === 'PRODUCER' && (
            <GlassCard className="p-8 animate-fade-in">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                  <Boxes className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Video Producer</h3>
                  <p className="text-sm text-white/50">Generate scripts, captions & VEO prompts</p>
                </div>
              </div>

              {/* Neighborhood Quick Select */}
              <div className="mb-8">
                <p className="text-xs uppercase tracking-wider text-white/40 mb-4">Quick Select Neighborhood</p>
                <div className="flex flex-wrap gap-2">
                  {NEIGHBORHOODS.map((n) => {
                    const Icon = n.icon;
                    return (
                      <button
                        key={n.id}
                        onClick={() => handleNeighborhoodSelect(n)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                          selectedNeighborhood === n.id
                            ? `bg-gradient-to-r ${n.color} text-white shadow-lg`
                            : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {n.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input Form */}
              <form onSubmit={handleProducerSubmit} className="mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Enter topic or select neighborhood above..."
                    className="glass-input flex-1"
                    value={topic}
                    onChange={(e) => { setTopic(e.target.value); setSelectedNeighborhood(null); }}
                  />
                  <button
                    type="submit"
                    disabled={status === AppStatus.LOADING || !topic.trim()}
                    className="btn-primary"
                  >
                    {status === AppStatus.LOADING ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                    Generate
                  </button>
                </div>
              </form>

              {/* Results */}
              <div className="glass-panel p-6 min-h-[300px]">
                {status === AppStatus.LOADING ? (
                  <div className="flex flex-col items-center justify-center h-full py-16">
                    <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                    <p className="text-white/40 text-sm">Generating with Gemini 3 Pro...</p>
                  </div>
                ) : result ? (
                  <div className="animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-semibold gradient-text">{result.title}</h4>
                      <CopyButton text={result.script_text} label="Copy Script" />
                    </div>
                    <p className="text-white/70 leading-relaxed mb-8">{result.script_text}</p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="glass-panel p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs uppercase tracking-wider text-cyan-400">Social Caption</span>
                          <CopyButton text={result.caption} />
                        </div>
                        <p className="text-sm text-white/60">{result.caption}</p>
                      </div>
                      <div className="glass-panel p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs uppercase tracking-wider text-violet-400">VEO Prompts</span>
                          <CopyButton text={result.visual_prompts.join('\n')} />
                        </div>
                        <ul className="space-y-2">
                          {result.visual_prompts.map((p, i) => (
                            <li key={i} className="text-xs text-white/50 flex items-start gap-2">
                              <span className="text-violet-400 font-semibold">{i + 1}.</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-16">
                    <Sparkles className="w-12 h-12 text-white/10 mb-4" />
                    <p className="text-white/30">Select a neighborhood or enter a topic to begin</p>
                  </div>
                )}
              </div>

              {status === AppStatus.ERROR && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                  <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
                </div>
              )}
            </GlassCard>
          )}

          {/* LIVE CONSULTANT MODE */}
          {mode === 'LIVE_CONSULTANT' && (
            <GlassCard className="p-8 md:p-16 animate-fade-in">
              <div className="text-center max-w-lg mx-auto">
                <div className={`w-40 h-40 md:w-56 md:h-56 mx-auto rounded-full flex items-center justify-center transition-all duration-1000 relative mb-8 ${
                  isLive
                    ? 'bg-gradient-to-br from-cyan-500 to-violet-500 shadow-[0_0_100px_rgba(13,204,242,0.4)]'
                    : 'bg-white/5 border-2 border-dashed border-white/10'
                }`}>
                  {isLive ? (
                    <Mic className="w-16 h-16 md:w-20 md:h-20 text-white animate-pulse" />
                  ) : (
                    <MicOff className="w-16 h-16 md:w-20 md:h-20 text-white/20" />
                  )}
                </div>

                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="gradient-text">Direct Intelligence</span> Link
                </h3>
                <p className="text-white/40 mb-8">
                  Real-time vocal consultation for market trends, valuations, and strategy.
                </p>

                <button
                  onClick={startLiveSession}
                  className={`px-12 py-4 rounded-xl font-semibold transition-all ${
                    isLive
                      ? 'bg-white text-black hover:bg-red-500 hover:text-white'
                      : 'btn-primary'
                  }`}
                >
                  {isLive ? 'End Session' : 'Start Session'}
                </button>
              </div>
            </GlassCard>
          )}

          {/* VEO ANIMATOR MODE */}
          {mode === 'VEO_ANIMATOR' && (
            <GlassCard className="overflow-hidden animate-fade-in">
              <div className="grid md:grid-cols-2">
                <div className="p-8 border-r border-white/5">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
                      <Film className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">VEO 3.1 Animator</h3>
                      <p className="text-sm text-white/50">Image-to-video generation</p>
                    </div>
                  </div>

                  <div className="aspect-[4/3] glass-panel flex flex-col items-center justify-center relative overflow-hidden mb-6 cursor-pointer hover:border-cyan-500/50 transition-all">
                    {selectedImage ? (
                      <img src={selectedImage} className="w-full h-full object-cover" alt="Selected" />
                    ) : (
                      <div className="text-center p-8">
                        <ImageIcon className="w-12 h-12 text-white/20 mx-auto mb-3" />
                        <p className="text-sm text-white/30">Drop listing stills here</p>
                      </div>
                    )}
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setSelectedImage(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>

                  <textarea
                    className="glass-input w-full h-32 resize-none mb-4"
                    placeholder="Describe the cinematic motion (e.g., Drone sweep across floor-to-ceiling windows)..."
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                  />

                  <button
                    onClick={handleVeoSubmit}
                    disabled={status === AppStatus.LOADING || !selectedImage || !imagePrompt}
                    className="btn-primary w-full justify-center"
                  >
                    {status === AppStatus.LOADING ? <Loader2 className="animate-spin w-5 h-5" /> : <Play className="w-5 h-5" />}
                    Generate Animation
                  </button>
                </div>

                <div className="p-8 bg-white/[0.01] flex flex-col items-center justify-center">
                  <p className="text-xs uppercase tracking-wider text-white/30 mb-6">Production Output</p>
                  {veoVideoUrl ? (
                    <div className="w-full rounded-2xl shadow-2xl overflow-hidden">
                      <video src={veoVideoUrl} controls autoPlay loop className="w-full" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-white/20">
                      <Film className="w-16 h-16" />
                      <span className="text-sm">Awaiting generation...</span>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          )}

          {/* CONTENT SUITE MODE */}
          {mode === 'CONTENT_SUITE' && (
            <GlassCard className="p-8 animate-fade-in">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center">
                  <Layout className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Content Multiplier</h3>
                  <p className="text-sm text-white/50">One topic → Full content suite</p>
                </div>
              </div>

              <form onSubmit={handleContentSuiteSubmit} className="mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Topic (e.g., 2026 Boston Market Forecast)..."
                    className="glass-input flex-1"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                  <button type="submit" disabled={status === AppStatus.LOADING || !topic.trim()} className="btn-primary">
                    {status === AppStatus.LOADING ? <Loader2 className="animate-spin w-5 h-5" /> : <Layout className="w-5 h-5" />}
                    Generate Suite
                  </button>
                </div>
              </form>

              {contentSuiteResult && (
                <div className="glass-panel overflow-hidden">
                  <div className="tab-pills flex-wrap p-2 border-b border-white/5">
                    {['video', 'slides', 'infographic', 'podcast', 'quiz', 'data'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setContentSuiteTab(tab as any)}
                        className={`tab-pill ${contentSuiteTab === tab ? 'active' : ''}`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-end mb-4">
                      <CopyButton text={
                        contentSuiteTab === 'video' ? contentSuiteResult.videoScript :
                        contentSuiteTab === 'slides' ? contentSuiteResult.slideDeck :
                        contentSuiteTab === 'infographic' ? contentSuiteResult.infographic :
                        contentSuiteTab === 'podcast' ? contentSuiteResult.podcastScript :
                        contentSuiteTab === 'quiz' ? contentSuiteResult.quizQuestions.join('\n\n') :
                        contentSuiteResult.dataTable
                      } />
                    </div>
                    <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm text-white/70">
                      {contentSuiteTab === 'video' && contentSuiteResult.videoScript}
                      {contentSuiteTab === 'slides' && contentSuiteResult.slideDeck}
                      {contentSuiteTab === 'infographic' && contentSuiteResult.infographic}
                      {contentSuiteTab === 'podcast' && contentSuiteResult.podcastScript}
                      {contentSuiteTab === 'quiz' && contentSuiteResult.quizQuestions.map((q, i) => (
                        <div key={i} className="mb-4 p-4 glass-panel">{q}</div>
                      ))}
                      {contentSuiteTab === 'data' && (
                        <pre className="glass-panel p-4 overflow-x-auto">{contentSuiteResult.dataTable}</pre>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          )}

          {/* COMPETITOR IQ MODE */}
          {mode === 'COMPETITOR_IQ' && (
            <GlassCard className="p-8 animate-fade-in">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Competitor Intelligence</h3>
                  <p className="text-sm text-white/50">Analyze & outmaneuver competition</p>
                </div>
              </div>

              <form onSubmit={handleCompetitorSubmit} className="space-y-4 mb-8">
                <input
                  type="text"
                  placeholder="Your Company Name..."
                  className="glass-input w-full"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <div className="grid md:grid-cols-3 gap-4">
                  {competitors.map((c, i) => (
                    <input
                      key={i}
                      type="text"
                      placeholder={`Competitor ${i + 1}...`}
                      className="glass-input"
                      value={c}
                      onChange={(e) => {
                        const newComps = [...competitors];
                        newComps[i] = e.target.value;
                        setCompetitors(newComps);
                      }}
                    />
                  ))}
                </div>
                <button type="submit" disabled={status === AppStatus.LOADING} className="btn-primary w-full justify-center">
                  {status === AppStatus.LOADING ? <Loader2 className="animate-spin w-5 h-5" /> : <Target className="w-5 h-5" />}
                  Analyze Competitors
                </button>
              </form>

              {competitorResult && (
                <div className="glass-panel overflow-hidden">
                  <div className="tab-pills flex-wrap p-2 border-b border-white/5">
                    {['matrix', 'pricing', 'messaging', 'counter', 'battlecard'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setCompetitorTab(tab as any)}
                        className={`tab-pill ${competitorTab === tab ? 'active' : ''}`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="p-6 whitespace-pre-wrap text-sm text-white/70">
                    {competitorTab === 'matrix' && competitorResult.strengthsWeaknesses}
                    {competitorTab === 'pricing' && competitorResult.pricingAnalysis}
                    {competitorTab === 'messaging' && competitorResult.messagingAnalysis}
                    {competitorTab === 'counter' && competitorResult.counterPositioning}
                    {competitorTab === 'battlecard' && competitorResult.battleCard}
                  </div>
                </div>
              )}
            </GlassCard>
          )}

          {/* SALES ACE MODE */}
          {mode === 'SALES_ACE' && (
            <GlassCard className="p-8 animate-fade-in">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                  <Swords className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Sales Ace</h3>
                  <p className="text-sm text-white/50">Objection handling & sales enablement</p>
                </div>
              </div>

              <form onSubmit={handleSalesAceSubmit} className="space-y-4 mb-8">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Product/Service Name..."
                    className="glass-input"
                    value={salesProduct}
                    onChange={(e) => setSalesProduct(e.target.value)}
                  />
                  <select
                    className="glass-input"
                    value={salesDealSize}
                    onChange={(e) => setSalesDealSize(e.target.value)}
                  >
                    <option>{'<$5K'}</option>
                    <option>$5K-$15K</option>
                    <option>$15K-$50K</option>
                    <option>$50K-$100K</option>
                    <option>$100K+</option>
                  </select>
                </div>
                <textarea
                  placeholder="Key Value Propositions (3-5 benefits)..."
                  className="glass-input w-full h-24 resize-none"
                  value={salesValueProps}
                  onChange={(e) => setSalesValueProps(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Top Competitors..."
                  className="glass-input w-full"
                  value={salesCompetitors}
                  onChange={(e) => setSalesCompetitors(e.target.value)}
                />
                <button type="submit" disabled={status === AppStatus.LOADING} className="btn-primary w-full justify-center">
                  {status === AppStatus.LOADING ? <Loader2 className="animate-spin w-5 h-5" /> : <Swords className="w-5 h-5" />}
                  Generate Sales Kit
                </button>
              </form>

              {salesResult && (
                <div className="glass-panel overflow-hidden">
                  <div className="tab-pills flex-wrap p-2 border-b border-white/5">
                    {['objections', 'battlecard', 'voicemail', 'roleplay', 'cheatsheet'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setSalesTab(tab as any)}
                        className={`tab-pill ${salesTab === tab ? 'active' : ''}`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="p-6 whitespace-pre-wrap text-sm text-white/70 max-h-[400px] overflow-y-auto">
                    {salesTab === 'objections' && salesResult.objectionFrameworks}
                    {salesTab === 'battlecard' && salesResult.competitorBattlecard}
                    {salesTab === 'voicemail' && salesResult.voicemailScripts}
                    {salesTab === 'roleplay' && salesResult.rolePlayScenarios}
                    {salesTab === 'cheatsheet' && salesResult.quickReferenceCard}
                  </div>
                </div>
              )}
            </GlassCard>
          )}

          {/* SOCIAL POSTS MODE */}
          {mode === 'SOCIAL_POSTS' && (
            <GlassCard className="p-8 animate-fade-in">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Linkedin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Social Post Generator</h3>
                  <p className="text-sm text-white/50">8-second scripts + LinkedIn posts</p>
                </div>
              </div>

              <form onSubmit={handleSocialPostSubmit} className="space-y-4 mb-8">
                <input
                  type="text"
                  placeholder="Topic or Idea..."
                  className="glass-input w-full"
                  value={socialTopic}
                  onChange={(e) => setSocialTopic(e.target.value)}
                />
                <div className="grid md:grid-cols-3 gap-4">
                  <select className="glass-input" value={socialPostStyle} onChange={(e) => setSocialPostStyle(e.target.value)}>
                    <option>Insight</option>
                    <option>Story</option>
                    <option>Hot Take</option>
                    <option>Tip</option>
                    <option>Question</option>
                    <option>Celebration</option>
                  </select>
                  <select className="glass-input" value={socialVideoStyle} onChange={(e) => setSocialVideoStyle(e.target.value)}>
                    <option>Talking Head</option>
                    <option>Text on Screen</option>
                    <option>B-Roll with Voiceover</option>
                    <option>Before/After</option>
                    <option>Quick Tip Demo</option>
                  </select>
                  <select className="glass-input" value={socialCtaGoal} onChange={(e) => setSocialCtaGoal(e.target.value)}>
                    <option>Engagement</option>
                    <option>DMs</option>
                    <option>Link Click</option>
                    <option>Awareness</option>
                  </select>
                </div>
                <button type="submit" disabled={status === AppStatus.LOADING} className="btn-primary w-full justify-center">
                  {status === AppStatus.LOADING ? <Loader2 className="animate-spin w-5 h-5" /> : <Linkedin className="w-5 h-5" />}
                  Generate Post
                </button>
              </form>

              {socialResult && (
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="glass-panel p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs uppercase tracking-wider text-cyan-400">Video Script</span>
                      <CopyButton text={socialResult.videoScript} />
                    </div>
                    <div className="whitespace-pre-wrap text-sm text-white/60">{socialResult.videoScript}</div>
                  </div>
                  <div className="glass-panel p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs uppercase tracking-wider text-violet-400">Veo Prompt</span>
                      <CopyButton text={socialResult.geminiPrompt} />
                    </div>
                    <div className="whitespace-pre-wrap text-sm text-white/60">{socialResult.geminiPrompt}</div>
                  </div>
                  <div className="glass-panel p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs uppercase tracking-wider text-orange-400">LinkedIn ({socialResult.characterCount}/1300)</span>
                      <CopyButton text={socialResult.linkedinPost} />
                    </div>
                    <div className="whitespace-pre-wrap text-sm text-white/60">{socialResult.linkedinPost}</div>
                  </div>
                </div>
              )}
            </GlassCard>
          )}

          {/* PROPOSALS MODE */}
          {mode === 'PROPOSALS' && (
            <GlassCard className="p-8 animate-fade-in">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Proposal Generator</h3>
                  <p className="text-sm text-white/50">Professional business proposals</p>
                </div>
              </div>

              <form onSubmit={handleProposalSubmit} className="space-y-4 mb-8">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Prospect Name..."
                    className="glass-input"
                    value={prospectName}
                    onChange={(e) => setProspectName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Company Name..."
                    className="glass-input"
                    value={prospectCompany}
                    onChange={(e) => setProspectCompany(e.target.value)}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Industry..."
                  className="glass-input w-full"
                  value={prospectIndustry}
                  onChange={(e) => setProspectIndustry(e.target.value)}
                />
                <textarea
                  placeholder="Pain Points..."
                  className="glass-input w-full h-24 resize-none"
                  value={prospectPainPoints}
                  onChange={(e) => setProspectPainPoints(e.target.value)}
                />
                <textarea
                  placeholder="Proposed Solution..."
                  className="glass-input w-full h-24 resize-none"
                  value={proposedSolution}
                  onChange={(e) => setProposedSolution(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Pricing Details..."
                  className="glass-input w-full"
                  value={proposalPricing}
                  onChange={(e) => setProposalPricing(e.target.value)}
                />
                <button type="submit" disabled={status === AppStatus.LOADING} className="btn-primary w-full justify-center">
                  {status === AppStatus.LOADING ? <Loader2 className="animate-spin w-5 h-5" /> : <FileCheck className="w-5 h-5" />}
                  Generate Proposal
                </button>
              </form>

              {proposalResult && (
                <div className="glass-panel overflow-hidden">
                  <div className="tab-pills flex-wrap p-2 border-b border-white/5">
                    {['summary', 'problem', 'scope', 'timeline', 'investment', 'next'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setProposalTab(tab as any)}
                        className={`tab-pill ${proposalTab === tab ? 'active' : ''}`}
                      >
                        {tab === 'next' ? 'Next Steps' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="p-6 whitespace-pre-wrap text-sm text-white/70">
                    {proposalTab === 'summary' && proposalResult.executiveSummary}
                    {proposalTab === 'problem' && proposalResult.problemStatement}
                    {proposalTab === 'scope' && proposalResult.scopeOfWork}
                    {proposalTab === 'timeline' && proposalResult.timeline}
                    {proposalTab === 'investment' && proposalResult.investmentBreakdown}
                    {proposalTab === 'next' && proposalResult.nextSteps}
                  </div>
                </div>
              )}
            </GlassCard>
          )}
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav flex items-center gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setMode(item.id as ToolMode)}
              className={`nav-item ${mode === item.id ? 'active' : ''}`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default App;
