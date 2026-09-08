import { useEffect, useRef } from "react";

type FlowFieldProps = {
  darkMode: boolean;
  reducedMotion: boolean;
};

type Point = { x: number; y: number };
type Route = {
  start: Point;
  controlA: Point;
  controlB: Point;
  end: Point;
  phase: number;
  speed: number;
};

const ROUTES: Route[] = [
  { start: { x: 0.06, y: 0.78 }, controlA: { x: 0.22, y: 0.86 }, controlB: { x: 0.22, y: 0.48 }, end: { x: 0.39, y: 0.55 }, phase: 0.08, speed: 0.000055 },
  { start: { x: 0.39, y: 0.55 }, controlA: { x: 0.5, y: 0.62 }, controlB: { x: 0.52, y: 0.28 }, end: { x: 0.66, y: 0.34 }, phase: 0.46, speed: 0.000043 },
  { start: { x: 0.66, y: 0.34 }, controlA: { x: 0.76, y: 0.38 }, controlB: { x: 0.75, y: 0.7 }, end: { x: 0.9, y: 0.61 }, phase: 0.72, speed: 0.000047 },
  { start: { x: 0.9, y: 0.61 }, controlA: { x: 0.98, y: 0.43 }, controlB: { x: 0.93, y: 0.13 }, end: { x: 0.79, y: 0.16 }, phase: 0.28, speed: 0.000039 },
  { start: { x: 0.79, y: 0.16 }, controlA: { x: 0.55, y: 0.08 }, controlB: { x: 0.24, y: 0.16 }, end: { x: 0.06, y: 0.78 }, phase: 0.9, speed: 0.000031 },
];

const NODES = [
  { point: ROUTES[0].start, label: "LEARN" },
  { point: ROUTES[0].end, label: "APPLY" },
  { point: ROUTES[1].end, label: "PUBLISH" },
  { point: ROUTES[2].end, label: "COMPETE" },
  { point: ROUTES[3].end, label: "LEAD" },
] as const;

function cubicPoint(route: Route, position: number): Point {
  const inverse = 1 - position;
  return {
    x: inverse ** 3 * route.start.x + 3 * inverse ** 2 * position * route.controlA.x + 3 * inverse * position ** 2 * route.controlB.x + position ** 3 * route.end.x,
    y: inverse ** 3 * route.start.y + 3 * inverse ** 2 * position * route.controlA.y + 3 * inverse * position ** 2 * route.controlB.y + position ** 3 * route.end.y,
  };
}

export function FlowField({ darkMode, reducedMotion }: FlowFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let pageVisible = !document.hidden;
    const pointer = { x: 0.68, y: 0.42, active: false };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const project = (point: Point): Point => {
      const dx = point.x - pointer.x;
      const dy = point.y - pointer.y;
      const distance = Math.max(0.08, Math.hypot(dx, dy));
      const influence = pointer.active ? Math.max(0, 0.22 - distance) * 0.13 : 0;
      return { x: (point.x + (dx / distance) * influence) * width, y: (point.y + (dy / distance) * influence) * height };
    };

    const drawRoute = (route: Route) => {
      const start = project(route.start);
      const controlA = project(route.controlA);
      const controlB = project(route.controlB);
      const end = project(route.end);
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.bezierCurveTo(controlA.x, controlA.y, controlB.x, controlB.y, end.x, end.y);
      context.stroke();
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;
      context.strokeStyle = darkMode ? "rgba(74, 222, 128, 0.09)" : "rgba(7, 19, 12, 0.075)";
      const grid = width < 640 ? 44 : 64;
      for (let x = grid; x < width; x += grid) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }
      for (let y = grid; y < height; y += grid) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      context.lineWidth = width < 640 ? 1.25 : 1.6;
      context.strokeStyle = darkMode ? "rgba(74, 222, 128, 0.46)" : "rgba(22, 163, 74, 0.42)";
      ROUTES.forEach(drawRoute);

      for (const { point, label } of NODES) {
        const projected = project(point);
        context.fillStyle = darkMode ? "#4ade80" : "#15803d";
        context.beginPath();
        context.arc(projected.x, projected.y, width < 640 ? 3.5 : 4.5, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = darkMode ? "rgba(240, 253, 244, 0.62)" : "rgba(7, 19, 12, 0.57)";
        context.font = `${width < 640 ? 9 : 10}px ui-monospace, monospace`;
        context.fillText(label, projected.x + 10, projected.y - 9);
      }

      ROUTES.forEach((route) => {
        const position = reducedMotion ? route.phase : (route.phase + time * route.speed) % 1;
        const projected = project(cubicPoint(route, position));
        context.fillStyle = darkMode ? "#f0fdf4" : "#07130c";
        context.beginPath();
        context.arc(projected.x, projected.y, width < 640 ? 2.5 : 3.25, 0, Math.PI * 2);
        context.fill();
      });

      canvas.dataset.rendered = "true";
      if (!reducedMotion && pageVisible) animationFrame = window.requestAnimationFrame(draw);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - bounds.left) / Math.max(1, bounds.width);
      pointer.y = (event.clientY - bounds.top) / Math.max(1, bounds.height);
      pointer.active = true;
      if (reducedMotion) draw(0);
    };
    const handlePointerLeave = () => {
      pointer.active = false;
      if (reducedMotion) draw(0);
    };
    const handleVisibility = () => {
      pageVisible = !document.hidden;
      window.cancelAnimationFrame(animationFrame);
      if (pageVisible) draw(performance.now());
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      window.cancelAnimationFrame(animationFrame);
      draw(performance.now());
    });
    resizeObserver.observe(canvas);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibility);
    resize();
    draw(performance.now());

    return () => {
      resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [darkMode, reducedMotion]);

  return <canvas ref={canvasRef} className="flow-field" aria-hidden="true" />;
}
