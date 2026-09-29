import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2, Terminal, Clock } from 'lucide-react';
import { createCliToken, pollCliToken } from '../api';
import { setApiKey } from '../lib/auth';

type Step = 'loading' | 'ready' | 'polling' | 'success' | 'expired' | 'error';

export function CliAuthPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('loading');
  const [token, setToken] = useState('');
  const [authUrl, setAuthUrl] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(15 * 60);

  const searchToken = new URLSearchParams(window.location.search).get('token');

  useEffect(() => {
    if (searchToken) {
      setStep('ready');
      setToken(searchToken);
      return;
    }

    createCliToken()
      .then((data) => {
        setToken(data.token);
        setAuthUrl(data.authUrl);
        setStep('polling');
        startPolling(data.token);
      })
      .catch((err) => {
        setError(err.message || 'Failed to start auth session');
        setStep('error');
      });
  }, []);

  useEffect(() => {
    if (step !== 'polling' && step !== 'ready') return;
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(t);
          setStep('expired');
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [step]);

  function startPolling(tok: string) {
    const interval = setInterval(async () => {
      try {
        const r = await pollCliToken(tok);
        if (r.status === 'claimed' && r.apiKey) {
          clearInterval(interval);
          setApiKey(r.apiKey);
          setStep('success');
          setTimeout(() => navigate('/app/endpoints'), 1500);
        } else if (r.status === 'expired') {
          clearInterval(interval);
          setStep('expired');
        }
      } catch {
        // continue polling
      }
    }, 2000);
  }

  function formatCountdown(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 text-foreground">
      <div className="w-full max-w-[520px]">
        {/* Card */}
        <div className="bg-card border border-foreground/15 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(20,20,16,0.06)]">
          {/* MacBook Title Bar with Traffic Lights */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-foreground/10 bg-muted/40">
            <div className="flex items-center gap-3">
              <div className="mac-traffic-lights">
                <span className="mac-dot mac-dot-close" />
                <span className="mac-dot mac-dot-minimize" />
                <span className="mac-dot mac-dot-maximize" />
              </div>
              <div className="flex items-center gap-2 ml-2">
                <img src="/logo.png" alt="modu logo" className="w-5 h-5 object-contain rounded" />
                <span className="font-display font-bold text-base text-foreground">modu</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
              <Terminal size={12} />
              <span>developer@macbook: ~</span>
            </div>
          </div>

          <div className="p-8 font-mono text-xs">
            <div className="text-muted-foreground mb-4">
              developer@terminal:~$ <span className="text-foreground font-semibold">modu login</span>
            </div>

            {step === 'loading' && (
              <div className="flex items-center gap-3 py-6 text-muted-foreground">
                <Loader2 size={16} className="animate-spin text-foreground" />
                Initializing authorization handshake...
              </div>
            )}

            {(step === 'ready' || step === 'polling') && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                    Authorize modu CLI
                  </h2>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {step === 'polling'
                      ? 'Waiting for browser approval. Approve session to grant CLI endpoint management access.'
                      : 'A local CLI session is requesting access to manage your endpoints and payout destinations.'}
                  </p>
                </div>

                <div className="bg-muted/30 border border-foreground/10 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Session Token:</span>
                    <span className="font-semibold text-foreground px-2 py-0.5 rounded bg-muted border border-foreground/10">
                      {token.slice(0, 10)}...
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Access Scope:</span>
                    <span className="text-foreground">endpoints:manage, payouts:manage</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Session Expiry:</span>
                    <span className="text-foreground flex items-center gap-1">
                      <Clock size={12} />
                      {formatCountdown(countdown)}
                    </span>
                  </div>
                </div>

                {step === 'polling' && authUrl && (
                  <div className="text-xs">
                    <span className="text-muted-foreground block mb-1">Open this link if not redirected:</span>
                    <a
                      href={authUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground font-semibold underline underline-offset-2 break-all"
                    >
                      {authUrl}
                    </a>
                  </div>
                )}

                {step === 'ready' && <AuthApproveForm token={token} />}
              </div>
            )}

            {step === 'success' && (
              <div className="space-y-3 py-4 text-emerald-700">
                <div className="flex items-center gap-2 font-display text-xl font-bold">
                  <CheckCircle size={20} className="text-emerald-600" />
                  Authorization Granted
                </div>
                <div className="text-xs text-muted-foreground">
                  Session credentials linked. Stored API key saved to ~/.modu/config.json.
                </div>
                <div className="text-xs text-foreground font-semibold pt-2">
                  Redirecting to dashboard...
                </div>
              </div>
            )}

            {step === 'expired' && (
              <div className="space-y-3 py-4 text-red-600">
                <div className="flex items-center gap-2 font-display text-xl font-bold">
                  <AlertCircle size={20} />
                  Session Expired
                </div>
                <p className="text-xs text-muted-foreground">
                  The session timed out. Run <code className="text-foreground font-bold">modu login</code> again.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-xs underline font-semibold text-foreground"
                >
                  Start New Session
                </button>
              </div>
            )}

            {step === 'error' && (
              <div className="space-y-2 py-4 text-red-600">
                <div className="flex items-center gap-2 font-display text-xl font-bold">
                  <AlertCircle size={20} />
                  Authentication Error
                </div>
                <p className="text-xs text-muted-foreground">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthApproveForm({ token }: { token: string }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      const res = await fetch(
        `${import.meta.env.VITE_CONTROL_PLANE_URL || 'https://modu-to68.onrender.com'}/api/auth/claim`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, email: email.trim() || undefined }),
        }
      );
      if (!res.ok) {
        const d = await res.json().catch(() => ({ error: 'Authorization failed' }));
        setErr(d.error || 'Authorization failed');
        setLoading(false);
        return;
      }
      setDone(true);
    } catch {
      setErr('Network error connecting to control plane.');
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="space-y-2 py-2">
        <div className="text-emerald-700 font-display text-lg font-bold flex items-center gap-2">
          <CheckCircle size={18} className="text-emerald-600" /> Authorization Granted
        </div>
        <p className="text-muted-foreground text-xs">
          Credentials issued. You can now close this tab and return to your terminal.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div>
        <label className="block text-xs font-mono font-medium text-foreground mb-1.5">
          Developer Email <span className="text-muted-foreground">(optional)</span>:
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="dev@example.com"
          className="w-full bg-background border border-foreground/20 rounded-xl px-4 py-2.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
          autoFocus
        />
      </div>
      {err && <p className="text-xs font-mono text-red-600">{err}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-foreground hover:bg-foreground/90 text-background rounded-full font-mono text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
      >
        {loading ? <Loader2 size={13} className="animate-spin inline mr-2" /> : null}
        Authorize CLI Session ↵
      </button>
    </form>
  );
}
