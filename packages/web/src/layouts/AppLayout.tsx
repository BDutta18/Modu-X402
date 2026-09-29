import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, PlusCircle, Wallet, LogOut, Github, Zap, BookOpen
} from 'lucide-react';
import { clearApiKey } from '../lib/auth';
import { GITHUB_URL } from '../config';

const NAV_ITEMS = [
  { to: '/app/endpoints', icon: LayoutDashboard, label: 'Endpoints' },
  { to: '/app/register', icon: PlusCircle, label: 'Register API' },
  { to: '/app/wallet', icon: Wallet, label: 'Wallet' },
];

export function AppLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    clearApiKey();
    navigate('/');
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-foreground/10 bg-card">
        {/* Brand Header */}
        <Link to="/" className="flex items-center gap-2.5 h-20 px-6 border-b border-foreground/10 group">
          <img src="/logo.png" alt="modu logo" className="w-8 h-8 object-contain rounded-md" />
          <span className="font-display font-bold text-2xl text-foreground">modu</span>
          <span className="font-mono text-[10px] text-muted-foreground border border-foreground/15 rounded px-1.5 py-0.5 ml-1">
            x402
          </span>
        </Link>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-3 py-2">
            Console
          </div>
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium transition-colors ${
                  isActive
                    ? 'bg-foreground text-background shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}

          <div className="mt-auto pt-4 border-t border-foreground/10 flex flex-col gap-1">
            <NavLink
              to="/playground"
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            >
              <Zap size={15} />
              Playground
            </NavLink>
            <NavLink
              to="/docs"
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            >
              <BookOpen size={15} />
              Docs
            </NavLink>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            >
              <Github size={15} />
              GitHub
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-mono text-red-600 hover:bg-red-50 transition-colors w-full text-left mt-2"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-6 h-16 border-b border-foreground/10 bg-card">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="modu logo" className="w-6 h-6 object-contain rounded" />
            <span className="font-display font-bold text-xl text-foreground">modu</span>
          </Link>
          <nav className="flex items-center gap-2">
            {NAV_ITEMS.map(({ to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `p-2 rounded-lg text-xs font-mono ${
                    isActive ? 'bg-foreground text-background' : 'text-muted-foreground'
                  }`
                }
              >
                <Icon size={16} />
              </NavLink>
            ))}
            <button onClick={handleLogout} className="p-2 text-muted-foreground hover:text-red-600">
              <LogOut size={16} />
            </button>
          </nav>
        </div>

        <main className="flex-1 overflow-auto p-6 lg:p-10 max-w-5xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
