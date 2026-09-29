import { useState, useEffect, useRef } from "react";
import { Terminal as TerminalIcon, Play, RotateCcw, Copy, Check, Sparkles } from "lucide-react";

interface TerminalStep {
  cmd: string;
  output: { text: string; color?: string }[];
  delayAfter?: number;
}

const DEMO_STEPS: TerminalStep[] = [
  {
    cmd: "npm install -g modu",
    output: [
      { text: "added 1 package, and audited 48 packages in 780ms", color: "text-zinc-400" },
      { text: "✓ modu v2.1.0 installed to /usr/local/bin/modu", color: "text-emerald-400" },
    ],
    delayAfter: 1200,
  },
  {
    cmd: "modu login",
    output: [
      { text: "⚡ Opening browser for authorization handshake...", color: "text-amber-300" },
      { text: "  Session token: 7a8f09d2... (valid 15m)", color: "text-zinc-400" },
      { text: "  Waiting for browser approval...", color: "text-zinc-400" },
      { text: "✓ Authorization granted! API key saved to ~/.modu/config.json", color: "text-emerald-400" },
    ],
    delayAfter: 1500,
  },
  {
    cmd: "modu wallet connect ALGO6XK7MNPQR2WXYZ34567890ABCDEFGH",
    output: [
      { text: "✓ Payout address verified (Algorand Base32 Checksum valid)", color: "text-emerald-400" },
      { text: "  Settlement network: Algorand TestNet (CAIP-2: algorand:SGO1...)", color: "text-cyan-300" },
    ],
    delayAfter: 1400,
  },
  {
    cmd: "modu register --url https://api.myfeed.com/market --price 0.01 --asset USDC",
    output: [
      { text: "✓ Route registered behind modu reverse proxy!", color: "text-emerald-400" },
      { text: "  Proxy URL: https://modu-proxy.onrender.com/p/market", color: "text-cyan-300" },
      { text: "  Price:     0.01 USDC (10,000 micro-units ASA: 10458941)", color: "text-zinc-300" },
      { text: "  Scheme:    x402 v2 Exact AVM Settlement", color: "text-zinc-400" },
    ],
    delayAfter: 1800,
  },
  {
    cmd: "curl -i https://modu-proxy.onrender.com/p/market",
    output: [
      { text: "HTTP/1.1 402 Payment Required", color: "text-red-400 font-bold" },
      { text: "Content-Type: application/json", color: "text-zinc-400" },
      { text: "PAYMENT-REQUIRED: eyJ4NDAyVmVyc2lvbiI6MiwiYWNjZXB0cyI6W...==", color: "text-zinc-500" },
      { text: '{\n  "x402Version": 2,\n  "accepts": [{\n    "scheme": "exact",\n    "network": "algorand:SGO1...",\n    "amount": "10000",\n    "asset": "10458941",\n    "payTo": "ALGO6XK7MNPQR2WXYZ34567890ABCDEFGH"\n  }]\n}', color: "text-amber-200" },
    ],
    delayAfter: 2000,
  },
  {
    cmd: 'curl -H "X-Payment: <algorand-signed-payload>" https://modu-proxy.onrender.com/p/market',
    output: [
      { text: "HTTP/1.1 200 OK", color: "text-emerald-400 font-bold" },
      { text: 'X-Payment-Response: {"status":"settled","txid":"5G2QX...K9FA","amount":"10000"}', color: "text-cyan-300" },
      { text: '{\n  "symbol": "ALGO/USDC",\n  "price": 0.2845,\n  "volume24h": 48291000,\n  "timestamp": "2026-09-29T22:15:00Z"\n}', color: "text-emerald-200" },
    ],
    delayAfter: 3500,
  },
];

export function MacbookTerminal() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [history, setHistory] = useState<{ cmd: string; output: { text: string; color?: string }[] }[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [copied, setCopied] = useState(false);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  const currentStep = DEMO_STEPS[currentStepIndex];

  // Auto-typing effect
  useEffect(() => {
    if (!isAutoPlay) return;

    if (typedChars < currentStep.cmd.length) {
      const timeout = setTimeout(() => {
        setTypedChars((prev) => prev + 1);
      }, Math.floor(Math.random() * 25) + 35);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
      const delay = currentStep.delayAfter || 1500;
      const timeout = setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          { cmd: currentStep.cmd, output: currentStep.output },
        ]);
        setTypedChars(0);
        setIsTyping(true);

        if (currentStepIndex + 1 < DEMO_STEPS.length) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          // Loop after a pause
          setTimeout(() => {
            setHistory([]);
            setCurrentStepIndex(0);
          }, 3000);
        }
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [typedChars, currentStepIndex, isAutoPlay, currentStep]);

  // Auto-scroll
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history, typedChars]);

  const handleCopyAll = () => {
    const allText = history
      .map((h) => `$ ${h.cmd}\n${h.output.map((o) => o.text).join("\n")}`)
      .join("\n\n");
    navigator.clipboard.writeText(allText || currentStep.cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCommand = (stepIdx: number) => {
    setIsAutoPlay(false);
    setCurrentStepIndex(stepIdx);
    setTypedChars(DEMO_STEPS[stepIdx].cmd.length);
    setHistory((prev) => [
      ...prev,
      { cmd: DEMO_STEPS[stepIdx].cmd, output: DEMO_STEPS[stepIdx].output },
    ]);
  };

  const handleReset = () => {
    setHistory([]);
    setCurrentStepIndex(0);
    setTypedChars(0);
    setIsTyping(true);
    setIsAutoPlay(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mac-terminal">
      {/* MacBook Title Bar */}
      <div className="mac-titlebar flex items-center justify-between">
        {/* Traffic Light Buttons */}
        <div className="mac-traffic-lights">
          <span className="mac-dot mac-dot-close" title="Close" />
          <span className="mac-dot mac-dot-minimize" title="Minimize" />
          <span className="mac-dot mac-dot-maximize" title="Zoom" />
        </div>

        {/* Center Title */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <TerminalIcon size={12} className="text-zinc-500" />
          <span>developer@macbook: ~/project — zsh — 80×24</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1.5 transition-colors ${
              isAutoPlay
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
            title={isAutoPlay ? "Pause Auto Play" : "Resume Auto Play"}
          >
            <Play size={10} className={isAutoPlay ? "fill-emerald-300" : ""} />
            <span>{isAutoPlay ? "Live" : "Paused"}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            title="Reset Terminal"
          >
            <RotateCcw size={12} />
          </button>

          <button
            onClick={handleCopyAll}
            className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            title="Copy Terminal Text"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={terminalBodyRef}
        className="p-6 font-mono text-[13px] leading-relaxed max-h-[460px] min-h-[380px] overflow-y-auto space-y-4"
        style={{ background: "#0a0c10" }}
      >
        <div className="text-zinc-500 text-xs pb-1 border-b border-zinc-800/80 flex items-center justify-between">
          <span>Last login: Tue Sep 29 22:15:02 on ttys001</span>
          <span className="text-[10px] text-zinc-600">x402 v2 protocol</span>
        </div>

        {/* Previous History */}
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1.5 animate-fadeIn">
            <div className="flex items-center gap-2 text-zinc-200">
              <span className="text-emerald-400 font-bold">dev@macbook</span>
              <span className="text-zinc-500">:</span>
              <span className="text-cyan-400">~/project</span>
              <span className="text-zinc-400">$</span>
              <span className="text-white font-medium">{item.cmd}</span>
            </div>
            <div className="pl-4 space-y-0.5 text-xs whitespace-pre-wrap">
              {item.output.map((line, lIdx) => (
                <div key={lIdx} className={line.color || "text-zinc-300"}>
                  {line.text}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Current Typing Command */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-zinc-200">
            <span className="text-emerald-400 font-bold">dev@macbook</span>
            <span className="text-zinc-500">:</span>
            <span className="text-cyan-400">~/project</span>
            <span className="text-zinc-400">$</span>
            <span className="text-white font-medium">
              {currentStep.cmd.slice(0, typedChars)}
            </span>
            <span className="w-2 h-4 bg-emerald-400 animate-terminal-blink inline-block" />
          </div>
        </div>
      </div>

      {/* Interactive Command Presets Bar */}
      <div className="bg-[#12151e] border-t border-zinc-800/80 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 text-zinc-400">
          <Sparkles size={13} className="text-amber-400" />
          <span className="text-[11px] uppercase tracking-wider text-zinc-500 hidden sm:inline">Try command:</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {["modu login", "modu register", "curl 402", "pay & verify"].map((label, idx) => (
            <button
              key={label}
              onClick={() => handleRunCommand(idx + 1)}
              className="px-2.5 py-1 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors text-[11px]"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
