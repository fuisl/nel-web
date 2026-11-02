"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

type Frame = {
  title: string;
  category: "Wedding" | "Portrait" | "Editorial" | "Event" | "Film" | "Yearbook";
  location: string;
  image: string;
  video?: string;
  position: string;
  alt: string;
};

const frames: Frame[] = [
  { title: "Grey Water", category: "Film", location: "Moving Image", image: "/images/film-grey-water.jpg", video: "/videos/grey-water.mp4", position: "center 50%", alt: "A figure walking by the water under a grey sky, on grainy film" },
  { title: "After Hours", category: "Editorial", location: "Adam", image: "/images/portfolio-11-img-2244.jpg", position: "center 50%", alt: "A man in black standing in an underpass" },
  { title: "Glass Chime", category: "Film", location: "Moving Image", image: "/images/film-glass-chime.jpg", video: "/videos/glass-chime.mp4", position: "center 50%", alt: "A glass wind chime hanging among leaves at night" },
  { title: "Bách & Nhi", category: "Wedding", location: "Hồ Chí Minh City", image: "/images/portfolio-03-img-0804.jpg", position: "center 25%", alt: "A wedding party gathered at a church entrance" },
  { title: "Road Hours", category: "Film", location: "Moving Image", image: "/images/film-road-hours.jpg", video: "/videos/road-hours.mp4", position: "center 50%", alt: "A motorcycle riding along a sunlit road" },
  { title: "The Local Bros 13", category: "Event", location: "Sound of Soul", image: "/images/event-local-bros-2226.jpg", position: "center 35%", alt: "A band playing on a smoky stage under blue and red light" },
  { title: "With Love", category: "Editorial", location: "THB Brand", image: "/images/editorial-home-2592.jpg", position: "center 50%", alt: "A living room seen from above, with clothes on a sofa and a round table" },
  { title: "Summer Time", category: "Yearbook", location: "Trấn Biên", image: "/images/yearbook-summer-9311.jpg", position: "center 50%", alt: "Three students in uniform walking across grass holding pinwheels" },
];

const REEL_MS = 6000;
const FILM_MS = 10000;
const GLIDE_MS = 110;
const TYPE_MS = 28;
const MARK = "NEL";
const MARK_MS = 160;

const dwell = (f: Frame) => (f.video ? FILM_MS : REEL_MS);

const caption = (i: number) => `F.${i + 1} — ${frames[i].title}, ${frames[i].location}`;

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function ReelIcon({ playing }: { playing: boolean }) {
  return (
    <svg className="reel-icon" viewBox="0 0 12 14" width="12" height="14" fill="none" stroke="currentColor" aria-hidden="true">
      {playing ? (
        <path d="M.5 .5h4M2.5 .5v13M.5 13.5h4M7.5 .5h4M9.5 .5v13M7.5 13.5h4" />
      ) : (
        <path d="M.5 .5h2.5M.5 13.5h2.5M2.5 .5v13L11.5 7z" />
      )}
    </svg>
  );
}

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
  const [browsing, setBrowsing] = useState(false);
  const [locked, setLocked] = useState(false);
  const [panel, setPanel] = useState<"about" | "contact" | null>(null);
  const [typing, setTyping] = useState({ frame: 0, n: 0 });
  const [cycle, setCycle] = useState(0);
  const [markTyped, setMarkTyped] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const glideRaf = useRef(0);
  const glideTarget = useRef(0);
  const running = playing && !reduced && panel === null;
  // A clicked frame stays until the reel is resumed; browsing the strip only holds it while hovering.
  // Films on screen keep playing through both.
  const reelOn = running && !locked;
  const advancing = reelOn && !browsing;

  const select = useCallback((i: number) => {
    setCurrent(i);
    setCycle((c) => c + 1);
  }, []);

  // Ease the strip toward a target; retargeting mid-flight keeps the motion continuous.
  const glideTo = useCallback((x: number) => {
    const track = trackRef.current;
    if (!track) return;
    glideTarget.current = x;
    if (reduced) {
      track.scrollLeft = x;
      return;
    }
    if (glideRaf.current) return;
    let pos = track.scrollLeft;
    let last = performance.now();
    const step = (now: number) => {
      pos += (glideTarget.current - pos) * (1 - Math.exp(-(now - last) / GLIDE_MS));
      last = now;
      const done = Math.abs(glideTarget.current - pos) < 0.5;
      track.scrollLeft = done ? glideTarget.current : pos;
      glideRaf.current = done ? 0 : requestAnimationFrame(step);
    };
    glideRaf.current = requestAnimationFrame(step);
  }, [reduced]);

  useEffect(() => () => cancelAnimationFrame(glideRaf.current), []);

  const go = useCallback((i: number) => {
    select(i);
    const track = trackRef.current;
    const frame = frameRefs.current[i];
    if (!track || !frame) return;
    const pad = parseFloat(getComputedStyle(track).paddingLeft);
    const from = glideRaf.current ? glideTarget.current : track.scrollLeft;
    const left = frame.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft - pad;
    const right = left + frame.offsetWidth + 2 * pad;
    if (left < from) glideTo(left);
    else if (right > from + track.clientWidth) glideTo(right - track.clientWidth);
  }, [select, glideTo]);

  const lockOn = (i: number) => {
    go(i);
    setPlaying(true);
    setLocked(true);
  };

  const toggleReel = () => {
    if (locked) setLocked(false);
    else setPlaying((p) => !p);
  };

  // Auto-advance the reel; restarts whenever the frame changes or play state toggles.
  useEffect(() => {
    if (!advancing) return;
    const id = window.setTimeout(() => go((current + 1) % frames.length), dwell(frames[current]));
    return () => window.clearTimeout(id);
  }, [advancing, current, cycle, go]);

  // A film starts from the top each time it comes on screen.
  useEffect(() => {
    const video = videoRefs.current[current];
    if (video) video.currentTime = 0;
  }, [current]);

  // Only the frame on screen plays, and only while the reel is running.
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === current && running) video.play().catch(() => {});
      else video.pause();
    });
  }, [current, running]);

  // The wheel moves the strip from anywhere on the stage, and the picture follows it.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || panel) return;
    const onWheel = (e: WheelEvent) => {
      const track = trackRef.current;
      if (!track) return;
      e.preventDefault();
      const delta = (Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * (e.deltaMode === 1 ? 16 : 1);
      const max = track.scrollWidth - track.clientWidth;
      if (max <= 0) return;
      const from = glideRaf.current ? glideTarget.current : track.scrollLeft;
      const to = Math.min(max, Math.max(0, from + delta));
      glideTo(to);
      const i = Math.round((to / max) * (frames.length - 1));
      if (i !== current) select(i);
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [panel, current, select, glideTo]);

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

  // Type the mark out once on entry.
  useEffect(() => {
    if (reduced) return;
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setMarkTyped(n);
      if (n >= MARK.length) window.clearInterval(id);
    }, MARK_MS);
    return () => window.clearInterval(id);
  }, [reduced]);

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

  return (
    <main ref={stageRef} className={panel ? "stage has-panel" : "stage"}>
      <h1 className="visually-hidden">NEL — wedding, portrait, editorial and event photographer in Hồ Chí Minh City</h1>

      <div className="backdrop" aria-hidden="true">
        {frames.map((f, i) => f.video ? (
          <video
            key={f.image}
            ref={(el) => { videoRefs.current[i] = el; }}
            src={f.video}
            poster={f.image}
            muted
            loop
            playsInline
            preload={i === 0 ? "auto" : "none"}
            className={i === current ? "is-on" : undefined}
            style={{ objectPosition: f.position }}
          />
        ) : (
          <Image
            key={f.image}
            src={f.image}
            alt=""
            fill
            sizes="100vw"
            className={i === current ? "is-on" : undefined}
            style={{ objectPosition: f.position }}
          />
        ))}
        <span className="shade" />
      </div>

      <header className="bar">
        <Link className="mark" href="/" aria-label={MARK}>
          <span aria-hidden="true">{reduced ? MARK : MARK.slice(0, markTyped)}</span>
          {/* Solid while typing, then blinks like an editor cursor waiting for input. */}
          <span className={reduced || markTyped >= MARK.length ? "caret" : undefined} aria-hidden="true">_</span>
        </Link>
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

      <section
        className="index"
        aria-label="Stories"
        onPointerEnter={(e) => e.pointerType === "mouse" && setBrowsing(true)}
        onPointerLeave={() => setBrowsing(false)}
      >
        <div className="index-meta">
          <span>{String(current + 1).padStart(2, "0")} / {frames.length}</span>
          <button type="button" className="reel-toggle" onClick={toggleReel} aria-label={reelOn ? "Pause the reel" : "Play the reel"}>
            {reelOn ? "Pause" : "Play"}
            <ReelIcon playing={reelOn} />
          </button>
        </div>
        <div className="ticks" aria-hidden="true" />
        <div ref={trackRef} className="track">
          {frames.map((f, i) => (
            <button
              key={f.image}
              ref={(el) => { frameRefs.current[i] = el; }}
              type="button"
              className={i === current ? "frame is-on" : "frame"}
              aria-pressed={i === current}
              onClick={() => lockOn(i)}
            >
              <span className="row rule">
                <span>F.</span>
                <span>{i + 1}</span>
                {i === current && advancing && <span key={cycle} className="reel" style={{ animationDuration: `${dwell(f)}ms` }} aria-hidden="true" />}
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
            <span className="mark">{MARK}<span className="caret" aria-hidden="true">_</span></span>
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
