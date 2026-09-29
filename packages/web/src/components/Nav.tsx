import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Github, Terminal, ChevronDown, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { getApiKey, clearApiKey } from '../lib/auth';
import { GITHUB_URL } from '../config';

export function Nav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const authed = !!getApiKey();

  function handleLogout() {
    clearApiKey();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-label="modu logo">
            <rect width="28" height="28" rx="7" fill="#14b8a6" fillOpacity="0.15" />
            <rect x="0.5" y="0.5" width="27" height="27" rx="6.5" stroke="#14b8a6" strokeOpacity="0.4" />
            <text x="14" y="19" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="13" fill="#14b8a6">m</text>
          </svg>
          <span className="font-bold text-[17px] tracking-tight text-foreground">modu</span>
          <span className="hidden sm:inline-block font-mono text-[10px] text-muted border border-border rounded px-1.5 py-0.5 ml-1">x402</span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-1 ml-2">
          {[
            { to: '/', label: 'Home', exact: true },
            { to: '/playground', label: 'Playground' },
            { to: '/docs', label: 'Docs' },
          ].map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'text-foreground bg-surface-2'
                    : 'text-muted hover:text-foreground hover:bg-surface-2'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-muted hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>

          {authed ? (
            <div className="flex items-center gap-2">
              <Link to="/app/endpoints" className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-ghost p-2" aria-label="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/app/cli-auth" className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
              <Terminal size={15} />
              Get started
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-1">
          {[
            { to: '/', label: 'Home' },
            { to: '/playground', label: 'Playground' },
            { to: '/docs', label: 'Docs' },
            ...(authed ? [{ to: '/app/endpoints', label: 'Dashboard' }] : []),
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'text-foreground bg-surface-2' : 'text-muted'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
