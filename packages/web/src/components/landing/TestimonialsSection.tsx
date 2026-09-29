import { useEffect, useState } from "react";

const useCases = [
  {
    quote: "Modu lets our autonomous agents pay per inference call without API key sharing or credit card accounts. Pure machine-to-machine commerce.",
    title: "Autonomous AI Agents",
    role: "AI Agent Orchestration",
    metric: "Zero API keys needed",
  },
  {
    quote: "We wrapped our real-time financial order book feed behind Modu in 30 seconds. Clients pay 0.05 USDC per query with 3-second finality.",
    title: "Proprietary Data Feeds",
    role: "Quantitative Market Data",
    metric: "3s Settlement",
  },
  {
    quote: "Instead of complex monthly billing tiers, we bill per model generation. Modu streams the completions verbatim and deposits USDC straight to our wallet.",
    title: "Per-Call Model Inference",
    role: "GPU Cloud Service",
    metric: "Zero platform escrow",
  },
  {
    quote: "No Stripe KYC, no subscription churn, no unpaid invoices. Every request is settled atomically on Algorand before reaching our backend.",
    title: "Micro-SaaS & Developer APIs",
    role: "Developer Tooling",
    metric: "Sub-cent fees",
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % useCases.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  const active = useCases[activeIndex];

  return (
    <section className="py-24 lg:py-36 border-t border-foreground/10 bg-background">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-16">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Use Cases
          </span>
          <div className="flex-1 h-px bg-foreground/10" />
          <span className="font-mono text-xs text-muted-foreground">
            {String(activeIndex + 1).padStart(2, "0")} / {String(useCases.length).padStart(2, "0")}
          </span>
        </div>

        {/* Main Quote & Details */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-end">
          <div className="lg:col-span-8">
            <blockquote className="min-h-[160px] flex items-center">
              <p className="font-display text-3xl md:text-5xl lg:text-5xl leading-[1.15] tracking-tight text-foreground">
                "{active.quote}"
              </p>
            </blockquote>

            <div className="mt-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-display text-xl">
                {active.title.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-foreground text-base">{active.title}</p>
                <p className="text-sm text-muted-foreground">{active.role}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 p-8 border border-foreground/10 rounded-2xl bg-card">
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
              Key Advantage
            </div>
            <div className="font-display text-3xl text-foreground font-semibold mb-4">
              {active.metric}
            </div>
            <div className="flex gap-2">
              {useCases.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === i ? "w-8 bg-foreground" : "w-2 bg-foreground/20"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
