import { Shield, Lock, CheckCircle2, KeyRound } from "lucide-react";

const securityFeatures = [
  {
    icon: Shield,
    title: "Non-Custodial Settlement",
    description: "Modu never holds, aggregates, or escrows developer funds. Algorand USDC/ALGO transfers settle directly into your payout address.",
  },
  {
    icon: Lock,
    title: "Strict 0600 File Permissions",
    description: "Private keys generated via `modu wallet create` are saved locally with read/write restricted to your OS user. Never transmitted over HTTP.",
  },
  {
    icon: CheckCircle2,
    title: "Atomic Replay Defense",
    description: "Nonces and transaction IDs are marked spent upon verification. Algorand blockchain ledger rejects double-broadcast attempts natively.",
  },
  {
    icon: KeyRound,
    title: "On-Chain Indexer Verification",
    description: "Proxy queries Algorand Indexer independently to confirm block confirmation, correct receiver, and matching exact micro-unit amounts.",
  },
];

const standards = ["Algorand ASA", "x402 v2 Exact AVM", "Atomic Tx Groups", "SHA-256 Nonces", "Non-Custodial"];

export function SecuritySection() {
  return (
    <section id="security" className="py-24 lg:py-36 bg-muted/20 border-t border-foreground/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left info */}
          <div>
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
              <span className="w-8 h-px bg-foreground/30" />
              Security Architecture
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight text-foreground mb-6">
              Trust is
              <br />
              cryptographic.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Non-custodial by design. Keys stay on your machine, payments settle directly
              to your address, and replay protection is guaranteed on-chain.
            </p>

            <div className="flex flex-wrap gap-2.5">
              {standards.map((s) => (
                <span
                  key={s}
                  className="px-3.5 py-1.5 border border-foreground/15 rounded-lg text-xs font-mono text-foreground/80 bg-card"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Right feature cards */}
          <div className="grid gap-4">
            {securityFeatures.map((f) => (
              <div
                key={f.title}
                className="p-6 border border-foreground/10 rounded-xl bg-card hover:border-foreground/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-foreground/5 border border-foreground/10 flex items-center justify-center shrink-0">
                    <f.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-base mb-1.5">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
