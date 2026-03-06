"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Network, 
  Cpu, 
  Image as ImageIcon, 
  Terminal, 
  Layers, 
  BookOpen, 
  ShieldCheck,
  ChevronDown
} from "lucide-react";

const slides = [
  {
    id: "hero",
    title: "Strategic Overview of the Google Gemini Ecosystem",
    subtitle: "A significant leap in multimodal AI capabilities, from on-device models to highly complex reasoning systems.",
    icon: <Network className="w-12 h-12 text-blue-400 mb-6" />,
    bg: "/assets/gemini-deck/gemini_hero_bg.png",
    content: (
      <div className="space-y-6 text-lg text-gray-200">
        <p>
          The Google Gemini ecosystem represents a paradigm shift. Central to recent developer and business interest is <strong className="text-white">Gemini 2.5 Flash</strong> and its image generation variant, <strong className="text-white">"Nano Banana,"</strong> alongside the <strong className="text-white">Gemini CLI</strong>, which offers a massive 1M+ token context window.
        </p>
        <p>
          Strategic workflows now treat Gemini as a specialized "reader" or "researcher" within larger agentic environments like Claude Code, leveraging superior context handling alongside other models&apos; autonomous editing strengths.
        </p>
      </div>
    )
  },
  {
    id: "models",
    title: "1. The Gemini Model Family",
    subtitle: "Structured to address varied computational requirements.",
    icon: <Cpu className="w-12 h-12 text-purple-400 mb-6" />,
    bg: "/assets/gemini-deck/gemini_models_bg.png",
    content: (
      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
          <h3 className="text-xl font-bold text-white mb-2">Gemini Ultra</h3>
          <p className="text-sm text-gray-300">The most capable model for complex reasoning. First to achieve human-expert performance on the MMLU benchmark.</p>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
          <h3 className="text-xl font-bold text-white mb-2">Gemini Pro</h3>
          <p className="text-sm text-gray-300">Performance-optimized delivering a balance of cost, latency, and reasoning across broad multimodal tasks.</p>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
          <h3 className="text-xl font-bold text-white mb-2">Gemini Nano</h3>
          <p className="text-sm text-gray-300">Tailored for on-device deployment. Excels in summarization and text completion in memory-constrained environments.</p>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
          <h3 className="text-xl font-bold text-white mb-2">Gemini 2.5 Flash</h3>
          <p className="text-sm text-gray-300">Optimized for speed and high-frequency tasks, featuring specialized variants for image generation.</p>
        </div>
      </div>
    )
  },
  {
    id: "nano-banana",
    title: "2. Gemini 2.5 Flash Image",
    subtitle: "Codename: 'Nano Banana'",
    icon: <ImageIcon className="w-12 h-12 text-yellow-400 mb-6" />,
    bg: "/assets/gemini-deck/gemini_claude_bg.png",
    content: (
      <div className="space-y-6">
        <p className="text-lg text-gray-200">
          Gaining massive traction for its precision in following complex image prompts and competitive pricing ($0.039 per image).
        </p>
        <ul className="space-y-4 text-gray-300">
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2"></div>
            <div><strong className="text-white">Character Consistency:</strong> Maintains the appearance of a character across scenes via the <code className="text-yellow-200 bg-white/10 px-1 rounded">maintainCharacterConsistency</code> flag.</div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2"></div>
            <div><strong className="text-white">Image Blending & Text:</strong> Naturally combines multiple input elements and drastically improves spelling and text rendering within visuals.</div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2"></div>
            <div><strong className="text-white">Advanced Hacks:</strong> Aspect Ratio Extension via blank frames, Multi-Referencing via contact sheets, and targeted Camera Rotations.</div>
          </li>
        </ul>
      </div>
    )
  },
  {
    id: "cli",
    title: "3. Gemini CLI Architecture",
    subtitle: "A high-powered AI agent with hierarchical configuration.",
    icon: <Terminal className="w-12 h-12 text-green-400 mb-6" />,
    bg: "/assets/gemini-deck/gemini_hero_bg.png",
    content: (
      <div className="flex gap-8 items-center mt-6">
        <div className="flex-1 space-y-4">
          <h3 className="text-xl font-semibold text-white">Precedence Order</h3>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 marker:text-green-400">
            <li>Command-Line Arguments</li>
            <li>Environment Variables (.env)</li>
            <li>System Settings File</li>
            <li>Project Settings (.gemini/settings.json)</li>
            <li>User Settings (~/.gemini/settings.json)</li>
            <li>System Defaults</li>
          </ol>
        </div>
        <div className="flex-1 space-y-4">
          <h3 className="text-xl font-semibold text-white">Auth & Context</h3>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li className="bg-white/5 p-3 rounded-lg border border-white/10"><strong className="text-white block">Google Credentials (ADC)</strong> Recommended default for local development.</li>
            <li className="bg-white/5 p-3 rounded-lg border border-white/10"><strong className="text-white block">Service Account Impersonation</strong> Secure enterprise environments.</li>
            <li className="bg-white/5 p-3 rounded-lg border border-white/10"><strong className="text-white block">Hierarchical Context</strong> Loads GEMINI.md globally, ancestrally, and locally.</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: "integration",
    title: "4. Strategic Integration",
    subtitle: "The Gemini & Claude Code Hybrid Workflow",
    icon: <Layers className="w-12 h-12 text-orange-400 mb-6" />,
    bg: "/assets/gemini-deck/gemini_claude_bg.png",
    content: (
      <div className="space-y-6 text-gray-200">
        <p className="text-lg">
          Power users combine Gemini&apos;s 1M+ context window with the autonomous editing capabilities of Anthropic&apos;s Claude Code.
        </p>
        <div className="bg-black/40 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-orange-500/10 mix-blend-overlay"></div>
          <h3 className="text-white font-bold mb-4 relative z-10">The Implementation Workflow:</h3>
          <div className="flex justify-between items-center relative z-10">
            <div className="text-center p-4">
              <div className="text-orange-400 font-bold text-xl mb-1">1. Claude Plans</div>
              <div className="text-sm text-gray-400">High-level design</div>
            </div>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-orange-500/50 to-blue-500/50 mx-4"></div>
            <div className="text-center p-4">
              <div className="text-blue-400 font-bold text-xl mb-1">2. Gemini Reads</div>
              <div className="text-sm text-gray-400">Sifts massive context</div>
            </div>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-500/50 to-orange-500/50 mx-4"></div>
            <div className="text-center p-4">
              <div className="text-orange-400 font-bold text-xl mb-1">3. Claude Edits</div>
              <div className="text-sm text-gray-400">Code implementation</div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "tools",
    title: "5. Specialized Tools & Workflows",
    subtitle: "Elevating research and interactive learning.",
    icon: <BookOpen className="w-12 h-12 text-emerald-400 mb-6" />,
    bg: "/assets/gemini-deck/gemini_models_bg.png",
    content: (
      <div className="grid grid-cols-3 gap-6 mt-8">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-bold text-emerald-400 mb-3">NotebookLM</h3>
          <p className="text-sm text-gray-300 mb-3">The "librarian" of the ecosystem. Grounded research environment with automatic citations.</p>
          <div className="text-xs bg-emerald-500/20 text-emerald-200 px-2 py-1 rounded inline-block">Audio Overviews</div>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-bold text-emerald-400 mb-3">Deep Research Mode</h3>
          <p className="text-sm text-gray-300">Autonomous, well-sourced web research bypassing sponsored ads to compile comprehensive data tables.</p>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-bold text-emerald-400 mb-3">Canvas Mode</h3>
          <p className="text-sm text-gray-300">Interactive digital workspace. Edit responses inline, take interactive quizzes, and correct generated code.</p>
        </div>
      </div>
    )
  },
  {
    id: "tech",
    title: "6. Technical Specs & Security",
    subtitle: "Enterprise-grade deployment and sandboxing.",
    icon: <ShieldCheck className="w-12 h-12 text-rose-400 mb-6" />,
    bg: "/assets/gemini-deck/gemini_hero_bg.png",
    content: (
      <div className="flex flex-col gap-6 mt-4">
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-white font-bold mb-2">System Specs</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• OS: macOS 15+, Win 11 24H2+, Ubuntu 20.04+</li>
              <li>• RAM: 4GB+ (16GB+ recommended for large bases)</li>
              <li>• Runtime: Node.js 20.0.0+</li>
            </ul>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-white font-bold mb-2">Structured Output</h3>
            <p className="text-sm text-gray-300">
              Enforce type-safe responses using Instructor. Note: Enum mapping and complex Union type limitations exist but are easily managed post-extraction.
            </p>
          </div>
        </div>
        <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl">
          <h3 className="text-rose-400 font-bold mb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            Security & Sandboxing
          </h3>
          <p className="text-sm text-gray-300 mb-2">Executes potentially unsafe operations in an isolated environment:</p>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• <strong>Docker/Podman:</strong> Uses pre-built <code className="bg-black/30 px-1 rounded">gemini-cli-sandbox</code>.</li>
            <li>• <strong>Env Redaction:</strong> Auto-redacts SECRET, PASSWORD, or KEY to prevent model leakage.</li>
            <li>• <strong>Seatbelt (macOS):</strong> Strict-open, restrictive-open permission controls.</li>
          </ul>
        </div>
      </div>
    )
  }
];

export default function GeminiPresentation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  return (
    <div 
      ref={containerRef}
      className="h-screen w-full overflow-y-auto snap-y snap-mandatory bg-black text-white scroll-smooth"
    >
      <div className="fixed top-8 left-8 z-50 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
          <Network className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold tracking-widest text-sm uppercase text-white/80">Apex AI Ops</span>
      </div>

      <motion.div 
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce text-white/50 flex flex-col items-center gap-2"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
      >
        <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
        <ChevronDown className="w-5 h-5" />
      </motion.div>

      {slides.map((slide, index) => (
        <section 
          key={slide.id} 
          className="h-screen w-full snap-start relative flex items-center justify-center overflow-hidden"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image 
              src={slide.bg} 
              alt={slide.title} 
              fill 
              className="object-cover opacity-80"
              priority={index === 0}
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
          </div>

          {/* Glassmorphic Content Card */}
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.5 }}
            className="relative z-10 max-w-5xl w-full mx-6 p-10 md:p-14 rounded-[2rem] bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] overflow-hidden group"
          >
            {/* Subtle glow effect inside the card */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-[100px] group-hover:bg-white/10 transition-all duration-700 pointer-events-none"></div>

            {slide.icon}
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              {slide.title}
            </h2>
            
            <h4 className="text-xl md:text-2xl text-blue-300 font-medium mb-8">
              {slide.subtitle}
            </h4>
            
            <div className="prose prose-invert max-w-none">
              {slide.content}
            </div>
            
            {/* Slide Indicator */}
            <div className="absolute bottom-8 right-10 text-white/20 font-mono text-sm tracking-widest">
              {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </div>
          </motion.div>
        </section>
      ))}
    </div>
  );
}
