import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Record<string, string> }
)  {
  const { width, height } = params;
  
  let w = parseInt(width, 10) || DEFAULT_WIDTH;
  let h = parseInt(height, 10) || DEFAULT_HEIGHT;

  // Clamp values within min/max
  w = Math.min(Math.max(w, MIN_SIZE), MAX_SIZE);
  h = Math.min(Math.max(h, MIN_SIZE), MAX_SIZE);

  // Generate SVG placeholder
  const svg = `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#9ca3af" text-anchor="middle" dy=".3em">
        ${w} × ${h}
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000",
    },
  });
}
