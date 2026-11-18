// sections-album.jsx — Album: a modern coverflow-style photo carousel.
// All photos sit on a 3D stage; the centre frame stands tall while its
// neighbours peel back into depth. Swipe / drag, arrows, dots + autoplay.
const { useState: useStateAl, useRef: useRefAl, useEffect: useEffectAl, useCallback: useCallbackAl } = React;

const ALBUM_PHOTOS = [
  { src: "images/album-06.jpeg", t: "Centre stage, gold",      tag: "Competition" },
  { src: "images/album-09.jpeg", t: "Lights up, posed down",   tag: "Competition" },
  { src: "images/album-08.jpeg", t: "The medal, earned",       tag: "Podium" },
  { src: "images/album-07.jpeg", t: "The side that wins",      tag: "Competition" },
  { src: "images/album-13.jpeg", t: "Brothers in gold",        tag: "On stage" },
  { src: "images/album-10.jpeg", t: "Stage-ready",             tag: "Competition" },
  { src: "images/album-12.jpeg", t: "Shakti, unmistakable",    tag: "On stage" },
  { src: "images/album-02.jpeg", t: "Victory pose",            tag: "Training floor" },
  { src: "images/album-03.jpeg", t: "Conditioning, dialled in", tag: "Training floor" },
  { src: "images/album-01.jpeg", t: "On the iron",             tag: "Training floor" },
  { src: "images/album-05.jpeg", t: "Earning every rep",       tag: "Training floor" },
  { src: "images/album-11.jpeg", t: "Floor pump",              tag: "Training floor" },
  { src: "images/album-04.jpeg", t: "Quiet discipline",        tag: "Off duty" },
];

const ALBUM_N = ALBUM_PHOTOS.length;

function Album() {
  const N = ALBUM_N;
  const [active, setActive] = useStateAl(0);
  const pauseRef = useRefAl(false);
  const lockRef = useRefAl(false);
  const gRef = useRefAl({ down: false });

  const go = useCallbackAl((dir) => {
    setActive((a) => (a + dir + N) % N);
  }, [N]);

  /* autoplay — pauses on hover / drag */
  useEffectAl(() => {
    const id = setInterval(() => { if (!pauseRef.current) go(1); }, 3200);
    return () => clearInterval(id);
  }, [go]);

  /* keyboard */
  useEffectAl(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  /* signed shortest distance from active, with wrap-around for the loop */
  const offsetOf = (i) => {
    let off = i - active;
    if (off > N / 2) off -= N;
    if (off < -N / 2) off += N;
    return off;
  };

  const slideStyle = (i) => {
    const off = offsetOf(i);
    const abs = Math.abs(off);
    if (abs > 3) return { opacity: 0, pointerEvents: "none", transform: "translate(-50%, -50%) translate3d(0,0,-700px) scale(0.5)" };
    const sign = Math.sign(off);
    const x = off * 50;                       // % spread
    const scale = Math.max(1 - abs * 0.16, 0.5);
    const rot = -sign * Math.min(abs * 20, 38);
    const z = 100 - abs;
    const op = abs === 0 ? 1 : Math.max(0.78 - abs * 0.2, 0.18);
    const depth = -abs * 180;
    return {
      transform: `translate(-50%, -50%) translate3d(${x}%, 0, ${depth}px) rotateY(${rot}deg) scale(${scale})`,
      zIndex: z, opacity: op,
      pointerEvents: abs === 0 ? "auto" : "none",
    };
  };

  /* drag / swipe */
  const onDown = (e) => {
    gRef.current = { down: true, moved: false, sx: e.clientX, sy: e.clientY, id: e.pointerId, el: e.currentTarget };
    pauseRef.current = true;
  };
  const onMove = (e) => {
    const g = gRef.current;
    if (!g.down) return;
    const dx = e.clientX - g.sx, dy = e.clientY - g.sy;
    if (!g.moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
      g.moved = true;
      try { g.el.setPointerCapture(g.id); } catch (err) {}
    }
  };
  const onUp = (e) => {
    const g = gRef.current;
    gRef.current = { down: false };
    pauseRef.current = false;
    if (!g.moved) return;
    const dx = e.clientX - g.sx;
    try { g.el.releasePointerCapture(g.id); } catch (err) {}
    if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
  };

  const cur = ALBUM_PHOTOS[active];

  return (
    <section className="sec album" id="album">
      <div className="album__bg" aria-hidden="true"></div>
      <div className="shell">
        <div className="sec__head reveal" style={{ textAlign: "center", margin: "0 auto clamp(36px,4.5vh,56px)" }}>
          <span className="sec__num" style={{ display: "block" }}>08 — Album</span>
          <div className="album__deva">चित्रशाला — moments of devotion</div>
          <h2>The journey, <span className="accent">in frames.</span></h2>
          <p className="lede" style={{ marginInline: "auto" }}>From the training floor to the championship stage —
            the proof of a practice kept. Swipe through the chapters.</p>
        </div>

        <div className="album__stage reveal" data-d="1"
          onMouseEnter={() => { pauseRef.current = true; }}
          onMouseLeave={() => { pauseRef.current = false; }}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
          <div className="album__track">
            {ALBUM_PHOTOS.map((p, i) => (
              <figure className={"acard" + (i === active ? " acard--active" : "")}
                key={p.src} style={slideStyle(i)}
                onClick={() => { if (i !== active) setActive(i); }}>
                <img src={p.src} alt={p.t} draggable="false" loading="lazy" />
                <span className="acard__sheen" aria-hidden="true"></span>
              </figure>
            ))}
          </div>

          <button className="album__nav album__nav--prev" aria-label="Previous photo" onClick={() => go(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button className="album__nav album__nav--next" aria-label="Next photo" onClick={() => go(1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>

        <div className="album__caption" key={active}>
          <span className="album__tag">{cur.tag}</span>
          <h3 className="album__title">{cur.t}</h3>
          <span className="album__count">{String(active + 1).padStart(2, "0")} <i>/</i> {String(N).padStart(2, "0")}</span>
        </div>

        <div className="album__dots" role="tablist" aria-label="Album photos">
          {ALBUM_PHOTOS.map((_, k) => (
            <button key={k} className={k === active ? "on" : ""} aria-label={"Photo " + (k + 1)}
              aria-selected={k === active} onClick={() => setActive(k)}></button>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Album });
