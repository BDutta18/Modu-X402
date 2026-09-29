import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Algorand TestNet",
    description: "For development, hackathons & testing",
    price: "Free",
    period: "forever",
    features: [
      "Algorand TestNet settlement",
      "Unlimited test requests",
      "Free TestNet dispenser tokens",
      "Full CLI and control-plane API",
      "Live playground testing",
    ],
    cta: "Start on TestNet",
    href: "/app/cli-auth",
    popular: false,
  },
  {
    name: "Algorand MainNet",
    description: "Direct on-chain settlement at production scale",
    price: "<$0.001",
    period: "per settlement gas",
    features: [
      "Zero platform commission",
      "Circle USDC (ASA 31566704) & ALGO",
      "~3s deterministic settlement",
      "Non-custodial direct payouts",
      "Live request log stream via SSE",
      "Instant route revocation (410 Gone)",
    ],
    cta: "Launch on MainNet",
    href: "/app/cli-auth",
    popular: true,
  },
  {
    name: "Self-Hosted",
    description: "Run your own reverse proxy infrastructure",
    price: "100%",
    period: "open source",
    features: [
      "Complete monorepo source code",
      "Docker compose & Dockerfiles",
      "One-click Render & Railway templates",
      "Custom facilitator integration",
      "Self-managed Indexer RPC endpoints",
      "No telemetry or external tracking",
    ],
    cta: "View on GitHub",
    href: "https://github.com/rupamghosh2006/modu",
    popular: false,
    external: true,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 lg:py-36 border-t border-foreground/10 bg-background">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-2xl mb-16 lg:mb-20">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase block mb-3">
            Economics
          </span>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tight text-foreground mb-6 leading-tight">
            Pay per request.
            <br />
            <span className="text-stroke">No monthly fees.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A native settlement rail for machine APIs. Pay only network gas on Algorand.
          </p>
        </div>

        {/* 3-column Grid */}
        <div className="grid md:grid-cols-3 gap-px bg-foreground/15 border border-foreground/15">
          {plans.map((plan, idx) => (
            <div
              key={plan.name}
              className={`p-8 lg:p-12 bg-background flex flex-col justify-between ${
                plan.popular ? "relative bg-card shadow-sm" : ""
              }`}
            >
              <div>
                {plan.popular && (
                  <span className="inline-block px-3 py-1 bg-foreground text-background text-[11px] font-mono uppercase tracking-widest rounded-full mb-6">
                    Production Standard
                  </span>
                )}
                <div className="mb-6">
                  <span className="font-mono text-xs text-muted-foreground">0{idx + 1}</span>
                  <h3 className="font-display text-2xl lg:text-3xl text-foreground mt-2">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{plan.description}</p>
                </div>

                <div className="mb-8 pb-6 border-b border-foreground/10">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-4xl lg:text-5xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-10">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-xs text-muted-foreground">
                      <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.external ? (
                <a
                  href={plan.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full border border-foreground/20 hover:bg-foreground/5 text-foreground text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  {plan.cta}
                  <ArrowRight size={13} />
                </a>
              ) : (
                <Link
                  to={plan.href}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                    plan.popular
                      ? "bg-foreground hover:bg-foreground/90 text-background"
                      : "border border-foreground/20 hover:bg-foreground/5 text-foreground"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight size={13} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
