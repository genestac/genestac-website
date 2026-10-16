// ============================================================
// Path Generation — Sine-wave zigzag positioning for journey map
// ============================================================

export interface PathPoint {
  x: number;
  y: number;
  levelIndex: number;
}

/**
 * Generate node positions for the journey map.
 * Creates a winding sine-wave path from top to bottom.
 */
export function generatePath(
  levelCount: number,
  width: number = 320,
  options?: {
    amplitude?: number;
    verticalGap?: number;
    startY?: number;
    frequency?: number;
  }
): PathPoint[] {
  const {
    amplitude = width * 0.28,
    verticalGap = 140,
    startY = 100,
    frequency = 0.9,
  } = options || {};

  const points: PathPoint[] = [];

  for (let i = 0; i < levelCount; i++) {
    const x = width / 2 + Math.sin(i * frequency) * amplitude;
    const y = i * verticalGap + startY;
    points.push({ x, y, levelIndex: i + 1 });
  }

  return points;
}

/**
 * Generate a smooth SVG path string (quadratic bezier curves) connecting all points.
 */
export function generateSVGPath(points: PathPoint[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];

    // Control point is at the midpoint horizontally, at the previous point's y
    const cpX = (prev.x + curr.x) / 2;
    const cpY = (prev.y + curr.y) / 2;

    path += ` Q ${prev.x} ${cpY}, ${cpX} ${cpY}`;

    if (i === points.length - 1) {
      path += ` Q ${curr.x} ${cpY}, ${curr.x} ${curr.y}`;
    }
  }

  return path;
}

/**
 * Alternative: generate SVG path as a simple smooth curve through all points
 * using catmull-rom-to-bezier approximation.
 */
export function generateSmoothSVGPath(points: PathPoint[]): string {
  if (points.length < 2) return points.length === 1 ? `M ${points[0].x} ${points[0].y}` : '';

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    // Catmull-Rom to Cubic Bezier conversion
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return path;
}

/**
 * Calculate total path height (for setting SVG/container height).
 */
export function getPathHeight(points: PathPoint[], padding: number = 100): number {
  if (points.length === 0) return 0;
  return points[points.length - 1].y + padding;
}
