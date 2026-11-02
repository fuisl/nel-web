"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type WheelEvent } from "react";

type Frame = {
  title: string;
  category: "Wedding" | "Portrait" | "Editorial" | "Event";
  location: string;
  image: string;
  position: string;
  alt: string;
};

const frames: Frame[] = [
  { title: "A Quiet Promise", category: "Wedding", location: "Independence Palace", image: "/images/hero-wedding-2512.jpg", position: "center 18%", alt: "Bride and groom embracing beneath trees" },
  { title: "Saigon, With You", category: "Portrait", location: "Hồ Chí Minh City", image: "/images/portfolio-02-img-1264.jpg", position: "center 20%", alt: "Two friends dancing across a city street" },
  { title: "Bách & Nhi", category: "Wedding", location: "Hồ Chí Minh City", image: "/images/portfolio-03-img-0804.jpg", position: "center 25%", alt: "A wedding party gathered at a church entrance" },
  { title: "After the Rain", category: "Portrait", location: "Ba Son", image: "/images/couple-bason.jpg", position: "center 35%", alt: "Couple kissing in silhouette against a pale sky" },
  { title: "Modern Uniform", category: "Editorial", location: "Studio 04", image: "/images/editorial-modern.jpg", position: "center 20%", alt: "Editorial portraits in a dark tailored suit" },
  { title: "Funky Night", category: "Event", location: "Live in Saigon", image: "/images/portfolio-06-img-2274.jpg", position: "center 40%", alt: "Performers on a smoky stage under lights" },
  { title: "Sinh & Xuyến", category: "Wedding", location: "Hồ Chí Minh City", image: "/images/portfolio-07-img-1059.jpg", position: "center 50%", alt: "A bride looking out from a car window" },
  { title: "Last Bell", category: "Portrait", location: "Trấn Biên", image: "/images/yearbook-motion.jpg", position: "center 20%", alt: "Students running, legs blurred with motion" },
  { title: "Constructed Form", category: "Editorial", location: "Nhật Anh", image: "/images/portfolio-09-img-9791.jpg", position: "center 40%", alt: "Details of a sculpted leather jacket" },
  { title: "Summer Stillness", category: "Portrait", location: "Trúc", image: "/images/portfolio-10-img-0377.jpg", position: "center 45%", alt: "A soft still life of a woman with oranges" },
  { title: "After Hours", category: "Editorial", location: "Adam", image: "/images/portfolio-11-img-2244.jpg", position: "center 50%", alt: "A man in black standing in an underpass" },
  { title: "Mirrorball", category: "Editorial", location: "HK", image: "/images/portfolio-12-hk1-3.jpg", position: "center 45%", alt: "A hand holding a glowing mirrorball" },
  { title: "Veiled Light", category: "Portrait", location: "Khả Như", image: "/images/portfolio-13-img-2236.jpg", position: "center 22%", alt: "Woman in a lace headscarf beneath a willow" },
  { title: "With Love", category: "Editorial", location: "THB Brand", image: "/images/portfolio-14-img-2183.jpg", position: "center 30%", alt: "Roses held over a printed white shirt" },
];

const REEL_MS = 6000;
const TYPE_MS = 28;

const caption = (i: number) => `F.${i + 1} — ${frames[i].title}, ${frames[i].location}`;

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(MOTION_QUERY);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(MOTION_QUERY).matches,
    () => false,
  );
}

export function Portfolio() {
  const reduced = usePrefersReducedMotion();
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [panel, setPanel] = useState<"about" | "contact" | null>(null);
  const [typing, setTyping] = useState({ frame: 0, n: 0 });
  const [cycle, setCycle] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const frameRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const running = playing && !reduced && panel === null;

  const go = useCallback((i: number) => {
    setCurrent(i);
    setCycle((c) => c + 1);
  }, []);

  // Auto-advance the reel; restarts whenever the frame changes or play state toggles.
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => go((current + 1) % frames.length), REEL_MS);
    return () => window.clearTimeout(id);
  }, [running, current, cycle, go]);

  // Keep the active frame in view when the reel advances.
  useEffect(() => {
    frameRefs.current[current]?.scrollIntoView({ inline: "nearest", block: "nearest", behavior: reduced ? "auto" : "smooth" });
  }, [current, reduced]);

  // Type the caption out each time the frame changes.
  useEffect(() => {
    if (reduced) return;
    const full = caption(current).length;
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setTyping({ frame: current, n });
      if (n >= full) window.clearInterval(id);
    }, TYPE_MS);
    return () => window.clearInterval(id);
  }, [current, reduced]);

  const typed = reduced ? caption(current).length : typing.frame === current ? typing.n : 0;

  // Close overlays with Escape and move focus into them when they open.
  useEffect(() => {
    if (!panel) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel]);

  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) e.currentTarget.scrollLeft += e.deltaY;
  };

  return (
    <main className={panel ? "stage has-panel" : "stage"}>
      <h1 className="visually-hidden">NEL — wedding, portrait, editorial and event photographer in Hồ Chí Minh City</h1>

      <div className="backdrop" aria-hidden="true">
        {frames.map((f, i) => (
          <Image
            key={f.image}
            src={f.image}
            alt=""
            fill
            sizes="100vw"
            priority={i === 0}
            className={i === current ? "is-on" : undefined}
            style={{ objectPosition: f.position }}
          />
        ))}
        <span className="shade" />
      </div>

      <header className="bar">
        <Link className="mark" href="/">NEL_</Link>
        <span className="hide-sm">Photographer<br />Hồ Chí Minh City, GMT+7</span>
        <nav aria-label="Main" className="menu">
          <button type="button" onClick={() => setPanel(null)}>Work,</button>
          <button type="button" onClick={() => setPanel("about")}>About,</button>
          <button type="button" onClick={() => setPanel("contact")}>Contact</button>
        </nav>
        <span className="right hide-sm">Bookings open<br />(C) 2026</span>
      </header>

      <p className="caption" aria-live="polite">
        <span className="visually-hidden">{caption(current)}</span>
        <span aria-hidden="true">{caption(current).slice(0, typed)}</span>
        <span className="caret" aria-hidden="true">_</span>
      </p>

      <section className="index" aria-label="Stories">
        <div className="index-meta">
          <span>{String(current + 1).padStart(2, "0")} / {frames.length}</span>
          <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={running ? "Pause the reel" : "Play the reel"}>
            {running ? "Pause" : "Play"}
          </button>
        </div>
        <div className="ticks" aria-hidden="true" />
        <div className="track" onWheel={onWheel}>
          {frames.map((f, i) => (
            <button
              key={f.image}
              ref={(el) => { frameRefs.current[i] = el; }}
              type="button"
              className={i === current ? "frame is-on" : "frame"}
              aria-pressed={i === current}
              onClick={() => go(i)}
              onMouseEnter={() => i !== current && go(i)}
              onFocus={() => i !== current && go(i)}
            >
              <span className="row rule">
                <span>F.</span>
                <span>{i + 1}</span>
                {i === current && running && <span key={cycle} className="reel" aria-hidden="true" />}
              </span>
              <span className="title">{f.title}</span>
              <span className="row gap"><span>C.</span><span>{f.category}</span></span>
              <span className="row"><span>L.</span><span>{f.location}</span></span>
            </button>
          ))}
        </div>
      </section>

      {panel && (
        <div className="panel" role="dialog" aria-modal="true" aria-label={panel === "about" ? "About" : "Contact"}>
          <div className="bar static">
            <span className="mark">NEL_</span>
            <span className="hide-sm">{panel === "about" ? "About" : "Contact"}</span>
            <span className="hide-sm" />
            <button ref={closeRef} type="button" className="right" onClick={() => setPanel(null)}>Close ×</button>
          </div>

          {panel === "about" ? (
            <div className="panel-body">
              <span className="hide-sm" />
              <p className="note">
                I photograph the energy between people — the fleeting, imperfect moments that make a story feel alive.
                Between documentary and editorial. Quiet observation, gentle direction, a little room for the unexpected.
              </p>
              <div className="list">
                <span className="row rule"><span>B.</span><span>Hồ Chí Minh City</span></span>
                <span className="row rule"><span>W.</span><span>Wedding, Portrait, Editorial, Event</span></span>
                <span className="row rule"><span>V.</span><span>Tiếng Việt / English</span></span>
              </div>
            </div>
          ) : (
            <div className="panel-body contact">
              <a href="mailto:ngolamanhkhoa169@gmail.com">
                <span className="row rule"><span>E.</span><span>Email</span></span>
                <span className="lower">ngolamanhkhoa169@gmail.com</span>
              </a>
              <a href="tel:+84908634027">
                <span className="row rule"><span>T.</span><span>Phone / Zalo</span></span>
                <span>(+84) 908 634 027</span>
              </a>
              <a href="https://www.instagram.com/nel_khoe" target="_blank" rel="noreferrer">
                <span className="row rule"><span>I.</span><span>Instagram</span></span>
                <span>@nel_khoe</span>
              </a>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
