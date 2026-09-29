import { Link } from 'react-router-dom';
import { ArrowLeft, Terminal } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-24 bg-background text-foreground">
      <div className="text-center max-w-md">
        <div className="font-display text-8xl font-bold text-foreground mb-4 opacity-90">404</div>
        <h1 className="text-3xl font-display font-bold mb-3 text-foreground">Page Not Found</h1>
        <p className="text-muted-foreground text-xs font-mono mb-8 leading-relaxed">
          The requested route does not exist. Check the URL or return to documentation.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-foreground text-background rounded-full font-mono text-xs font-semibold"
          >
            <ArrowLeft size={14} />
            Go Home
          </Link>
          <Link
            to="/docs"
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-foreground/20 rounded-full font-mono text-xs font-semibold hover:bg-muted/40"
          >
            <Terminal size={14} />
            Read Docs
          </Link>
        </div>
      </div>
    </div>
  );
}
