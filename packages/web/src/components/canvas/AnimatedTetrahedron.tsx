import { useEffect, useRef } from "react";

export function AnimatedTetrahedron() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Tetrahedron vertices
    const vertices = [
      { x: 0, y: 1, z: 0 },
      { x: -0.943, y: -0.333, z: -0.5 },
      { x: 0.943, y: -0.333, z: -0.5 },
      { x: 0, y: -0.333, z: 1 },
    ];

    const edges = [
      [0, 1], [0, 2], [0, 3],
      [1, 2], [2, 3], [3, 1],
    ];

    const rotateY = (point: { x: number; y: number; z: number }, angle: number) => ({
      x: point.x * Math.cos(angle) - point.z * Math.sin(angle),
      y: point.y,
      z: point.x * Math.sin(angle) + point.z * Math.cos(angle),
    });

    const rotateX = (point: { x: number; y: number; z: number }, angle: number) => ({
      x: point.x,
      y: point.y * Math.cos(angle) - point.z * Math.sin(angle),
      z: point.y * Math.sin(angle) + point.z * Math.cos(angle),
    });

    const rotateZ = (point: { x: number; y: number; z: number }, angle: number) => ({
      x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
      y: point.x * Math.sin(angle) + point.y * Math.cos(angle),
      z: point.z,
    });

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const scale = Math.min(rect.width, rect.height) * 0.45;

      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const points: { x: number; y: number; z: number; char: string }[] = [];

      edges.forEach(([i, j]) => {
        const v1 = vertices[i];
        const v2 = vertices[j];

        for (let t = 0; t <= 1; t += 0.06) {
          let point = {
            x: v1.x + (v2.x - v1.x) * t,
            y: v1.y + (v2.y - v1.y) * t,
            z: v1.z + (v2.z - v1.z) * t,
          };

          point = rotateY(point, time * 0.4);
          point = rotateX(point, time * 0.3);
          point = rotateZ(point, time * 0.2);

          points.push({
            x: centerX + point.x * scale,
            y: centerY + point.y * scale,
            z: point.z,
            char: t === 0 || t >= 0.95 ? "●" : "─",
          });
        }
      });

      points.sort((a, b) => a.z - b.z);

      points.forEach((point) => {
        const alpha = 0.2 + (point.z + 1) * 0.4;
        ctx.fillStyle = `rgba(20, 20, 16, ${alpha})`;
        ctx.fillText(point.char, point.x, point.y);
      });

      time += 0.02;
      frameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
