import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Copy, CheckCircle, AlertCircle, Loader2, BarChart2 } from 'lucide-react';
import { listEndpoints, type EndpointListItem } from '../api';
import { copyToClipboard } from '../lib/utils';

export function EndpointsPage() {
  const [endpoints, setEndpoints] = useState<EndpointListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    listEndpoints()
      .then(setEndpoints)
      .catch((err) => setError(err.message || 'Failed to load endpoints'))
      .finally(() => setLoading(false));
  }, []);

  async function handleCopy(url: string, id: string) {
    await copyToClipboard(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground font-mono text-xs">
        <Loader2 size={20} className="animate-spin mr-2 text-foreground" />
        Loading endpoints...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-foreground/10">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-1">
            Overview
          </span>
          <h1 className="text-3xl font-display font-bold text-foreground">Registered Endpoints</h1>
        </div>
        <Link
          to="/app/register"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground hover:bg-foreground/90 text-background rounded-full text-xs font-mono font-medium transition-colors shadow-sm"
        >
          <PlusCircle size={14} />
          Register API
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono mb-6">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {endpoints.length === 0 && !error ? (
        <div className="text-center py-20 border border-dashed border-foreground/15 rounded-3xl bg-card">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 text-muted-foreground">
            <PlusCircle size={22} />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">No endpoints yet</h2>
          <p className="text-muted-foreground text-xs font-mono mb-6 max-w-sm mx-auto leading-relaxed">
            Register your first HTTP origin API behind the modu proxy to start accepting x402 payments.
          </p>
          <Link
            to="/app/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-foreground hover:bg-foreground/90 text-background rounded-full text-xs font-mono font-medium transition-colors"
          >
            Register Your First API
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {endpoints.map((ep) => (
            <div
              key={ep.id}
              className="bg-card border border-foreground/10 rounded-2xl p-6 hover:border-foreground/25 transition-all shadow-sm group"
            >
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border ${
                        ep.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          ep.isActive ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                      />
                      {ep.isActive ? 'Active' : 'Revoked'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-muted text-foreground font-mono text-[11px] border border-foreground/10">
                      {ep.asset}
                    </span>
                    <span className="font-mono text-xs font-bold text-foreground">
                      {ep.price} {ep.asset}/req
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2 font-mono text-xs text-foreground min-w-0">
                    <span className="truncate text-foreground font-medium">{ep.proxyUrl}</span>
                    <button
                      onClick={() => handleCopy(ep.proxyUrl, ep.id)}
                      className="shrink-0 p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Copy proxy URL"
                    >
                      {copied === ep.id ? (
                        <CheckCircle size={13} className="text-emerald-600" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </div>

                  <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                    <span>Origin:</span>
                    <span className="truncate text-foreground/70">{ep.originUrl}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-8 shrink-0">
                  <div className="text-right">
                    <div className="text-2xl font-display font-bold text-foreground">
                      {ep.requestsToday}
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      Requests Today
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-display font-bold text-foreground">
                      {parseFloat(ep.revenueToday).toFixed(4)} {ep.asset}
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      Revenue Today
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    to={`/app/endpoints/${ep.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-foreground/15 rounded-full text-xs font-mono hover:bg-muted/50 transition-colors"
                  >
                    <BarChart2 size={13} />
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
