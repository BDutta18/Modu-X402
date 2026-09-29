import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle, Copy, Globe, DollarSign } from 'lucide-react';
import { createEndpoint } from '../api';

const ASSETS = ['USDC', 'ALGO'] as const;

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ originUrl: '', price: '0.01', asset: 'USDC' as 'USDC' | 'ALGO', path: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ proxyUrl: string; slug: string } | null>(null);
  const [copied, setCopied] = useState(false);

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.originUrl) { setError('Origin URL is required'); return; }
    if (isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) {
      setError('Price must be a positive number');
      return;
    }
    setLoading(true);
    try {
      const data = await createEndpoint({
        originUrl: form.originUrl.trim(),
        price: form.price,
        asset: form.asset,
        path: form.path.trim() || undefined,
      });
      setResult({ proxyUrl: data.proxyUrl, slug: data.slug });
    } catch (err: any) {
      setError(err.message || 'Failed to register endpoint');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const curlSnippet = form.originUrl
    ? `curl https://modu-proxy.onrender.com/p/${form.path || '<slug>'}
# -> 402 Payment Required

# After client pays ${form.price} ${form.asset} on Algorand:
curl -H "X-Payment: <base64-payload>" \\
  https://modu-proxy.onrender.com/p/${form.path || '<slug>'}`
    : '';

  return (
    <div className="max-w-2xl">
      <div className="mb-8 pb-6 border-b border-foreground/10">
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-1">
          Gateway Configuration
        </span>
        <h1 className="text-3xl font-display font-bold text-foreground">Register an API Endpoint</h1>
        <p className="text-xs font-mono text-muted-foreground mt-2 leading-relaxed">
          Wrap any upstream HTTP endpoint with autonomous x402 pay-per-request settlement on Algorand.
        </p>
      </div>

      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Origin URL */}
          <div className="bg-card border border-foreground/10 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-foreground mb-2 flex items-center gap-2">
                <Globe size={14} /> Upstream Origin URL
              </label>
              <input
                type="url"
                className="w-full bg-background border border-foreground/20 rounded-xl px-4 py-2.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                placeholder="https://api.example.com/v1/forecast"
                value={form.originUrl}
                onChange={set('originUrl')}
                required
              />
              <p className="text-[11px] font-mono text-muted-foreground mt-1.5">
                The target HTTP service modu reverse proxy pipes requests to upon payment settlement.
              </p>
            </div>

            {/* Price & Asset */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-foreground/5">
              <div>
                <label className="block text-xs font-mono font-medium text-foreground mb-2 flex items-center gap-1.5">
                  <DollarSign size={14} /> Price per call
                </label>
                <input
                  type="number"
                  className="w-full bg-background border border-foreground/20 rounded-xl px-4 py-2.5 font-mono text-xs text-foreground focus:outline-none focus:border-foreground"
                  placeholder="0.01"
                  step="0.000001"
                  min="0.000001"
                  value={form.price}
                  onChange={set('price')}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-medium text-foreground mb-2">Settlement Asset</label>
                <select
                  className="w-full bg-background border border-foreground/20 rounded-xl px-4 py-2.5 font-mono text-xs text-foreground focus:outline-none focus:border-foreground"
                  value={form.asset}
                  onChange={set('asset')}
                >
                  {ASSETS.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Path Slug */}
            <div className="pt-2 border-t border-foreground/5">
              <label className="block text-xs font-mono font-medium text-foreground mb-2">
                Custom Path Slug <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <div className="flex items-center">
                <span className="bg-muted border border-r-0 border-foreground/15 rounded-l-xl px-3 py-2.5 text-xs font-mono text-muted-foreground">
                  /p/
                </span>
                <input
                  type="text"
                  className="flex-1 bg-background border border-foreground/20 rounded-r-xl px-4 py-2.5 font-mono text-xs text-foreground focus:outline-none focus:border-foreground"
                  placeholder="custom-slug"
                  value={form.path}
                  onChange={set('path')}
                />
              </div>
              <p className="text-[11px] font-mono text-muted-foreground mt-1.5">
                Leave empty for an auto-generated 6-character hex hash.
              </p>
            </div>
          </div>

          {/* Code snippet preview */}
          {curlSnippet && (
            <div className="rounded-2xl border border-foreground/10 bg-card p-5 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-2">
                Instant Request Preview
              </span>
              <pre className="rounded-xl border border-foreground/10 bg-muted/40 p-4 font-mono text-xs text-foreground leading-relaxed overflow-x-auto">
                {curlSnippet}
              </pre>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center bg-foreground hover:bg-foreground/90 text-background py-3.5 rounded-full font-mono text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? <Loader2 size={15} className="animate-spin mr-2" /> : null}
            {loading ? 'Registering Route...' : 'Deploy Proxy Endpoint'}
          </button>
        </form>
      ) : (
        <div className="bg-card border border-foreground/10 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 text-emerald-700 font-display text-2xl font-bold">
            <CheckCircle size={22} className="text-emerald-600" />
            Proxy Endpoint Deployed
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
              Public x402 Proxy Address
            </div>
            <div className="flex items-center gap-2 bg-muted/40 border border-foreground/15 rounded-xl p-3 font-mono text-xs">
              <span className="flex-1 truncate font-medium text-foreground">{result.proxyUrl}</span>
              <button
                onClick={() => handleCopy(result.proxyUrl)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                {copied ? <CheckCircle size={14} className="text-emerald-600" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => navigate(`/app/endpoints/${result.slug}`)}
              className="flex-1 py-3 bg-foreground text-background rounded-full font-mono text-xs font-semibold uppercase tracking-wider"
            >
              View Route Analytics
            </button>
            <button
              onClick={() => {
                setResult(null);
                setForm({ originUrl: '', price: '0.01', asset: 'USDC', path: '' });
              }}
              className="px-6 py-3 border border-foreground/20 rounded-full font-mono text-xs font-semibold uppercase tracking-wider hover:bg-muted/40"
            >
              Register Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
