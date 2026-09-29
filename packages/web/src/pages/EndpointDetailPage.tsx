import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Copy, CheckCircle, AlertCircle, Loader2, Trash2, Radio,
  ExternalLink, TrendingUp, Users, DollarSign, Activity,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { getEndpointStats, deleteEndpoint, subscribeToLogs, type EndpointStats, type LogEntry } from '../api';
import { ALGORAND_EXPLORER } from '../config';
import { truncateAddress, formatAmount, copyToClipboard } from '../lib/utils';

export function EndpointDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [stats, setStats] = useState<EndpointStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [streaming, setStreaming] = useState(false);
  const esRef = useRef<EventSource | null>(null);

  const [revoking, setRevoking] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    getEndpointStats(id)
      .then(setStats)
      .catch((err) => setError(err.message || 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, [id]);

  const startStream = useCallback(() => {
    if (!id || esRef.current) return;
    setStreaming(true);
    const es = subscribeToLogs(
      id,
      (log: LogEntry) => setLogs((prev) => [log, ...prev].slice(0, 50)),
      () => setStreaming(false),
    );
    esRef.current = es;
  }, [id]);

  const stopStream = useCallback(() => {
    esRef.current?.close();
    esRef.current = null;
    setStreaming(false);
  }, []);

  useEffect(() => () => stopStream(), [stopStream]);

  async function handleRevoke() {
    if (!id) return;
    setRevoking(true);
    try {
      await deleteEndpoint(id);
      navigate('/app/endpoints');
    } catch (err: any) {
      setError(err.message || 'Failed to revoke endpoint');
      setRevoking(false);
    }
  }

  async function handleCopy(text: string) {
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground font-mono text-xs">
        <Loader2 size={20} className="animate-spin mr-2 text-foreground" />
        Loading endpoint metrics...
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-center gap-2">
        <AlertCircle size={18} />
        {error}
      </div>
    );
  }

  const revenueData = stats?.revenueByDay?.map((d) => ({
    date: d.date,
    revenue: parseFloat(d.amount),
    requests: d.requests,
  })) ?? [];

  const proxyUrl = `${import.meta.env.VITE_PROXY_URL || 'https://modu-proxy.onrender.com'}/p/${id}`;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-foreground/10">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            to="/app/endpoints"
            className="w-9 h-9 rounded-full border border-foreground/15 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors shrink-0"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground truncate">
                /p/{id?.slice(0, 14)}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground mt-1">
              <span className="truncate">{proxyUrl}</span>
              <button
                onClick={() => handleCopy(proxyUrl)}
                className="hover:text-foreground transition-colors p-1"
                title="Copy proxy URL"
              >
                {copied ? <CheckCircle size={12} className="text-emerald-600" /> : <Copy size={12} />}
              </button>
            </div>
          </div>
        </div>

        {/* Revoke Action */}
        <div>
          {!confirmRevoke ? (
            <button
              onClick={() => setConfirmRevoke(true)}
              className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-full text-xs font-mono font-medium transition-colors inline-flex items-center gap-1.5"
            >
              <Trash2 size={13} />
              Revoke
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-red-600">Confirm?</span>
              <button
                onClick={handleRevoke}
                disabled={revoking}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-mono font-medium transition-colors"
              >
                {revoking ? <Loader2 size={12} className="animate-spin" /> : 'Yes, Revoke'}
              </button>
              <button
                onClick={() => setConfirmRevoke(false)}
                className="px-3 py-1.5 border border-foreground/20 rounded-full text-xs font-mono hover:bg-muted/40 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Activity, label: 'Total Requests', value: stats?.totalRequests?.toString() ?? '—' },
          { icon: CheckCircle, label: 'Paid Requests', value: stats?.paidRequests?.toString() ?? '—' },
          { icon: DollarSign, label: 'Total Revenue', value: `${stats?.totalRevenue ?? '—'}` },
          { icon: TrendingUp, label: 'Revenue Today', value: `${stats?.revenueToday ?? '—'}` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-card border border-foreground/10 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground text-[11px] font-mono uppercase tracking-wider mb-2">
              <Icon size={14} className="text-foreground" />
              {label}
            </div>
            <div className="text-2xl font-display font-bold text-foreground">{value}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-card border border-foreground/10 rounded-2xl p-6 lg:p-8 mb-8 shadow-sm">
        <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2.5">
          <TrendingUp size={18} />
          Settlement Revenue by Day
        </h2>
        {revenueData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#141410" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#141410" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e3d8" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#66645b', fontFamily: 'monospace' }} />
              <YAxis tick={{ fontSize: 11, fill: '#66645b', fontFamily: 'monospace' }} />
              <Tooltip
                contentStyle={{
                  background: '#ffffff',
                  border: '1px solid #e6e3d8',
                  borderRadius: 12,
                  fontSize: 12,
                  fontFamily: 'monospace',
                }}
                labelStyle={{ color: '#66645b' }}
                itemStyle={{ color: '#141410', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#141410" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[220px] flex items-center justify-center text-muted-foreground text-xs font-mono border border-dashed border-foreground/10 rounded-xl">
            No daily transactions recorded yet
          </div>
        )}
      </div>

      {/* Split: Payers + Live Stream */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top Payers */}
        <div className="bg-card border border-foreground/10 rounded-2xl p-6 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2.5">
            <Users size={18} />
            Top Counterparties
          </h2>
          {stats?.topPayers && stats.topPayers.length > 0 ? (
            <div className="space-y-3">
              {stats.topPayers.slice(0, 5).map((p) => (
                <div key={p.address} className="flex items-center justify-between py-2 border-b border-foreground/5 last:border-0">
                  <a
                    href={`${ALGORAND_EXPLORER}/${p.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-foreground font-medium hover:underline flex items-center gap-1.5"
                  >
                    {truncateAddress(p.address)}
                    <ExternalLink size={10} className="text-muted-foreground" />
                  </a>
                  <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                    <span>{p.requests} req</span>
                    <span className="text-foreground font-bold">{formatAmount(p.totalAmount)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground text-xs font-mono py-8 text-center border border-dashed border-foreground/10 rounded-xl">
              No transactions recorded
            </div>
          )}
        </div>

        {/* Live SSE Stream */}
        <div className="bg-card border border-foreground/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2.5">
              <Radio size={18} className={streaming ? 'text-emerald-600 animate-pulse' : 'text-muted-foreground'} />
              Live SSE Request Log
            </h2>
            <button
              onClick={streaming ? stopStream : startStream}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-colors ${
                streaming
                  ? 'border border-foreground/20 text-foreground hover:bg-muted/40'
                  : 'bg-foreground text-background hover:bg-foreground/90'
              }`}
            >
              {streaming ? 'Stop Stream' : 'Connect Stream'}
            </button>
          </div>

          <div className="bg-muted/30 border border-foreground/10 rounded-xl p-4 h-[220px] overflow-y-auto space-y-2 text-xs font-mono">
            {logs.length === 0 ? (
              <span className="text-muted-foreground">
                {streaming ? 'Connected to SSE broker. Waiting for incoming settlements...' : 'Click "Connect Stream" to listen to live proxy logs via SSE.'}
              </span>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="pb-1.5 border-b border-foreground/5 last:border-0 flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-muted-foreground">
                      {new Date(log.timestamp || '').toLocaleTimeString()}
                    </span>
                    <span className={`font-bold ${(log.status ?? 0) >= 200 && (log.status ?? 0) < 300 ? 'text-emerald-700' : 'text-red-600'}`}>
                      {log.status ?? '200'}
                    </span>
                    <span className="text-muted-foreground">{log.latencyMs}ms</span>
                  </div>
                  {log.txid && (
                    <a
                      href={`${ALGORAND_EXPLORER}/${log.txid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground underline underline-offset-2 flex items-center gap-1 shrink-0 ml-2"
                    >
                      {log.txid.slice(0, 8)}...
                      <ExternalLink size={9} />
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
