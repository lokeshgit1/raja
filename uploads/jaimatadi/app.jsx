// app.jsx — assembles the page and wires Tweaks
const { useEffect: useEffectA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "gold",
  "displayFont": "Saira Condensed",
  "motif": "balanced",
  "motion": "default",
  "galleryShape": "portrait"
}/*EDITMODE-END*/;

const ACCENTS = {
  gold:    { a: "#C9A227", b: "#E6C865", cta: "#C9A227" },
  saffron: { a: "#F4A300", b: "#FFC24A", cta: "#F4A300" },
};
const GALLERY_AR = {
  portrait: "4 / 5",
  tall:     "2 / 3",
  square:   "1 / 1",
};
const MOTION = {
  calm:    { scale: "0.55", dur: "1400ms" },
  default: { scale: "1",    dur: "1100ms" },
  bold:    { scale: "1.7",  dur: "820ms"  },
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // apply tweaks to :root
  useEffectA(() => {
    const root = document.documentElement;
    const ac = ACCENTS[t.accent] || ACCENTS.gold;
    root.style.setProperty("--accent", ac.a);
    root.style.setProperty("--accent-bright", ac.b);
    root.style.setProperty("--accent-cta", ac.cta);
    root.style.setProperty("--font-display", `'${t.displayFont}', 'Saira Condensed', sans-serif`);
    const mo = MOTION[t.motion] || MOTION.default;
    root.style.setProperty("--motion-scale", mo.scale);
    root.style.setProperty("--reveal-dur", mo.dur);
    root.style.setProperty("--gallery-ar", GALLERY_AR[t.galleryShape] || GALLERY_AR.portrait);
    root.setAttribute("data-motif", t.motif);
    root.setAttribute("data-motion", t.motion);
  }, [t.accent, t.displayFont, t.motif, t.motion, t.galleryShape]);

  // global behaviours
  useScrollReveal([]);
  useScrollProgress();

  return (
    <React.Fragment>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Programs />
        <Method />
        <Trainers />
        <Gallery />
        <Testimonials />
        <Transformations />
        <Album />
        <Membership />
        <Horizon />
        <FinalCTA />
      </main>
      <Footer />

      <TweaksPanel>
        <TweakSection label="Accent" />
        <TweakRadio label="Gold tone" value={t.accent}
          options={["gold", "saffron"]}
          onChange={(v) => setTweak("accent", v)} />
        <TweakSection label="Typography" />
        <TweakSelect label="Display face" value={t.displayFont}
          options={["Saira Condensed", "Oswald", "Anton"]}
          onChange={(v) => setTweak("displayFont", v)} />
        <TweakSection label="Gallery" />
        <TweakRadio label="Photo frame" value={t.galleryShape}
          options={["portrait", "tall", "square"]}
          onChange={(v) => setTweak("galleryShape", v)} />
        <TweakSection label="Cultural motifs" />
        <TweakRadio label="Intensity" value={t.motif}
          options={["subtle", "balanced", "expressive"]}
          onChange={(v) => setTweak("motif", v)} />
        <TweakSection label="Motion" />
        <TweakRadio label="Feel" value={t.motion}
          options={["calm", "default", "bold"]}
          onChange={(v) => setTweak("motion", v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
