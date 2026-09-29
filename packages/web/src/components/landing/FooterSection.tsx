import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { AnimatedWave } from "../canvas/AnimatedWave";
import { GITHUB_URL } from "../../config";

interface FooterLink {
  name: string;
  href: string;
  external?: boolean;
}

const footerLinks: Record<string, FooterLink[]> = {
  Product: [
    { name: "Features", href: "#features" },
    { name: "How it works", href: "#how-it-works" },
    { name: "Infrastructure", href: "#infrastructure" },
    { name: "Playground", href: "/playground" },
    { name: "Dashboard", href: "/app/endpoints" },
  ],
  Developers: [
    { name: "Documentation", href: "/docs" },
    { name: "CLI Reference", href: "/docs" },
    { name: "GitHub Monorepo", href: GITHUB_URL, external: true },
    { name: "x402 Protocol", href: "https://x402.org", external: true },
  ],
  Algorand: [
    { name: "Algorand Network", href: "https://algorand.co", external: true },
    { name: "TestNet Dispenser", href: "https://testnet.algoexplorer.io/dispenser", external: true },
    { name: "Circle USDC (ASA)", href: "https://allo.info/asset/31566704", external: true },
    { name: "Pera Explorer", href: "https://explorer.perawallet.app", external: true },
  ],
  Hackathon: [
    { name: "Global x402 on Algorand", href: "https://x402.org", external: true },
    { name: "Submission Repo", href: GITHUB_URL, external: true },
    { name: "Apache 2.0 License", href: `${GITHUB_URL}/blob/main/LICENSE`, external: true },
  ],
};

export function FooterSection() {
  return (
    <footer className="relative border-t border-foreground/10 bg-background overflow-hidden pt-16 pb-12">
      {/* Animated wave background */}
      <div className="absolute inset-0 h-72 opacity-25 pointer-events-none overflow-hidden">
        <AnimatedWave />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 lg:gap-8 pb-16">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <img src="/logo.png" alt="modu logo" className="w-8 h-8 object-contain rounded-md" />
              <span className="text-2xl font-display font-bold text-foreground">modu</span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              Edge reverse proxy and pay-per-request infrastructure for the Algorand agent economy.
              Monetize any HTTP API with zero payment code.
            </p>

            <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Algorand TestNet & MainNet
              </span>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground mb-4">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                      >
                        {link.name}
                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </a>
                    ) : link.href.startsWith("#") ? (
                      <a
                        href={link.href}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-mono">
          <p>© 2026 modu. Built for Global x402 on Algorand.</p>
          <div className="flex gap-6">
            <Link to="/docs" className="hover:text-foreground">Docs</Link>
            <Link to="/playground" className="hover:text-foreground">Playground</Link>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
