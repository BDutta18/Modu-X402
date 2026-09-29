const integrations = [
  { name: "Algorand", category: "Layer-1 Blockchain" },
  { name: "Circle USDC (ASA)", category: "Payment Asset" },
  { name: "ALGO Native", category: "Settlement Asset" },
  { name: "Pera Wallet", category: "Algorand Signer" },
  { name: "Defly Wallet", category: "Mobile Wallet" },
  { name: "Lute Wallet", category: "Web Signer" },
  { name: "algosdk", category: "TypeScript SDK" },
  { name: "py-algorand-sdk", category: "Python SDK" },
  { name: "Claude MCP", category: "AI Tool Protocol" },
  { name: "Vercel AI SDK", category: "Agent Framework" },
  { name: "LangChain", category: "Agent Framework" },
  { name: "Fastify & Prisma", category: "Control Plane" },
  { name: "Docker Compose", category: "Deployment" },
  { name: "Render & Railway", category: "Cloud Hosting" },
];

export function IntegrationsSection() {
  return (
    <section id="integrations" className="py-24 lg:py-36 overflow-hidden bg-background">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-16 lg:mb-20 text-center">
        <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
          <span className="w-8 h-px bg-foreground/30" />
          Ecosystem
          <span className="w-8 h-px bg-foreground/30" />
        </span>
        <h2 className="text-4xl lg:text-6xl font-display tracking-tight text-foreground mb-4">
          Works with what you already run.
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          From Algorand native wallets to autonomous AI agents, modu fits into any modern developer stack.
        </p>
      </div>

      {/* Marquee Row 1 */}
      <div className="w-full mb-6 overflow-hidden">
        <div className="flex gap-6 marquee whitespace-nowrap">
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex gap-6 shrink-0">
              {integrations.map((item) => (
                <div
                  key={`${item.name}-${setIdx}`}
                  className="px-8 py-5 border border-foreground/10 rounded-xl bg-card hover:border-foreground/30 hover:bg-muted/30 transition-colors"
                >
                  <div className="text-base font-semibold text-foreground">{item.name}</div>
                  <div className="text-xs font-mono text-muted-foreground mt-0.5">{item.category}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Row 2 (Reverse) */}
      <div className="w-full overflow-hidden">
        <div className="flex gap-6 marquee-reverse whitespace-nowrap">
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex gap-6 shrink-0">
              {[...integrations].reverse().map((item) => (
                <div
                  key={`${item.name}-rev-${setIdx}`}
                  className="px-8 py-5 border border-foreground/10 rounded-xl bg-card hover:border-foreground/30 hover:bg-muted/30 transition-colors"
                >
                  <div className="text-base font-semibold text-foreground">{item.name}</div>
                  <div className="text-xs font-mono text-muted-foreground mt-0.5">{item.category}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
