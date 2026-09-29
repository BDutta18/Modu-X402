import { Github, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GITHUB_URL } from '../config';

const LINKS = {
  product: [
    { label: 'Playground', to: '/playground' },
    { label: 'Dashboard', to: '/app/endpoints' },
    { label: 'Documentation', to: '/docs' },
  ],
  resources: [
    { label: 'GitHub', href: GITHUB_URL },
    { label: 'Algorand', href: 'https://algorand.com' },
    { label: 'x402 Protocol', href: 'https://x402.org' },
    { label: 'TestNet Dispenser', href: 'https://testnet.algoexplorer.io/dispenser' },
  ],
  hackathon: [
    { label: 'Global x402 on Algorand', href: 'https://x402.org' },
    { label: 'Pera Wallet', href: 'https://perawallet.app' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="7" fill="#14b8a6" fillOpacity="0.15" />
                <rect x="0.5" y="0.5" width="27" height="27" rx="6.5" stroke="#14b8a6" strokeOpacity="0.4" />
                <text x="14" y="19" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="13" fill="#14b8a6">m</text>
              </svg>
              <span className="font-bold text-foreground">modu</span>
            </div>
            <p className="text-muted text-sm leading-relaxed max-w-[200px]">
              Monetize any HTTP API with pay-per-request on Algorand. Zero payment code.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground transition-colors" aria-label="GitHub">
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-2 mb-3">Product</h4>
            <ul className="space-y-2">
              {LINKS.product.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-muted hover:text-foreground transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-2 mb-3">Resources</h4>
            <ul className="space-y-2">
              {LINKS.resources.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-foreground transition-colors inline-flex items-center gap-1">
                    {label}
                    <ExternalLink size={11} className="opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Hackathon */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-2 mb-3">Hackathon</h4>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-accent-500/10 border border-accent-500/20 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
              <span className="text-xs font-semibold text-accent-400">Global x402 · Algorand</span>
            </div>
            <ul className="space-y-2 mt-2">
              {LINKS.hackathon.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-foreground transition-colors inline-flex items-center gap-1">
                    {label}
                    <ExternalLink size={11} className="opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-2">
            © 2026 modu. Built for Global x402 on Algorand Hackathon.
          </p>
          <p className="text-xs font-mono text-muted-2">
            <span className="text-accent-400">modu</span> · x402 · Algorand TestNet
          </p>
        </div>
      </div>
    </footer>
  );
}
