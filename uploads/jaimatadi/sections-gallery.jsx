// sections-gallery.jsx — Hall of Strength: a flickable card-deck photo gallery.
// 12 framed image-slots stacked like a physical deck. The top card peels away
// on drag/flick (or via prev/next), looping endlessly. Plain clicks fall
// through to the image-slot so users can still drop their own photos.
const { useState: useStateG, useRef: useRefG, useCallback: useCallbackG, useEffect: useEffectG } = React;

// Ordered as a narrative: stillness → stage glory → the daily grind → community.
// Each frame carries its own title + line, surfaced on the left as you flick.
const GALLERY_IMAGES = [
  { src: "images/temple-meditate.jpeg", t: "Stillness before strength",
    d: "The calm mind lifts the heaviest weight. Every real session starts long before the first rep." },
  { src: "images/stage-167.jpeg", t: "The stage never lies",
    d: "Months of 5 a.m. alarms, weighed meals and silent reps — all of it, lit up in ten seconds." },
  { src: "images/gym-abs.jpeg", t: "Built rep by rep",
    d: "No shortcuts, no secrets. Just the same lift, done a little better every single day." },
  { src: "images/worship-idol.jpeg", t: "Strength is gratitude",
    d: "We bow before we build. The body is borrowed — the discipline is ours to give." },
  { src: "images/rooftop-ladder.jpeg", t: "Climb your own ladder",
    d: "Progress isn’t loud. It’s one more rung than yesterday, taken in your own time." },
  { src: "images/grind-tricep.jpeg", t: "Fall in love with the grind",
    d: "The set you don’t feel like doing is usually the one that changes you." },
  { src: "images/stage-side.jpeg", t: "Earned, never given",
    d: "Conditioning like this is paid for in the boring weeks nobody posts about." },
  { src: "images/namaste-back.jpeg", t: "Train the body, bow the ego",
    d: "The strongest people we know are also the most humble. That’s no coincidence." },
  { src: "images/group-cliff.jpeg", t: "Stronger together",
    d: "You come for the iron. You stay for the brothers and sisters who push you." },
  { src: "images/flex-yellow.jpeg", t: "This could be you",
    d: "Everyone here started as a beginner who simply refused to quit. Your frame goes next." },
];

const GALLERY_N = GALLERY_IMAGES.length;

// resting transforms for the visible depth of the stack (index = depth)
const DECK_DEPTHS = [
  { x: 0,   y: 0,  r: 0,    s: 1,     o: 1    },
  { x: 22,  y: 12, r: 3.4,  s: 0.965, o: 1    },
  { x: -18, y: 22, r: -4.2, s: 0.93,  o: 1    },
  { x: 27,  y: 31, r: 4.8,  s: 0.9,   o: 0.92 },
  { x: -10, y: 39, r: -2.4, s: 0.875, o: 0.68 },
];

function Gallery() {
  const N = GALLERY_N;
  const [active, setActive] = useStateG(0);
  const [anim, setAnim] = useStateG(null);   // { card, dir, fx }
  const [drag, setDrag] = useStateG(null);    // { card, dx, dy }
  const lockRef = useRefG(false);
  const gestureRef = useRefG({ down: false });
  const pauseRef = useRefG(false);

  const go = useCallbackG((dir, fx) => {
    if (lockRef.current) return;
    lockRef.current = true;
    setActive((a) => {
      const card = dir === "next" ? a : (a - 1 + N) % N;
      const dirX = fx || (a % 2 === 0 ? 1 : -1);
      setAnim({ card, dir, fx: dirX });
      return dir === "next" ? (a + 1) % N : (a - 1 + N) % N;
    });
    setTimeout(() => { setAnim(null); lockRef.current = false; }, 580);
  }, [N]);

  /* ---- auto-advance every 2s, smoothly; pauses on hover / interaction ---- */
  useEffectG(() => {
    const id = setInterval(() => { if (!pauseRef.current && !lockRef.current) go("next"); }, 2000);
    return () => clearInterval(id);
  }, [go]);

  /* ---- pointer flick on the top card (coexists with image-slot fill) ---- */
  const onDown = (e, i) => {
    if (lockRef.current || i !== active) return;
    gestureRef.current = {
      down: true, moved: false, cancelled: false,
      sx: e.clientX, sy: e.clientY, id: e.pointerId, el: e.currentTarget,
    };
  };
  const onMove = (e) => {
    const g = gestureRef.current;
    if (!g.down || g.cancelled) return;
    const dx = e.clientX - g.sx, dy = e.clientY - g.sy;
    if (!g.moved) {
      if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
        g.moved = true;
        try { g.el.setPointerCapture(g.id); } catch (err) {}
      } else if (Math.abs(dy) > 10 && Math.abs(dy) >= Math.abs(dx)) {
        g.cancelled = true; // vertical intent → let the page scroll
        return;
      } else { return; }
    }
    e.preventDefault();
    setDrag({ card: active, dx, dy });
  };
  const onUp = (e) => {
    const g = gestureRef.current;
    gestureRef.current = { down: false };
    pauseRef.current = false;
    if (!g.moved) return; // plain click → image-slot handles it
    const dx = e.clientX - g.sx;
    try { g.el.releasePointerCapture(g.id); } catch (err) {}
    setDrag(null);
    if (Math.abs(dx) > 88) go("next", Math.sign(dx) || 1);
  };

  const cardStyle = (i) => {
    const pos = (i - active + N) % N;
    if (drag && drag.card === i) {
      const { dx, dy } = drag;
      return { transform: `translate3d(${dx}px, ${dy}px, 0) rotate(${dx * 0.045}deg)`,
               zIndex: N + 3, opacity: 1, transition: "none" };
    }
    if (anim && anim.card === i && anim.dir === "next") {
      const fx = anim.fx;
      return { transform: `translate3d(${fx * 152}%, -46%, 0) rotate(${fx * 22}deg) scale(0.95)`,
               opacity: 0, zIndex: N + 3 };
    }
    if (pos >= DECK_DEPTHS.length) {
      return { transform: "translate3d(0, 46px, 0) scale(0.85)", opacity: 0, zIndex: 0, pointerEvents: "none" };
    }
    const d = DECK_DEPTHS[pos];
    let z = N - pos;
    if (anim && anim.card === i && anim.dir === "prev") z = N + 3; // rise over the stack
    return {
      transform: `translate3d(${d.x}px, ${d.y}px, 0) rotate(${d.r}deg) scale(${d.s})`,
      opacity: d.o, zIndex: z, pointerEvents: pos === 0 ? "auto" : "none",
    };
  };

  return (
    <section className="sec gallery" id="gallery">
      <div className="gallery__bg">
        <div className="gallery__glow"></div>
        <MandalaRing className="gallery__mandala spin-slow" />
      </div>
      <div className="shell">
        <div className="gallery__layout">
          {/* left — intro + controls (title & line track the active frame) */}
          <div className="gallery__intro reveal">
            <span className="sec__num">04 — Hall of Strength</span>
            <div className="gallery__deva">शक्ति का दर्शन — a darshan of power</div>
            <div className="gallery__copy" key={active}>
              <h2>{GALLERY_IMAGES[active].t}</h2>
              <p className="lede">{GALLERY_IMAGES[active].d}</p>
            </div>

            <div className="gallery__counter" aria-live="polite">
              <span className="cur">{String(active + 1).padStart(2, "0")}</span>
              <span className="sep">/</span>
              <span className="tot">{String(N).padStart(2, "0")}</span>
            </div>

            <div className="gallery__controls">
              <button className="gnav-btn" aria-label="Previous photo" onClick={() => go("prev")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button className="gnav-btn" aria-label="Next photo" onClick={() => go("next")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
              </button>
            </div>
          </div>

          {/* right — the deck */}
          <div className="gallery__stage reveal" data-d="1"
            onMouseEnter={() => { pauseRef.current = true; }}
            onMouseLeave={() => { pauseRef.current = false; }}>
            <div className="gallery__deck">
              {Array.from({ length: N }).map((_, i) => {
                const pos = (i - active + N) % N;
                return (
                  <div
                    key={i}
                    className={"gcard" + (pos === 0 ? " gcard--top" : "")}
                    style={cardStyle(i)}
                    onPointerDown={(e) => { pauseRef.current = true; onDown(e, i); }}
                    onPointerMove={onMove}
                    onPointerUp={onUp}
                    onPointerCancel={onUp}
                  >
                    <div className="gcard__media">
                      <img className="gcard__img" src={GALLERY_IMAGES[i].src}
                        alt={GALLERY_IMAGES[i].t} draggable="false" loading="lazy" />
                    </div>
                    <div className="gcard__sheen"></div>
                    <span className="gcard__corner tl"></span>
                    <span className="gcard__corner tr"></span>
                    <span className="gcard__corner bl"></span>
                    <span className="gcard__corner br"></span>
                    <div className="gcard__frame"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Gallery });
