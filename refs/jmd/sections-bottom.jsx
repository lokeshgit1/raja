// sections-bottom.jsx — Membership, Final CTA, Footer
const { useRef: useRefB } = React;

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

/* ---------------- MEMBERSHIP ---------------- */
function Membership() {
  const cta = useMagnetic(0.22);
  const [openIdx, setOpenIdx] = React.useState(null);
  const plans = [
    {
      deva: "भक्त", name: "Bhakt · Monthly", cur: "₹", amt: "1,500", per: "/ month",
      desc: "Begin the practice. Full floor access and every group class, month to month.",
      feats: ["Unlimited gym floor access", "All group classes", "App-based programming", "No long-term lock-in"],
      img: "images/plan-bhakt.png",
      long: "The doorway in. No long vow, no pressure — just full access to the floor and every class while you find your rhythm. Perfect for first-timers testing whether a gym with soul is for them.",
      who: "Best for newcomers & the curious",
      metrics: [["Commitment", "Month to month"], ["Effective", "₹1,500 / mo"], ["You keep", "Full flexibility"]],
      unlocks: ["Member app with your full program", "Open-gym access, 7 days a week", "An invite to our monthly Sangha meetups"],
      reassure: "Pause, upgrade or cancel anytime — no questions asked.",
      feat: false, cta: "Begin monthly",
    },
    {
      deva: "साधक", name: "Sadhak · 3 Months", cur: "₹", amt: "3,500", per: "/ quarter",
      desc: "The committed path. One season of devotion — and you save ₹1,000.",
      feats: ["Everything in Monthly", "Works out to ₹1,167 / month", "Save ₹1,000 vs paying monthly", "Quarterly movement screen", "Priority class booking"],
      img: "images/plan-sadhak.png",
      long: "A full season to actually change. Three months is where habits set and the body answers — and you lock in a lower rate plus a quarterly movement screen so progress is measured, not guessed.",
      who: "Best for building a real habit",
      metrics: [["Commitment", "3 months"], ["Effective", "₹1,167 / mo"], ["You save", "₹1,000"]],
      unlocks: ["A quarterly movement screen & re-test", "Priority booking on every class", "A personalised nutrition starter guide"],
      reassure: "One season, one rate — your price is locked for the quarter.",
      feat: false, cta: "Choose quarterly",
    },
    {
      deva: "योद्धा", name: "Yodha · 12 Months", cur: "₹", amt: "10,000", per: "/ year",
      desc: "Total devotion. A full year on the floor at our lowest-ever rate.",
      feats: ["Everything in Quarterly", "Works out to ₹833 / month", "Save up to ₹8,000 vs monthly", "Offer pricing ₹10,000–12,000", "1:1 onboarding with a coach"],
      img: "images/plan-yodha.png",
      long: "The warrior’s commitment. A year on the floor at our lowest-ever rate, opened by a one-to-one onboarding with a coach who maps your whole journey. This is how transformations happen — and champions are made.",
      who: "Best for serious, long-term transformation",
      metrics: [["Commitment", "12 months"], ["Effective", "₹833 / mo"], ["You save", "up to ₹8,000"]],
      unlocks: ["1:1 onboarding & a mapped 12-month journey", "Body-composition tracking every cycle", "Two guest passes a month for friends", "A locked rate — you never pay a price rise"],
      reassure: "Your lowest-ever rate, held for a full year of devotion.",
      feat: true, tag: "Best value", cta: "Join for a year",
    },
  ];
  const sel = openIdx != null ? plans[openIdx] : null;
  return (
    <section className="sec" id="membership">
      <div className="shell">
        <div className="sec__head reveal" style={{ textAlign: "center", margin: "0 auto clamp(56px,7vh,90px)" }}>
          <span className="sec__num" style={{ display: "block" }}>06 — Membership</span>
          <h2>Choose your <span className="accent">devotion.</span></h2>
          <p className="lede" style={{ marginInline: "auto" }}>One standard of coaching, three ways to commit —
            the longer the vow, the less you pay. A one-time ₹2,000 admission joins you to the Sangha.</p>
        </div>
        <div className="plans__grid">
          {plans.map((p, i) => (
            <article className={"plan reveal" + (p.feat ? " plan--feat" : "")} data-d={i + 1} key={p.name}
              role="button" tabIndex={0}
              onClick={() => setOpenIdx(i)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpenIdx(i); } }}>
              {p.feat && <span className="plan__tag">★ {p.tag}</span>}
              <span className="plan__deva">{p.deva}</span>
              <span className="plan__name">{p.name}</span>
              <div className="plan__price">
                <span className="cur">{p.cur}</span>
                <span className="amt">{p.amt}</span>
                <span className="per">{p.per}</span>
              </div>
              <p className="plan__desc">{p.desc}</p>
              <hr />
              <ul className="plan__feats">
                {p.feats.map((f, j) => <li key={j}><Check />{f}</li>)}
              </ul>
              {p.feat
                ? <a ref={cta} href="#" className="btn btn--gold" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenIdx(i); }}>{p.cta}<span className="btn__arrow">→</span></a>
                : <button type="button" className="btn btn--ghost" onClick={(e) => { e.stopPropagation(); setOpenIdx(i); }}>{p.cta}</button>}
            </article>
          ))}
        </div>
        <div className="plans__note reveal" data-d="2">
          <Divider style={{ maxWidth: 420, margin: "0 auto 18px" }} />
          <p>One-time admission <b>₹2,000</b> &nbsp;·&nbsp; All plans include full floor &amp; class access
            &nbsp;·&nbsp; Annual offer pricing varies <b>₹10,000–12,000</b> by season</p>
        </div>
      </div>

      <Modal open={openIdx != null} onClose={() => setOpenIdx(null)} variant="modal__card--split">
        {sel && (
          <React.Fragment>
            <div className="pm__media">
              <img src={sel.img} alt={sel.name} />
              <span className="pm__deva">{sel.deva}</span>
            </div>
            <div className="pm__body">
              {sel.feat && <span className="pm__badge">★ {sel.tag}</span>}
              <span className="sec__num">Membership</span>
              <h3 className="pm__title">{sel.name}</h3>
              <div className="plan__price pm__price">
                <span className="cur">{sel.cur}</span>
                <span className="amt">{sel.amt}</span>
                <span className="per">{sel.per}</span>
              </div>
              <p className="pm__lede">{sel.long}</p>
              <div className="pm__metrics">
                {sel.metrics.map((m, j) => (
                  <div className="pm__metric" key={j}>
                    <span className="v">{m[1]}</span>
                    <span className="k">{m[0]}</span>
                  </div>
                ))}
              </div>
              <div className="pm__incl">
                <span className="pm__incl-h">{sel.who}</span>
                <ul>{sel.feats.map((c, j) => <li key={j}>{c}</li>)}</ul>
              </div>
              <div className="pm__incl">
                <span className="pm__incl-h">Also unlocks</span>
                <ul>{sel.unlocks.map((c, j) => <li key={j}>{c}</li>)}</ul>
              </div>
              <p className="pm__reassure"><span className="deva">ॐ</span>{sel.reassure} A one-time ₹2,000 admission joins you to the Sangha.</p>
              <a href="#" className="btn btn--gold" onClick={(e) => { e.preventDefault(); setOpenIdx(null); }}>Join the Sangha
                <span className="btn__arrow">→</span></a>
            </div>
          </React.Fragment>
        )}
      </Modal>
    </section>
  );
}
/* ---------------- FINAL CTA ---------------- */
function FinalCTA() {
  const cta = useMagnetic(0.3);
  const yantra = useParallax(0.04);
  const assurances = [
    ["First session free", "Walk in once, on us"],
    ["No contract to start", "Begin month to month"],
    ["Coaches who know you", "By name, by number, by why"],
  ];
  return (
    <section className="finalcta">
      <div ref={yantra} className="finalcta__yantra"><Yantra /></div>
      <Trishul className="finalcta__trishul" sw={1.1} />
      <div className="finalcta__glow"></div>
      <div className="shell finalcta__inner">
        <div className="finalcta__emblem" aria-hidden="true">
          <div className="finalcta__emblem-glow"></div>
          <div className="finalcta__emblem-disc"></div>
          <MandalaRing className="finalcta__emblem-ring spin-slow" />
          <MandalaRing className="finalcta__emblem-ring2 spin-rev" />
          <img className="finalcta__emblem-fig" src="images/method-sadhana-gold.png" alt="" />
        </div>
        <div className="energy reveal"><span className="deva">जय माता दी</span></div>
        <h2 className="reveal" data-d="1">Show up.<br /><span className="accent">Become.</span></h2>
        <p className="reveal" data-d="2">Your first session is on us. Walk in once — feel the difference
          a gym with soul makes — and decide for yourself. No pressure, no contract to begin;
          just a coach, a barbell, and the start of a practice worth keeping.</p>
        <div className="finalcta__assure reveal" data-d="3">
          {assurances.map((a, i) => (
            <div className="fca" key={i}>
              <span className="fca__check">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
              </span>
              <span className="fca__txt"><b>{a[0]}</b><span>{a[1]}</span></span>
            </div>
          ))}
        </div>
        <a ref={cta} href="#membership" className="btn btn--gold reveal" data-d="4">
          Book your first session<span className="btn__arrow">→</span></a>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Social({ d, label }) {
  return (
    <a href="#" aria-label={label}>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d={d} />
      </svg>
    </a>
  );
}

function Footer() {
  const ig = "M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.17.4.36 1 .42 2.2.07 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 1.8-.42 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.17-1 .36-2.2.42-1.3.07-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.8-.25-2.2-.42-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.17-.4-.36-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.25-1.8.42-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.17 1-.36 2.2-.42C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.07-.9.04-1.4.2-1.7.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.12.3-.28.8-.32 1.7C3.2 8.5 3.2 8.9 3.2 12s0 3.5.07 4.7c.04.9.2 1.4.32 1.7.17.43.37.74.69 1.06.32.32.63.52 1.06.69.3.12.8.28 1.7.32 1.2.07 1.6.07 4.7.07s3.5 0 4.7-.07c.9-.04 1.4-.2 1.7-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.12-.3.28-.8.32-1.7.07-1.2.07-1.6.07-4.7s0-3.5-.07-4.7c-.04-.9-.2-1.4-.32-1.7a2.86 2.86 0 0 0-.69-1.06 2.86 2.86 0 0 0-1.06-.69c-.3-.12-.8-.28-1.7-.32C15.5 4 15.1 4 12 4zm0 3.06A4.94 4.94 0 1 1 12 17a4.94 4.94 0 0 1 0-9.88zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28zm5.14-.66a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0z";
  const yt = "M21.6 7.2s-.2-1.4-.8-2c-.76-.8-1.6-.8-2-.85C16 4.2 12 4.2 12 4.2h-.02s-4 0-6.8.2c-.4.05-1.24.05-2 .85-.6.6-.8 2-.8 2S2.2 8.8 2.2 10.5v1.6c0 1.65.2 3.3.2 3.3s.2 1.4.8 2c.76.8 1.76.77 2.2.86 1.6.15 6.6.2 6.6.2s4 0 6.8-.21c.4-.05 1.24-.05 2-.85.6-.6.8-2 .8-2s.2-1.65.2-3.3v-1.6c0-1.65-.2-3.3-.2-3.3zM9.96 14.6V8.9l5.2 2.86-5.2 2.84z";
  const wa = "M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 0 1 6.9 12.6l-.4.6.6 2.2-2.3-.6-.5.3A8.2 8.2 0 1 1 12 3.8zm-3 3.7c-.2 0-.5.07-.7.36-.2.3-.86.84-.86 2.05 0 1.2.88 2.37 1 2.53.12.16 1.72 2.74 4.27 3.74 2.1.83 2.53.66 2.99.62.46-.04 1.48-.6 1.69-1.2.2-.58.2-1.08.15-1.18-.06-.1-.22-.16-.46-.28-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.42-1.34-1.66-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.46-.4-.4-.54-.4z";
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__top">
          <div className="footer__brand">
            <span className="deva-mark">जय माता दी</span>
            <div className="word">JAI <b>MATA DI</b> FITNESS</div>
            <p>Strength is devotion. A strength &amp; conditioning gym with soul — built for everyday
              fighters and serious lifters.</p>
          </div>
          <div className="footer__col">
            <h4>Train</h4>
            <ul>
              <li><a href="#programs">Strength</a></li>
              <li><a href="#programs">Conditioning</a></li>
              <li><a href="#programs">Combat &amp; Functional</a></li>
              <li><a href="#programs">Recovery &amp; Breath</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>Gym</h4>
            <ul>
              <li><a href="#method">The Method</a></li>
              <li><a href="#trainers">Our Coaches</a></li>
              <li><a href="#membership">Membership</a></li>
              <li><a href="#top">Book a Tour</a></li>
            </ul>
          </div>
          <div className="footer__news">
            <label htmlFor="nl">Join the Sangha</label>
            <p>Training notes, member stories, and the occasional dose of Shakti — to your inbox.</p>
            <form className="footer__form" onSubmit={(e) => e.preventDefault()}>
              <input id="nl" type="email" placeholder="you@email.com" />
              <button type="submit">Join</button>
            </form>
          </div>
        </div>
        <div className="footer__bottom">
          <div className="copy">© 2026 Jai Mata Di Fitness · <span className="deva">शक्ति</span> · Made with devotion</div>
          <div className="socials">
            <Social d={ig} label="Instagram" />
            <Social d={yt} label="YouTube" />
            <Social d={wa} label="WhatsApp" />
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Membership, FinalCTA, Footer });
