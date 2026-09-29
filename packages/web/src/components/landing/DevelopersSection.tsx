import { useState } from "react";
import { Copy, Check, Terminal as TerminalIcon } from "lucide-react";

const codeExamples = [
  {
    label: "CLI Quickstart",
    lang: "bash",
    code: `# 1. Install globally
npm install -g modu

# 2. Authenticate CLI session
modu login

# 3. Connect your Algorand payout address
modu wallet connect ALGO6XK7MNPQR2WXYZ34567890ABCDEFGH

# 4. Register your API endpoint
modu register --url https://api.myfeed.com --price 0.01 --asset USDC`,
  },
  {
    label: "cURL Flow",
    lang: "bash",
    code: `# Step 1: Hit endpoint -> Receive 402 challenge
curl https://modu-proxy.onrender.com/p/a3f2c1
# -> HTTP/1.1 402 Payment Required
# -> PAYMENT-REQUIRED: <base64 challenge>

# Step 2: Pay 0.01 USDC on Algorand TestNet
# Step 3: Retry with signed payment proof
curl -H "X-Payment: <base64-payload>" \\
  https://modu-proxy.onrender.com/p/a3f2c1
# -> HTTP/1.1 200 OK + X-Payment-Response: {"status":"settled", ...}`,
  },
  {
    label: "TypeScript Client",
    lang: "typescript",
    code: `import algosdk from 'algosdk';

async function fetchModu(url: string) {
  // 1. Initial attempt receives 402
  const r1 = await fetch(url);
  if (r1.status !== 402) return r1;

  const challenge = await r1.json();
  const accept = challenge.accepts[0];

  // 2. Client signs payment on Algorand
  const txid = await payOnAlgorand({
    payTo: accept.payTo,
    amount: accept.amount,
    assetId: accept.asset,
  });

  // 3. Retry with proof -> Returns origin response
  return fetch(url, {
    headers: { 'X-Payment-Txid': txid },
  });
}`,
  },
  {
    label: "Live SSE Stream",
    lang: "bash",
    code: `# Stream live request settlements to your terminal
modu logs <endpoint-id> --follow

# Output in real time:
# [2026-09-29 22:18:02] 200 OK | 0.01 USDC | 28ms | Tx: 5P3Z...K9FA
# [2026-09-29 22:18:08] 200 OK | 0.01 USDC | 32ms | Tx: J7X2...M4BQ`,
  },
];

const highlights = [
  { title: "Zero SDK in your origin", desc: "No imports or crypto dependencies in your API codebase." },
  { title: "Verbatim streaming", desc: "Edge proxy pipes origin SSE, JSON, or binaries with no buffering." },
  { title: "Instant route revocation", desc: "Revoked endpoints return 410 Gone within seconds." },
  { title: "Algorand TestNet & MainNet", desc: "Switch networks with a single environment variable." },
];

export function DevelopersSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="developers" className="py-24 lg:py-36 border-t border-black/[0.08] bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-16">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-zinc-600 mb-4">
            <span className="w-8 h-px bg-black/40" />
            Developer Experience
          </span>
          <h2 className="text-4xl lg:text-6xl font-display tracking-tight text-black">
            Built for terminals,
            <br />
            scripts, and agents.
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* MacBook Style Code Window */}
          <div className="lg:col-span-8 mac-terminal">
            {/* MacBook Title Bar with traffic lights & tab chips */}
            <div className="mac-titlebar flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="mac-traffic-lights">
                  <span className="mac-dot mac-dot-close" />
                  <span className="mac-dot mac-dot-minimize" />
                  <span className="mac-dot mac-dot-maximize" />
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                  <TerminalIcon size={12} className="text-zinc-500" />
                  <span>modu-code-runner</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1.5">
                {codeExamples.map((ex, idx) => (
                  <button
                    key={ex.label}
                    onClick={() => setActiveTab(idx)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                      activeTab === idx
                        ? "bg-zinc-800 text-white font-medium shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {ex.label}
                  </button>
                ))}
              </div>

              {/* Copy */}
              <button
                onClick={handleCopy}
                className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 p-1 rounded hover:bg-zinc-800 transition-colors"
                title="Copy code"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            {/* Code Body */}
            <pre className="p-6 font-mono text-[13px] leading-relaxed text-zinc-200 overflow-x-auto min-h-[260px] bg-[#0a0c10]">
              <code>{codeExamples[activeTab].code}</code>
            </pre>
          </div>

          {/* Right Highlights */}
          <div className="lg:col-span-4 space-y-6">
            {highlights.map((h, i) => (
              <div key={i} className="pb-6 border-b border-black/[0.08] last:border-b-0">
                <h3 className="font-semibold text-black text-base mb-1">{h.title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
