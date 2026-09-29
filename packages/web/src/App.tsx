import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// ─── Layouts ─────────────────────────────────────────────────────────────────
import { MarketingLayout } from './layouts/MarketingLayout';
import { AppLayout } from './layouts/AppLayout';

// ─── Lazy page components ─────────────────────────────────────────────────────
const HomePage           = React.lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const PlaygroundPage     = React.lazy(() => import('./pages/PlaygroundPage').then(m => ({ default: m.PlaygroundPage })));
const DocsPage           = React.lazy(() => import('./pages/DocsPage').then(m => ({ default: m.DocsPage })));
const EndpointsPage      = React.lazy(() => import('./pages/EndpointsPage').then(m => ({ default: m.EndpointsPage })));
const EndpointDetailPage = React.lazy(() => import('./pages/EndpointDetailPage').then(m => ({ default: m.EndpointDetailPage })));
const RegisterPage       = React.lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const WalletPage         = React.lazy(() => import('./pages/WalletPage').then(m => ({ default: m.WalletPage })));
const CliAuthPage        = React.lazy(() => import('./pages/CliAuthPage').then(m => ({ default: m.CliAuthPage })));
const NotFoundPage       = React.lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// ─── Loading fallback ─────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" />
      <p className="text-sm text-muted font-mono">loading…</p>
    </div>
  </div>
);

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Marketing routes (Nav + Footer) ─────────────────────── */}
        <Route element={<MarketingLayout />}>
          <Route path="/"           element={<HomePage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/docs"       element={<DocsPage />} />
        </Route>

        {/* ── Standalone route – no layout ────────────────────────── */}
        <Route path="/app/cli-auth" element={<CliAuthPage />} />

        {/* ── App routes (sidebar layout) ──────────────────────────── */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="/app/endpoints" replace />} />
          <Route path="endpoints"     element={<EndpointsPage />} />
          <Route path="endpoints/:id" element={<EndpointDetailPage />} />
          <Route path="register"      element={<RegisterPage />} />
          <Route path="wallet"        element={<WalletPage />} />
        </Route>

        {/* ── 404 ──────────────────────────────────────────────────── */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
