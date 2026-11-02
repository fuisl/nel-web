import Image from "next/image";

type Mark = "star" | "corners" | "ring";

type Shot = {
  image: string;
  video?: string;
  ratio: number;
  position?: string;
  label?: string;
  mark?: Mark;
};

const upper: Shot[] = [
  { image: "/images/bts/team.jpg", ratio: 1.5, label: "the team", mark: "corners" },
  { image: "/images/film-glass-chime.jpg", video: "/videos/strip-glass-chime.mp4", ratio: 1.78 },
  { image: "/images/bts/wall.jpg", ratio: 1.5, position: "center 60%", mark: "star" },
  { image: "/images/bts/seat.jpg", ratio: 1.05, position: "center 22%", label: "between takes" },
  { image: "/images/film-road-hours.jpg", video: "/videos/strip-road-hours.mp4", ratio: 1.78, mark: "corners" },
  { image: "/images/bts/market.jpg", ratio: 1.33, position: "center 60%", label: "on location", mark: "ring" },
  { image: "/images/bts/kit.jpg", ratio: 1.3 },
];

const lower: Shot[] = [
  { image: "/images/bts/phone.jpg", ratio: 1.5, label: "on set", mark: "ring" },
  { image: "/images/film-grey-water.jpg", video: "/videos/strip-grey-water.mp4", ratio: 1.78 },
  { image: "/images/bts/hallway.jpg", ratio: 1.5, mark: "star" },
  { image: "/images/bts/crew.jpg", ratio: 1.6, label: "the crew" },
  { image: "/images/film-last-light.jpg", video: "/videos/strip-last-light.mp4", ratio: 1.78, mark: "corners" },
  { image: "/images/bts/lion.jpg", ratio: 1.1, position: "center 55%" },
  { image: "/images/bts/bridge.jpg", ratio: 1.3, position: "center 70%", mark: "star" },
];

function Doodle({ mark }: { mark: Mark }) {
  return (
    <svg className={`doodle doodle-${mark}`} viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" stroke="currentColor" aria-hidden="true">
      {mark === "star" && <path d="M12 44 89 30 27 84 50 10 76 88Z" />}
      {mark === "ring" && <path d="M18 52C14 24 44 8 68 14c24 6 28 40 8 60-20 18-50 14-60-8-8-20 8-44 34-50" />}
      {mark === "corners" && <path d="M4 22V4h20M76 4h20v18M96 78v18H76M24 96H4V78" />}
    </svg>
  );
}

function Frame({ shot, n, reduced }: { shot: Shot; n: number; reduced: boolean }) {
  return (
    <figure className="still" style={{ aspectRatio: shot.ratio }}>
      <span className="edge edge-top">NEL 5063<i>{n}A ▸</i></span>
      <span className="edge edge-bottom">{n + 1} ◂<i>400</i></span>
      {shot.video ? (
        <video src={shot.video} poster={shot.image} muted loop playsInline autoPlay={!reduced} preload="auto" style={{ objectPosition: shot.position }} />
      ) : (
        <Image src={shot.image} alt="" fill sizes="(max-width: 820px) 300px, 520px" loading="eager" style={{ objectPosition: shot.position }} />
      )}
      {shot.mark && <Doodle mark={shot.mark} />}
      {shot.label && <figcaption>{shot.label}</figcaption>}
    </figure>
  );
}

function Strip({ shots, tone, reduced }: { shots: Shot[]; tone: "amber" | "worn"; reduced: boolean }) {
  return (
    <div className={`strip-rail strip-${tone}`}>
      <div className="strip">
        {/* Two identical runs, so the roll loops without a visible seam. */}
        {[0, 1].map((run) => (
          <div className="strip-run" key={run}>
            {shots.map((shot, i) => <Frame key={shot.image} shot={shot} n={i + 11} reduced={reduced} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

function Note({ className, delay, children }: { className: string; delay: number; children: React.ReactNode }) {
  return <p className={`note-hand ${className}`} style={{ "--at": `${delay}s` } as React.CSSProperties}>{children}</p>;
}

function Stroke({ className, delay, viewBox, d }: { className: string; delay: number; viewBox: string; d: string }) {
  return (
    <svg className={`stroke ${className}`} viewBox={viewBox} fill="none" stroke="currentColor" aria-hidden="true" style={{ "--at": `${delay}s` } as React.CSSProperties}>
      <path pathLength={1} d={d} />
    </svg>
  );
}

export function FilmRoll({ reduced }: { reduced: boolean }) {
  return (
    <div className="film-roll" aria-hidden="true">
      <Strip shots={upper} tone="amber" reduced={reduced} />
      <Strip shots={lower} tone="worn" reduced={reduced} />
      <span className="film-leak" />
      <span className="film-fade" />

      <div className="scribbles">
        <Note className="n-observe" delay={0.5}>quiet observation</Note>
        <Stroke className="s-observe" delay={1.5} viewBox="0 0 200 64" d="M26 34C20 12 90 4 150 8c36 3 50 16 42 30-10 18-70 24-120 20C36 54 8 44 12 28 16 12 60 6 96 6" />

        <Note className="n-moments" delay={2.6}>the fleeting, imperfect moments</Note>
        <Stroke className="s-moments" delay={3.8} viewBox="0 0 120 170" d="M104 4C112 62 72 118 12 158M10 118c-3 15-3 28 2 41 16-1 30-5 42-12M6 126c0 12 1 22 7 32" />

        <Note className="n-unexpected" delay={4.8}>a little room for the unexpected</Note>
        <Stroke className="s-under" delay={6} viewBox="0 0 200 18" d="M4 7C50 3 130 2 196 6 140 7 80 9 34 15" />
        <Stroke className="s-unexpected" delay={6.6} viewBox="0 0 90 130" d="M60 4C78 44 68 88 26 122M16 88c-4 12-3 24 6 36 12-3 22-8 32-16" />

        <Stroke className="s-star" delay={7.6} viewBox="0 0 100 100" d="M12 44 89 30 27 84 50 10 76 88Z" />
      </div>
    </div>
  );
}
