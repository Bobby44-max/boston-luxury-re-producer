"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Check, Menu, X, Bot, LayoutTemplate, Activity } from "lucide-react";

// Register ScrollTrigger to avoid issues with SSR frameworks (Next.js)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// --- MICRO-INTERACTION COMPONENTS ---

const DiagnosticShuffler = () => {
  const [cards, setCards] = useState(["Script Generation", "VEO Animations", "Voice Synthesis"]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCards(prev => {
        const next = [...prev];
        next.unshift(next.pop()!);
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-48 w-full flex items-center justify-center">
      {cards.map((label, i) => (
        <div
          key={label}
          className="absolute w-64 p-4 rounded-[1.5rem] bg-[#111118] border border-white/10 text-center shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-700 font-jetbrains text-sm"
          style={{
            zIndex: cards.length - i,
            transform: `translateY(${i * 15}px) scale(${1 - i * 0.05})`,
            opacity: 1 - i * 0.2,
          }}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

const TelemetryTypewriter = () => {
  const [text, setText] = useState("");
  const fullText = "> Extracting parameters...\n> Generating content suite...\n> Formatting for IG & TikTok.\n> SUCCESS.";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length + 20) {
        // Pause at the end before restarting
        index = 0;
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-48 w-full bg-[#111118] rounded-[1.5rem] p-6 font-jetbrains text-xs md:text-sm text-white/70 overflow-hidden relative border border-white/5">
      <div className="absolute top-4 right-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#C9A84C]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse"></span>
        Live Feed
      </div>
      <div className="mt-6 whitespace-pre-wrap leading-loose">
        {text}
        <span className="inline-block w-2h h-3.5 ml-1 align-middle bg-[#C9A84C] animate-pulse"></span>
      </div>
    </div>
  );
};

const CursorProtocolScheduler = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [activeDay, setActiveDay] = useState<number | null>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      tl.set(cursorRef.current, { x: 200, y: 150, opacity: 0 });
      tl.to(cursorRef.current, { x: 120, y: 70, opacity: 1, duration: 1, ease: "power2.inOut" });
      tl.to(cursorRef.current, { scale: 0.9, duration: 0.1 });
      tl.add(() => setActiveDay(3)); // Wednesday index
      tl.to(cursorRef.current, { scale: 1, duration: 0.1 });
      tl.to(cursorRef.current, { x: 150, y: 130, duration: 0.8, ease: "power2.inOut" });
      tl.to(cursorRef.current, { scale: 0.9, duration: 0.1 });
      tl.to(cursorRef.current, { scale: 1, duration: 0.1 });
      tl.to(cursorRef.current, { opacity: 0, y: "+=30", duration: 0.4 });
      tl.add(() => setActiveDay(null));
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="h-48 w-full relative bg-[#111118] border border-white/5 p-6 rounded-[1.5rem] flex flex-col justify-between overflow-hidden">
      <div className="flex justify-between items-center mb-4 mt-2 px-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-jetbrains transition-colors ${activeDay === i ? 'bg-[#C9A84C] text-[#0D0D12] font-bold' : 'text-white/40'}`}>
            {d}
          </div>
        ))}
      </div>
      <div className="flex justify-end relative z-0">
        <div className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] md:text-xs font-medium text-white/50 border border-white/5 transition-colors">Automate Drip</div>
      </div>

      {/* Visual Cursor */}
      <div ref={cursorRef} className="absolute z-10 w-5 h-5 md:w-6 md:h-6 pointer-events-none drop-shadow-lg text-white">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4 4l5.35 16.05c.29.87 1.5.85 1.76-.02l2.64-8.79 8.79-2.64c.87-.26.89-1.47.02-1.76L4 4z" fill="currentColor" stroke="#000" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
};


// --- MAJOR SECTIONS ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-6 md:px-8 py-4 rounded-[2rem] transition-all duration-300 w-[92%] max-w-5xl ${scrolled
          ? "bg-[#0D0D12]/70 backdrop-blur-xl border border-white/10 text-white shadow-2xl"
          : "bg-transparent text-white border border-transparent"
        }`}
    >
      <div className="flex items-center gap-2">
        <span className="font-sans font-bold text-lg md:text-xl tracking-tight">Boston Luxury.</span>
      </div>
      <div className="hidden md:flex items-center gap-8">
        <Link href="#features" className="text-sm font-medium text-white/70 hover:text-white hover:-translate-y-[1px] transition-all">Features</Link>
        <Link href="#protocol" className="text-sm font-medium text-white/70 hover:text-white hover:-translate-y-[1px] transition-all">Protocol</Link>
        <Link href="#pricing" className="text-sm font-medium text-white/70 hover:text-white hover:-translate-y-[1px] transition-all">Access</Link>
      </div>
      <div className="hidden md:block">
        <Link
          href="/dashboard"
          className="relative overflow-hidden px-6 py-2.5 bg-[#C9A84C] text-[#0D0D12] font-semibold rounded-full hover:scale-[1.03] transition-transform inline-block group"
        >
          <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
          <span className="relative z-10">Start Creating</span>
        </Link>
      </div>
      <button className="md:hidden text-white hover:text-[#C9A84C] transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X /> : <Menu />}
      </button>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 mt-4 p-6 bg-[#0D0D12]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] md:hidden flex flex-col gap-6 shadow-[0_10px_50px_rgba(0,0,0,0.8)]">
          <Link href="#features" className="text-lg" onClick={() => setMobileOpen(false)}>Features</Link>
          <Link href="#protocol" className="text-lg" onClick={() => setMobileOpen(false)}>Protocol</Link>
          <Link href="#pricing" className="text-lg" onClick={() => setMobileOpen(false)}>Access</Link>
          <Link href="/dashboard" className="text-[#C9A84C] text-lg font-bold" onClick={() => setMobileOpen(false)}>Start Creating</Link>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative w-full h-[100dvh] flex items-end pb-24 md:pb-32 px-6 md:px-12">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop"
          alt="Luxury Architecture Midnight"
          className="w-full h-full object-cover grayscale-[30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] via-[#0D0D12]/80 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto md:mx-0 md:pl-16">
        <h1 className="flex flex-col gap-0 md:gap-2 mb-8">
          <span className="hero-reveal font-sans font-bold text-3xl md:text-5xl tracking-tight text-white uppercase opacity-90">
            A private showroom meets
          </span>
          <span className="hero-reveal font-playfair italic text-5xl md:text-8xl leading-[1.05] text-[#C9A84C]">
            Architectural Precision.
          </span>
        </h1>
        <p className="hero-reveal font-sans text-lg md:text-xl text-white/50 max-w-xl mb-12 leading-relaxed">
          The ultimate AI-powered production suite for high-end real estate. Transform raw listing URLs into cinematic video packages and automated collateral in seconds.
        </p>
        <div className="hero-reveal">
          <Link
            href="/dashboard"
            className="group relative overflow-hidden inline-flex items-center gap-4 px-8 py-5 bg-[#C9A84C] text-[#0D0D12] font-semibold text-lg hover:scale-[1.03] transition-all duration-300 ease-out rounded-full"
            style={{ borderRadius: "3rem" }}
          >
            <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
            <span className="relative z-10">Deploy Content Interface</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-24 max-w-3xl mx-auto">
        <h2 className="font-playfair italic text-4xl md:text-6xl mb-6 text-[#C9A84C]">Interactive Functional Artifacts</h2>
        <p className="text-white/50 text-lg font-sans">Automated solutions replacing days of manual production effort. Designed strictly for high-yield market operations.</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="feature-card bg-[#0D0D12] rounded-[3rem] p-8 md:p-10 border border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden">
          <DiagnosticShuffler />
          <div className="mt-12 text-center w-full">
            <h3 className="font-sans font-bold text-xl mb-3 text-white">Video & Visual Generation</h3>
            <p className="text-sm text-white/40 leading-relaxed font-sans">Instantly map property features to cinematic shot lists and premium voiceovers, entirely driven by intelligent parsing.</p>
          </div>
        </div>

        <div className="feature-card bg-[#0D0D12] rounded-[3rem] p-8 md:p-10 border border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden">
          <TelemetryTypewriter />
          <div className="mt-12 text-center w-full">
            <h3 className="font-sans font-bold text-xl mb-3 text-white">Omnichannel Content Suite</h3>
            <p className="text-sm text-white/40 leading-relaxed font-sans">Extract core details from any listing URL to spontaneously produce blogs, newsletters, and targeted social matrices.</p>
          </div>
        </div>

        <div className="feature-card bg-[#0D0D12] rounded-[3rem] p-8 md:p-10 border border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden">
          <CursorProtocolScheduler />
          <div className="mt-12 text-center w-full">
            <h3 className="font-sans font-bold text-xl mb-3 text-white">Intelligent Sales Protocol</h3>
            <p className="text-sm text-white/40 leading-relaxed font-sans">Automate deal proposals, generate objection defenses, and deploy active battlecards live into your schedule.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Philosophy = () => {
  return (
    <section id="philosophy" className="relative py-48 w-full bg-black overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0 opacity-20">
        <img src="https://images.unsplash.com/photo-1549242967-de40fcab2d23?q=80&w=2000&auto=format&fit=crop" alt="Dark marble luxury" className="w-full h-full object-cover scale-105" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <p className="philosophy-reveal font-sans text-white/40 text-xl md:text-3xl mb-8 uppercase tracking-widest font-semibold">
          Most real estate tech focuses on: <span className="text-white">Generic Automation.</span>
        </p>
        <p className="philosophy-reveal font-playfair italic text-5xl md:text-8xl leading-tight text-white drop-shadow-[0_10px_30px_rgba(201,168,76,0.15)]">
          We focus on building: <span className="text-[#C9A84C]">Cinematic Trust.</span>
        </p>
      </div>
    </section>
  );
};

const ProtocolSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.stacking-card') as HTMLElement[];
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": function () {
          cards.forEach((card, i) => {
            ScrollTrigger.create({
              trigger: card,
              start: "top top",
              end: "bottom+=1000 top",
              pin: true,
              pinSpacing: false,
            });

            if (i > 0) {
              gsap.fromTo(cards[i - 1],
                { scale: 1, filter: "blur(0px)", opacity: 1 },
                {
                  scale: 0.9, filter: "blur(10px)", opacity: 0.05,
                  scrollTrigger: {
                    trigger: card,
                    start: "top bottom",
                    end: "top top",
                    scrub: true
                  }
                }
              );
            }
          });
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const steps = [
    { num: "01", title: "Ingestion Phase", desc: "Instantly parse real estate listings, analyzing property details, architectural nuances, and local market comparables with zero manual entry.", icon: <Activity className="w-16 h-16 text-[#C9A84C]" /> },
    { num: "02", title: "Synthesis Core", desc: "Constructing targeted sales narratives, compelling video scripts, and custom visual prompts with our autonomous multi-agent orchestration.", icon: <Bot className="w-16 h-16 text-[#C9A84C]" /> },
    { num: "03", title: "Asset Deployment", desc: "Programmatic finalization of high-fidelity video files, robust content arrays, and ready-to-present sales documents seamlessly distributed.", icon: <LayoutTemplate className="w-16 h-16 text-[#C9A84C]" /> },
  ];

  return (
    <section id="protocol" ref={containerRef} className="py-24 bg-[#0D0D12] min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        {steps.map((step, i) => (
          <div key={i} className={`stacking-card md:h-screen w-full flex items-center justify-center py-6 z-[${10 + i}]`}>
            <div className="bg-[#111118] border border-white/10 rounded-[3rem] p-10 md:p-24 shadow-2xl w-full flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-16">
              <div className="flex-shrink-0 bg-white/5 p-6 rounded-[2rem] border border-white/5 opacity-80">
                {step.icon}
              </div>
              <div className="text-center md:text-left">
                <div className="font-jetbrains text-[#C9A84C] text-sm md:text-base tracking-widest uppercase mb-6 font-semibold">Step {step.num}</div>
                <h3 className="font-playfair italic font-bold text-4xl md:text-6xl mb-6 text-white">{step.title}</h3>
                <p className="text-lg md:text-xl text-white/50 leading-relaxed font-sans">{step.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Membership = () => {
  return (
    <section id="pricing" className="py-32 md:py-48 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-24 max-w-2xl mx-auto">
        <h2 className="font-sans font-bold text-4xl md:text-5xl mb-6 tracking-tight text-white uppercase opacity-90">Access the Architecture</h2>
        <p className="text-white/50 text-lg font-sans">Elevate your digital operational footprint to elite status. Secure your system access tier.</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="p-10 rounded-[3rem] border border-white/10 bg-[#0A0A0F] shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-3 text-white font-sans">Essential</h3>
            <p className="text-white/40 text-sm mb-8 font-sans">Foundational content engine.</p>
            <div className="text-5xl font-sans font-bold mb-10 text-white">$49<span className="text-xl text-white/30 font-normal">/mo</span></div>
            <ul className="space-y-4 mb-12">
              <li className="flex items-center gap-3 text-sm text-white/60 font-sans"><Check className="w-5 h-5 text-[#C9A84C]" /> 10 HD Videos</li>
              <li className="flex items-center gap-3 text-sm text-white/60 font-sans"><Check className="w-5 h-5 text-[#C9A84C]" /> Standard Templates</li>
              <li className="flex items-center gap-3 text-sm text-white/60 font-sans"><Check className="w-5 h-5 text-[#C9A84C]" /> Voiceover Engine</li>
            </ul>
          </div>
          <Link href="/dashboard" className="block w-full py-5 text-center rounded-[2rem] bg-white/5 hover:bg-white/10 transition-colors font-sans font-semibold text-white/80 border border-white/5">Join Essential</Link>
        </div>

        <div className="p-10 rounded-[3rem] border-2 border-[#C9A84C] bg-[#111118] relative transform lg:-translate-y-6 shadow-2xl flex flex-col justify-between">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#C9A84C] text-[#0D0D12] px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest font-sans">Performance</div>
          <div>
            <h3 className="text-2xl font-bold mb-3 text-white font-sans">Performance</h3>
            <p className="text-white/40 text-sm mb-8 font-sans">Unrestricted production pipeline.</p>
            <div className="text-5xl font-sans font-bold mb-10 text-white">$149<span className="text-xl text-white/30 font-normal">/mo</span></div>
            <ul className="space-y-4 mb-12">
              <li className="flex items-center gap-3 text-sm text-white font-sans"><Check className="w-5 h-5 text-[#C9A84C]" /> Unlimited 4K Videos</li>
              <li className="flex items-center gap-3 text-sm text-white font-sans"><Check className="w-5 h-5 text-[#C9A84C]" /> VEO Integration</li>
              <li className="flex items-center gap-3 text-sm text-white font-sans"><Check className="w-5 h-5 text-[#C9A84C]" /> Full Content Suites</li>
            </ul>
          </div>
          <Link href="/dashboard" className="group relative overflow-hidden block w-full py-5 text-center rounded-[2rem] bg-[#C9A84C] text-[#0D0D12] font-sans font-bold hover:scale-[1.02] transition-transform">
            <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
            <span className="relative z-10">Initialize System</span>
          </Link>
        </div>

        <div className="p-10 rounded-[3rem] border border-white/10 bg-[#0A0A0F] shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-3 text-white font-sans">Enterprise</h3>
            <p className="text-white/40 text-sm mb-8 font-sans">Bespoke brokerage solutions.</p>
            <div className="text-5xl font-sans font-bold mb-10 text-white">Custom</div>
            <ul className="space-y-4 mb-12">
              <li className="flex items-center gap-3 text-sm text-white/60 font-sans"><Check className="w-5 h-5 text-[#C9A84C]" /> White-label Portal</li>
              <li className="flex items-center gap-3 text-sm text-white/60 font-sans"><Check className="w-5 h-5 text-[#C9A84C]" /> Dedicated API Access</li>
              <li className="flex items-center gap-3 text-sm text-white/60 font-sans"><Check className="w-5 h-5 text-[#C9A84C]" /> Custom Architectures</li>
            </ul>
          </div>
          <Link href="/dashboard" className="block w-full py-5 text-center rounded-[2rem] bg-white/5 hover:bg-white/10 transition-colors font-sans font-semibold text-white/80 border border-white/5">Contact Directors</Link>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-24 pb-12 px-6 mt-32 relative">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 lg:gap-24 mb-24 relative z-10">
        <div className="col-span-1 md:col-span-2">
          <span className="font-playfair italic font-bold text-3xl tracking-tight mb-6 block text-white drop-shadow-md">Boston Luxury.</span>
          <p className="text-white/40 text-sm max-w-sm mb-10 font-sans leading-relaxed">Precision real estate production tools engineered strictly for premium aesthetic supremacy and high-conversion environments.</p>
          <div className="inline-flex items-center gap-3 bg-[#111118] rounded-full px-5 py-3 border border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse"></span>
            <span className="font-jetbrains text-[10px] md:text-xs text-emerald-400 uppercase tracking-widest font-semibold">System Operational</span>
          </div>
        </div>
        <div>
          <h4 className="font-sans font-semibold mb-6 uppercase tracking-widest text-[#C9A84C] text-xs">Node Directory</h4>
          <ul className="space-y-4 font-sans text-sm text-white/50">
            <li><Link href="#features" className="hover:text-white transition-colors block">Features</Link></li>
            <li><Link href="#protocol" className="hover:text-white transition-colors block">Protocol</Link></li>
            <li><Link href="#pricing" className="hover:text-white transition-colors block">Access</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors block">Studio</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-sans font-semibold mb-6 uppercase tracking-widest text-[#C9A84C] text-xs">Legal Policies</h4>
          <ul className="space-y-4 font-sans text-sm text-white/50">
            <li><Link href="#" className="hover:text-white transition-colors block">Terms of Operation</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors block">Privacy Control</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-white/10 pt-10 text-center md:text-left text-xs md:text-sm font-sans text-white/30 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        <p>&copy; {new Date().getFullYear()} Boston Luxury Production. All rights explicitly reserved.</p>
      </div>
    </footer>
  );
};

export default function MarketingHomePage() {
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-reveal",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "power3.out" }
      );

      gsap.fromTo(
        ".philosophy-reveal",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.15, duration: 1.2, ease: "power2.out",
          scrollTrigger: {
            trigger: "#philosophy",
            start: "top 75%"
          }
        }
      );

      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, stagger: 0.2, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: "#features",
            start: "top 80%"
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative z-10 w-full text-[var(--foreground)] selection:bg-[#C9A84C] selection:text-[#0D0D12]">
      <Navbar />
      <main className="w-full">
        <Hero />
        <Features />
        <Philosophy />
        <ProtocolSection />
        <Membership />
      </main>
      <Footer />
    </div>
  );
}
