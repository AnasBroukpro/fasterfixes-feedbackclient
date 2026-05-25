type Props = { title: string };

function titleFontSize(title: string) {
  if (title.length <= 40) return 96;
  if (title.length <= 60) return 80;
  if (title.length <= 80) return 64;
  return 52;
}

// Mirrors the home-page hero dot background (a dim "/" on a 24px grid).
// Static SVG data URI tile — Satori does not support <canvas> or repeating CSS
// patterns reliably, but it does composite layered data-URI backgrounds.
const PATTERN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><text x="12" y="16" font-family="monospace" font-size="8" fill="#f8fafc" fill-opacity="0.07" text-anchor="middle">/</text></svg>`;
const PATTERN_DATA_URI = `data:image/svg+xml;base64,${Buffer.from(PATTERN_SVG).toString("base64")}`;

export function OgCard({ title }: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        backgroundColor: "#020617",
        backgroundImage: `url("${PATTERN_DATA_URI}"), radial-gradient(ellipse at top left, #1e293b 0%, #020617 60%)`,
        backgroundRepeat: "repeat, no-repeat",
        backgroundSize: "24px 24px, 100% 100%",
        color: "#f8fafc",
        fontFamily: "Space Grotesk",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 36,
          fontWeight: 700,
          opacity: 0.7,
          letterSpacing: "-0.02em",
        }}
      >
        /fasterfixes
      </div>
      <div
        style={{
          display: "flex",
          fontSize: titleFontSize(title),
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          maxWidth: 1040,
        }}
      >
        {title}
      </div>
    </div>
  );
}
