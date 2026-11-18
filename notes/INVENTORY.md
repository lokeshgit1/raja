# SOURCE-OF-TRUTH INVENTORY
Extracted from supplied product files only. Nothing here is invented.
Raw text: notes/raw-*.txt · Sources: uploads/

---

## 01 · VIDWAN — "the operating system for India's home tutors"
Vesperon Tech · PRD v1.0 · VT-VIDWAN-PRD-2026-001 · 05 Jul 2026 · 33 sections
िवद्वान् = "the learned one". Tagline: *"Aapke bachche ki poori padhai ka hisaab — attendance, fees, test, report — sab kuch ek app mein."*

### Users (3 roles, never blurred)
| Role | Who | Surface |
|---|---|---|
| PRIMARY USER | **Sunita**, 32, home tutor. Maths & Science, 34 kids / 3 batches, tier-2 city. Android, WhatsApp-fluent, not "techy". Runs fees on a diary. | Flutter app |
| PAYER | **Rajesh**, parent. Pays ₹1,500/mo for son Aarav. Anxious about attendance + improvement. **Will never install another app.** | WhatsApp only |
| RECORD (not a user) | **Aarav**, Class 8. Attendance, marks, fee status. A minor — deliberately no login. | none |
Plus: Vesperon **ops admin** → internal web dashboard (KYC, settlement, BSP templates, pilot analytics).

### Problems (from PRD §02)
1. **Fee leakage** — diary/memory; 5–15% of billings lost monthly.
2. **Awkward chasing** — asking face-to-face hurts the relationship, so she delays, so leakage worsens.
3. **Zero parent visibility** — parent pays ₹1,000–3,000/mo and receives *nothing* back.
4. **Everything manual** — admin eats teaching time.
5. **Trust deficit** — trust rests on word of mouth + an exam result months later.
Gap: consumer edtech competes with the tutor; institute ERP (Teachmint/Classplus) is priced for orgs. Real incumbent = **paper diary + WhatsApp + Excel**.

### IA — five tutor surfaces + WhatsApp as the sixth
Bottom tab bar, 5 destinations: **Timetable (HOME · week grid) · Batches · Fees · Tests · More** (reports, notices, settings, earnings).
One backend (one shared DB). **Parent surface = WhatsApp** (reminders · receipts · reports · alerts, no app).
Principle: *"Timetable is home"* — app always launches on the week grid because that's where a tutor's day lives.

### Screens / flows
**Onboarding (target <10 min):** Phone OTP → language (Hindi/English/Bangla/Tamil/Telugu/Marathi) → profile basics (name, subjects, city — appear on receipts) → create first batch → bulk-add students → land on Timetable.
- Batch fields: name (≤40, unique), days[] (≥1), start_time, fee/student/month, cycle_day (1–28, default 1), subject/grade tag (opt).
- Student fields: name (≤50), **parent WhatsApp (E.164, required — sole parent contact & premium identity)**, fee override (scholarship/sibling), parent name/lang, join date (pro-rates first invoice).
- Design rule: only name, days, time, fee, student name + parent number are mandatory.

**Timetable & attendance (most-used action):** week grid Mon–Sun, sessions as blocks, today highlighted → tap session → **student list loads all defaulted to Present** → tap only absentees → Save → optional same-day WhatsApp absent alert (free tier).
Edge cases: holiday → tutor cancels session → **excluded from the "classes held" denominator**; mid-month join → % counts only sessions on/after join date; edits allowed within the current cycle (report recomputes); extra/makeup class counts toward held & attended; bulk mark-all-absent control.

**Fee engine (Flow A):** Invoice auto on cycle day → WhatsApp reminder + UPI link (Razorpay) → parent pays → auto-receipt → ledger Paid. Unpaid after N days → **Defaulter view** (red-tinted list, sorted by days overdue & amount, "Remind" per row + "Remind all") + gentle auto re-reminder cadence (e.g. day 3, 7, 14). Tutor can mark paid (cash) or record partial. Monthly recovery view = collected vs outstanding.

**Tests, marks & the monthly report:** tutor creates Test (batch, date, name, max marks) → fast one-number-per-student entry → feeds report engine + per-test alert (premium).
Report is **generated, never authored**: attendance data + test marks → rule-based engine → PDF → premium parent.
- attendance % = attended ÷ classes_held (held excludes cancelled; both since join date)
- latest test = score ÷ max × 100 with ▲/▼ vs previous
- trend verdict tag: **Consistent · Improving · Attendance dropping · Needs attention**
- Example line: *"Aarav ne is mahine 14/16 classes attend kiye (88%) aur last test mein 72% score kiya — pichhle test se 6% behtar. Verdict: Improving."*
- Artifact: one-page branded PDF — tutor header, month, **attendance ring**, latest + previous test with trend, verdict tag, short encouraging note.

**Parent premium (zero install):** tutor adds student → parent gets WhatsApp with activation link → lightweight web page (confirm child, see what premium unlocks) → **UPI Autopay mandate** (this is the DPDP consent event) → premium stream begins, tutor earns 30% → lapse: mandate fails/cancels → auto-downgrade to Free at cycle end, keeps free basics.

**Free vs Premium split:** free = fee reminder + UPI link, receipt, same-day absent alert. Premium (per child, ₹49–99 hypothesis) = full report-card PDF, per-test score alert, full attendance history, upcoming-notice broadcasts.

**Notices/broadcasts:** one message to a whole batch's parents (holidays, timing changes, test announcements). Free parents still get essential operational notices so no child is stranded.

### Two money flows (never share a ledger, wallet or reminder)
- **Flow A** parent→tutor, tuition (e.g. ₹1,500), rail = Razorpay UPI collect link per invoice, **platform take ₹0**, settles straight to tutor.
- **Flow B** parent→platform, premium, rail = **UPI Autopay mandate**, split **70% platform / 30% tutor** via Razorpay Route. Vidwan's only v1 revenue line.

### Architecture
Flutter tutor app (offline-tolerant attendance) · Ops web dashboard · Parent WhatsApp + pay page (Next.js) → **NestJS API** → **PostgreSQL/Supabase with Row-Level Security on tutor_id** + **job workers** (reminders, month-end reports, retry/dead-letter) → 3 external rails: **WhatsApp BSP** (Interakt/Wati) · **Razorpay** (links, Autopay, Route) · **Puppeteer PDF render**. PostHog + Sentry.
Report pipeline: cron month-end → gather (attend+marks) → compute (%, trend, verdict) → render PDF → send WA media → track delivery. Idempotent per (student, cycle); premium+active-mandate only; failure isolation per child; language per parent.
Data model — 9 entities: Tutor → Batch → {Student, Session, Test}; Session→Attendance; Test→Mark; Student→FeeInvoice→Payment (Payment carries `flow ∈ {A,B}`).

### Design decisions (Decision Log, verbatim rationale)
- **D2** WhatsApp-only for parents, no parent app — zero install removes the biggest funnel leak; 100% reach; cleaner minor-data posture.
- **D3** Parents pay per child; tutor free forever (v1) — necessity on tutor side, aspiration on parent side.
- **D5** Same-day absent alert = free tier — builds the parent trust/habit that later sells premium.
- **D6** Student is a record, not a user — no minor login → smallest DPDP surface.
- **D7** Two strictly separate money flows — different owners/rails/economics.
- **D8** Reports generated, never authored — zero extra tutor effort is the whole pitch.
- **Default-present attendance** (§09) — in a real tuition the vast majority attend; touching only exceptions turns a 30-tap chore into a 2-tap action.
- **D10** New brand palette **"Vidya Indigo"** — scholarly, premium, ownable; distinct from Vesperon navy/orange/gold.
- **D1** Name Vidwan; rejected "Hazri" (too payroll).

### Compliance
Students are minors stored only as records; **parent is the consenting data principal**, consent captured at premium activation and logged. Data minimisation (name, attendance, marks, fee status, parent number only). DPDP full compliance 13 May 2027, enforcement active Q1 2026. RLS tenant isolation; phone OTP → short-lived JWT; no card/UPI credentials stored; time-limited media links.

### Numbers in source (labelled Hypothesis where the PRD does)
71M students in private tuition (NSSO) · $4.1B market 2024 → $7.8B by 2033 @7.5% CAGR (IMARC) · ₹0 tutor cost · 30% rev-share · ARPU ₹79 → ₹332 net platform revenue/tutor/month, ₹142 tutor earning · targets: 500 active tutors, ₹1.2 Cr/mo GMV, 15–20% premium conversion, ≥95% report delivery, ≥80% 3-mo tutor retention · North star = **active premium children** · 15-week P0–P4 delivery · 50-tutor pilot gates cluster #2 (≥70% activation, ≥15% conversion).

---

## 02 · SERVORA — "Smart Kitchen OS"
Wisbox Technology · "The Servora Build Bible" v2.0 · June 2026 · 20 pages · 30+ screens & states
**Ideation, artwork & design by Raja Sahoo, Founder & CEO, Wisbox Technology.** (Explicit authorship — this is his own product.)

### Problem, users
Two problems it kills: **running out** (no paneer at dinner rush = lost sales) and **wasting** (cream spoils overnight = money in the bin).
Users: restaurants & dhabas · cafés & bakeries · cloud kitchens & tiffin services. **Owner = the user. Low-tech, busy, hates typing.**

### The 5 clever moves (why it works where others failed)
1. **Photograph the menu, don't type it** — Servora Mind reads dishes → derives every raw material. Setup weeks → minutes.
2. **Tap "how full", never weigh** — Full/Half/Low/Empty; AI turns that into quantity + days of cover.
3. **Learn the kitchen in 7 days**, then autopilot.
4. **Traffic lights = days left, not amount** — half a sack of rice is green; half a tray of paneer is red.
5. **Connect menu ↔ stock** — "paneer spoils tomorrow" becomes "push a paneer combo now."

### Design system (exact, from §2 — use these hex values, never invent)
Ink navy `#0D1929` · Text navy `#16202E` · Gold accent `#E0B057` · Gold ink `#9A6E1E` · App canvas `#F4F0E8` · Card tint `#FBF9F4` · Card white `#FFFFFF` · Hairline `#ECE6D9`
Status traffic light: Green Fresh `#3E9B6E` (≥4 days cover) · Purple Use-soon `#6A4BB0` (aging perishable) · Amber Low `#E0B057` (1.5–4 days) · Red Critical `#D2553B` (<1.5 days / out). Tints: green `#E4F0E8` purple `#EBE4F7` amber `#F6EFDC` red `#FBE7E0`.
**Rule: colour = status, never decoration. Never colour alone — always dot + tint + word** (Healthy/Use soon/Low/Critical).
Type: **Bricolage** display/headings 700–800 (big numbers, titles, brand mark) + **Hanken Grotesk** body/labels/buttons 400–800.
Shape: cards 18–22px · pills 999px · **phone frame 420×910** · screen padding 16–26px · hit target ≥44px · body ≥14–17px.
Icons: friendly emoji for food categories (🍚 🧀 🥛) + thin 2px Lucide-style line icons for nav/controls. No detailed illustrations.
Components: primary navy button (r14–16, soft shadow) · **gold button reserved for the hero moment** (Create account, Enter Servora) · status dot + meter · **jar-fill selector (4 tappable filling jars — the core input of the whole app)** · bottom sheet (r28 top, dark scrim) · full-screen overlay · toast (navy pill + green tick, 2.2s) · toggle (green on).
Motion: `svFade` page-in · `svUp` sheet rise · `svPop` scale-in · `svPulse` live dot · `svScan` OCR line · `svSpin` loader. Durations 0.2–0.6s ease.

### Architecture of the app: 3 phases → 3 tabs → stacked overlays
`phase: 'auth' → 'onb' → 'app'` — **no URL router, navigation is state.** Overlays are independent booleans layered by z-index so flows can stack.
State: phase · tab · densities (0–3 per item) · orderQty · connections · countIdx · selId · stockTab.
Bottom nav (always 3): **📊 Dashboard · 📦 Stock (Needs you / All items) · ⚡ Count**.
Overlay z-order: Add chooser z50 · Add flow z55 · Profile z56 · Connections hub z57 · Notifications z58 · My orders z58 · Live feed z58 · Item detail z60 · Servora report z60 · Push offer z61 · Connect flow z62 · Terms/Privacy/Settings z64 · Toast z70.

### Screens
**Auth:** landing (dark hero, spinning ring — 2 critical / 3 low / 18 fresh badges orbiting a big "23 items"; headline **"Never run out. Never waste."**; 3 feature chips; gold "Create your kitchen account") → sign up (phone ≥6, password ≥6, terms ticked; continue grey→navy) → sign in → forgot password 3 steps (number → code, demo 123456 → new password) → **4-digit unlock PIN + morning lock screen** ("Hi {name}", wrong PIN → shake).
**Onboarding, 5 steps** (progress bar fills to 100%): 1 kitchen details (name + owner required) · 2 **add menu — 4 ways** (snap photo/PDF · CSV/Excel · by hand · cuisine starter list) with skip ("Servora Mind fills it") · 3 **"How full are these now?"** — only the 5 hero items (rice, paneer, chicken, oil, milk), tap a jar → instant days-of-cover estimate · 4 connect POS (Wisbox/Petpooja/Zomato/Swiggy, skippable) · 5 **"Kitchen mapped 100%"** celebration explaining the 7-day learning window → gold "Enter Servora".
**Dashboard (top→bottom):** header ("Hello, Sneha" + kitchen name, bell w/ red badge, avatar) · **stock-health hero donut** (dark card, 3-colour ring, "needs you" count in the middle, tappable legend fresh/low/critical, Saved-per-month + On-shelf value) · **"Do this first" focus card** (spoil→red Create an offer / low→amber Reorder now / else green All clear) · two quick actions (Count stock under 60s · Add items) · live-sync or gold Connect-POS banner · **today's order list** (−/+ steppers, supplier, line cost, running total, Place order) · **ask the neighbourhood** (post box → 14 nearby kitchens).
**Stock · Needs you:** learning banner "Servora Mind is learning · day 3 of 7" → later green "Autopilot ON" · **🔥 Use before it spoils** (₹ at risk, red-topped card per perishable: name, expiry, money at risk, checkable dish chips → **Push offer** → "Offer is live", card disappears ~1.3s) · **🛒 Order today** (side-scrolling cards: big days-left number, Mind's suggested quantity, Add to order) · empty state "Nothing needs you".
**Stock · All items:** filter chips All/Order now/Expiring/Fresh + colour legend · rows sorted most-urgent-first (emoji + colour dot, name, "powers N dishes", quantity "2 sacks · ~280 servings", big days-left number, fill meter, status word) → **item detail bottom sheet** (status line, in stock now, runs out in, supplier, suggested reorder, value/unit, **jar-fill selector to update fullness**, dishes it powers, primary action). Changing the jar writes straight to `densities` — row, dashboard ring and counts all update at once; the landed item **glows gold ~2.6s**.
**Count & report:** one item at a time (progress dots, "Item 3 of 24 · ~63s left", last count, 4 jars with quantity hints, Back / Confirm & next, "Skip the rest → summary"; **perishables ordered first**) → "Count done!" celebration (fresh/low/critical totals) → **editable report** (Mind pre-fills Empty=0 Low=1 Half=2 Full=4, grouped by category, editable number boxes, free-text "Note for the kitchen") → **branded A4 PDF** (navy header band, gold S logo, "SERVORA MIND · KITCHEN STOCK REPORT", 3 stat cards, items grouped by category with colour dot + status word + quantity, kitchen note boxed in gold, auto-paginates, `Servora-stock-report-{date}.pdf`).
**Add items, 3 (+1) ways:** A snap the menu — capture (corner guides) → **scanning (green scan-line sweep, "Reading your menu…" ~1.5s)** → review ("N dishes → M raw materials", tick dishes, toggle ingredient chips, +Add missing, **confidence % per dish**). B CSV/Excel (≤5MB, columns item·category·unit·quantity any order, matched vs new). C by hand. D cuisine starter list (~50–74 items instantly, onboarding only).
**Connections & live orders:** hub lists Wisbox (dine-in/takeaway POS), Petpooja (online hub) with Zomato & Swiggy routed *through* it — **connecting Petpooja auto-connects both; disconnecting removes both**. Connect flow: 1 authorise (restaurant ID + phone; shows what Mind **will** read — orders, menu, modifiers — and what it **never** reads — payments, customer data) → 2 syncing checklist (~2s) → 3 done "84 dishes mapped · 312 ingredient links". **Live order feed:** "LIVE · auto-deducting stock", channel pills, orders-synced / sales-captured stats, order cards showing exact deductions (e.g. −250g chicken), stock drops & ring recolours in real time.
**Profile / orders / alerts:** navy hero (avatar, Owner · kitchen, **Autopilot ACTIVE** badge, 3 stats: waste prevented / items tracked / covers today), "Today, from your POS" card w/ bar chart + top mover, **Servora report modal = the AI diary** (everything Mind did today, each with time + value), **My orders** (stepper, line total, remove, grand total, "Approve & place order" — *the owner always has the final say*), notifications (Mind alerts + neighbourhood activity).
**Spoilage → push loop (the money-saving superpower):** at-risk item (name, expiry, ₹ at risk) → dish menu with dishes that use it suggested first + "Uses {item}" tag → tick → "Push offer for N dishes" → toast + dashboard "offer is live". In production: creates a time-boxed POS/aggregator discount linked back to the item so Mind can measure waste prevented.

### Logic (pure functions of state — UI never stores derived values)
```
cover = density > 0 ? round(density × cpl) : 0
if perishable: cover = min(cover, expiryDays)

status: density==0 → red (out)
  else perishable & expiry≤2 & density≥Half → purple (use soon)
  else cover<1.5 → red
  else cover<4 or (perishable & expiry≤2) → amber
  else → green
```
Donut = 3 arcs sized by share of green/amber/red, circumference 502.6 with a small gap.
**7-day calibration** learns true per-dish use, burn rate by weekday, supplier lead time, spoilage curve → replaces generic `cpl` defaults with personalised par-levels + autopilot.
Auto-deduct walks each sold dish's recipe, adds a fractional depletion per ingredient, drops one density bucket when depletion crosses 1.0. Only for connected channels; density floors at 0.
Item schema: id, name, cat, unit, **cpl** (days cover per fullness level), perish, expiry(days), price, sup, dishes[], def.
Seed catalogue: **24 items across 13 categories**, food and non-food (gas, parcel boxes, cups) — e.g. Basmati rice/Grains/sacks/₹2,400/Sri Maa Traders; Paneer/Dairy/trays/perishable 1d/₹600/Milkmaid Dairy; Chicken/Proteins/kg/2d/₹1,800/Fresh Meat Co.; Tomato/Vegetables/crates/2d/₹500/Unit-1 Mandi.

### Backend to stand up (current build is a front-end prototype, in-memory)
Auth & accounts · **menu OCR & ingredient graph** (image/PDF → dishes via LLM + food ontology → raw materials + confidence → item master + recipe BOM) · stock & prediction engine · POS/delivery connectors (OAuth + webhooks; **scopes: orders & menu only, never payments or customer identity**) · orders & suppliers (lead time fed back into prediction) · offers & neighbourhood (geo-scoped) · notifications & server-side PDF reports.

### Definition of done (per screen) — from §8
Matches palette/type/spacing · hit targets ≥44px, body ≥14px · status = colour + tint + word · every action gives feedback · **no dead space, every screen fills its frame edge to edge**.


---

## 03 · CURECALL — "telemedicine for Bharat"
Wisbox Technology · CC-PRD-0001 · v1.0 · **Ideation, Artwork & Design by Raja Sahoo, Founder & CEO**
2 apps · 32 screens · bilingual · AI-assisted. Positioning: *"A doctor in your pocket — that anyone in India can use."* Closing line: *"Healthcare that travels to the patient."*

### Problem removed
No long travel (villages are far from good doctors) · no language wall (patient's own language, not just English) · no lost paper (digital permanent record).

### Personas
- **Sunita Devi, 34 — the patient (primary).** Village two hours from the nearest good clinic. Reads Hindi, not English. Basic Android, patchy network. Needs: a real doctor today, in Hindi, without travelling — and to understand the medicine afterwards.
- **Dr. Anjali Verma, 38 — the doctor (primary).** Verified GP wanting extra income from home between hospital shifts. Needs: pre-screened patients with a summary ready, a fast safe way to prescribe, trusted peers for hard cases.
- **The caregiver (secondary).** One literate family member books for an elderly parent or child; needs several people's records in one account and a "who is this for" at the start.
Targets stated: 6 languages at sign-up · **<3 min from "I'm sick" to a doctor** · **0 words of medical jargon the patient must know**.

### Four pillars
Trust (only government-verified doctors, patients see proof) · Reach (any language, low bandwidth, audio-only fallback) · Speed (AI types so doctors care instead of writing) · Safety (a traffic-light gate catches emergencies before they're missed).

### Design system (exact)
Logo: rounded-square mark, **teal→blue gradient at 140°**, white glyph. Wordmark "Cure" teal + "Call" blue, Space Grotesk Bold, −0.6px tracking. **Never recolour the two halves the same.** Gradient #18A39E → #2B7CE3. Min mark 24px; clear space ½ mark height.
Core: Ink #0E2436 · Teal #0FA3A1 (primary brand) · Blue #2B7CE3 ("Call", links) · Cream #FBF6EE (app canvas).
Semantic (meaning fixed, never decorative): Green #16BD8E safe/paid/success · Amber #F39021 caution/pending · Red #E2574C emergency/urgent · **Purple #7257F5 = AI & peer layer**.
Type: **Space Grotesk** (display, numbers, time, wordmark) · **Hanken Grotesk** (UI labels, Latin body) · **Hind** (Devanagari & bilingual body) · **JetBrains Mono** (codes, IDs, registration numbers).
Scale: screen title 30px Hind Bold −0.5px · section head 24/700 · body 15/1.5 · caption 11–12 muted · hit target 44×44 always · icons Material Symbols Rounded FILL 1.
Components: primary button 62px tall in-app, radius 18–19, teal or ink fill · status chip (soft bg + bold text in the semantic colour) · toggle · info card (white, 1.5px border, 14px radius) · icon tile (30px rounded, soft bg of its colour) · toast (ink pill, ~2.5s).
Device frame: **392 × 830px phone, radius 54/45, ink bezel, 9:41 status bar**, vertical scroll, edge padding 18–24px, cream canvas. A right-side journey rail (~210px) is demo-only and ships nowhere near production.

### Screen architecture
Each app holds a single value called *screen*; a button doesn't open a link, it **changes that one word**. A second value uiLang (hi/en) flips every label through tr(hindi, english) — content authored as pairs, nothing hard-coded to one language.
PATIENT (17): onboard → welcome (language + who) → otp → consent → abha → home → doctors → doctor → pay → preconsult → gate → waiting → consult → rate → building → record → profile.
DOCTOR (16): intro1 · intro2 → signin → identity → registry → documents → liveness → review → verified → today → patients → consult → prescription → thanks → board → earnings → profile.

### Patient screens (key detail)
01 **Onboarding** — brand mark, warm hero, one-line promise "a doctor, in your language", single Get started. No sign-up wall — show value first.
02 **Welcome** — 6-tile language grid each with a native glyph (Hindi, English, Marathi, Tamil, Bangla, Telugu) + "Who is this for? Myself / A family member". *The most important screen for reach.*
03 **Phone + OTP** — +91 field, 4-box code, resend timer, **"Call instead" IVR fallback for no-SMS areas**. The only identity a rural patient reliably has.
04 **Consent** — three plain-language cards: what we keep (stored in India) · who can see it (only you + a doctor you allow; every view logged) · withdraw anytime. Records a timestamped, versioned consent; immutable ledger required before any health write.
05 **ABHA linking (optional, skippable)** — one ID for records across every hospital in India. Store ABHA address, not raw Aadhaar.
06 **Home** — "Namaste, Sunita" · **Med wallet ₹240 + Add money** (warns under ₹300) · **6-tile symptom grid** (Fever, Stomach, Cough, Skin, Repeat med, Explain report) · bell · family strip.
07 **Doctor list** — filter chips Verified / Available now / Top rated over cards (avatar, name, specialty, languages, rating, years, fee ₹249–₹329, online dot).
08 **Doctor profile** — verified registration number (e.g. NMC-DL-48217 ✓), three slots (Now 2 min / 6 PM Today / 10 AM Tmrw), fee, Proceed to pay. Slot soft-held ~2 min during checkout.
09 **Payment** — Med wallet or UPI/QR, clear total, auto-advance on success. Idempotent, refund on no-show.
10 **AI pre-consult** — friendly chat, **5 questions** (complaint, since when, severity, other symptoms, meds/allergy), answered by tapping a chip **or speaking** (mic), with a running "summary so far" panel.
11 **Safety gate** — the traffic light before the call.
12 **Waiting room** — doctor avatar, calm "joining you shortly", queue position; silent network check; pre-warms the video token.
13 **Live consult** — one WebRTC room, **two interfaces**: patient gets an immersive dark call with the doctor front-and-centre; doctor sees the patient alongside live vitals, intake notes and a quick-note pad. Shared timer, mic/cam toggles, end. **Auto-degrades to audio-only on a weak network** (callMode / netWeak).
14 **Rate the doctor** — stars + quick tags ("clear advice", "kind", "good listener"), skippable; powers the Top-rated filter.
15 **Record engine — 5 steps after you hang up:** 1 transcribing the consult · 2 drafting the structured note · 3 CureCall Intelligence medicine check · 4 doctor verified & e-signed · 5 your record is ready.
16 **Health record — three tabs:** **Samajh** ("understand" — the diagnosis in simple words, what to do, when to worry, listen to the consult audio, reminder toggle) · **Rx** (signed prescription, download PDF, find pharmacy with a QR) · **Story** (health timeline, every consult/test/report as dated dots).
17 **Profile** — Med wallet · family/care circle · ABHA & identity · consent & privacy (withdraw with a confirm; read who has viewed records) · notifications & language · IVR & help · logout.

### Doctor verification gauntlet (7 hard gates, no skipping)
01 two value-prop slides ("Treat patients from anywhere", "Peer case boards + payments") with floating proof chips + EN/हिं toggle · 02 sign in (same OTP service, account flagged role:doctor status:unverified) · 03 identity & specialty (1 of 5: General Physician, Physician, Pediatrics, Dermatology, Gynaecology — drives queue routing) · 04 **registry check** (6 councils incl. Delhi MC, NMC national, UP, Maharashtra, Kerala, TN + reg number; states idle→checking→found; live lookup against the NMC/state register) · 05 documents (MBBS required, MD/PG optional, council cert required, govt photo ID/ABHA required; Continue disabled until all required are in; encrypted, only the verification team sees them) · 06 **liveness face-match** against the uploaded ID photo (animated progress ring; store match score, not raw video) · 07 under review (human + automated queue) · 08 **Verified 🎉** (confetti, preview of how patients see you).
Trust ledger captures: council + reg no · MBBS · PG · council cert · govt ID/ABHA · face-match score · board decision + reviewer.

### Doctor daily tool
09 **Today** — Online/Offline toggle (only online doctors get patients), queue cards each carrying name, age, concern, wait **and a safety-gate colour**, this-week earnings (₹11,940 / 48 consults). 10 **Patients** — searchable past patients; only those who consented to this doctor; access logged. 11 **Consult** — safety-gate banner up top, vitals (Temp · Pulse · SpO₂ · BP), AI intake summary, notes with quick-append chips; **a red gate swaps the primary action for "Emergency referral"**. 12 **Prescription** — 7-drug catalogue (Paracetamol, ORS, Azithromycin, Cetirizine, Pantoprazole, Ibuprofen, Vitamin D3), editable dose & timing, **CureCall Intelligence medicine check (interactions, allergy clash, dose sanity)** → digitally sign & send as a FHIR MedicationRequest, immutable v1. 13 **Consult complete** → offers "Share this case to the board". 15 **Earnings** — this week, per-consult breakdown, settles every Friday, withdraw to bank/UPI, pending vs settled. 16 **Profile** — same card patients see; verification read-only.
14 **Case Board** — peer second opinions, a debate room for hard cases. Patient anonymised to a code (P-2291, "F · 34"); doctor attaches report, vitals, proposed Dx and a question. Filter All/Mine. Responses are typed **support** ("I agree") or **correct** ("I'd change this, here's why"), upvotable, with threaded replies. Only verified doctors can read or post; re-identification blocked server-side; abuse/report tooling required at launch. 4 seed cases across GP, cardiology, dermatology, pediatrics.

### THE SAFETY GATE (the single most important rule)
Telemedicine's biggest risk is missing an emergency. Scored once per intake, **travels with the patient — same colour on the patient's screen and the doctor's queue card.**
- **GREEN** safe to consult online — everyday complaints, no danger signs (viral fever, mild rash, cough).
- **AMBER** proceed with caution — could be minor, could need a closer look; doctor alerted to watch for escalation (contact dermatitis, possible allergy).
- **RED** emergency, refer out — the doctor's main button **becomes Emergency referral**; patient urged to seek in-person care (chest pain, possible heart attack).
Worked seed examples: Sunita Devi 34 → GREEN (fever 2 days + headache, Temp 38.4, SpO₂ 98%, viral fever) · Aisha Khan 28 → AMBER (itchy rash 3 days, new detergent, stable vitals, contact dermatitis) · Ramesh Yadav 52 → RED (chest tightness 1 hr, sweating, Pulse 104, BP 150/94 → emergency referral to cardiology).
Decided by rules (red-flag symptoms, vital thresholds) + the AI intake model. **Rules always win toward caution — when unsure the gate goes more red, never less.** Score and reasons stored for audit.

### CURECALL INTELLIGENCE — golden rule: **AI ASSISTS, THE DOCTOR DECIDES**
Four jobs: 1 intake & triage (tapped/spoken answers → clean clinical summary + gate colour) · 2 transcription (consult audio, captured with consent, in the spoken language) · 3 note drafting & "Samajh" (structured clinical note for the doctor + plain-language version for the patient) · 4 medicine check (interactions, allergy clashes, dose sanity against the record).
Guardrails, non-negotiable: every AI output is doctor-reviewed and e-signed before it's final · triage fails safe · all prompts/inputs/outputs logged for audit · models run on India-resident infrastructure, no patient data leaves the region.

### The health record
Built on ABHA identity + **FHIR R4**. Entities: Patient · Doctor · Consult · Intake · Record · Prescription · ConsentLog.
Ownership: **the patient owns the record**; a doctor sees it only while consent is active; every view logged and shown to the patient; withdrawal revokes future access immediately. Immutability: signed prescriptions/notes are write-once — corrections create v2 referencing v1, history never silently edited. Residency: all data stored in India, encrypted at rest and in transit.
How a record is born: AI intake → safety gate → consult (audio) → transcript → note + Rx check → doctor e-sign → immutable record.
Services: Auth & Identity · Verification · Intelligence · Realtime (WebRTC SFU, presence, queue, adaptive bitrate, audio fallback) · Payments (UPI collect, wallet ledger, doctor payouts, weekly settlement) · Records (FHIR store, consent ledger, immutable versions).
NFRs: video→audio fallback · home & record cached for offline open · IVR fallback · entry-Android performance · bilingual via tr() pairs, no English required anywhere in the patient flow · 44×44 targets · voice-first intake for low literacy · targets <3 min sick→doctor, <2 s transitions, 99.9% consult uptime, 100% Rx doctor-signed.
Build order: 1 auth + consent → 2 doctor verification → 3 booking + payments → 4 intake + gate → 5 realtime consult → 6 record engine + board.

---

## 04 · GHARBAR — "a private social world for house parties in Bengaluru"
GB-PRD-2026-001 · v1.0 · 07 Sep 2026 · 31 sections / 67 pages
घरबार — house and home. *And, if you say it out loud, ghar + bar.*
Hook line: *"Something is happening tonight, eight minutes from you, and four people you like are already there."*
Tags: MOBILE FIRST · 18–30 · TONIGHT FIRST · INVITE-LED
Vision: **"Every good night in this city is already happening. Gharbar is how you find out you were invited to it."**

### Four pains
1. **Invisibility** — a party's reach equals the host's contact list; newcomers (the largest Bengaluru segment) are structurally excluded for their first two years.
2. **The door problem** — open it up and you get plus-ones of plus-ones; keep it closed and it's the same eight people. **There is no mechanism between "private" and "anyone".**
3. **Address exposure** — publishing a party means publishing your home. *Any product that shows the flat number before approval is dead on arrival, especially for women hosting alone.*
4. **No signal of quality** — before you go, a title and a time; afterwards, nothing recorded. Good hosts build no reputation, bad hosts pay no price.
Gap: nobody has built the layer between "my group chat" and "the public internet".
Positioning: **the approval layer for private nights** — the only place a host can safely let in people she does not know yet, because somebody she trusts does.

### Personas
- **Aarav, 24 — the newcomer** (primary attendee, ~70% of users). 18 months in Bengaluru, product analyst, flatshare in Indiranagar, knows nine people well. Needs proof a night is real and that someone he knows will be there. **Fear: turning up somewhere he was not really wanted, and standing in a kitchen alone.** Success: invited to the second party by someone he met at the first.
- **Meher, 27 — the host** (supply side, ~4% of users, **100% of the content**). Has the terrace flat everyone ends up at, throws something monthly, unpaid social secretary of three friend groups. Needs a door she controls, a headcount she can trust, one place to say "gate 2, not gate 1". Fear: her address circulating, someone bringing three strangers, neighbours at 1 a.m. **Success: thirty of the right people, and she did not have to hold her phone once after 10 p.m.**
- **Rohan, 41 — the space owner** (revenue side). Two villas near Whitefield; fills them via Instagram DMs; wants party bookings specifically and to state his rules once rather than forty times. He is a business, happy to pay for demand.
- **THE ANTI-PERSONA — "the stranger looking for a room full of women."** He is why there is no public guest list before approval, no exact address before approval, no way to browse people rather than parties, no gender filter of any kind, and why every party is host-approved. **If a feature helps him, it does not ship — even if it also helps Aarav.** *The one place in the document where we accept a worse product for a safer one.*

### The two loops (every screen belongs to one)
ATTENDEE: **Discover → Desire → Connect → Join → Experience → Remember**
HOST: **Imagine → Create → Invite → Manage → Host → Remember**
**The crossover is the business:** step 6 of the attendee loop is step 1 of the host loop. The product exists to shorten the distance between "I had a great night at someone's place" and "I should have people over." That is why Host is a tab, not a button.

### IA — four tabs, no hamburger, no floating plus, no fifth idea
**Discover** (default; find a night; time-scoped Tonight / This weekend / Later, never category-first; entry to Spaces) — **badge: none, ever** (a badge would manufacture false urgency). **Invites** (answer people; one mental model: "the door"; badge = unanswered invitations only). **Host** (throw and run a night; badge = guests awaiting approval). **You** (be someone in this world — identity, vibes, upcoming, past nights, privacy; not a settings screen).
Rules: tabs are peers, nothing modal between them · party detail pushes over the tab bar, full-bleed, returns to exact scroll position · create flow + party detail are the only screens that hide the tab bar · chat, pass and invitation open as sheets · **max depth from any tab to any action: two taps** · back always means back, never "up".
Rejected: five tabs + Activity ("a graveyard of things you have already dealt with") · floating + button · category-first Discover ("nobody wakes up wanting a pool party; they want tonight") · **a People tab (the anti-persona's feature — deliberately impossible)**.

### Discover (the most important screen — one job: "something is happening near you")
Header (wordmark, tappable area selector, search covering parties/areas/hosts — **never people alone**) → time scope pills (three mutually exclusive windows; scopes must never repeat the same party) → **featured card** (one cinematic 4:5; live parties get an ember badge + pulsing dot; floating date chip, party name, one line of host-written copy, friends-going row) → **the programme rail — the signature layout**: a vertical hairline down the left with **door times ticked off it**, parties hung to the right in strict chronological order, date markers when a scope spans dates → **"Where your people are"** (horizontal square-card rail sorted by number of your friends attending — the only place in Discover not sorted by time) → **Spaces teaser** ("34 villas open this weekend" — the one piece of supply-side marketing on the attendee side).
Card rules: emotion first, information second; never show every attribute at once. Permitted set in priority order: image, party name, type, area, door time, host, friends going, availability. **One status badge max, precedence: YOU'RE IN › LIVE NOW › 7 SPOTS LEFT › INVITE ONLY › NOTHING.** "Spots left" only at eight or fewer and only on parties accepting requests — *scarcity on an invite-only party is a taunt, not information.*

### Party detail — "not a listing. The feeling of opening the door."
Order and why: 01 hero image edge-to-edge with date chip + title (**feeling before facts — the image is the argument**) · 02 one line of the host's own words (never a description field) · 03 signal card: host standing · who's going · map (three trust signals before any logistics) · 04 host row (avatar, name, verification tick, nights hosted, rating — **the person is the product**) · 05 four-cell logistics grid When · Doors · Where · Dress (Where shows area + a lock + "unlocks when you're in") · 06 the vibe (up to five host-chosen chips) · 07 who's going (friends first with a ring, then mutuals, then a count; **a relational sentence, never a raw number** — "Dev joined 2 hours ago") · 08 how the night goes (a short host-written timeline: doors, the turn, food, the end — sets the exit expectation, which is what neighbours care about) · 09 party chat entry, house rules (host's voice), then the safety line (ours, on every party without exception).
Action bar, pinned, **one primary action in one of four states**: 1 NOT IN → label adapts to access (Join tonight / Request to join / Ask for an invite) · 2 REQUESTED → "Request sent" + an expectation for the wait ("Raghav usually replies within the hour") + Cancel, **never a dead spinner** · 3 APPROVED → "You're in · View pass", and the address in the grid above **silently unlocks in the same moment** (the only state with two actions) · 4 CLOSED → "Full · Notify me if space opens" (**a full party never shows a disabled button**).
**Spatial continuity is required, not decorative:** the card image must expand into the hero and collapse back into the exact same card, scroll position preserved.

### Invitations — "someone specifically wants you there", not "you have a new notification"
**The invitation is a physical object.** Invitations and passes are the only two surfaces rendered on **bone paper** rather than the dark ground. They carry a perforation, notches and a tactile edge — the product's one deliberate piece of skeuomorphism, and it is load-bearing: *it is what makes an invitation feel like it cost the sender something.*
States: **New** (full bone paper, sender's name in the kicker "Raghav M wants you there", expiry if under 24h) · **Viewed** (quieter kicker, "Waiting on you", moves out of the badge count so the badge never lies) · **Accepted** (**jade stamp, rotated, scales in over ~520ms**, then a "what happens next" list and a route to the pass) · **Declined** (flips to the dark ground, image desaturated, "You said no" — never guilt-worded, never re-promoted) · **Expired** (the host is not told you ignored it, only that it lapsed) · **Revoked** (says so plainly, without a reason, address re-locks immediately).
Rules: an invitation always names a person, never "Gharbar" · always shows the relationship (mutual count, where you met, or that you follow each other) · a host may invite at most 2× her guest cap (caps spam structurally, not by policy) · declining is one tap, needs no reason, never shown to other guests · invitations expire at door time at the latest · **accepting an invitation skips approval entirely — the host already chose you.**

### Join, approval & the pass
Three access models, and **there is no fourth — no instant-join for strangers. Even "Open" means open to asking.**
| Access | Who sees it on Discover | Entry |
|---|---|---|
| Invite only | Nobody — it does not exist in search or Discover for anyone but its guests | Named invitation |
| Friends of friends (**default**) | The host's circle and exactly one step beyond it. Never two. | Request → approve |
| Open to requests | Verified users within the party's radius. **Area only — never the building.** | Request → approve |
**The pass** — issued the instant a guest is approved. Bone paper, perforated, notches; carries date, door time, **the full address now unlocked**, a four-digit door code, the guest's name and plus-one count, and a scannable code for gate check-in. Two actions only: add to calendar, directions. **Guarantee: the pass works offline** (a guest in a basement car park with no signal can still show the door code). **Constraint: personal and non-transferable — sharing a pass removes the guest from the list, and the app says so on the pass itself, before they do it.**
**Declines are a designed experience** — the most fragile moment in the product, a small social wound that happens often. Never labelled "rejected"; the guest sees "Not this time" with no reason and no host name attached; the party disappears from Invites rather than sitting there as a scar; and Discover immediately surfaces two alternatives for the same night. **Nobody is left on a dead end.**

### Host — create a night: six questions, one per screen. Never a form. (median < 2:30)
1 **What are you throwing?** grid of photographic type tiles (House party, Rooftop, Pool, Dinner, Birthday, Game night, Theme night, Something else) — tap only; the choice picks default photography and downstream vibe suggestions.
2 **Where is it happening?** two doors — My place (pre-filled from her saved address, shown once then hidden) or Find a space (hands off to Spaces and returns with the venue attached). **Never a raw address field on first run.**
3 **Which night, and when do doors open?** day chips + door-time chips; contextual advice changes with the pick — *early doors suit dinners, late doors mean a thin room until midnight.* **The app has an opinion.**
4 **What kind of night is it?** up to five vibe chips, hard-capped, plus the party's name in a large serif field. Placeholder is a real example, never "Enter title". Helper text earns its place: *"A name beats 'house party' every time."*
5 **Who gets in?** the three access models as full-width radio cards **with their real consequences written out**, plus a guest-cap stepper. Cap advice is human: *"Past forty-five, tell your neighbours before you tell your friends."*
6 **This is what people will see.** the actual Discover card rendered exactly as guests get it, above a five-row summary. **The publish button is the only bone-coloured primary button in the app** — it is the most committing action a host takes.
Flow rules: six ticks at the top · continue is dimmed but never removed, and the line above says exactly what is missing · back moves one step, the draft survives either way · nothing required that we can infer · steps slide horizontally in the direction of travel · publishing lands on a celebration screen naming the audience reached, then routes straight to inviting.
**Photos after publish, not before** — demanding three good photographs is the single biggest drop-off risk; publish with type-based imagery, then prompt on the celebration screen and again the morning after, when she actually has them.

### Host — manage a night (a control room for one party, not a dashboard)
BLOCK 1 **Headcount** — confirmed out of cap with a fill bar; one number set in the display face at scale because she checks it nine times a day. **Confirmed means approved — pending requests are counted separately and never inflate it.** Approving animates the bar.
BLOCK 2 **Waiting on you** — each request shows avatar, name, verification tick, **how you are connected ("5 mutuals · was at Salt & Static in July")**, how long they have waited, and their note. Two actions: "Not this time" and **"Let Sana in" — the approve button names the person, because approving a name is a different decision from approving a row.** *Deliberately absent: age, gender, photos beyond the avatar, or any attribute that would let a host sort people by looks.*
BLOCK 3 **Tell everyone** — one composer pinned to the top of party chat; **the single highest-value feature for a host.** Placeholder shows the archetypal message ("Gate 2, not gate 1 — security has the list…"). Once posted, the composer is replaced by the live announcement, not stacked below it.
BLOCK 4 **Guest list & the door** — avatar grid; from door time it becomes a door list (tap a name to check in, or scan a pass). Revoking a guest **re-locks the address instantly**.

### Party chat — a utility with a lifespan, not a messaging app
Pinned host announcement always at the top in a **marigold-outlined block**, only the host can post one — it is the reason the chat exists. **Opens on approval** (pending requesters get no visibility; the guest list stays private). **Closes 24 hours after** the party: read-only, then archived. **No DMs** (LATER, and only opt-in + mutual — private DMs are the fastest route to harassment).
Copy sets the norm: the composer placeholder reads *"Ask something useful…"* rather than "Message…". *Placeholder text is the cheapest culture-setting tool we have.*

### Spaces — not accommodation. "Where can we throw an incredible night?"
WE SHOW: area · **party capacity (not beds)** · pool · indoor/outdoor split · **parking in cars** · **music cut-off time** · neighbour sensitivity · whether the owner has hosted parties before · price for one night · which dates are free this month.
WE REFUSE: bedroom/bathroom counts as headline stats · five-point star ratings · nightly-stay language · wishlists · instant book · map-first browse — *all of it drags the product back towards accommodation, which is the wrong mental model.*
Two entry points, two intents: from Discover it is **aspirational** ("Plan a night here" — turns an attendee into a first-time host, and picking a space starts the create flow with the venue attached); from create step 2 it is **transactional** ("Step 2 of 6 · choose a space", CTA "Use this space", returns with a confirmation chip and a Change link). Same screen, different verb, no dead ends either way. Owners onboarded manually in v1; 30–40 verified spaces is enough, and hand-curating is how we guarantee they genuinely allow parties.

### Profile & social graph
Contains: avatar, name, age, area, verification tick (**the four things a host judges an approval on**) · **three stats only: nights out, nights hosted, host rating — no followers, no streaks, no points** · "What you turn up for" (the same vibe vocabulary hosts use, so both sides speak one language) · Next up with RSVP state · "Nights you were there" photo grid captioned with party and month · "Who can see you" privacy toggles **on the profile, not buried in settings**.
Graph edges: **Friend** (mutual, explicit, confirmed both sides) · **Mutual** (derived friend-of-a-friend, never a request you send) · **Been there** (automatic, you both attended the same party — **the strongest trust signal we have**; "Was at Salt & Static in July" is what gets a stranger approved) · **Following a host** (one-directional, only ever towards a host).
**Social proof is always relational.** Never "432 people going" where "4 of your friends and 11 mutuals" will do. *Absolute numbers create a popularity contest; relational numbers create a decision.*

### "Nothing is ever empty" — five states every surface must ship (QA rejects a surface missing any one)
**Loading** — skeletons in the exact shape of the content, never a centred spinner; images fade in; layout never shifts (Discover shows three card-shaped skeletons with the time rail already drawn).
**Empty** — a sentence in the display face, one line of explanation, exactly one action. **Never an illustration of a cactus.** ("Nothing here yet. When someone wants you at their night, it lands here first.")
**Sparse** — *the dangerous one.* Fewer than three parties in scope must never look broken: widen the radius, then offer the next scope, and say so honestly ("Quiet tonight in Indiranagar. Two nights within 12 km, and eleven this weekend.")
**Error** — what failed in human words, keeps what was already on screen, offers retry, never a code ("Couldn't reach Gharbar. Showing what you had at 9:12 PM.")
**Success** — confirms in place, states the consequence, offers the next step. **A toast alone is not a success state.**
Button rules: a dimmed button is always paired with a line saying what would enable it · never two primary buttons on one screen (if there appear to be two, the screen is asking two questions) · every tap responds within 100ms · destructive actions confirm once, naming the consequence and the number of people affected · 44×44pt minimum · optimistic UI for RSVP and approval, reverted visibly and explained, never silently.

### Design principles (any one can reject a design)
01 **The UI does not scream. The parties do.** 02 **Emotion first, information second.** 03 **One question per screen.** 04 **Screens that share an object share it visibly.** 05 **Trust is visible, not implied.** 06 **Warm, not neon** — this is a home at night: lamps, plum shadow, skin tones. Not a nightclub poster. No cyan, no cyberpunk, no all-over gradients, no glass for the sake of glass.

### Colour — five accents, one dark room, each with exactly one job
- **Ember #FF4B3E — the GO colour.** Primary action and nothing else (Join, Request, Accept, Continue, Publish) + the live-now badge, because a party happening right now is an action. Never decoration, never a heading, never on two buttons on the same screen.
- **Marigold #FFB020 — the CLOCK colour.** Time and scarcity: door times on the programme rail, date markers, "7 spots left", the pinned host announcement, create-flow progress ticks.
- **Orchid #9B6BFF — the PEOPLE colour.** The social graph: friend rings on avatars, "4 friends and 11 mutuals", invitation senders, mutual context on an approval.
- **Jade #17C08A — the YES colour.** Confirmation: "You're in", the acceptance stamp, the approve button, an unlocked address, a free date on a space. **Appears only after something has actually been granted — never as a promise.**
- **Bone #FBF6EF — the PAPER colour.** Physical objects only: invitations, passes, and the single Publish button. *The most precious surface in the app precisely because it is rare.*
Neutral ramp — **a warm plum-black, never a blue-black. This is the single decision that makes Gharbar feel like a lamp-lit home rather than a tech product.**
Midnight **#150B18** app ground · Plum **#241130** raised card/sheet · Ash **#3A2440** input/chip/divider · Muted **#9A8FA0** secondary text · Bone **#FBF6EF** primary text on dark.
Every accent ships two versions — a **glow** value for the dark app and an **ink** value for paper/print. *Never use a glow value as text on paper — the single most common way this system gets broken.*
| Accent | Glow (on Midnight) | Ink (on Bone) | Text on the fill |
|---|---|---|---|
| Ember | #FF4B3E | #CE2A1D | #26100C |
| Marigold | #FFB020 | #8A5D00 | #26100C |
| Orchid | #9B6BFF | #6B3BD4 | #1B0E1A |
| Jade | #17C08A | #0A7D5C | #08221A |
ALWAYS: body text 4.5:1 · **full-opacity ink over photography, never a faded overlay** · one accent per meaning · scrims under any text on an image · a lock icon wherever something is hidden.
NEVER: more than two accents on one card · a gradient as a page background · ember on anything unpressable · bone as a generic light theme · colour as the only carrier of meaning.

### Typography — two faces, never a third
**Bricolage Grotesque** 600–800 — party names, screen titles, big numbers, wordmark. Always tight tracking (−0.02 to −0.035em), line-height at or under 1.0.
**Instrument Sans** 400–700 — body, labels, buttons, times, everything functional. Micro-labels are 600 weight, uppercase, tracked 0.15–0.2em — *the third voice, achieved with case and tracking rather than a third typeface.*
Scale: hero 44/0.95 Bricolage 800 · title 34/1.0 Bricolage 700 · card 25/1.0 Bricolage 700 · lead 17/1.5 Instrument 400 · body 15/1.5 · action 15/1.0 Instrument 700 · meta 12/1.4 Instrument 500 · micro 10/1.2 Instrument 600 caps. Floor: nothing below 10pt, nothing meaningful below 12pt; micro-labels never wrap.

### Shape, depth & tactility
Radius carries meaning — **the rounder something is, the more it wants to be pressed.** pill 999 (every button, chip, badge, nav active state — *touchable things are pills, full stop*) · sheet 30 top · **object 24** (invitations and passes, plus notches and a perforated dash line — the only surfaces with a cut edge) · card 22 (all photographic containers) · tile 14 (thumbnails, memory grid, floating date chip) · full 0 (the detail hero only, it runs to the physical edge).
Depth in four permitted forms: **hairline** (1px inset border at 10–14% bone — the default separator) · **scrim** (vertical gradient over imagery so text stays 4.5:1 — a legibility tool, not a mood effect, **mandatory on every image carrying type**) · **lift** (a single soft shadow, four uses only: nav bar, sheets, the pass, the overlay card) · **glow** (a coloured shadow beneath the primary button and the live dot only — the closest the app comes to light spilling out of a room).
Tactility on a leash: physical borrowing in **exactly two places** (invitation, pass). No leather, no felt, no embossed toggles. *The restraint is what makes the two exceptions land.*

### Components (complete inventory)
Primary button (ember pill 54pt, dark ink label; variants ember / **bone = publish only** / jade = approve / dimmed-with-reason) · secondary (hairline pill, never equal width beside a primary) · icon button (38pt circle, translucent dark + hairline, 44pt hit area) · **party card** in three sizes (featured 4:5 with overlay card, rail 16:10, square 1:1) · **date chip** (floating bone tile, month above day, 14pt radius — *the most recognisable single element in the app*) · overlay card (lifted blurred panel on the lower third of a featured image, **exactly one per screen, never on a rail card**) · avatar (circle, monogram fallback, sizes 20/26/38/46/84, **orchid ring = your friend**, stacks −9pt max five plus a count) · badge (filled micro pill, five kinds only: you're in jade / live ember / scarcity marigold / invite-only hairline / sponsored hairline+label, one per card) · chip (idle hairline → selected accent fill + dark ink) · **programme row** (48pt time column with a tick onto the vertical rail + a rail card — the signature layout unit) · data grid (hairline-divided 2×2 of micro-label + value) · **paper object** (bone card, 24pt radius, perforation with side notches, optional rotated stamp and barcode — two instances only) · sheet (30pt top radius, grab handle, scrim, max 88% height) · **section header** (micro label + a hairline rule filling the remaining width + optional count — *what gives the app its editorial rhythm*) · nav bar (floating, lifted, four items; active is an ember pill with icon + label, inactive icon only) · toggle & stepper (46×27 track, marigold when on) · skeleton (shape-accurate, ash, slow shimmer, mandatory).
Spacing: **4pt base used at 4 / 8 / 12 / 16 / 22 / 30 / 44. Screen gutter is 22pt on every screen without exception — what makes unrelated screens feel like one product.**

### Motion — "motion explains where things went. It is never applause."
**Card → detail hero 540ms out-expo** — shared element; the card's image frame morphs to the hero's bounds while the image counter-scales so it never distorts; content behind rises 18pt and fades in at 150ms. **The single most important animation in the product.**
Detail → back 400ms exactly reversed, landing in the original card, feed scroll restored first · tab change 320ms fade + 10pt rise (**no horizontal slide — tabs are peers, not a sequence**) · create step 330ms horizontal slide in the direction of travel (this one IS a sequence) · sheet in/out 420/280ms (**arrivals are gentle, departures are decisive**) · **invitation accepted 520ms** — the stamp scales from 1.9× through a slight overshoot to rest at −8° while the paper compresses to 0.985 and back (*the one moment where delight is the point*) · approval → headcount 500ms (row leaves, number ticks up, fill bar grows — cause and effect visible in one glance) · press feedback 240ms scale to 0.97, mandatory, within 100ms of touch · **live dot 1.9s loop — the only infinite animation in the app.**
Perceived speed beats real speed. Every animation respects reduce-motion by collapsing to a cross-fade; the shared-element transition is the first thing dropped on a low-end device, never the last.

### Photography direction — "photography is not decoration. It is most of the persuasion."
WANT: warm, low, **motivated** light (lamps, string lights, a kitchen at midnight) · slight motion blur · grain · candid faces mid-conversation · hands, food, ice, a record sleeve · terraces at dusk · pools lit from below · a room from the doorway · imperfect framing.
REJECT: stock imagery of any kind · everyone facing the camera · flat even lighting · empty styled interiors with no people · AI-generated crowds · cyan or magenta club lighting · drinks-brand advertising language · **anything that looks composed.**
Source priority: 1 host's own photos (prompted after publish and the morning after, up to six) · 2 previous nights (labelled with the date — honest, and far more persuasive than anything staged) · 3 space photos (commissioned to this direction, not supplied as marketing) · 4 commissioned set (real Bengaluru homes, real friends, one set per party type — **never captioned as if it were her party**) · last: atmosphere plate (warm-dark gradient, grain, bokeh, no subject; must still hold type at 4.5:1).
Treatment: no filters, no duotone, no brand wash. Only a warm-shadow lift (so dark images don't crush to black on cheap screens) and the mandatory scrim. **Faces are never cropped by a badge or a date chip** — the overlay safe zone is top-left, top-right and bottom 30%; the create flow nudges a re-crop.
Consent, non-negotiable: no guest's face in public imagery without their per-party opt-in; **the photo toggle defaults to off. A great photo is not worth a person's complaint.**

### Architecture — "boring on purpose. The interesting part is where the address lives."
One cross-platform mobile app (no web app in v1) · single versioned REST service, realtime only for party chat and approval events · relational primary with a graph-friendly index for mutuals · phone + OTP, one account per number, no social login · **uploaded originals never served; four derived sizes, all stripped of EXIF including GPS on ingest** · internal admin console, never customer-facing.
Entities & sensitivity: User HIGH · Party NORMAL · **PartyLocation CRITICAL** (separate table: exact address, flat number, lat/lng, door code, arrival notes; encrypted at rest; only ever returned for a caller with an approved attendance) · Attendance MEDIUM · Invitation MEDIUM (always attributed to a person, never to the platform) · Pass HIGH (cached on device so it works offline) · Edge MEDIUM (mutuals derived at read time, never stored) · Space NORMAL.
**The one architectural rule: PartyLocation is never joined into a party response. It is a separate authorised call, gated on an approved Attendance, audited on every read. Any pull request that widens a party serialiser to include address fields is rejected on sight.**

### Privacy, safety & age gating
**Location disclosure, four tiers:** anyone browsing → neighbourhood name + approximate distance, no map (~2 km) · viewing the party → area + a map thumbnail centred on a **jittered point**, visible lock, "unlocks when you're in" (~800 m) · **requested, pending → no change whatsoever (asking earns nothing — this closes the "request to farm addresses" hole)** · approved guest → full address, flat number, door code, arrival notes, directions, on the pass, **re-locked instantly if revoked** (exact).
18+ only, stated at signup, on every party page and in the store listing. DOB collected at signup, **not editable afterwards**. Two verification levels: phone-verified (everyone, to browse) and **ID-verified (required to host, and to attend an "open to requests" party)**; done by a licensed provider, we store pass/fail and the derived age band, **never the document**. A host can require ID-verified guests only — **the only guest filter that will ever exist.**
Reporting: reachable in two taps from any party page, profile or chat message; never asks the reporter to justify themselves at length · blocking is symmetric and total · a blocked user is silently prevented from requesting any party you are attending, and is not told why · **every report human-reviewed within 12 hours and the reporter always hears the outcome — committed publicly** · two upheld safety reports removes hosting rights, three removes the account, no appeal path in v1 · post-party each guest is asked **one private question about whether they felt safe** — it feeds host standing and nothing else.
Data: in-region under India's DPDP Act · consent per purpose, separately withdrawable · **GPS read only in the foreground, never in the background, ever** · party chat and guest lists deleted 30 days after the party, passes and locations 7 days after · account deletion is self-serve, removes the graph, and **anonymises attendance history rather than rewriting other people's memories out of existence.**

### Business model (free in v1, on purpose)
Contributions ("₹500 towards the bar") are **displayed as information, never collected** — this one decision keeps Gharbar out of payment aggregation, refund liability, GST on ticket sales, and the legal category of "event organiser", *and it keeps a house party a house party.*
Revenue in build order: 1 **Spaces commission FIRST** — 10–12% of the booking **from the space owner, not the host** (assumption ₹14,000 average booking, ~₹1,500/transaction) · 2 host tools subscription LATER (~₹299/mo, for the ~5% who host monthly; only once hosting is provably habitual) · 3 sponsored nights LATER (hard cap: never more than one in a user's Discover per week, always labelled, never in the featured slot).
**The rule that protects the product: every revenue line must be paid by a business or by a heavy host getting real leverage. The moment an attendee has to pay to see who is going, the social proof becomes a paywall and the loop breaks.**

### Metrics & delivery
North star **parties completed per week** ("the only number on the wall — it cannot be gamed by acquisition spend") · health **supply density** (parties within 8 km of the median user on a Friday; below three, Discover feels dead — that is the alarm) · guardrail **reports per 1,000 attendances** ("if this rises, growth stops until it falls. It outranks every other number in this document").
Vanity metrics refused: downloads, registered users, MAU, **time in app — "time in app is actively bad here; the product succeeds when people close it and go to a party."**
Goals for v1 (first 90 days): 120 completed parties/wk · 6% of attendees host within 60 days · **invite→accept rate > 55% ("if invites feel like spam, the whole product dies. This is our canary")** · median create time < 2:30 · **reports per 1,000 attendances < 2 ("the number we will kill features to protect")**.
Phases: **P0 Forty hosts** (wks 1–6, invite-only, Indiranagar + Koramangala, invitations only; gate: 25 real parties, accept rate > 55%) → **P1 The door opens** (wks 7–14, friends-of-friends + request-and-approve, programme rail, ID verification, reporting, six neighbourhoods; gate: 120 parties/wk, <2 reports/1,000) → **P2 Spaces** (wks 15–22, curated villas, booking + commission, first revenue, memories + host standing; gate: 30 verified spaces, 40 bookings/mo) → **P3 Depth** (wks 23+, host tools, personalised ranking, recurring nights, co-hosts).
Market: 3.5M Bengaluru residents 18–30 · six launch neighbourhoods (Indiranagar, Koramangala, HSR, Jayanagar, Whitefield, Frazer Town) · every launch party within 8 km of a user or Discover feels dead · **"Read the last row first: this is a supply problem disguised as a consumer app. Four hundred committed hosts make the product feel infinite; four hundred thousand attendees with no hosts make it feel broken. Every early growth rupee goes to hosts."**
Non-goals with reasons: not a ticketing platform · **not a dating product** (no swiping, no matching, no "singles going" — *if Gharbar reads as a way to meet strangers romantically, hosts stop publishing and women stop attending. Non-negotiable.*) · not a popularity contest · **not a feed** ("the content is the parties, and there are only ever a few dozen live at once. **Finiteness is a feature.**")

### Decision log (07 Sep 26)
Four tabs, Activity folded into Invites · Host is a tab, not a floating button · No payments in v1 · Discover is time-scoped, not category-first · **Address lives in a separate gated table** ("makes the most dangerous leak structurally hard rather than a matter of discipline in a serialiser") · **Bone paper reserved for invitations and passes** ("scarcity is what makes them feel like objects") · Photos requested after publish.
Risks: **a safety incident at a Gharbar party = FATAL** (ID verification, host approval on every entry, 12-hour report SLA, address gating, written incident protocol, named on-call owner from day one) · empty Discover HIGH · hosts churn after two parties HIGH · read as a dating app MED · noise complaints MED (end times are a first-class field; music cut-off is a headline attribute; **"we surface the neighbour, we do not hide them"**) · regulatory reclassification MED.


---

## 05 · MIRA — "The Confidence Mirror"
Vesperon Tech × Wisbox · v1.0 · 04 July 2026 · 23 sections
*"An on-device AI mirror that leads with confidence and never grades. Engineered so she walks out feeling good at least 7 in 10 times — by design, not by chance."*
Badges: On-device AI · Flutter Web + Mobile · DPDP & GDPR-safe · Affiliate + SaaS + White-label · **Zero beauty score**
Headline numbers: **7/10** sessions engineered to end in confidence · **0** beauty scores shown, ever · **100%** face analysis on-device, no image uploaded · **3** revenue lines.

### The problem — "everyone built the wrong mirror"
*Getting ready is an emotional moment, not a diagnostic one. Yet the tools built for it treat the face like a defect list.*
- **The rushed check** — she's late, needs a quick "you're good," and instead gets a screen full of "improvements" that make her feel worse right before she walks out.
- **The trust problem** — a mirror that only flatters is useless when it matters; one that only critiques is painful. **Nobody built the honest-but-kind middle.**
- **The privacy fear** — uploading your face to a beauty app is a real, growing anxiety. Most apps do exactly that, and bury it in a policy.
Why competitors fail: beauty-score scanners (grade symmetry/skin → erodes self-esteem, poor retention, toxic to co-brand) · AR virtual try-on (a shopping funnel, not a confidence habit) · selfie/filter apps (distort reality, no useful feedback) · skin-analysis apps (deficit-framed, cloud-based, privacy-heavy).
**The moat is not the computer vision — it is the emotional contract: lead with confidence, never grade.** *"No competitor occupies this position because the hard part isn't the vision model; it's having the discipline to not grade."*

### Personas / JTBD
- **The final-check woman** (primary) — getting ready, often late. JTBD: *"Tell me I'm good to walk out — and if something's genuinely off and I ask, tell me kindly."*
- **The event woman** (secondary) — wedding, date, big meeting. Stakes are real, so she opts into honesty. JTBD: *"Help me get this exactly right for tonight — gently, step by step."*
- **The beauty brand (B2B buyer)** — JTBD: *"Give my customers a mirror with my products that my legal and PR teams can sign off on."*
Core age 18–40, smartphone-first · daily makeup/grooming routine · wants confidence, wary of being judged · beachhead India (metro + tier-1), then GCC & SE Asia · mobile primary, web for reach & B2B demos.

### THE EMOTIONAL CONTRACT — six promises the mirror can never break
1 **Never diagnose, only add** — detection is internal; the voice is always additive. "A gloss would make these pop" — never "your lips look dry."
2 **Confidence is default, critique is opt-in** — ~80% of unprompted sessions are affirmation-forward.
3 **Praise must be earned & specific** — affirmations come from actually-detected positives and rotate. No generic filler that rots into noise.
4 **Honest when asked** — a yes-only mirror is useless before a real event.
5 **The face never leaves the phone** — privacy is the architecture and the marketing, not a footer link.
6 **Never invent a flaw to sell** — recommendations are genuinely relevant or absent. No manufactured insecurity, ever.

### Confidence Engine I — the Session Director ("7/10 is engineered, not lucky")
Before a single word is chosen, each scan is assigned an emotional session type; the mix is enforced by the Director, not by whatever the model happens to notice.
| Type | Share | Behaviour |
|---|---|---|
| Pure affirmation | ~45% | One earned compliment + a "go" line. **No tip.** |
| Affirm + optional tip | ~35% | Compliment, then a tappable "want a tip?" pill |
| She asked | ~20% | She requested help → honesty invited |
| Bad-day warmth | override | Soft distress signals → **tips forced to zero** |
Decision flow: scan captured → bad-day? → yes: warmth, no tips → no: asked? → yes: honest + kind → no: weighted pick.
Guardrails: bad-day signals override everything · a direct question always routes to "she asked" · **no two tip-sessions back-to-back — after a tip, tip-probability drops 0.44 → 0.15** · net effect ≥80% of unprompted sessions stay affirmation-forward.

### Confidence Engine II — the reframe map (deficit → additive, tip-gated only)
| Internal signal | Never say | May say (only if she taps a tip / asks) |
|---|---|---|
| Dark under-eye | anything, unprompted | "A peach corrector brightens here — you'll read well-rested." |
| Dry lips | "dry" | "A hydrating gloss will make these look juicy." |
| Uneven base | "uneven" | "A setting spray locks this in all day." |
| Sparse brows | "sparse / thin" | "A tinted gel adds a soft fullness, if you want it." |
**Tone lexicon, hard-coded.** BANNED: tired · dull · uneven · flaw · fix · correct · aging · wrinkle · blemish · "you should" · "you need to". ALLOWED FRAMES: "would pop" · "would love" · "a touch more" · "if you're going for…" · "you're glowing" · "this is working" · "go as you are".
Four safeguards: **specificity engine** (praise from real detected positives, rotated over the last 4 so it never sounds robotic) · **honesty valve** (direct question → acknowledge → gentle truth → additive fix; *the requested "3/10" earns trust*) · **bad-day safeguard** (soft behavioural signals only, never a claimed emotion → more warmth, zero tips) · **ethics rails** (no invented flaws; no comment on weight or skin tone; no anti-aging framing; recs anchored to the event).

### The Copy Engine — "the mirror's mouth, in pure Dart"
On-device, zero network. One call per scan: CopyEngine.compose(read, dirIn). Banks: affirmations (keyed by Positive enum, with a {shade} slot) · outros ("you're set — go" variants) · tips (keyed by TipSignal — additive lines + a product category) · honest (yesForm vs gentleTweakForm) · bad-day (warmth-only lines).
Two mechanisms: **RotationBuffer** (per-bucket ring buffer avoids the last K lines, resets when exhausted) and **SessionDirector** (weighted type selection with the no-back-to-back-tips guardrail). **The tip line is generated but hidden until she taps "want a tip?" — the affirmation always shows first.**

### Architecture — "everything that matters runs on the phone"
One Flutter codebase → iOS / Android / Web. ON-DEVICE: camera (mirrored) → face mesh (ML Kit / MediaPipe) → region segmentation → attribute read (classical CV) → Confidence Director → Copy Engine → catalog match (local SQLite) → renderer. **A PRIVACY BOUNDARY sits under this: only derived text crosses, never an image.** CLOUD (Node.js, never receives a face): catalog/price sync · affiliate resolver · anonymous analytics · skin analysis v2 (derived features only).
On-device pipeline, 7 stages: capture (front cam) → face mesh (468 pts) → segment regions → read (Lab/HSV) → direct (session type) → match (catalog) → render (mirror UI).
Key insight: **most of v1 needs no ML model and no server** — undertone, shade, glow, symmetry and makeup-presence are landmark-region samples in Lab/HSV colour space. Undertone = cheek/jaw sampled in Lab, warm/cool/neutral from a·b ratios · dominant lip/eye shade = colour clustering → nearest catalog shade · glow = specular-highlight ratio on cheekbones/nose bridge → "you're glowing" · symmetry = landmark mirror-distance across the vertical axis → balance positive · makeup presence = saturation & edge deltas vs a bare-skin baseline → bare-vs-done detection.
Performance: 30fps preview; the heavy read runs on a captured still or a "check me" tap. **No storage — frames live in memory only; nothing written to disk unless she saves a look.**
Backend deliberately thin: GET /catalog?v= · GET /product/:id/link · POST /events (anonymous aggregate) · GET /copy/experiments · GET /partner/:id/theme · POST /skin/derive (v2, opt-in, derived features only). Data model image-free by default: Session {sessionType, affirmationShown, tipShown, tipAccepted, productsShown[], productsClicked[]} · SavedLook {imageRef ONLY if saved} · CatalogProduct {brand, category, shade, undertoneMatch, finish, price, affiliateUrl, occasionTags[]}.

### Design system — "a warm vanity, not a scanner"
Direction: **a dressing-room at golden hour. Boldness is spent in one place — the halo — and everything else stays quiet.**
Display voice **Fraunces** (italic for emphasis) · UI/body **Hanken Grotesk**.
Dark palette (flagship): Room bg **#17100F** · Gold glow **#F0C89A** (halo/accent) · Rose **#E8A3A0** ("love" moments) · Ink **#F6EDE4** (text on dark) · Muted **#B6968B** (secondary text).
Light palette (Phase-2 daytime): Porcelain **#F3EBE0** · Gold **#B98A4E** · Ink **#3A2C23**.
Signature elements: **THE HALO** — a champagne glow that breathes, warmest at the affirmation moment; *the light literally flatters the reflection.* **THE MESH** — a whisper-faint landmark constellation on an abstract warm reflection; *shows on-device AI honestly, with no stock face.*
Quality floor: responsive to small mobile · visible keyboard focus · **prefers-reduced-motion stops the halo & pulse** · dark = flagship, light shipped as a theme in Phase 2.
**Seven screens:** 1–2 onboarding + privacy promise (set the "on your side" tone; earn trust before the camera) · 3 **Mirror (home)** — the core moment; states: pure affirmation / affirm+tip / bad-day · 4 **Tip sheet** — one additive tip + matched product; save/shop · 5 **Get me ready** — occasion-led honest mode; picker/active check · 6 **My looks** — saved looks & favourites, opt-in; empty/populated · 7 **Privacy & data** — toggles, delete-all.

### Session state machine & warm-voice edge cases
Idle → Scanning → Director → {pure affirmation | affirm+tip | she asked → honest | bad-day warmth} → tip → product shown → save look? (opt-in only) → exit → Idle.
| Situation | Behaviour (warm voice) |
|---|---|
| No face detected | "I can't quite see you — bring me up to eye level?" **No error code.** |
| Poor lighting | "Let's find better light — face a window?" |
| Repeated re-scans | Soft bad-day signal → warmth up, tips off |
| "Not feeling it" tapped | Immediate warmth mode; no analysis pressure |
| Offline | Full mirror still works; only affiliate links defer |
| Camera denied | Explain the on-device promise; offer a retry, **never nag** |

### Recommendations — "recs only when she reaches for them"
Products appear **only after a tip is accepted or a look is requested. Never pushed, never invented.** Match on tip signal → category, detected undertone → undertoneMatch, dominant shade → nearest-neighbour, occasion → occasionTags, finish preference. Score = undertone fit × occasion fit × shade proximity; tie-break by favourites then price band. **Show one hero product; "more options" is a tap away.**

### Privacy, retention, money
Facial data is sensitive-category biometric under DPDP (India) and GDPR — **the default of never uploading a face is simultaneously the compliance stance, the headline marketing line, and the B2B trust unlock.** No image upload · no cloud face processing · no image storage · granular opt-ins, no pre-ticked boxes · one-tap delete-everything · local-only saved looks · export on request.
Retention: **confidence is a daily habit; grading is a one-time novelty.** The loop: open mirror → feel good → trust grows → daily habit → accept tip → buy/save. Metrics that matter, **never a score**: felt-good rate ≥70% · time-to-reassurance <5 s · 4–7 sessions/week/active · **flat 30-day tip-acceptance = no fatigue** · D30 retention >30% · affiliate CTR on accepted tips.
Revenue, "floor / middle / prize": 1 affiliate commission on accepted-tip recs (Nykaa/Amazon/Myntra, live day one) · 2 freemium SaaS (Free ₹0 · Plus ₹149–199/mo occasion mode + shade-match + history · Premium ₹349/mo + opt-in skin insights & themes) · 3 **white-label to beauty brands** (₹5–40L/yr, skinned to their catalog + dashboard) — the prize. *"The on-device architecture is the margin story: no per-scan cloud inference cost means gross margin scales with users, not against them."*
GTM: lead with the kindness narrative — *"the mirror that's on your side, and never sees your face."* Creator/organic demos of the kind mirror vs a scanner · ASO · web try-instantly · B2B outbound · PR angle "the anti-beauty-score app".
Phases: P1 mo 1–3 on-device mirror MVP (iOS + Android, dark theme) · P2 mo 4–6 occasion mode, looks history, opt-in skin analysis, web, light theme, premium · P3 mo 7–9 white-label SDK, brand catalog ingestion, partner dashboard.
Decision log 04 Jul 26: confidence-first contract = core thesis, no beauty score · on-device-only for v1 · Flutter + ML Kit (v1), MediaPipe mesh (v2) · dark vanity = flagship, light in P2 · session mix ~45/35/20, no back-to-back tips.
Risks: reads as a "rate-me" app · praise fatigue · **empty flattery erodes trust → honesty valve** · privacy backlash · mis-read "distress" (soft signals only, safe failure = warmth) · recs feel like ads (only after accepted tip, never invented).
Also in source: **glossary** — Session Director, reframe rule, specificity engine, honesty valve, bad-day safeguard, the halo / the mesh. Open questions: final name + trademark ("Mira" is a working name), first affiliate partner (Nykaa?), license vs build for v2 skin analysis, first white-label design partner.
Assets available: **uploads/Mira-standalone.html** — a real built product (Flutter-style web build, text lives in JS so it must be rendered to be read/screenshotted).

---

## 06 · JAI MATA DI FITNESS — flagship landing page (a BRAND project, not an app UX project)
Real built product in **uploads/jaimatadi/** (index.html + React/Babel sections + 40 real photographs). Title: *"Jai Mata Di Fitness — Strength is Devotion."* Meta description: *"A strength & conditioning gym with soul. Training as a practice — build inner and outer power."* Est. 2014.
**The prompt is explicit: do NOT force an app UX case-study process onto this project.** Focus on brand, landing-page hierarchy, visual identity, conversion, hero, program discovery, membership, responsive composition, photography, CTA, scroll storytelling.

### Design tokens (verbatim from styles.css)
Base: black **#0B0706** · black-2 #120A09 · oxblood **#3A0B0B** · oxblood-deep #260707 · oxblood-2 #4A1010
Text: cream **#F4ECDD** · cream-dim #D8C7B2 · muted #9C8676 · muted-deep #6E5A4D
Accents: saffron **#F4A300** · marigold #F0820C · gold **#C9A227** · gold-light #E6C865 · gold-deep #9A7A1C
Accent driver (swapped by tweaks): --accent = gold · --accent-bright = gold-light · --accent-cta = saffron
Fonts: display **Saira Condensed** (fallback Oswald) · body **Manrope** · Devanagari **Tiro Devanagari Sanskrit** · Devanagari bold **Rozha One**. Also loaded: Anton.
Motion: --ease cubic-bezier(0.16,1,0.3,1) · --ease-out cubic-bezier(0.22,1,0.36,1) · --reveal-dur 1100ms · --motion-scale tweakable
Layout: --pad-x clamp(20px, 6vw, 120px) · --section-y clamp(90px, 13vh, 200px) · --maxw 1320px
Lines: --hair rgba(201,162,39,0.18) · --hair-soft rgba(244,236,221,0.09)
Signature treatments: a **fixed film-grain / temple-stone SVG turbulence overlay at 0.05 opacity, mix-blend-mode overlay, z 9998** · ::selection = saffron on black · .display = Saira Condensed 800, line-height 0.9, letter-spacing −0.02em, uppercase · **.eyebrow = display 600, uppercase, letter-spacing 0.32em, 11–13px, accent-coloured** · .deva = Devanagari, no transform, no tracking · buttons: display 700, uppercase, 0.12em tracking, 18×32 padding, radius 12, 0.5s ease transitions · a scroll-progress bar at the top of the document.
Brand mark (from the bundler thumbnail SVG): a gold trident/kalash-like glyph inside a circle on #150807.

### Page architecture (scroll order)
hero (#top) → **programs** (#programs) → **method** (#method) → **trainers** (#trainers) → **gallery** (#gallery) → **transformations** (#transformations) → **horizon** (#horizon) → **album** (#album) → **membership** (#membership) → footer (newsletter).
Hero: side-rail vertical rule reading "JAI MATA DI — EST. 2014" · eyebrow "Strength & Conditioning" + शक्ति · a hero photo layer + a warm glow · a magnetic CTA (useMagnetic hook).

### The bilingual naming system (English + Devanagari, used everywhere)
Method: **Sankalp** संकल्प · **Shakti** शक्ति · **Sadhana** साधना (each has a plain and a gold PNG mark in images/).
Membership plans: **Bhakt** भक्त · Monthly ₹1,500 ("Begin the practice. Full floor access and every group class, month to month.") · **Sadhak** साधक · 3 Months ₹3,500 ("The committed path. One season of devotion — and you save ₹1,000." → ₹1,167/mo) · **Yodha** योद्धा · 12 Months ₹10,000, tagged **"Best value"** ("Total devotion. A full year on the floor at our lowest-ever rate." → ₹833/mo, save up to ₹8,000; offer pricing ₹10,000–12,000; 1:1 onboarding; body-composition tracking every cycle; two guest passes a month; **"a locked rate — you never pay a price rise"**). Each plan has its own gradient + ring theme.
Coming-soon "Horizon" rail: 01 **Calisthenics** देहबल (Winter '26) · 02 **Championship Prep** विजय ('26 intake) · 03 **Powerlifting** महाबल (Platform '26) · 04 **Yoga Classes** योग (Autumn '26) · 05 **Elite Diet Plans** आहार (Invite-only).
Transformations carousel: six members, each with a plan theme, a Devanagari tag and a stat + journey line (e.g. "+42kg deadlift · 12 months", "Couch → first 10K · 3 months", "Postpartum → full pull-up").
**Free starter-plan wizard** (4 steps): goal (Muscle Building मांसपेशी / Fat Loss वसा-क्षय / Strength & Power बल / General Fitness स्वास्थ्य / Stage · Competition मंच) → diet (Vegetarian / Non-Vegetarian / Eggetarian / Vegan) → training frequency (3 / 4 / 5–6 days per week, *"Be honest — consistency beats intensity"*) → focus areas → **a generated "plate" card** (calories, protein target g/kg, training split, a day on your plate: breakfast / mid-morning / lunch / post-workout / dinner, plus a disclaimer that it is a free starter guide, not medical advice).
Album: 13 curated real competition/training photographs, each captioned and tagged (Competition · Podium · On stage · Training floor · Off duty) — e.g. "Centre stage, gold", "The medal, earned", "Brothers in gold", "Quiet discipline".
Photography available (40 files, deduped): stage/competition gold-oiled physique shots · gym floor training · temple & devotion set (flag-raising, namaste-back, meditation, worship, turban/dhoti) · rooftop and outdoor · group shots (pier, cliff) · coach portrait · 4 horizon stock images · 3 method marks × 2 finishes · 3 plan marks.
Component/behaviour vocabulary in the build: reveal-on-scroll (1100ms), magnetic CTA, auto-sliding carousel, expanding program modal ("Program 02 · CONDITIONING गति" with "What's inside" list + "START THIS PATH →"), a tweaks panel (motif + motion + accent + display-font swaps), drag-and-drop image slots, scroll-progress bar.

---

## 07 · GLOW — "Nearby Salon OS" (SUPPLIED BUT NOT IN THE PROJECT LIST — ask before using)
Wisbox Technology · "The Glow Build Bible" v1.0 · July 2026 · Phase 1 build · **32 screens & states** · 1 brain "Glow Mind".
**Ideation, artwork & design by Raja Sahoo, Founder & CEO.** *"The Wisbox vertical that turns an empty chair into a booked one."*
Service taxonomy: Haircut · Shave & trim · Facial · Styling · Nails · Massage. Same three-box doc convention as Servora ("Like I'm 6" / "For the developer" / "Watch out").
Full text at notes/raw-glowsalon.txt (1,559 lines) — not yet distilled, pending a decision on whether Glow belongs in the portfolio.

---

## CROSS-CUTTING OBSERVATIONS (traceable, useful for the portfolio's own narrative)
- **Authorship is explicit in the sources.** Servora, CureCall and Glow each name "Ideation, Artwork & Design by Raja Sahoo, Founder & CEO, Wisbox Technology". Mira is "Vesperon Tech × Wisbox". Vidwan and Gharbar are Vesperon/Gharbar Product PRDs.
- **A house method runs through all six documents:** a single source of truth · a plain-language box on every page (Samjho aise / Like I'm 6 / In plain words / 🧒 / Explain like I'm 6) · a colour-coded section spine · an explicit non-goals list · a decision log with reasoning · a hypothesis/assumption label on every unproven number · a phased delivery plan with exit gates.
- **Every product has one load-bearing constraint that generates its design:** Vidwan = the parent never installs anything · Servora = tap how full, never weigh · CureCall = AI assists, the doctor decides · Gharbar = the address is a separate gated table · Mira = never grade · Jai Mata Di = strength as devotion.
- **Recurring craft rules across the docs:** 44px minimum touch targets (Servora, CureCall, Gharbar) · colour never alone, always paired with a word or icon (Servora, Gharbar) · designed empty/sparse/error/loading/success states (Gharbar §19, Servora §8) · one primary action per screen (Gharbar) · motion with a reason, not applause (Gharbar §25, Servora §2).
