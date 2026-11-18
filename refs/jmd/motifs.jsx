// motifs.jsx — abstract, respectful cultural motifs as design elements.
// Thin gold linework: yantra/mandala geometry, stylized trishul & lotus,
// section dividers. All stroke-driven so they scale crisply at any size.
// Exported to window for use across the babel scripts.

const STROKE = "currentColor";

/* ---- Large background yantra (Sri-yantra abstraction) ---- */
function Yantra({ className = "", style = {} }) {
  // interlocking triangles + lotus petal ring + bindu, all line-only
  const petals = [];
  const R = 150, r = 120, n = 16;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const a2 = ((i + 0.5) / n) * Math.PI * 2;
    const x1 = 256 + Math.cos(a) * r, y1 = 256 + Math.sin(a) * r;
    const cx = 256 + Math.cos(a2) * R, cy = 256 + Math.sin(a2) * R;
    const a3 = ((i + 1) / n) * Math.PI * 2;
    const x2 = 256 + Math.cos(a3) * r, y2 = 256 + Math.sin(a3) * r;
    petals.push(<path key={i} d={`M${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`} />);
  }
  return (
    <svg viewBox="0 0 512 512" className={className} style={style}
         fill="none" stroke={STROKE} strokeWidth="1" aria-hidden="true">
      <g className="spin-slow" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <circle cx="256" cy="256" r="200" strokeWidth="0.8" opacity="0.55" />
        <circle cx="256" cy="256" r="172" strokeWidth="0.8" opacity="0.4" />
        <g opacity="0.7">{petals}</g>
      </g>
      {/* interlocking triangles */}
      <g opacity="0.9">
        <path d="M256 96 L408 360 L104 360 Z" />
        <path d="M256 416 L104 152 L408 152 Z" />
        <path d="M256 150 L356 326 L156 326 Z" opacity="0.8" />
        <path d="M256 362 L156 186 L356 186 Z" opacity="0.8" />
      </g>
      <circle cx="256" cy="256" r="92" strokeWidth="0.8" opacity="0.5" />
      <circle cx="256" cy="256" r="6" fill={STROKE} stroke="none" />
      {/* square gate */}
      <g opacity="0.35" strokeWidth="0.8">
        <rect x="76" y="76" width="360" height="360" />
        <path d="M256 56 L256 76 M256 436 L256 456 M56 256 L76 256 M436 256 L456 256" />
      </g>
    </svg>
  );
}

/* ---- Concentric mandala ring (lighter, for accents) ---- */
function MandalaRing({ className = "", style = {} }) {
  const ticks = [];
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const x1 = 128 + Math.cos(a) * 104, y1 = 128 + Math.sin(a) * 104;
    const x2 = 128 + Math.cos(a) * 116, y2 = 128 + Math.sin(a) * 116;
    ticks.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />);
  }
  const petals = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    petals.push(
      <ellipse key={i} cx="128" cy="58" rx="13" ry="36"
        transform={`rotate(${(a * 180) / Math.PI} 128 128)`} opacity="0.6" />
    );
  }
  return (
    <svg viewBox="0 0 256 256" className={className} style={style}
         fill="none" stroke={STROKE} strokeWidth="1" aria-hidden="true">
      <circle cx="128" cy="128" r="122" opacity="0.4" />
      <g opacity="0.55">{ticks}</g>
      <circle cx="128" cy="128" r="92" opacity="0.5" />
      <g>{petals}</g>
      <circle cx="128" cy="128" r="30" opacity="0.7" />
      <circle cx="128" cy="128" r="4" fill={STROKE} stroke="none" />
    </svg>
  );
}

/* ---- Modal — shared overlay for program & membership detail cards ---- */
function Modal({ open, onClose, children, variant = "" }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal__scrim"></div>
      <div className={"modal__card " + variant} onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" aria-label="Close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        {children}
      </div>
    </div>
  );
}

/* ---- Trishul (trident) — a true three-pronged trishul, line vector ---- */
function Trishul({ className = "", style = {}, sw = 1.6 }) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style}
         fill="none" stroke={STROKE} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* central spike + leaf tip */}
      <path d="M32 27 L32 6" />
      <path d="M28 11 L32 3 L36 11" />
      {/* outer prongs, curving up to sharp points */}
      <path d="M15 28 C12 19 14 12 21 7" />
      <path d="M21 7 L24 13" />
      <path d="M49 28 C52 19 50 12 43 7" />
      <path d="M43 7 L40 13" />
      {/* crescent crossbar where the prongs meet */}
      <path d="M14 26 Q32 34 50 26" />
      {/* shaft + binding rings + spear foot */}
      <path d="M32 33 L32 58" />
      <path d="M27 37 L37 37" />
      <path d="M28 41 L36 41" />
      <path d="M29 57 L32 62 L35 57" />
    </svg>
  );
}

/* ---- Lotus — stylized, line icon ---- */
function Lotus({ className = "", style = {}, sw = 1.6 }) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style}
         fill="none" stroke={STROKE} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M32 16 C26 26 26 38 32 46 C38 38 38 26 32 16 Z" />
      <path d="M32 46 C24 44 16 36 16 26 C24 28 30 36 32 46 Z" />
      <path d="M32 46 C40 44 48 36 48 26 C40 28 34 36 32 46 Z" />
      <path d="M32 46 C20 48 10 44 8 38 C16 36 26 40 32 46 Z" />
      <path d="M32 46 C44 48 54 44 56 38 C48 36 38 40 32 46 Z" />
    </svg>
  );
}

/* ---- Flame / diya — for recovery/devotion ---- */
function Flame({ className = "", style = {}, sw = 1.6 }) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style}
         fill="none" stroke={STROKE} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M32 8 C40 22 46 28 46 38 C46 48 40 54 32 54 C24 54 18 48 18 38 C18 30 24 28 28 22 C30 28 28 34 33 36 C37 33 34 26 32 8 Z" />
    </svg>
  );
}

/* ---- Chakra / wheel — for conditioning ---- */
function Chakra({ className = "", style = {}, sw = 1.6 }) {
  const spokes = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    spokes.push(<line key={i} x1={32 + Math.cos(a) * 8} y1={32 + Math.sin(a) * 8}
      x2={32 + Math.cos(a) * 22} y2={32 + Math.sin(a) * 22} />);
  }
  return (
    <svg viewBox="0 0 64 64" className={className} style={style}
         fill="none" stroke={STROKE} strokeWidth={sw} strokeLinecap="round" aria-hidden="true">
      <circle cx="32" cy="32" r="24" />
      <circle cx="32" cy="32" r="8" />
      {spokes}
    </svg>
  );
}

/* ---- Kettlebell — for strength ---- */
function Kettle({ className = "", style = {}, sw = 1.6 }) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style}
         fill="none" stroke={STROKE} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M24 22 C24 14 30 12 32 12 C34 12 40 14 40 22" />
      <path d="M22 24 C16 28 14 38 16 46 C17 51 21 54 26 54 L38 54 C43 54 47 51 48 46 C50 38 48 28 42 24 C38 21 26 21 22 24 Z" />
    </svg>
  );
}

/* ---- Figure illustrations for The Method: meditate · stretch · lift ---- */
function FigMeditate({ className = "", style = {}, sw = 3.2 }) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={style}
         fill="none" stroke={STROKE} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="60" cy="28" r="10" />
      <path d="M60 38 L60 70" />
      <path d="M47 50 Q60 45 73 50" />
      <path d="M47 50 Q40 62 45 72" />
      <path d="M73 50 Q80 62 75 72" />
      <path d="M37 88 Q60 74 83 88" />
      <path d="M37 88 Q37 97 47 97 L73 97 Q83 97 83 88" />
      <path d="M50 97 Q60 86 70 97" />
      <circle cx="45" cy="72" r="2.6" fill={STROKE} stroke="none" />
      <circle cx="75" cy="72" r="2.6" fill={STROKE} stroke="none" />
    </svg>
  );
}

function FigStretch({ className = "", style = {}, sw = 3.2 }) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={style}
         fill="none" stroke={STROKE} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="56" cy="24" r="9" />
      <path d="M58 33 Q63 50 60 66" />
      <path d="M58 35 Q64 22 74 14" />
      <path d="M62 36 Q70 24 74 14" />
      <circle cx="75" cy="13" r="3" />
      <path d="M60 66 Q54 82 52 98" />
      <path d="M60 66 Q68 80 72 98" />
      <path d="M47 98 L55 98" />
      <path d="M68 98 L76 98" />
    </svg>
  );
}

function FigLift({ className = "", style = {}, sw = 3.2 }) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={style}
         fill="none" stroke={STROKE} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="46" cy="30" r="9" />
      <path d="M51 37 Q63 43 73 49" />
      <path d="M73 49 Q80 60 75 70" />
      <path d="M75 70 L80 92" />
      <path d="M74 92 L90 92" />
      <path d="M73 49 Q64 60 62 72" />
      <path d="M62 72 L58 92" />
      <path d="M50 92 L64 92" />
      <path d="M60 44 L63 76" />
      <path d="M53 80 L73 80" />
      <rect x="49" y="74" width="6" height="12" rx="1.6" />
      <rect x="71" y="74" width="6" height="12" rx="1.6" />
    </svg>
  );
}

/* ---- Section divider with center diamond ---- */
function Divider({ className = "", style = {} }) {
  return (
    <div className={className} style={{ display: "flex", alignItems: "center", gap: "14px", color: "var(--accent)", ...style }}>
      <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, var(--hair))" }} />
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="7" y="0.5" width="9" height="9" transform="rotate(45 7 0.5)" />
      </svg>
      <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, var(--hair), transparent)" }} />
    </div>
  );
}

/* ---- Tiny logo glyph: trishul inside a ring ---- */
function LogoGlyph({ size = 40, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none"
         stroke="currentColor" strokeWidth="1.4" style={style} aria-hidden="true">
      <circle cx="32" cy="32" r="30" opacity="0.5" />
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 16 C30.5 20 29 22.5 26 25" />
        <path d="M32 16 C33.5 20 35 22.5 38 25" />
        <path d="M22 21 C22 30 26 32 32 32 C38 32 42 30 42 21" />
        <path d="M32 13 L32 48" />
        <path d="M27 44 L37 44" />
      </g>
    </svg>
  );
}

Object.assign(window, { Yantra, MandalaRing, Trishul, Lotus, Flame, Chakra, Kettle, Divider, LogoGlyph, Modal, FigMeditate, FigStretch, FigLift });
