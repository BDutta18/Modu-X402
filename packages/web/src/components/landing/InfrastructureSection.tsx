import { useEffect, useState, useRef } from "react";

const nodes = [
  { name: "Algorand TestNet", role: "Primary Settlement", latency: "~2.8s" },
  { name: "Algorand MainNet", role: "Production Rail", latency: "~3.1s" },
  { name: "Modu Edge Proxy", role: "Reverse Gateway", latency: "<20ms" },
  { name: "Algorand Indexer", role: "Transaction Verification", latency: "<40ms" },
  { name: "Facilitator (Goplausible)", role: "x402 Exact Settlement", latency: "<80ms" },
  { name: "Modu Control Plane", role: "Session & Auth API", latency: "<45ms" },
];

export function InfrastructureSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeNode, setActiveNode] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

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
      setActiveNode((prev) => (prev + 1) % nodes.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-36 overflow-hidden bg-background">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left content */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
              <span className="w-8 h-px bg-foreground/30" />
              Infrastructure
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-6">
              Algorand-native
              <br />
              by design.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg">
              Sub-cent transactions, ~3s deterministic finality, and native Circle USDC
              ASA make pay-per-request API commerce viable at global scale.
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-foreground/10">
              <div>
                <div className="text-3xl lg:text-4xl font-display mb-1 text-foreground">&lt;$0.001</div>
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Tx Fee</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-display mb-1 text-foreground">~3s</div>
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Finality</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-display mb-1 text-foreground">100%</div>
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Non-custodial</div>
              </div>
            </div>
          </div>

          {/* Right status board */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="border border-foreground/10 rounded-xl overflow-hidden bg-card shadow-sm">
              <div className="px-6 py-4 border-b border-foreground/10 flex items-center justify-between bg-muted/30">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Network Health
                </span>
                <span className="flex items-center gap-2 text-xs font-mono text-emerald-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  All Systems Operational
                </span>
              </div>

              <div>
                {nodes.map((node, index) => (
                  <div
                    key={node.name}
                    className={`px-6 py-4 border-b border-foreground/5 last:border-b-0 flex items-center justify-between transition-colors duration-200 ${
                      activeNode === index ? "bg-muted/40" : "hover:bg-muted/15"
                    }`}
                  >
                    <div>
                      <div className="font-medium text-sm text-foreground">{node.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{node.role}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-muted-foreground">{node.latency}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
