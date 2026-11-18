// sections-top.jsx — Nav, Hero, Stats, Programs
const { useState: useStateT, useEffect: useEffectT, useRef: useRefT } = React;

/* ---------------- NAV ---------------- */
function Nav() {
  const [solid, setSolid] = useStateT(false);
  const [open, setOpen] = useStateT(false);
  useEffectT(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const cta = useMagnetic(0.25);
  const links = [
  ["Programs", "#programs"],
  ["The Method", "#method"],
  ["Trainers", "#trainers"],
  ["Album", "#album"],
  ["Membership", "#membership"]];

  return (
    <React.Fragment>
      <nav className={"nav" + (solid ? " solid" : "")}>
        <a href="#top" className="nav__brand" aria-label="Jai Mata Di Fitness home">
          <LogoGlyph size={38} />
          <span className="lockup">
            <span className="deva-mark">जय माता दी</span>
            <span className="word">JAI <b>MATA DI</b></span>
          </span>
        </a>
        <div className="nav__links">
          {links.map(([t, h]) => <a key={h} href={h}>{t}</a>)}
        </div>
        <div className="nav__cta">
          <a ref={cta} href="#membership" className="btn btn--gold">Book a Session
            <span className="btn__arrow">→</span></a>
          <button className="nav__burger" aria-label="Open menu" onClick={() => setOpen(true)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
      <div className={"drawer" + (open ? " open" : "")}>
        <button className="drawer__close" aria-label="Close menu" onClick={() => setOpen(false)}>✕</button>
        {links.map(([t, h]) => <a key={h} href={h} onClick={() => setOpen(false)}>{t}</a>)}
        <a href="#membership" onClick={() => setOpen(false)} className="gold-text">Book a Session</a>
      </div>
    </React.Fragment>);

}

/* ---------------- HERO ---------------- */
function Hero() {
  const yantra = useParallax(0.06);
  const cta = useMagnetic(0.3);
  return (
    <header className="hero" id="top">
      <div className="hero__glow"></div>
      <div className="hero__photo" aria-hidden="true">
        <img src="images/devotion-namaste.jpeg" alt="" />
      </div>
      <div ref={yantra} className="hero__yantra"><Yantra /></div>
      <div className="hero__side">JAI MATA DI <span style={{ width: 28, height: 1, background: "var(--hair)" }}></span> EST. 2014</div>
      <div className="shell hero__inner">
        <div className="hero__eyebrow reveal">
          <span className="eyebrow">Strength &amp; Conditioning</span>
          <span className="deva">शक्ति</span>
        </div>
        <h1>
          <span className="line-mask"><span>Strength</span></span>
          <span className="line-mask"><span>is <em className="accent" style={{ fontStyle: "normal" }}>devotion.</em></span></span>
        </h1>
        <p className="hero__sub reveal" data-d="2">
          A gym with soul. Every rep is a vow, every set a practice. Train your body
          like a discipline worth keeping — and build the kind of power that follows you
          out the door.
        </p>
        <div className="hero__actions reveal" data-d="3">
          <a ref={cta} href="#membership" className="btn btn--gold">Book your first session
            <span className="btn__arrow">→</span></a>
          <a href="#method" className="btn btn--ghost">See the method</a>
        </div>
        <div className="hero__meta reveal" data-d="4">
          <div className="m"><b>6</b><span>Day Programs</span></div>
          <div className="m"><b>1:1</b><span>Coaching</span></div>
          <div className="m"><b>365</b><span>Days a year</span></div>
        </div>
      </div>
      <div className="hero__scroll">
        <span>Scroll</span>
        <span className="track"></span>
      </div>
    </header>);

}

/* ---------------- STATS ---------------- */
function Stats() {
  const data = [
  { to: 4200, suffix: "+", lbl: "Members Trained" },
  { to: 18.4, decimals: 1, suffix: "M", lbl: "Kilos Lifted" },
  { to: 92000, suffix: "+", lbl: "Coaching Hours" },
  { to: 11, suffix: " yrs", lbl: "Of Sadhana" }];

  return (
    <section className="stats">
      <div className="shell">
        <div className="stats__grid">
          {data.map((s, i) =>
          <div className="stat reveal" data-d={i + 1} key={i}>
              <b><CountUp to={s.to} decimals={s.decimals || 0} suffix="" />
                <span className="u">{s.suffix}</span></b>
              <div className="lbl">{s.lbl}</div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

/* ---------------- PROGRAMS ---------------- */
function Programs() {
  const [openIdx, setOpenIdx] = useStateT(null);
  const items = [
  { no: "01", Icon: Kettle, t: "Strength", d: "शक्ति", img: "images/gym-posters.jpeg",
    p: "Barbell foundations — squat, press, pull, hinge. Progressive overload programmed around you, coached by hand. Build the kind of strength that lasts.",
    long: "The bedrock of everything we do. You’ll learn the four foundational lifts under a coach’s eye, then follow programming that adapts to your numbers week on week. No ego lifting, no guesswork — just steady, measurable strength that holds up for decades.",
    includes: ["Squat, bench, deadlift & overhead press technique", "Individualised progressive-overload blocks", "Monthly strength testing & form review", "Accessory work to bulletproof joints"] },
  { no: "02", Icon: Chakra, t: "Conditioning", d: "गति", img: "images/rooftop-biceps.jpeg",
    p: "Engine work, intervals, and breathing under load. Relentless conditioning that turns effort into ease and gasping into composure.",
    long: "Build a bigger engine. We blend steady-state base work with sharp intervals and breath training so your heart, lungs and mind stay composed when the work gets ugly. Walk out fitter for sport, for the stairs, for life.",
    includes: ["Zone-2 base building & VO₂ intervals", "Breath mechanics under fatigue", "Rowing, bike & loaded carries", "Heart-rate-guided sessions"] },
  { no: "03", Icon: Trishul, t: "Combat & Functional", d: "युद्ध", img: "images/gym-tricep.jpeg",
    p: "Boxing, kettlebell flows, and movement that carries weight in the real world. Sharpen instinct, reflex, and the will to keep going.",
    long: "Where strength meets instinct. Box, flow with kettlebells, and move in every plane — training the reflexes, footwork and grit that translate the moment it matters. Equal parts skill, sweat and spirit.",
    includes: ["Boxing fundamentals & pad work", "Kettlebell sport & flow complexes", "Agility, footwork & reaction drills", "Functional carries, crawls & throws"] },
  { no: "04", Icon: Flame, t: "Recovery & Breath", d: "विश्राम", img: "images/devotion-namaste.jpeg",
    p: "Mobility, breathwork, and deliberate rest. Where the work is absorbed and the body is rebuilt. Recovery is part of the practice.",
    long: "The work is only absorbed when you recover. Mobility, breathwork and deliberate rest turn training stress into adaptation — and a calmer nervous system. This is the quiet, devotional half of getting strong.",
    includes: ["Guided mobility & joint prep flows", "Breathwork & down-regulation", "Soft-tissue & rehab protocols", "Sleep & recovery coaching"] }];

  const sel = openIdx != null ? items[openIdx] : null;
  return (
    <section className="sec" id="programs">
      <div className="shell">
        <div className="sec__head reveal">
          <span className="sec__num">01 — Programs</span>
          <h2>Four paths,<br /><span className="accent">one practice.</span></h2>
          <p className="lede">Every body arrives somewhere different. These are the disciplines we
            coach — choose your entry point, or train across all four.</p>
        </div>
        <div className="programs__grid">
          {items.map((it, i) =>
          <article className="prog reveal" data-d={i % 4 + 1} key={it.no}
          role="button" tabIndex={0}
          onClick={() => setOpenIdx(i)}
          onKeyDown={(e) => {if (e.key === "Enter" || e.key === " ") {e.preventDefault();setOpenIdx(i);}}}>
              <span className="prog__no">{it.no}</span>
              <it.Icon className="prog__icon" sw={1.4} />
              <h3>{it.t}</h3>
              <span className="deva-tag">{it.d}</span>
              <p>{it.p}</p>
              <span className="prog__link">View details <span className="a">→</span></span>
            </article>
          )}
        </div>
      </div>

      <Modal open={openIdx != null} onClose={() => setOpenIdx(null)} variant="modal__card--split">
        {sel &&
        <React.Fragment>
            <div className="pm__media">
              <img src={sel.img} alt={sel.t} />
              <Trishul className="pm__motif" sw={1.5} />
            </div>
            <div className="pm__body" style={{ opacity: "1" }}>
              <span className="sec__num">Program {sel.no}</span>
              <h3 className="pm__title">{sel.t}</h3>
              <span className="deva-tag">{sel.d}</span>
              <p className="pm__lede">{sel.long}</p>
              <div className="pm__incl">
                <span className="pm__incl-h">What’s inside</span>
                <ul>{sel.includes.map((c, j) => <li key={j}>{c}</li>)}</ul>
              </div>
              <a href="#membership" className="btn btn--gold" onClick={() => setOpenIdx(null)}>Start this path
                <span className="btn__arrow">→</span></a>
            </div>
          </React.Fragment>
        }
      </Modal>
    </section>);

}

Object.assign(window, { Nav, Hero, Stats, Programs });