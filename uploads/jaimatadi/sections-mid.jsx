// sections-mid.jsx — The Method (sticky scroll), Trainers, Testimonials
const { useState: useStateM, useEffect: useEffectM, useRef: useRefM } = React;

/* ---------------- THE METHOD ---------------- */
function Method() {
  const [active, setActive] = useStateM(0);
  const stepRefs = useRefM([]);
  const steps = [
    { idx: "I", deva: "संकल्प", roman: "Sankalp", h: "Intention", icon: "images/method-sankalp-gold.png",
      p: "Before the first rep, the vow. We sit with you to name what you’re training toward — and why it matters. Direction turns effort into devotion.",
      points: [
        "A 1:1 intention-setting session before day one",
        "We map your “why”, your baselines & honest targets",
        "A written sankalp you sign — your vow on paper",
      ] },
    { idx: "II", deva: "साधना", roman: "Sadhana", h: "Practice", icon: "images/method-sadhana-gold.png",
      p: "Show up. Again. The work is daily, deliberate, and coached with precision. Discipline isn’t punishment here — it’s the quiet ritual that compounds. Every session has a shape: you arrive, you warm the body, you do the hard thing, you breathe, you log it. Small, honest reps, stacked day on day, become the strength nobody can take from you.",
      points: [
        "Sessions programmed to your numbers, not a template",
        "A daily ritual: warm-up, work, breath, reflect",
        "Weekly coach check-ins keep the practice honest",
        "Every lift logged — so progress is seen, not guessed",
        "Built-in deload weeks so the body recovers and grows",
      ] },
    { idx: "III", deva: "शक्ति", roman: "Shakti", h: "Power", icon: "images/method-shakti-gold.png",
      p: "Strength of body, steadiness of mind. What you build on the floor walks out with you — into the way you carry weight, pressure, and life itself.",
      points: [
        "Measured strength gains — proof, not vanity numbers",
        "Composure under load that follows you out the door",
        "Re-test every cycle and celebrate the climb",
      ] },
  ];
  useEffectM(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = Number(e.target.dataset.i);
            setActive(i);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <section className="sec method" id="method">
      <div className="shell">
        <div className="sec__head reveal">
          <span className="sec__num">02 — The Method</span>
          <h2>The path is<br /><span className="accent">three steps.</span></h2>
          <p className="lede">Not a program. A practice. This is how we move every member from
            intention to lasting power.</p>
        </div>
        <div className="method__layout">
          <div className="method__sticky">
            <div className="method__stage" data-step={active}>
              <div className="method__glow"></div>
              <div className="method__rays spin-slow"></div>
              <div className="method__disc"></div>
              <MandalaRing className="ring spin-slow" />
              <div className="method__icon method__icon--fig">
                {steps.map((s, i) => (
                  <img key={i} src={s.icon} alt="" aria-hidden="true"
                    className={"method__fig" + (i === active ? " on" : "")} />
                ))}
              </div>
              <span className="method__count">{steps[active].idx}</span>
              <div className="method__pips">
                {steps.map((s, i) => (
                  <span key={i} className={i <= active ? "on" : ""}></span>
                ))}
              </div>
            </div>
          </div>
          <div className="method__steps">
            {steps.map((s, i) => (
              <div
                key={i}
                data-i={i}
                ref={(el) => (stepRefs.current[i] = el)}
                className={"mstep" + (i === active ? " on" : " dim")}
              >
                <span className="mstep__bar" aria-hidden="true"></span>
                <div className="k">
                  <span className="idx">{s.idx}</span>
                  <span className="deva-h">{s.deva}</span>
                </div>
                <h3>{s.roman} · {s.h}</h3>
                <p>{s.p}</p>
                <ul className="mstep__points">
                  {s.points.map((pt, j) => (
                    <li key={j}><span className="dot"></span>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TRAINERS ---------------- */
function Trainers() {
  const people = [
    { id: "t1", img: "images/grind-tricep.jpeg", name: "Aarav Mehta", role: "Head Coach · Strength", creds: ["IPF National lifter", "10 yrs barbell coaching", "Sports nutrition cert."] },
    { id: "t2", img: "images/female-stage.jpeg", name: "Sana Kapoor", role: "Conditioning Lead", creds: ["Ex-national rower", "Energy-system specialist", "Breathwork practitioner"] },
    { id: "t3", img: "images/outdoor-flex.jpeg", name: "Vikram Singh", role: "Combat & Functional", creds: ["State boxing medalist", "Kettlebell sport L2", "8 yrs ring experience"] },
    { id: "t4", img: "images/coach-kapil.jpeg", name: "Kapil", role: "Recovery & Mobility", creds: ["Physio (MPT)", "Mobility & rehab", "Yoga & breath teacher"] },
  ];
  return (
    <section className="sec" id="trainers">
      <div className="shell">
        <div className="sec__head reveal">
          <span className="sec__num">03 — The Coaches</span>
          <h2>Trained by <span className="accent">devotees</span><br />of the craft.</h2>
          <p className="lede">No conveyor belt of trainers. A small, obsessive team who coach by hand
            and know your name, your numbers, and your why.</p>
        </div>
        <div className="trainers__grid">
          {people.map((p, i) => (
            <article className="trainer reveal" data-d={(i % 4) + 1} key={p.id}>
              <div className="trainer__img">
                <img className="trainer__photo" src={p.img} alt={p.name} loading="lazy" />
                <div className="trainer__grad"></div>
              </div>
              <Trishul className="trainer__motif" sw={1.6} />
              <div className="trainer__body">
                <div className="role">{p.role}</div>
                <h3>{p.name}</h3>
                <div className="trainer__creds">
                  <ul>{p.creds.map((c, j) => <li key={j}>{c}</li>)}</ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- TESTIMONIALS ---------------- */
function Testimonials() {
  const quotes = [
    { q: ["I came for a body. I left with a ", "practice", " I’ll keep for life."], who: "Rohan D.", meta: "Member · 3 years" },
    { q: ["Strongest I’ve ever been at 41. They coach the ", "mind", " as much as the lift."], who: "Meera J.", meta: "Member · 2 years" },
    { q: ["First gym that felt like it had a ", "soul", ". Jai Mata Di — I mean it."], who: "Kabir S.", meta: "Member · 4 years" },
  ];
  const [i, setI] = useStateM(0);
  useEffectM(() => {
    if (prefersReduced()) return;
    const t = setInterval(() => setI((p) => (p + 1) % quotes.length), 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="sec testi">
      <MandalaRing className="testi__mandala spin-rev" />
      <div className="shell">
        <div className="testi__wrap reveal">
          <div className="testi__quote-mark">“</div>
          {quotes.map((qt, k) => (
            <div className={"testi__slide" + (k === i ? " on" : "")} key={k} aria-hidden={k !== i}>
              <blockquote>{qt.q[0]}<span className="accent">{qt.q[1]}</span>{qt.q[2]}</blockquote>
              <div className="testi__who"><b>{qt.who}</b><span>{qt.meta}</span></div>
            </div>
          ))}
          <div className="testi__dots">
            {quotes.map((_, k) => (
              <button key={k} className={k === i ? "on" : ""} aria-label={"Testimonial " + (k + 1)}
                onClick={() => setI(k)}></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Method, Trainers, Testimonials });
