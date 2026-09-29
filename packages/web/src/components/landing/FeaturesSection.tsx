import { useEffect, useRef, useState } from "react";

const features = [
  {
    number: "01",
    title: "x402 Reverse Proxy Protocol",
    description: "Any HTTP endpoint returns 402 Payment Required with an Algorand USDC/ALGO price. Consumers pay via atomic transaction group; the facilitator co-signs and settles on-chain.",
    visual: "deploy",
  },
  {
    number: "02",
    title: "Streaming Passthrough & Instant Revoke",
    description: "Modu edge proxies stream responses verbatim with zero buffer latency. Revoke compromised or deprecated routes instantly; requests return 410 Gone immediately.",
    visual: "stream",
  },
  {
    number: "03",
    title: "Replay Protection & Indexer Verification",
    description: "Every payment nonce and transaction ID is single-use. Verified on Algorand Indexer against receiver, amount, and round window before origin forwarding.",
    visual: "replay",
  },
  {
    number: "04",
    title: "Non-Custodial Key Architecture",
    description: "Private keys are generated locally and stored in ~/.modu/config.json with strict 0600 permissions. Modu never sees, touches, or stores your private keys.",
    visual: "security",
  },
];

function DeployVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full text-foreground">
      <defs>
        <clipPath id="deployClip">
          <rect x="30" y="20" width="140" height="120" rx="4" />
        </clipPath>
      </defs>
      <rect x="30" y="20" width="140" height="120" rx="4" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
      <g clipPath="url(#deployClip)">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x="40"
            y={35 + i * 16}
            width="120"
            height="10"
            rx="2"
            fill="currentColor"
            opacity="0.12"
          >
            <animate attributeName="opacity" values="0.12;0.7;0.12" dur="2s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
            <animate attributeName="width" values="30;120;30" dur="2s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
          </rect>
        ))}
      </g>
      <circle cx="100" cy="155" r="3" fill="currentColor" opacity="0.4">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function StreamVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full text-foreground">
      {/* Central node */}
      <circle cx="100" cy="80" r="14" fill="currentColor">
        <animate attributeName="r" values="13;15;13" dur="2.5s" repeatCount="indefinite" />
      </circle>
      {/* Orbiting nodes */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * 60) * (Math.PI / 180);
        const radius = 50;
        const x = 100 + Math.cos(angle) * radius;
        const y = 80 + Math.sin(angle) * radius;
        return (
          <g key={i}>
            <line
              x1="100"
              y1="80"
              x2={x.toFixed(4)}
              y2={y.toFixed(4)}
              stroke="currentColor"
              strokeWidth="1.5"
              opacity="0.25"
            >
              <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2s" begin={`${i * 0.25}s`} repeatCount="indefinite" />
            </line>
            <circle cx={x.toFixed(4)} cy={y.toFixed(4)} r="6" fill="none" stroke="currentColor" strokeWidth="2">
              <animate attributeName="r" values="5;7;5" dur="2s" begin={`${i * 0.25}s`} repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}
    </svg>
  );
}

function ReplayVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full text-foreground">
      <rect x="25" y="65" width="40" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      <rect x="80" y="55" width="40" height="50" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="135" y="65" width="40" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      {/* Flowing dots */}
      {[0, 1, 2].map((i) => (
        <circle key={i} cy="80" r="3.5" fill="currentColor">
          <animate
            attributeName="cx"
            values="45;100;155"
            dur="2.5s"
            begin={`${i * 0.8}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.2;1;0.2"
            dur="2.5s"
            begin={`${i * 0.8}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
      <path d="M 65 80 L 80 80 M 120 80 L 135 80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
    </svg>
  );
}

function SecurityVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full text-foreground">
      {/* Outer shield outline */}
      <path
        d="M 100 25 L 145 45 L 145 85 C 145 115 100 135 100 135 C 100 135 55 115 55 85 L 55 45 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Inner pulsing keyhole */}
      <circle cx="100" cy="70" r="10" fill="none" stroke="currentColor" strokeWidth="2">
        <animate attributeName="r" values="9;11;9" dur="2s" repeatCount="indefinite" />
      </circle>
      <path d="M 96 76 L 104 76 L 106 95 L 94 95 Z" fill="currentColor" opacity="0.8" />
    </svg>
  );
}

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
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

  const visuals: Record<string, JSX.Element> = {
    deploy: <DeployVisual />,
    stream: <StreamVisual />,
    replay: <ReplayVisual />,
    security: <SecurityVisual />,
  };

  return (
    <section id="features" ref={sectionRef} className="py-24 lg:py-36 border-t border-foreground/10 bg-background">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-20 max-w-2xl">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
            <span className="w-8 h-px bg-foreground/30" />
            Core Capabilities
          </span>
          <h2 className="text-4xl lg:text-6xl font-display tracking-tight text-foreground leading-[1.05]">
            Engineered for payments at the edge.
          </h2>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-foreground/10 border border-foreground/10">
          {features.map((feature, idx) => (
            <div
              key={feature.number}
              onMouseEnter={() => setActiveFeature(idx)}
              className={`p-8 lg:p-10 bg-background transition-colors duration-300 flex flex-col justify-between min-h-[380px] group ${
                activeFeature === idx ? "bg-muted/40" : "hover:bg-muted/20"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-xs text-muted-foreground">{feature.number}</span>
                  <span className="w-2 h-2 rounded-full bg-foreground/20 group-hover:bg-foreground transition-colors" />
                </div>
                <h3 className="font-display text-2xl lg:text-3xl text-foreground mb-4 leading-snug">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="w-full h-32 mt-8 opacity-70 group-hover:opacity-100 transition-opacity">
                {visuals[feature.visual]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
