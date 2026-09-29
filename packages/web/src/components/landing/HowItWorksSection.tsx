import { useEffect, useRef, useState } from "react";
import { Terminal } from "lucide-react";

const steps = [
  {
    number: "I",
    title: "Authenticate & Connect Wallet",
    description: "Run `modu login` in your terminal to approve access in your browser. Connect an Algorand address for payouts — private keys remain local.",
    code: `# Install CLI globally
npm install -g modu

# Authorize session in browser
modu login

# Connect your Algorand payout address
modu wallet connect ALGO6XK7MNPQR2WXYZ34567890ABCDEFGH`,
  },
  {
    number: "II",
    title: "Register Any Origin API",
    description: "Point modu at your existing API endpoint. Specify your price in USDC or ALGO. Receive an instant proxy route with automatic x402 enforcement.",
    code: `# Register your API behind the reverse proxy
modu register \\
  --url https://api.myfeed.com \\
  --price 0.01 \\
  --asset USDC \\
  --path weather

# Output:
# ✓ Live proxy: https://modu-proxy.onrender.com/p/weather`,
  },
  {
    number: "III",
    title: "Consumer Pays & Streams",
    description: "Clients query your endpoint, receive a 402 challenge, pay on Algorand TestNet or MainNet, and retry with the proof to stream origin data verbatim.",
    code: `# 1. Initial request returns 402 challenge
curl https://modu-proxy.onrender.com/p/weather
# -> HTTP/1.1 402 Payment Required

# 2. Pay 0.01 USDC on Algorand & retry
curl -H "X-Payment: <signed-payload>" \\
  https://modu-proxy.onrender.com/p/weather
# -> HTTP/1.1 200 OK + X-Payment-Response: {"status":"settled"}`,
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-24 lg:py-36 bg-zinc-950 text-white overflow-hidden"
    >
      {/* Diagonal lines pattern */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 40px,
              currentColor 40px,
              currentColor 41px
            )`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-zinc-400 mb-4">
            <span className="w-8 h-px bg-white/40" />
            Execution Flow
          </span>
          <h2
            className={`text-4xl lg:text-6xl font-display tracking-tight text-white transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            One command.
            <br />
            <span className="text-zinc-500">Zero payment code.</span>
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Step Selector */}
          <div className="lg:col-span-5 space-y-4">
            {steps.map((step, idx) => (
              <button
                key={step.number}
                onClick={() => setActiveStep(idx)}
                className={`w-full text-left p-6 lg:p-8 rounded-2xl border transition-all duration-300 ${
                  activeStep === idx
                    ? "bg-white/10 border-white/30 shadow-lg"
                    : "border-transparent hover:bg-white/5 text-zinc-400"
                }`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded border border-white/20 text-white">
                    {step.number}
                  </span>
                  <h3 className="font-display text-2xl text-white font-semibold">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {step.description}
                </p>
              </button>
            ))}
          </div>

          {/* Interactive MacBook Terminal Preview */}
          <div className="lg:col-span-7 mac-terminal">
            {/* Titlebar with Traffic Lights */}
            <div className="mac-titlebar flex items-center justify-between">
              <div className="mac-traffic-lights">
                <span className="mac-dot mac-dot-close" />
                <span className="mac-dot mac-dot-minimize" />
                <span className="mac-dot mac-dot-maximize" />
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <Terminal size={12} className="text-zinc-500" />
                <span>developer@macbook: ~/project — step {steps[activeStep].number}</span>
              </div>

              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                bash
              </span>
            </div>

            <pre className="p-6 lg:p-8 font-mono text-[13px] leading-relaxed text-zinc-200 overflow-x-auto min-h-[220px] bg-[#0a0c10]">
              <code>{steps[activeStep].code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
