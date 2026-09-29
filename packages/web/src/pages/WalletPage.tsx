import { useEffect, useState } from 'react';
import { Loader2, AlertCircle, CheckCircle, Shield, Key, ExternalLink } from 'lucide-react';
import { getMe, updatePayoutAddress } from '../api';
import { ALGORAND_EXPLORER } from '../config';

function isValidAlgorandAddress(addr: string): boolean {
  return /^[A-Z2-7]{58}$/.test(addr.trim());
}

export function WalletPage() {
  const [me, setMe] = useState<{ id: string; email?: string; payoutAddress?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addr, setAddr] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState('');
  const [saved, setSaved] = useState(false);
  const [addrErr, setAddrErr] = useState('');

  useEffect(() => {
    getMe()
      .then((data) => {
        setMe(data);
        setAddr(data.payoutAddress || '');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function validateAddress(value: string) {
    if (!value) {
      setAddrErr('');
      return;
    }
    if (!isValidAlgorandAddress(value)) {
      setAddrErr('Invalid Algorand address (must be 58-character base32)');
    } else {
      setAddrErr('');
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (addrErr || !addr.trim()) return;
    setSaving(true);
    setSaveErr('');
    setSaved(false);
    try {
      const data = await updatePayoutAddress(addr.trim());
      setMe((m) => (m ? { ...m, payoutAddress: data.payoutAddress } : m));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setSaveErr(err.message || 'Failed to update address');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground font-mono text-xs">
        <Loader2 size={20} className="animate-spin mr-2 text-foreground" />
        Loading wallet profile...
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div className="border-b border-foreground/10 pb-6">
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-1">
          Settlement Configuration
        </span>
        <h1 className="text-3xl font-display font-bold text-foreground">Payout Wallet</h1>
        <p className="text-xs font-mono text-muted-foreground mt-2">
          Configure where Algorand settlement revenues from all your x402 endpoints are deposited.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {/* Current Address Card */}
      <div className="bg-card border border-foreground/10 rounded-2xl p-6 lg:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center">
            <Key size={15} />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">Connected Payout Address</h2>
        </div>

        {me?.payoutAddress ? (
          <div className="p-4 bg-muted/30 border border-foreground/10 rounded-xl space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
              Active On-Chain Destination
            </span>
            <div className="flex items-center justify-between gap-3">
              <code className="font-mono text-xs text-foreground font-semibold break-all">
                {me.payoutAddress}
              </code>
              <a
                href={`${ALGORAND_EXPLORER}/address/${me.payoutAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground shrink-0 p-1"
                title="View on Algorand Explorer"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-mono rounded-xl">
            No payout address connected yet. Endpoints cannot be registered until an address is configured.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-mono font-medium text-foreground mb-2">
              {me?.payoutAddress ? 'Update Algorand Payout Address' : 'Connect Payout Address'}
            </label>
            <input
              type="text"
              className={`w-full bg-background border ${
                addrErr ? 'border-red-400' : 'border-foreground/20'
              } rounded-xl px-4 py-2.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground`}
              placeholder="ALGO4XKABCDEFGHIJKLMNOPQRSTUVWXYZ234567890ABCDEFGHIJKLMNOP"
              value={addr}
              onChange={(e) => {
                setAddr(e.target.value);
                validateAddress(e.target.value);
              }}
            />
            {addrErr && <p className="text-xs font-mono text-red-600 mt-1.5">{addrErr}</p>}
            {!addrErr && addr && (
              <p className="text-xs font-mono text-emerald-600 mt-1.5 flex items-center gap-1">
                <CheckCircle size={12} /> Valid Algorand address format
              </p>
            )}
          </div>

          {saveErr && <p className="text-xs font-mono text-red-600">{saveErr}</p>}

          <button
            type="submit"
            disabled={saving || !!addrErr || !addr.trim()}
            className="w-full py-3 bg-foreground hover:bg-foreground/90 text-background rounded-full font-mono text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? <Loader2 size={13} className="animate-spin inline mr-2" /> : null}
            {saving ? 'Updating...' : saved ? '✓ Address Updated' : 'Save Payout Address'}
          </button>
        </form>
      </div>

      {/* Security Architecture Notes */}
      <div className="bg-card border border-foreground/10 rounded-2xl p-6 lg:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center">
            <Shield size={15} />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">Non-Custodial Guarantee</h2>
        </div>

        <div className="grid gap-4 text-xs font-mono text-muted-foreground">
          <div className="p-4 rounded-xl border border-foreground/10 bg-muted/20">
            <div className="font-semibold text-foreground mb-1">Local Key Generation</div>
            <div>
              Keys generated via <code className="text-foreground">modu wallet create</code> never leave your machine.
              Stored in <code className="text-foreground">~/.modu/config.json</code> with 0600 permissions.
            </div>
          </div>
          <div className="p-4 rounded-xl border border-foreground/10 bg-muted/20">
            <div className="font-semibold text-foreground mb-1">Direct Settlement</div>
            <div>
              Incoming USDC and ALGO payments settle directly from the consumer's wallet into your payout address.
              No escrow, no holding period.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
