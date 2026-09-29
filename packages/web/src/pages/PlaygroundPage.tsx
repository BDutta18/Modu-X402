import { useState } from 'react';
import { Zap, AlertCircle, CheckCircle, ExternalLink, Loader2, Info } from 'lucide-react';
import { PROXY_URL, ALGORAND_EXPLORER, ALGORAND_DISPENSER, ALGORAND_NETWORK } from '../config';

const DEMO_ENDPOINT = `${PROXY_URL}/p/demo`;

type Stage = 'idle' | 'fetching402' | 'got402' | 'paying' | 'paid' | 'verifying' | 'success' | 'error';

interface Challenge {
  x402Version: number;
  accepts: {
    scheme: string;
    network: string;
    amount: string;
    asset: string;
    payTo: string;
    maxTimeoutSeconds: number;
    extra?: Record<string, unknown>;
  }[];
}

interface Receipt {
  status: string;
  txid: string;
  payer: string;
  amount: string;
  asset: string;
  timestamp: string;
}

export function PlaygroundPage() {
  const [stage, setStage] = useState<Stage>('idle');
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [rawHeaders, setRawHeaders] = useState<Record<string, string>>({});
  const [txid, setTxid] = useState('');
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState('');

  // Step 1: Hit endpoint — get 402
  async function step1Hit() {
    setStage('fetching402');
    setError('');
    setChallenge(null);
    setReceipt(null);
    setResponse('');
    try {
      const res = await fetch(DEMO_ENDPOINT, { method: 'GET', mode: 'cors' });
      const headers: Record<string, string> = {};
      res.headers.forEach((v, k) => { headers[k] = v; });
      setRawHeaders(headers);
      const body = await res.json();
      if (res.status === 402) {
        setChallenge(body);
        setStage('got402');
      } else if (res.status === 200) {
        setResponse(JSON.stringify(body, null, 2));
        setStage('success');
      } else {
        setError(`Unexpected status: ${res.status}`);
        setStage('error');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
      setStage('error');
    }
  }

  // Step 2: Pay (paste txid from wallet)
  async function step2Pay(e: React.FormEvent) {
    e.preventDefault();
    if (!txid.trim()) return;
    setStage('verifying');
    setError('');
    try {
      const res = await fetch(DEMO_ENDPOINT, {
        method: 'GET',
        mode: 'cors',
        headers: { 'X-Payment-Txid': txid.trim() },
      });
      const body = await res.json();
      if (res.status === 200) {
        const xReceipt = res.headers.get('x-payment-response');
        if (xReceipt) {
          try { setReceipt(JSON.parse(xReceipt)); } catch {}
        }
        setResponse(JSON.stringify(body, null, 2));
        setStage('success');
      } else {
        setError(body?.message || body?.error || `Status ${res.status}`);
        setStage('paid');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      setStage('error');
    }
  }

  function reset() {
    setStage('idle');
    setChallenge(null);
    setRawHeaders({});
    setTxid('');
    setReceipt(null);
    setResponse('');
    setError('');
  }

  const accept = challenge?.accepts?.[0];
  const amountHuman = accept
    ? (Number(accept.amount) / 1_000_000).toFixed(6).replace(/\.?0+$/, '') + ' USDC'
    : '';

  return (
    <div className="bg-background text-foreground min-h-screen pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-foreground/15 bg-card text-foreground text-xs font-mono mb-4 shadow-sm">
            <Zap size={13} className="text-accent" />
            Live on Algorand {ALGORAND_NETWORK === 'testnet' ? 'TestNet' : 'MainNet'}
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-foreground mb-4">
            Try it live.
          </h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Hit a real modu endpoint, inspect the 402 challenge, verify with an Algorand transaction,
            and view the 200 OK settlement receipt.
          </p>
        </div>

        {/* Dispenser banner */}
        <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-foreground/10 text-xs font-mono text-muted-foreground mb-8 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Info size={15} className="text-foreground shrink-0" />
            <span>Need TestNet ALGO or USDC?</span>
          </div>
          <a
            href={ALGORAND_DISPENSER}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground font-semibold underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground inline-flex items-center gap-1 shrink-0"
          >
            Get Free TestNet Tokens
            <ExternalLink size={11} />
          </a>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {/* Step 1 */}
          <StepCard
            n="01"
            title="Hit the modu proxy endpoint"
            active={stage === 'idle' || stage === 'fetching402' || stage === 'error'}
            done={stage !== 'idle' && stage !== 'fetching402' && stage !== 'error'}
          >
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed font-mono">
              Send an unpaid GET request to the demo proxy. The gateway intercepts it and returns HTTP 402 with x402 challenge headers.
            </p>
            <div className="rounded-xl border border-foreground/10 bg-muted/40 p-3.5 font-mono text-xs text-foreground mb-4 overflow-x-auto">
              GET {DEMO_ENDPOINT}
            </div>
            <button
              onClick={step1Hit}
              disabled={stage === 'fetching402' || (stage !== 'idle' && stage !== 'error')}
              className="inline-flex items-center justify-center bg-foreground hover:bg-foreground/90 text-background px-6 h-11 text-xs font-mono font-medium rounded-full transition-colors disabled:opacity-50"
            >
              {stage === 'fetching402' ? (
                <>
                  <Loader2 size={13} className="animate-spin mr-2" />
                  Sending request...
                </>
              ) : (
                'Send request →'
              )}
            </button>
          </StepCard>

          {/* 402 Challenge display — MacBook Window */}
          {stage !== 'idle' && stage !== 'fetching402' && challenge && (
            <div className="mac-terminal shadow-md">
              <div className="mac-titlebar flex items-center justify-between">
                <div className="mac-traffic-lights">
                  <span className="mac-dot mac-dot-close" />
                  <span className="mac-dot mac-dot-minimize" />
                  <span className="mac-dot mac-dot-maximize" />
                </div>
                <div className="text-xs font-mono text-zinc-400">
                  HTTP/1.1 402 Payment Required — x402 challenge
                </div>
                <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider font-bold">
                  Status 402
                </span>
              </div>
              <div className="p-6 font-mono text-xs space-y-3 bg-[#0a0c10]">
                <div className="text-zinc-400 text-xs space-y-0.5 border-b border-zinc-800 pb-2">
                  <div>Content-Type: application/json</div>
                  {rawHeaders['payment-required'] && (
                    <div className="truncate text-zinc-500">PAYMENT-REQUIRED: {rawHeaders['payment-required'].slice(0, 48)}...</div>
                  )}
                </div>
                <pre className="text-amber-200 leading-relaxed overflow-x-auto">
                  {JSON.stringify(challenge, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {(stage === 'got402' || stage === 'paying' || stage === 'paid' || stage === 'verifying') && accept && (
            <StepCard
              n="02"
              title={`Settle ${amountHuman} on Algorand`}
              active
              done={stage === 'verifying' || (stage as string) === 'success'}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <InfoRow label="Receiver (payTo)" value={accept.payTo ? accept.payTo.slice(0, 18) + '...' : '—'} />
                  <InfoRow label="Amount Required" value={amountHuman} highlight />
                  <InfoRow label="Asset ASA ID" value={accept.asset} />
                  <InfoRow label="CAIP-2 Network" value={accept.network.slice(0, 18) + '...'} />
                </div>

                <div className="p-4 rounded-xl border border-foreground/10 bg-muted/30 text-xs font-mono text-muted-foreground space-y-1.5 leading-relaxed">
                  <p className="font-medium text-foreground">Payment instructions:</p>
                  <p>1. Open Pera, Defly, or Lute Wallet and send <strong className="text-foreground">{amountHuman}</strong> to <code className="text-foreground font-semibold">{accept.payTo?.slice(0, 16)}...</code></p>
                  <p>2. Copy the confirmed transaction ID.</p>
                  <p>3. Paste below to verify and unlock the origin API response.</p>
                </div>

                <form onSubmit={step2Pay} className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-background border border-foreground/20 rounded-xl px-4 py-2.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                    placeholder="Paste confirmed Algorand TXID..."
                    value={txid}
                    onChange={(e) => setTxid(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    disabled={stage === 'verifying' || !txid.trim()}
                    className="inline-flex items-center justify-center bg-foreground hover:bg-foreground/90 text-background px-6 h-10 text-xs font-mono font-medium rounded-full transition-colors disabled:opacity-50 shrink-0"
                  >
                    {stage === 'verifying' ? (
                      <>
                        <Loader2 size={13} className="animate-spin mr-2" /> Verifying
                      </>
                    ) : (
                      'Verify →'
                    )}
                  </button>
                </form>

                {error && (
                  <div className="flex items-center gap-2 text-xs font-mono text-red-600">
                    <AlertCircle size={14} />
                    {error}
                  </div>
                )}
              </div>
            </StepCard>
          )}

          {/* Step 3 */}
          {stage === 'success' && (
            <StepCard n="03" title="200 OK — Settlement Receipt" active={false} done>
              <div className="space-y-4">
                <div className="mac-terminal shadow-md space-y-0">
                  <div className="mac-titlebar flex items-center justify-between">
                    <div className="mac-traffic-lights">
                      <span className="mac-dot mac-dot-close" />
                      <span className="mac-dot mac-dot-minimize" />
                      <span className="mac-dot mac-dot-maximize" />
                    </div>
                    <div className="text-xs font-mono text-zinc-400">
                      HTTP/1.1 200 OK — Settled Response
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                      Settled
                    </span>
                  </div>
                  <div className="p-6 font-mono text-xs space-y-4 bg-[#0a0c10]">
                    {receipt && (
                      <div className="grid grid-cols-2 gap-3 pb-3 border-b border-zinc-800">
                        <InfoRow label="Status" value={receipt.status} highlight />
                        <InfoRow
                          label="Transaction ID"
                          value={
                            <a
                              href={`${ALGORAND_EXPLORER}/${receipt.txid}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-300 font-semibold underline underline-offset-2 flex items-center gap-1"
                            >
                              {receipt.txid.slice(0, 12)}...
                              <ExternalLink size={10} />
                            </a>
                          }
                        />
                        <InfoRow label="Payer" value={receipt.payer ? receipt.payer.slice(0, 16) + '...' : '—'} />
                        <InfoRow label="Settled Amount" value={(Number(receipt.amount) / 1_000_000).toFixed(6) + ' USDC'} highlight />
                      </div>
                    )}
                    <pre className="text-emerald-300 leading-relaxed overflow-x-auto">
                      {response}
                    </pre>
                  </div>
                </div>

                <button
                  onClick={reset}
                  className="px-6 py-2.5 border border-foreground/20 rounded-full text-xs font-mono text-foreground hover:bg-muted/40 transition-colors"
                >
                  Run another test
                </button>
              </div>
            </StepCard>
          )}

          {stage === 'error' && !challenge && (
            <div className="flex items-center justify-between p-4 rounded-2xl border border-red-500/20 bg-red-50 text-red-700 text-xs font-mono">
              <div className="flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{error || 'Unable to connect to proxy.'}</span>
              </div>
              <button onClick={reset} className="underline">Reset</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepCard({
  n,
  title,
  active,
  done,
  children,
}: {
  n: string;
  title: string;
  active: boolean;
  done: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-3xl border p-6 lg:p-8 transition-all duration-300 ${
        done
          ? 'border-emerald-600/30 bg-emerald-500/[0.02]'
          : active
          ? 'border-foreground/20 bg-card shadow-sm'
          : 'border-foreground/10 bg-card/60 opacity-60'
      }`}
    >
      <div className="flex items-center gap-3 mb-5">
        <span
          className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
            done
              ? 'text-emerald-700 border-emerald-600/30 bg-emerald-50'
              : 'text-foreground border-foreground/20 bg-muted'
          }`}
        >
          {done ? '✓' : n}
        </span>
        <h3 className="font-display text-2xl text-foreground font-semibold">{title}</h3>
        {done && <CheckCircle size={16} className="text-emerald-600 ml-auto" />}
      </div>
      {children}
    </div>
  );
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="bg-muted/40 border border-foreground/10 rounded-xl p-3">
      <div className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className={`text-xs font-mono truncate ${highlight ? 'text-foreground font-bold' : 'text-foreground/80'}`}>
        {value}
      </div>
    </div>
  );
}
