import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import { AnimatedSphere } from "../canvas/AnimatedSphere";
import { MacbookTerminal } from "../terminal/MacbookTerminal";

const words = ["pay", "monetize", "stream", "settle"];

const marqueeStats = [
  { value: "0 lines", label: "Payment code required" },
  { value: "~3s", label: "Deterministic finality" },
  { value: "<$0.001", label: "Per settlement on Algorand" },
  { value: "x402 v2", label: "Open exact AVM protocol" },
  { value: "USDC & ALGO", label: "Native on-chain assets" },
  { value: "100%", label: "Non-custodial private keys" },
  { value: "410", label: "Instant route revocation" },
  { value: "SSE", label: "Real-time log streaming" },
];

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-28 pb-16 bg-white text-black">
      {/* Animated sphere background in upper corner */}
      <div className="absolute right-[-6%] top-20 w-[550px] h-[550px] lg:w-[750px] lg:h-[750px] opacity-25 pointer-events-none">
        <AnimatedSphere />
      </div>

      {/* Subtle crisp grid lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
        {[...Array(8)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-black/[0.06]"
            style={{
              top: `${12.5 * (i + 1)}%`,
              left: 0,
              right: 0,
            }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-black/[0.06]"
            style={{
              left: `${8.33 * (i + 1)}%`,
              top: 0,
              bottom: 0,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 pt-8 pb-16">
        {/* Eyebrow */}
        <div
          className={`mb-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-zinc-600">
            <span className="w-8 h-px bg-black/40" />
            x402 payment infrastructure for Algorand
          </span>
        </div>

        {/* Main headline */}
        <div className="mb-10">
          <h1
            className={`text-[clamp(2.75rem,9.5vw,8rem)] font-display leading-[0.9] tracking-tight text-black transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="block">The layer to</span>
            <span className="block">
              {" "}
              <span className="relative inline-block">
                <span key={wordIndex} className="inline-flex">
                  {words[wordIndex].split("").map((char, i) => (
                    <span
                      key={`${wordIndex}-${i}`}
                      className="inline-block animate-char-in"
                      style={{
                        animationDelay: `${i * 45}ms`,
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-black/10" />
              </span>
            </span>
          </h1>
        </div>

        {/* Description + CTAs */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-end mb-16">
          <p
            className={`text-xl lg:text-2xl text-zinc-600 leading-relaxed max-w-xl transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Turn any HTTP API into a pay-per-request endpoint settled in USDC or ALGO
            on Algorand in ~3 seconds. Zero payment code required.
          </p>

          <div
            className={`flex flex-col sm:flex-row items-start gap-4 transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <button
              onClick={() => navigate("/app/cli-auth")}
              className="inline-flex items-center justify-center bg-black hover:bg-zinc-800 text-white px-8 h-14 text-base font-medium rounded-full transition-transform hover:-translate-y-0.5 group shadow-lg"
            >
              Start integrating
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
            <Link
              to="/playground"
              className="inline-flex items-center justify-center h-14 px-8 text-base font-medium rounded-full border border-black/20 hover:bg-black/5 text-black transition-colors"
            >
              <Zap className="w-4 h-4 mr-2 text-teal-600" />
              Try playground
            </Link>
          </div>
        </div>

        {/* MacBook Live Terminal Showcase */}
        <div
          className={`transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="mb-4 text-center">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live macOS Terminal Demonstration
            </span>
          </div>
          <MacbookTerminal />
        </div>
      </div>

      {/* Marquee ticker */}
      <div
        className={`w-full mt-10 border-y border-black/[0.08] py-4 bg-zinc-50/50 backdrop-blur-sm transition-all duration-700 delay-500 overflow-hidden ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex gap-16 marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16 shrink-0 items-center">
              {marqueeStats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="font-display text-2xl text-black font-semibold">
                    {stat.value}
                  </span>
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-black/20 ml-8" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
