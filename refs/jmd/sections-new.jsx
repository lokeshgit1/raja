// sections-new.jsx — Transformations (member journeys) + On The Horizon (future projects)
const { useState: useStateN, useEffect: useEffectN, useRef: useRefN } = React;

/* ---------------- TRANSFORMATIONS (auto-slide carousel) ---------------- */
const TF_THEME = {
  yodha:  { grad: "linear-gradient(135deg, #F3D27A 0%, #C9A227 48%, #7A1414 100%)", ring: "rgba(201,162,39,0.6)",  label: "Yodha · 12 Months" },
  sadhak: { grad: "linear-gradient(135deg, #FFE7A6 0%, #E6C865 45%, #C9A227 100%)", ring: "rgba(230,200,101,0.55)", label: "Sadhak · 3 Months" },
  bhakt:  { grad: "linear-gradient(135deg, #FFC24A 0%, #F4A300 50%, #F0820C 100%)", ring: "rgba(244,163,0,0.6)",   label: "Bhakt · Monthly" },
};
const TF_PEOPLE = [
  { id: "tf1", name: "Rohit Sharma", plan: "yodha", deva: "योद्धा", stat: "+42kg deadlift · 12 months",
    journey: "Walked in nursing a wrecked back. A full year of patient, coached strength left him pulling double the weight he once feared he’d never lift again." },
  { id: "tf2", name: "Ananya Iyer", plan: "sadhak", deva: "साधक", stat: "Couch → first 10K · 3 months",
    journey: "Three months of honest practice turned “I can’t run” into her first 10K — and a steadiness she now carries into every room she walks into." },
  { id: "tf3", name: "Faizan Khan", plan: "bhakt", deva: "भक्त", stat: "−14kg · 8 months in",
    journey: "Joined month-to-month just to try it out. Eight months on, he’s the strongest, calmest, most disciplined version of himself yet." },
  { id: "tf4", name: "Dev Patel", plan: "yodha", deva: "योद्धा", stat: "First stage · district podium",
    journey: "From back-of-the-gym beginner to a year of championship prep — he stepped on stage for the first time and walked off with a medal." },
  { id: "tf5", name: "Sneha Rao", plan: "sadhak", deva: "साधक", stat: "Postpartum → full pull-up",
    journey: "Came back after her first child unsure of her own body. One season of guided strength, and she’s doing strict pull-ups she never managed before." },
  { id: "tf6", name: "Imran Qureshi", plan: "bhakt", deva: "भक्त", stat: "−18kg · found his discipline",
    journey: "No grand plan — just showed up. The weight came off, but he says the real change is the discipline that now follows him everywhere." },
];

function Transformations() {
  const [idx, setIdx] = useStateN(0);
  const n = TF_PEOPLE.length;
  const pauseRef = useRefN(false);
  useEffectN(() => {
    if (typeof prefersReduced === "function" && prefersReduced()) return;
    const t = setInterval(() => { if (!pauseRef.current) setIdx((p) => (p + 1) % n); }, 4200);
    return () => clearInterval(t);
  }, [n]);
  const go = (d) => setIdx((p) => (p + d + n) % n);
  return (
    <section className="sec transforms" id="transformations">
      <div className="shell">
        <div className="sec__head reveal" style={{ textAlign: "center", margin: "0 auto clamp(40px,5vh,64px)" }}>
          <span className="sec__num" style={{ display: "block" }}>06 — Transformations</span>
          <h2>Devotion, made <span className="accent">visible.</span></h2>
          <p className="lede" style={{ marginInline: "auto" }}>Real members, real vows kept. Each began on a different plan —
            and each walked a path that changed more than a number on the bar.</p>
        </div>

        <div className="tfc reveal"
          onMouseEnter={() => { pauseRef.current = true; }}
          onMouseLeave={() => { pauseRef.current = false; }}>
          <div className="tfc__viewport">
            <div className="tfc__track" style={{ transform: `translateX(-${idx * 100}%)` }}>
              {TF_PEOPLE.map((p) => {
                const th = TF_THEME[p.plan];
                return (
                  <div className="tfc__slide" key={p.id}>
                    <article className="tf" style={{ "--tf-grad": th.grad, "--tf-ring": th.ring }}>
                      <div className="tf__shots">
                        <figure className="tf__shot">
                          <image-slot id={p.id + "-before"} shape="rounded" radius="12"
                            placeholder="Drop ‘before’ photo"></image-slot>
                          <figcaption>Before</figcaption>
                        </figure>
                        <span className="tf__arrow" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                        </span>
                        <figure className="tf__shot">
                          <image-slot id={p.id + "-after"} shape="rounded" radius="12"
                            placeholder="Drop ‘after’ photo"></image-slot>
                          <figcaption>After</figcaption>
                        </figure>
                      </div>
                      <div className="tf__info">
                        <span className="tf__plan" style={{ background: th.grad }}>
                          <span className="deva">{p.deva}</span>{th.label}
                        </span>
                        <h3 className="tf__name">{p.name}</h3>
                        <span className="tf__stat">{p.stat}</span>
                        <p className="tf__journey">{p.journey}</p>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>

          <button className="tfc__nav tfc__nav--prev" aria-label="Previous story" onClick={() => go(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button className="tfc__nav tfc__nav--next" aria-label="Next story" onClick={() => go(1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
          </button>

          <div className="tfc__dots">
            {TF_PEOPLE.map((_, k) => (
              <button key={k} className={k === idx ? "on" : ""} aria-label={"Story " + (k + 1)}
                onClick={() => setIdx(k)}></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- ON THE HORIZON (future projects, all locked) ---------------- */
function Lock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.2" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

const HORIZON_ITEMS = [
  { no: "01", img: "images/horizon-calisthenics.jpg", t: "Calisthenics", deva: "देहबल", tag: "Winter ’26",
    p: "Master your own bodyweight — pull-ups to planches to full levers. A dedicated bar park and a skills curriculum from first rep to flag." },
  { no: "02", img: "images/stage-side.jpeg", t: "Championship Prep", deva: "विजय", tag: "’26 intake",
    p: "Peak for the stage. Periodised prep, posing practice and peak-week coaching for athletes chasing a podium." },
  { no: "03", img: "images/horizon-powerlifting.jpg", t: "Powerlifting", deva: "महाबल", tag: "Platform ’26",
    p: "The pursuit of the big three. A competition platform, calibrated plates and meet-day coaching to chase a real total." },
  { no: "04", img: "images/horizon-yoga.jpg", t: "Yoga Classes", deva: "योग", tag: "Autumn ’26",
    p: "Breath, balance and the still half of strength. Guided mat practice to open what the iron tightens." },
  { no: "05", img: "images/horizon-diet.jpg", t: "Elite Diet Plans", deva: "आहार", tag: "Invite-only",
    p: "Nutrition built around your numbers. Bespoke, blood-work-informed plans for serious members chasing the next level." },
];

function Horizon() {
  const [wizard, setWizard] = useStateN(false);
  return (
    <section className="sec horizon" id="horizon">
      <div className="horizon__glow" aria-hidden="true"></div>
      <div className="shell">
        <div className="sec__head reveal">
          <span className="sec__num">07 — On The Horizon</span>
          <h2>The practice<br /><span className="accent">keeps growing.</span></h2>
          <p className="lede">We’re building the next chapters of Jai Mata Di — new disciplines, new
            spaces, new ways to chase Shakti. All of it is on the way. Locked for now — your interest decides what we open first.</p>
        </div>
        <div className="horizon__grid">
          {HORIZON_ITEMS.map((it) => (
            <article className="hz hz--locked reveal" key={it.no}>
              <div className="hz__media">
                <img src={it.img} alt={it.t} loading="lazy" />
                <div className="hz__veil"></div>
                <span className="hz__locktag"><Lock /> Coming soon</span>
                <span className="hz__no">{it.no}</span>
              </div>
              <div className="hz__body">
                <div className="hz__titlerow">
                  <h3 className="hz__title">{it.t}</h3>
                  <span className="hz__tag">{it.tag}</span>
                </div>
                <span className="deva-tag">{it.deva}</span>
                <p className="hz__p">{it.p}</p>
              </div>
            </article>
          ))}
        </div>

        <button type="button" className="hz__want reveal" onClick={() => setWizard(true)}>
          <span className="hz__want-l">
            <span className="hz__want-deva">जय माता दी</span>
            <span className="hz__want-t">Find your path.</span>
            <span className="hz__want-s">Four taps and we match you to the right plan — plus a free starter diet.</span>
          </span>
          <span className="hz__want-cta">Match me <span className="btn__arrow">→</span></span>
        </button>
      </div>

      <Modal open={wizard} onClose={() => setWizard(false)} variant="modal__card--wizard">
        {wizard && <DietWizard onClose={() => setWizard(false)} />}
      </Modal>
    </section>
  );
}

/* ---------------- INTEREST → DIET PLAN WIZARD ---------------- */
const DW_STEPS = [
  { key: "goal", multi: false, q: "What’s your main goal?", sub: "Pick the one that matters most right now.",
    opts: [
      { k: "muscle", label: "Muscle Building", deva: "मांसपेशी" },
      { k: "fatloss", label: "Fat Loss", deva: "वसा-क्षय" },
      { k: "strength", label: "Strength & Power", deva: "बल" },
      { k: "fitness", label: "General Fitness", deva: "स्वास्थ्य" },
      { k: "stage", label: "Stage / Competition", deva: "मंच" },
    ] },
  { key: "diet", multi: false, q: "How do you eat?", sub: "We’ll build your plate around it.",
    opts: [
      { k: "veg", label: "Vegetarian" },
      { k: "nonveg", label: "Non-Vegetarian" },
      { k: "egg", label: "Eggetarian" },
      { k: "vegan", label: "Vegan" },
    ] },
  { key: "freq", multi: false, q: "How often can you train?", sub: "Be honest — consistency beats intensity.",
    opts: [
      { k: "3", label: "3 days / week" },
      { k: "4", label: "4 days / week" },
      { k: "56", label: "5–6 days / week" },
    ] },
  { key: "focus", multi: true, q: "Where do you want to focus?", sub: "Select all that apply.",
    opts: [
      { k: "chestarms", label: "Chest & Arms" },
      { k: "backshould", label: "Back & Shoulders" },
      { k: "legs", label: "Legs & Glutes" },
      { k: "core", label: "Core & Abs" },
      { k: "cond", label: "Conditioning" },
      { k: "mobility", label: "Mobility" },
    ] },
];

const DW_PROTEIN = {
  veg:    { b: "paneer bhurji + 2 multigrain rotis", l: "rajma / chole + brown rice + curd", po: "whey or paneer + banana", d: "paneer / soya curry + sautéed greens", snack: "Greek yogurt + handful of nuts" },
  nonveg: { b: "3 eggs + oats + a fruit", l: "grilled chicken + rice + salad", po: "whey + banana", d: "fish or chicken + veg + roti", snack: "boiled eggs / chicken slices" },
  egg:    { b: "egg-white omelette + 2 rotis", l: "paneer + rice + curd", po: "whey + banana", d: "paneer + veg + roti", snack: "2 boiled eggs + nuts" },
  vegan:  { b: "tofu scramble + multigrain toast", l: "tofu / soya chunks + quinoa", po: "vegan protein + banana", d: "mixed lentils + tofu + greens", snack: "roasted chana + peanut butter" },
};
const DW_GOAL = {
  muscle:   { title: "Lean Mass", cal: "Slight surplus (+250–350 kcal)", pro: "1.8–2.2 g protein / kg", note: "Eat enough to grow, train heavy, sleep 8h." },
  fatloss:  { title: "Fat Loss", cal: "Moderate deficit (−400–500 kcal)", pro: "2.0–2.4 g protein / kg", note: "Protein high, steps up, lift to keep muscle." },
  strength: { title: "Strength", cal: "Around maintenance", pro: "1.6–2.0 g protein / kg", note: "Fuel the big lifts; carbs around training." },
  fitness:  { title: "General Fitness", cal: "Maintenance", pro: "1.6 g protein / kg", note: "Balanced plate, move daily, stay consistent." },
  stage:    { title: "Stage Prep", cal: "Structured deficit + refeeds", pro: "2.2–2.6 g protein / kg", note: "Coach-managed. Timing & conditioning are everything." },
};
const DW_SPLIT = {
  "3": "Full-body × 3 — every session hits everything.",
  "4": "Upper / Lower split — 2 upper, 2 lower days.",
  "56": "Push / Pull / Legs — classic bodybuilding split.",
};

/* membership match — turn the answers into one clear plan recommendation */
const PLAN_REC = {
  bhakt:  { deva: "भक्त", name: "Bhakt", per: "Monthly", price: "₹1,500", unit: "/ month",
    why: "Start month-to-month — full floor and every class while you find your rhythm. No lock-in." },
  sadhak: { deva: "साधक", name: "Sadhak", per: "3 Months", price: "₹3,500", unit: "/ quarter",
    why: "A full season is where habits set. A lower rate, priority booking and a quarterly movement screen." },
  yodha:  { deva: "योद्धा", name: "Yodha", per: "12 Months", price: "₹10,000", unit: "/ year",
    why: "Total devotion at our lowest rate — 1:1 onboarding and a coach who maps your whole year." },
};
function matchPlan(ans) {
  if (ans.goal === "stage" || ans.freq === "56") return "yodha";
  if (ans.freq === "4" || ans.goal === "strength" || ans.goal === "muscle") return "sadhak";
  return "bhakt";
}

function DietWizard({ onClose }) {
  const [step, setStep] = useStateN(0);
  const [ans, setAns] = useStateN({ goal: null, diet: null, freq: null, focus: [] });
  const [done, setDone] = useStateN(false);
  const total = DW_STEPS.length;

  const pick = (key, k, multi) => {
    setAns((prev) => {
      if (multi) {
        const cur = prev[key] || [];
        return { ...prev, [key]: cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k] };
      }
      return { ...prev, [key]: k };
    });
  };
  const next = () => setStep((s) => Math.min(s + 1, total - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const cur = DW_STEPS[step];
  const curVal = ans[cur.key];
  const stepDone = cur.multi ? (curVal && curVal.length > 0) : !!curVal;
  const isLast = step === total - 1;

  if (done) return <DietPlan ans={ans} onClose={onClose} onRestart={() => { setDone(false); setStep(0); setAns({ goal: null, diet: null, freq: null, focus: [] }); }} />;

  return (
    <div className="dw">
      <div className="dw__head">
        <span className="sec__num">Free starter plan</span>
        <div className="dw__steps">{DW_STEPS.map((_, i) => (
          <span key={i} className={"dw__pip" + (i <= step ? " on" : "")}></span>
        ))}</div>
      </div>
      <div className="dw__body" key={step}>
        <span className="dw__count">Step {step + 1} of {total}</span>
        <h3 className="dw__q">{cur.q}</h3>
        <p className="dw__sub">{cur.sub}</p>
        <div className="dw__chips">
          {cur.opts.map((o) => {
            const on = cur.multi ? (curVal || []).includes(o.k) : curVal === o.k;
            return (
              <button key={o.k} type="button" className={"chip" + (on ? " on" : "")}
                onClick={() => pick(cur.key, o.k, cur.multi)}>
                {o.deva && <span className="chip__deva">{o.deva}</span>}
                {o.label}
                {on && <span className="chip__tick">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
      <div className="dw__foot">
        <button type="button" className="dw__back" onClick={back} disabled={step === 0}>← Back</button>
        {isLast
          ? <button type="button" className="btn btn--gold" disabled={!stepDone} onClick={() => setDone(true)}>Generate my plan<span className="btn__arrow">→</span></button>
          : <button type="button" className="btn btn--gold" disabled={!stepDone} onClick={next}>Next<span className="btn__arrow">→</span></button>}
      </div>
    </div>
  );
}

function DietPlan({ ans, onClose, onRestart }) {
  const g = DW_GOAL[ans.goal] || DW_GOAL.fitness;
  const p = DW_PROTEIN[ans.diet] || DW_PROTEIN.veg;
  const split = DW_SPLIT[ans.freq] || DW_SPLIT["3"];
  const rec = PLAN_REC[matchPlan(ans)];
  const focusLabels = (ans.focus || []).map((k) => (DW_STEPS[3].opts.find((o) => o.k === k) || {}).label).filter(Boolean);
  const meals = [
    ["Breakfast", p.b],
    ["Mid-morning", p.snack],
    ["Lunch", p.l],
    ["Post-workout", p.po],
    ["Dinner", p.d],
  ];
  return (
    <div className="dp">
      <div className="dp__hero">
        <span className="dp__deva">आहार · your starter plan</span>
        <h3 className="dp__title">{g.title} <span className="accent">plate</span></h3>
        <p className="dp__note">{g.note}</p>
        <div className="dp__stats">
          <div className="dp__stat"><span className="v">{g.cal}</span><span className="k">Calories</span></div>
          <div className="dp__stat"><span className="v">{g.pro}</span><span className="k">Protein target</span></div>
          <div className="dp__stat"><span className="v">{split}</span><span className="k">Training split</span></div>
        </div>
      </div>
      <div className="dp__meals">
        <span className="dp__meals-h">A day on your plate</span>
        <ul>
          {meals.map((m, i) => (
            <li key={i}><span className="dp__when">{m[0]}</span><span className="dp__what">{m[1]}</span></li>
          ))}
        </ul>
      </div>
      {focusLabels.length > 0 && (
        <p className="dp__focus"><b>Your focus:</b> {focusLabels.join(" · ")} — we’ll bias your sessions here.</p>
      )}
      <div className="dp__rec">
        <span className="dp__rec-h">✨ Your matched plan</span>
        <div className="dp__rec-card">
          <div className="dp__rec-top">
            <span className="dp__rec-deva">{rec.deva}</span>
            <div className="dp__rec-name"><b>{rec.name}</b><span>{rec.per}</span></div>
            <div className="dp__rec-price"><span className="amt">{rec.price}</span><span className="per">{rec.unit}</span></div>
          </div>
          <p className="dp__rec-why">{rec.why}</p>
        </div>
      </div>
      <p className="dp__disc">This is a free starter guide, not medical advice. Your coach will tailor exact numbers,
        timing and supplements once you join the Sangha.</p>
      <div className="dp__foot">
        <button type="button" className="dw__back" onClick={onRestart}>↺ Start over</button>
        <a href="#membership" className="btn btn--gold" onClick={onClose}>Choose {rec.name}<span className="btn__arrow">→</span></a>
      </div>
    </div>
  );
}

Object.assign(window, { Transformations, Horizon });