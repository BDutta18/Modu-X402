import { useState } from 'react';
import { ChevronRight, ChevronDown, Book, Terminal, Shield, Globe, Cpu, HelpCircle, Zap, GitBranch } from 'lucide-react';

const SECTIONS = [
  {
    id: 'intro',
    icon: Book,
    title: 'Introduction',
    content: `
## What is modu?

**modu** is a developer tool and edge reverse proxy that turns any existing HTTP API into a pay-per-request endpoint settled in Algorand USDC (ASA) or ALGO, with zero payment code from the developer.

## Why x402?

The x402 protocol (an extension of HTTP's 402 Payment Required status code) enables machine-native micropayments inline with API calls. When a consumer hits a modu endpoint without payment, they receive a structured challenge. After paying on-chain, they retry with proof — and receive the API response.

## How modu differs

- **No SDK required** — your origin API needs zero changes
- **Algorand-native** — USDC (ASA-10458941) and ALGO on Algorand (~3s finality, sub-cent fees)
- **Non-custodial** — payments go directly to your wallet; modu never holds funds
- **CLI-first** — \`modu register --url ... --price ...\` and you're live in seconds
    `.trim(),
  },
  {
    id: 'quickstart',
    icon: Zap,
    title: 'Quick Start (5 minutes)',
    content: `
## Install

\`\`\`bash
npm install -g modu
\`\`\`

## Login

\`\`\`bash
modu login
# Opens browser → authorize → API key saved to ~/.modu/config.json
\`\`\`

## Connect wallet

\`\`\`bash
# Generate a new wallet
modu wallet create
# or connect an existing Algorand address
modu wallet connect YOUR_ALGORAND_ADDRESS
\`\`\`

## Register your API

\`\`\`bash
modu register \\
  --url https://api.example.com \\
  --price 0.01 \\
  --asset USDC

# Output:
# ✓ Endpoint registered!
#   ID:    abc123
#   Proxy: https://modu-proxy.onrender.com/p/a3f2c1
#   Price: 0.01 USDC/request
\`\`\`

## Test it

\`\`\`bash
# Gets 402 challenge
curl https://modu-proxy.onrender.com/p/a3f2c1

# After paying via Pera/Defly/Lute:
curl -H "X-Payment-Txid: ABC123..." \\
  https://modu-proxy.onrender.com/p/a3f2c1
# → 200 OK + your API data
\`\`\`
    `.trim(),
  },
  {
    id: 'concepts',
    icon: GitBranch,
    title: 'Concepts: x402 Flow',
    content: `
## The x402 Payment Flow

### Step 1 — Unpaid Request: 402 Challenge

Consumer sends \`GET /p/<slug>\` without payment headers. Proxy responds:

\`\`\`
HTTP/1.1 402 Payment Required
Content-Type: application/json
PAYMENT-REQUIRED: <base64-encoded-challenge>

{
  "x402Version": 2,
  "resource": { "url": "https://proxy.modu.io/p/abc" },
  "accepts": [{
    "scheme": "exact",
    "network": "algorand:SGO1...",
    "amount": "10000",         // micro-units (0.01 USDC)
    "asset": "10458941",       // TestNet USDC ASA ID
    "payTo": "ALGO_ADDRESS",
    "maxTimeoutSeconds": 300
  }]
}
\`\`\`

### Step 2 — Payment on Algorand

Consumer sends USDC to the \`payTo\` address via Pera/Defly/Lute or algosdk. The transaction note is \`modu:<nonce>\` for legacy flows; in x402 v2, a signed atomic transaction group is submitted.

### Step 3 — Retry with Proof

\`\`\`bash
curl -H "X-Payment: <base64-signed-payload>" \\
  https://modu-proxy.onrender.com/p/abc
\`\`\`

Or for legacy local-verifier mode:
\`\`\`bash
curl -H "X-Payment-Txid: TXID_HERE" \\
  https://modu-proxy.onrender.com/p/abc
\`\`\`

### Step 4 — Verification & Settlement

Proxy verifies via Algorand Indexer (receiver, amount, asset, round). In x402 v2, the facilitator co-signs and broadcasts the atomic group. The txid is marked spent (replay protection).

### Step 5 — 200 OK + Receipt

\`\`\`
HTTP/1.1 200 OK
X-Payment-Response: {"status":"settled","txid":"ABC...","payer":"ADDR...","amount":"10000","timestamp":"..."}
\`\`\`

## Nonces & Replay Protection

Each nonce is single-use. The TXID is recorded in the control plane store. Subsequent requests with the same TXID return 402. On Algorand, the blockchain itself also enforces single-use via \`firstValid\`/\`lastValid\` transaction windows.

## Revocation

\`modu revoke <id>\` marks the endpoint inactive. The proxy returns \`410 Gone\` immediately (cached within 10s TTL).
    `.trim(),
  },
  {
    id: 'cli',
    icon: Terminal,
    title: 'CLI Reference',
    content: `
## Commands

### \`modu login\`
Opens a browser tab to authorize the CLI. Polls for approval. Saves API key to \`~/.modu/config.json\`.

\`\`\`bash
modu login
# → Opening https://modu-to68.onrender.com/cli-auth?token=...
# → Waiting for approval...
# ✓ Logged in successfully.
\`\`\`

### \`modu wallet create\`
Generates a new Algorand keypair locally. Private key stored at \`~/.modu/config.json\` (0600).

### \`modu wallet connect <address>\`
Sets your payout address without generating keys. Useful if you manage keys externally.

### \`modu register\`
\`\`\`bash
modu register --url <origin-url> --price <amount> --asset USDC|ALGO [--path <slug>]
\`\`\`
Flags:
- \`--url\`    Origin HTTP URL to proxy
- \`--price\`  Price per request in standard units (e.g. \`0.01\`)
- \`--asset\`  \`USDC\` or \`ALGO\`
- \`--path\`   Custom URL slug (default: random hex)

### \`modu list\`
Lists all your registered endpoints with status, proxy URL, price.

### \`modu revoke <id>\`
Revokes an endpoint. Proxy returns 410 Gone.

### \`modu logs <id> [--follow]\`
Shows request logs. \`--follow\` streams via SSE.

### \`modu stats <id>\`
Shows revenue, request count, top payers.

### Exit codes
| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Auth required (run \`modu login\`) |
| 3 | Not found |
    `.trim(),
  },
  {
    id: 'security',
    icon: Shield,
    title: 'Wallet & Security Model',
    content: `
## Local Key Generation

\`\`\`bash
modu wallet create
# Generates Algorand keypair locally using algosdk
# Private key stored ONLY in ~/.modu/config.json
# chmod 0600 automatically applied
\`\`\`

## Config File

\`~/.modu/config.json\` (0600 permissions):
\`\`\`json
{
  "apiKey": "your-api-key",
  "payoutAddress": "YOUR_ALGO_ADDRESS",
  "controlPlaneUrl": "https://modu-to68.onrender.com",
  "proxyUrl": "https://modu-proxy.onrender.com"
}
\`\`\`

## Threat Model

| Threat | Mitigation |
|--------|-----------|
| Private key exposure | Keys never transmitted; 0600 file perms |
| Replay attacks | Nonce + TXID marked spent server-side + Algorand blockchain enforcement |
| Stolen API key | API key only controls endpoint management, not wallet funds |
| Man-in-the-middle | TLS everywhere; Algorand TXID verified via public Indexer |

## 24-word Mnemonic
\`\`\`bash
modu wallet show
# Reveals your mnemonic — back this up offline
\`\`\`
⚠️ Anyone with your mnemonic controls your wallet. Treat it like a password.
    `.trim(),
  },
  {
    id: 'consumer',
    icon: Cpu,
    title: 'Consumer Guide',
    content: `
## How to Pay a modu Endpoint

### JavaScript (algosdk)

\`\`\`typescript
import algosdk from 'algosdk';

async function callModuEndpoint(proxyUrl: string, payerMnemonic: string) {
  // 1. Initial request → expect 402
  const r1 = await fetch(proxyUrl);
  if (r1.status !== 402) return r1;
  const challenge = await r1.json();
  const accept = challenge.accepts[0];

  // 2. Send Algorand USDC payment
  const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');
  const account = algosdk.mnemonicToSecretKey(payerMnemonic);
  const params = await algodClient.getTransactionParams().do();

  const assetId = parseInt(accept.asset); // e.g. 10458941
  const amount = BigInt(accept.amount);   // micro-units

  const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    sender: account.addr,
    receiver: accept.payTo,
    amount,
    assetIndex: assetId,
    suggestedParams: params,
    note: new TextEncoder().encode(\`modu:\${accept.nonce || 'pay'}\`),
  });
  const signedTxn = txn.signTxn(account.sk);
  const { txid } = await algodClient.sendRawTransaction(signedTxn).do();

  // Wait for confirmation (~3s)
  await algosdk.waitForConfirmation(algodClient, txid, 4);

  // 3. Retry with payment proof
  const r2 = await fetch(proxyUrl, {
    headers: { 'X-Payment-Txid': txid }
  });
  return r2; // 200 OK
}
\`\`\`

### Python (py-algorand-sdk)

\`\`\`python
import requests
import algosdk
from algosdk import transaction as txn_module

def call_modu_endpoint(proxy_url: str, sender_mnemonic: str):
    # 1. Get 402 challenge
    r = requests.get(proxy_url)
    if r.status_code != 402:
        return r
    challenge = r.json()
    accept = challenge['accepts'][0]

    # 2. Pay on Algorand
    acct = algosdk.account.from_mnemonic(sender_mnemonic)
    algod = algosdk.v2client.algod.AlgodClient('', 'https://testnet-api.algonode.cloud')
    params = algod.suggested_params()
    
    txn = txn_module.AssetTransferTxn(
        sender=acct['pk'],
        receiver=accept['payTo'],
        amt=int(accept['amount']),
        index=int(accept['asset']),
        sp=params,
        note=b'modu:pay',
    )
    signed = txn.sign(acct['sk'])
    txid = algod.send_transaction(signed)
    txn_module.wait_for_confirmation(algod, txid, 4)

    # 3. Retry with proof
    r2 = requests.get(proxy_url, headers={'X-Payment-Txid': txid})
    return r2  # 200 OK
\`\`\`
    `.trim(),
  },
  {
    id: 'api',
    icon: Globe,
    title: 'API Reference',
    content: `
## Control Plane (https://modu-to68.onrender.com)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /health | — | Health check |
| POST | /api/auth/cli-token | — | Initiate CLI auth session |
| POST | /api/auth/claim | — | Claim session with email |
| GET | /api/auth/poll?token= | — | Poll session status |
| GET | /api/account/me | Bearer | Get account info |
| POST | /api/account/payout-address | Bearer | Update payout address |
| POST | /api/endpoints | Bearer | Register endpoint |
| GET | /api/endpoints | Bearer | List endpoints |
| DELETE | /api/endpoints/:id | Bearer | Revoke endpoint |
| GET | /api/endpoints/:id/logs | Bearer | Logs (SSE if ?follow=true) |
| GET | /api/endpoints/:id/stats | Bearer | Stats + revenue chart data |

## Proxy (https://modu-proxy.onrender.com)

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| ALL | /p/:slug | x402 proxy endpoint |

## Headers

| Header | Direction | Description |
|--------|-----------|-------------|
| \`X-Payment\` | Request | Base64-encoded x402 v2 PaymentPayload |
| \`X-Payment-Txid\` | Request | Algorand TXID (legacy/local verifier mode) |
| \`X-Payment-Response\` | Response | JSON settlement receipt |
| \`PAYMENT-REQUIRED\` | Response | Base64-encoded x402 challenge |
| \`Authorization\` | Request | \`Bearer <api-key>\` for control plane |

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success — API response forwarded with receipt header |
| 402 | Payment Required — x402 challenge body |
| 400 | Bad Request — invalid payment / missing fields |
| 401 | Unauthorized — missing/invalid API key |
| 404 | Endpoint not found |
| 410 | Gone — endpoint has been revoked |
| 500 | Internal Server Error |
    `.trim(),
  },
  {
    id: 'selfhosting',
    icon: Globe,
    title: 'Self-Hosting',
    content: `
## Docker Compose

\`\`\`bash
# Clone the repo
git clone https://github.com/rupamghosh2006/modu.git
cd modu

# Copy and fill env vars
cp .env.example .env

# Start everything
docker-compose up -d
\`\`\`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| \`PORT\` | 3000 | Control plane port |
| \`CONTROL_PLANE_URL\` | https://modu-to68.onrender.com | Control plane URL |
| \`PROXY_URL\` | https://modu-proxy.onrender.com | Proxy public URL |
| \`NETWORK\` | algorand-testnet | Network (algorand-testnet / algorand-mainnet) |
| \`MODU_STORE_PATH\` | ~/.modu/control-plane-store.json | Persistence file |
| \`FACILITATOR_URL\` | https://facilitator.goplausible.xyz | x402 facilitator |
| \`USE_LOCAL_VERIFIER\` | false | Skip facilitator; verify txid via Indexer |
| \`CHALLENGE_TIMEOUT_SECONDS\` | 300 | Challenge validity window |

## Render / Railway

The repo already has \`render.yaml\` and \`railway.json\`. Push to GitHub and connect your repo. Set the env vars above in the dashboard.

## TestNet vs MainNet

Set \`NETWORK=algorand-testnet\` for TestNet (USDC ASA 10458941) or \`NETWORK=algorand-mainnet\` for MainNet (USDC ASA 31566704). No other changes needed.
    `.trim(),
  },
  {
    id: 'faq',
    icon: HelpCircle,
    title: 'FAQ',
    content: `
**Q: Does modu store my API data?**  
No. modu proxies request/response streams verbatim. Only request metadata (txid, payer address, latency, status code) is logged.

**Q: What happens if a consumer pays but the origin is down?**  
The proxy forwards the request to the origin. If the origin returns an error, the consumer gets that error. modu does not refund payments — this is by design (the x402 model).

**Q: Can I use modu with streaming APIs?**  
Yes. \`forwardStream\` passes the response stream directly to the consumer with no buffering.

**Q: What if the Algorand network is congested?**  
The challenge has a \`maxTimeoutSeconds\` (default 300s). If the payment doesn't confirm in time, the nonce expires and the consumer must retry.

**Q: How do I update my payout address?**  
\`\`\`bash
modu wallet connect NEW_ALGO_ADDRESS
\`\`\`
New payments go to the new address immediately. Existing unconfirmed payments are unaffected.

**Q: Is modu open source?**  
Yes — Apache 2.0. See [github.com/rupamghosh2006/modu](https://github.com/rupamghosh2006/modu).
    `.trim(),
  },
];

function MarkdownLite({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-lg font-bold mt-6 mb-3 text-foreground">{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-base font-semibold mt-4 mb-2 text-foreground">{line.slice(4)}</h3>);
    } else if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={i} className="my-4 relative rounded-xl border border-foreground/15 bg-muted/40 p-4 font-mono text-xs overflow-x-auto shadow-sm">
          {lang && <span className="absolute top-2.5 right-3 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{lang}</span>}
          <pre className="text-foreground leading-relaxed overflow-x-auto">{codeLines.join('\n')}</pre>
        </div>
      );
    } else if (line.startsWith('| ')) {
      // Table
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        if (!lines[i].match(/^\|[-| ]+\|$/)) {
          rows.push(lines[i].split('|').slice(1, -1).map((c) => c.trim()));
        }
        i++;
      }
      elements.push(
        <div key={i} className="overflow-x-auto my-5 rounded-xl border border-foreground/10">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-foreground/10">
                {rows[0]?.map((h, hi) => (
                  <th key={hi} className="text-left px-4 py-2.5 text-foreground font-semibold font-mono text-[11px] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((row, ri) => (
                <tr key={ri} className="border-b border-foreground/5 last:border-0 hover:bg-muted/20">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2 text-foreground/80 font-mono text-xs">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={i} className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground my-3 leading-relaxed">
          {items.map((item, ii) => <li key={ii}>{item}</li>)}
        </ul>
      );
      continue;
    } else if (line.startsWith('**') && line.includes('**')) {
      elements.push(
        <p
          key={i}
          className="text-sm font-semibold text-foreground mt-5 mb-1"
          dangerouslySetInnerHTML={{
            __html: line
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/`(.*?)`/g, '<code class="font-mono text-xs bg-muted px-1.5 py-0.5 rounded border border-foreground/10 text-foreground">$1</code>')
          }}
        />
      );
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p
          key={i}
          className="text-sm text-muted-foreground leading-relaxed my-1.5"
          dangerouslySetInnerHTML={{
            __html: line
              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-medium">$1</strong>')
              .replace(/`(.*?)`/g, '<code class="font-mono text-xs bg-muted px-1.5 py-0.5 rounded border border-foreground/10 text-foreground font-medium">$1</code>')
              .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground font-medium">$1</a>')
          }}
        />
      );
    }
    i++;
  }
  return <div>{elements}</div>;
}

export function DocsPage() {
  const [active, setActive] = useState('intro');
  const activeSection = SECTIONS.find((s) => s.id === active);

  return (
    <div className="bg-background text-foreground min-h-screen pt-28 pb-24">
      <div className="max-w-[1300px] mx-auto px-6 lg:px-12">
        <div className="mb-12">
          <span className="inline-flex items-center gap-3 text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
            <span className="w-8 h-px bg-foreground/30" />
            Documentation
          </span>
          <h1 className="text-4xl lg:text-6xl font-display font-bold tracking-tight text-foreground">
            modu Documentation
          </h1>
          <p className="text-base text-muted-foreground mt-2 max-w-xl">
            Everything you need to wrap, monetize, and deploy APIs with x402 on Algorand.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Sidebar */}
          <nav className="w-full md:w-64 shrink-0 sticky top-28 border border-foreground/10 rounded-2xl p-3 bg-card shadow-sm">
            <div className="space-y-1">
              {SECTIONS.map(({ id, icon: Icon, title }) => (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-colors text-left ${
                    active === id
                      ? 'bg-foreground text-background font-semibold shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                  }`}
                >
                  <Icon size={14} />
                  <span className="truncate">{title}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0 bg-card border border-foreground/10 rounded-3xl p-8 lg:p-12 shadow-sm">
            {activeSection && (
              <div>
                <div className="flex items-center gap-3 mb-8 pb-5 border-b border-foreground/10">
                  <div className="w-9 h-9 rounded-lg bg-foreground text-background flex items-center justify-center">
                    <activeSection.icon size={16} />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
                    {activeSection.title}
                  </h2>
                </div>
                <MarkdownLite content={activeSection.content} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
