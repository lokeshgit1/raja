// hooks.jsx — scroll reveal, count-up, parallax, magnetic buttons, scroll progress.
const { useEffect, useRef, useState, useCallback } = React;

const prefersReduced = () =>
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Observe all .reveal / .line-mask nodes and toggle .in once on enter.
   Call once near the top of the app; re-run when layout-affecting deps change. */
function useScrollReveal(deps = []) {
  useEffect(() => {
    if (prefersReduced()) {
      document.querySelectorAll(".reveal, .line-mask").forEach((el) => el.classList.add("in"));
      return;
    }
    const sel = ".reveal:not(.in), .line-mask:not(.in)";
    // Scan-based reveal: robust regardless of IntersectionObserver timing /
    // background-tab throttling. Reveals anything whose top has entered ~92vh.
    const scan = () => {
      const vh = window.innerHeight;
      let remaining = 0;
      document.querySelectorAll(sel).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add("in");
        else remaining++;
      });
      return remaining;
    };
    let raf = 0;
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; scan(); }); };
    // initial sweeps (cover late layout / font load / first paint)
    scan();
    const t1 = setTimeout(scan, 60);
    const t2 = setTimeout(scan, 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("load", scan);
    document.addEventListener("visibilitychange", scan);
    return () => {
      clearTimeout(t1); clearTimeout(t2);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("load", scan);
      document.removeEventListener("visibilitychange", scan);
    };
  }, deps); // eslint-disable-line
}

/* thin gold scroll-progress bar */
function useScrollProgress() {
  useEffect(() => {
    const bar = document.getElementById("scroll-prog");
    if (!bar) return;
    let raf = 0;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? (h.scrollTop || window.scrollY) / max : 0;
      bar.style.width = (p * 100).toFixed(2) + "%";
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
}

/* count up when scrolled into view */
function CountUp({ to, dur = 2000, decimals = 0, prefix = "", suffix = "", className = "" }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) { setVal(to); return; }
    const run = () => {
      if (done.current) return;
      const r = el.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.92 || r.bottom < 0) return; // not in view yet
      done.current = true;
      cleanup();
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        setVal(to * eased);
        if (t < 1) requestAnimationFrame(tick);
        else setVal(to);
      };
      requestAnimationFrame(tick);
    };
    let raf = 0;
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; run(); }); };
    const cleanup = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", run);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("visibilitychange", run);
    run();
    const t1 = setTimeout(run, 120);
    const t2 = setTimeout(run, 500);
    return () => { cleanup(); clearTimeout(t1); clearTimeout(t2); };
  }, [to, dur]);
  const shown = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString("en-IN");
  return <span ref={ref} className={"tnum " + className}>{prefix}{shown}{suffix}</span>;
}

/* parallax: translateY proportional to scroll, eased via rAF */
function useParallax(strength = 0.15) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${(-center * strength).toFixed(1)}px, 0)`;
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, [strength]);
  return ref;
}

/* magnetic button: pulls toward cursor; respects --motion-scale */
function useMagnetic(power = 0.32) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${mx * power}px, ${my * power}px)`;
    };
    const reset = () => { el.style.transform = ""; };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", reset);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", reset);
    };
  }, [power]);
  return ref;
}

Object.assign(window, { useScrollReveal, useScrollProgress, CountUp, useParallax, useMagnetic, prefersReduced });
