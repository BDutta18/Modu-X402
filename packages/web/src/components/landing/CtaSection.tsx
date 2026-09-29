import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AnimatedTetrahedron } from "../canvas/AnimatedTetrahedron";

export function CtaSection() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section className="py-24 lg:py-36 overflow-hidden bg-background">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          onMouseMove={handleMouseMove}
          className="relative border border-foreground/20 rounded-3xl p-8 lg:p-16 overflow-hidden bg-card shadow-sm"
        >
          {/* Mouse spotlight */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(20,20,16,0.2), transparent 45%)`,
            }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground block mb-4">
                Get Started in 60 Seconds
              </span>
              <h2 className="text-4xl lg:text-7xl font-display tracking-tight text-foreground mb-6 leading-[0.95]">
                Ready to monetize
                <br />
                your API?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
                One CLI command turns any HTTP origin into a pay-per-request endpoint on Algorand.
                Non-custodial, ~3s settlement, sub-cent fees.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  to="/app/cli-auth"
                  className="inline-flex items-center justify-center bg-foreground hover:bg-foreground/90 text-background px-8 h-14 text-base font-medium rounded-full transition-transform hover:-translate-y-0.5 group shadow-md"
                >
                  Authorize CLI Session
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/docs"
                  className="inline-flex items-center justify-center h-14 px-8 text-base font-medium rounded-full border border-foreground/20 hover:bg-foreground/5 transition-colors"
                >
                  Read the docs
                </Link>
              </div>

              <p className="text-xs font-mono text-muted-foreground mt-8">
                npm install -g modu
              </p>
            </div>

            {/* Right 3D Wireframe ASCII Tetrahedron */}
            <div className="w-[320px] h-[320px] lg:w-[420px] lg:h-[420px] shrink-0 opacity-80 pointer-events-none">
              <AnimatedTetrahedron />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
