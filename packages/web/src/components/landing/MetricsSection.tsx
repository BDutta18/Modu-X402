import { useEffect, useState, useRef } from "react";

function AnimatedCounter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, hasAnimated]);

  return (
    <div ref={ref} className="text-5xl lg:text-7xl font-display tracking-tight text-foreground">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

const metrics = [
  { value: 100, suffix: "%", label: "Non-custodial key architecture" },
  { value: 99, suffix: ".99%", label: "Edge proxy gateway uptime" },
  { value: 1, suffix: " cmd", label: "To register & monetize any HTTP API" },
  { value: 3, suffix: " sec", label: "Average deterministic settlement" },
];

export function MetricsSection() {
  const [time, setTime] = useState(new Date());
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-36 border-y border-foreground/10 bg-muted/20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 lg:mb-24">
          <div>
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
              <span className="w-8 h-px bg-foreground/30" />
              Real Performance
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight text-foreground">
              By the numbers.
            </h2>
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            UTC {time.toUTCString().slice(17, 25)} · Algorand TestNet Active
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((m, idx) => (
            <div key={idx} className="p-6 border border-foreground/10 rounded-xl bg-card">
              <AnimatedCounter end={m.value} suffix={m.suffix} />
              <div className="mt-3 text-sm text-muted-foreground font-mono leading-relaxed">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
