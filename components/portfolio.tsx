"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Work = {
  title: string;
  category: "Wedding" | "Portrait" | "Editorial" | "Event";
  location: string;
  image: string;
  alt: string;
  ratio: "portrait" | "landscape" | "tall";
};

const works: Work[] = [
  {
    title: "A Quiet Promise",
    category: "Wedding",
    location: "Independence Palace",
    image: "/images/wedding-promise.jpg",
    alt: "Bride and groom sharing a quiet moment outdoors",
    ratio: "portrait",
  },
  {
    title: "Saigon, With You",
    category: "Portrait",
    location: "Ho Chi Minh City",
    image: "/images/portfolio-02-img-1264.jpg",
    alt: "A couple laughing and dancing on a Ho Chi Minh City street",
    ratio: "tall",
  },
  {
    title: "Bách & Nhi",
    category: "Wedding",
    location: "Ho Chi Minh City",
    image: "/images/portfolio-03-img-0804.jpg",
    alt: "A wedding party gathered at the entrance of a church",
    ratio: "portrait",
  },
  {
    title: "After the Rain",
    category: "Portrait",
    location: "Ba Son",
    image: "/images/couple-bason.jpg",
    alt: "Couple kissing under a cloudy sky",
    ratio: "landscape",
  },
  {
    title: "Modern Uniform",
    category: "Editorial",
    location: "Studio 04",
    image: "/images/editorial-modern.jpg",
    alt: "Fashion portrait in a dark tailored suit",
    ratio: "portrait",
  },
  {
    title: "Funky Night",
    category: "Event",
    location: "Live in Saigon",
    image: "/images/portfolio-06-img-2274.jpg",
    alt: "Performers caught in motion on a concert stage in black and white",
    ratio: "landscape",
  },
  {
    title: "Sinh & Xuyến",
    category: "Wedding",
    location: "Ho Chi Minh City",
    image: "/images/portfolio-07-img-1059.jpg",
    alt: "A bride looking through the window of a wedding car",
    ratio: "portrait",
  },
  {
    title: "Last Bell",
    category: "Portrait",
    location: "Trấn Biên",
    image: "/images/yearbook-motion.jpg",
    alt: "Students moving through a school courtyard",
    ratio: "portrait",
  },
  {
    title: "Constructed Form",
    category: "Editorial",
    location: "Nhật Anh",
    image: "/images/portfolio-09-img-9791.jpg",
    alt: "Editorial study of a structured jacket with folded details",
    ratio: "portrait",
  },
  {
    title: "Summer Stillness",
    category: "Portrait",
    location: "Trúc",
    image: "/images/portfolio-10-img-0377.jpg",
    alt: "Soft portrait study with a woman and a basket of oranges",
    ratio: "tall",
  },
  {
    title: "After Hours",
    category: "Editorial",
    location: "Adam",
    image: "/images/portfolio-11-img-2244.jpg",
    alt: "Blue-toned fashion portrait in an underground passage",
    ratio: "landscape",
  },
  {
    title: "Mirrorball",
    category: "Editorial",
    location: "HK",
    image: "/images/portfolio-12-hk1-3.jpg",
    alt: "Hand holding a mirrorball in warm amber light",
    ratio: "portrait",
  },
  {
    title: "Veiled Light",
    category: "Portrait",
    location: "Khả Như",
    image: "/images/portfolio-13-img-2236.jpg",
    alt: "Dreamlike portrait beside a lake beneath willow branches",
    ratio: "portrait",
  },
  {
    title: "With Love",
    category: "Editorial",
    location: "THB Brand",
    image: "/images/portfolio-14-img-2183.jpg",
    alt: "Editorial detail of red roses against a typographic white shirt",
    ratio: "portrait",
  },
];

const filters = ["All", "Wedding", "Portrait", "Editorial", "Event"] as const;

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
      <path d={diagonal ? "M5 19 19 5M8 5h11v11" : "M5 12h14m-5-5 5 5-5 5"} />
    </svg>
  );
}

export function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 24);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  const visibleWorks = filter === "All" ? works : works.filter((work) => work.category === filter);
  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <header className={scrolled ? "site-header is-scrolled" : "site-header"}>
        <a className="brand-block" href="#top" aria-label="NEL home" onClick={closeMenu}>
          <span className="nav-label">Independent</span>
          <strong className="wordmark">NEL<span>®</span></strong>
        </a>
        <div className="location-block">
          <span className="nav-label">Based in</span>
          <strong>Ho Chi Minh City</strong>
        </div>
        <nav className={menuOpen ? "site-nav is-open" : "site-nav"} aria-label="Main navigation">
          <span className="nav-label">Index</span>
          <div className="nav-links">
            <a href="#work" onClick={closeMenu}>Portfolio</a>
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="#contact" onClick={closeMenu}>Contact</a>
          </div>
        </nav>
        <div className="header-contact">
          <span className="nav-label">Contact</span>
          <div>
            <a href="https://www.instagram.com/nel_khoe" target="_blank" rel="noreferrer">Instagram</a>
            <a href="mailto:ngolamanhkhoa169@gmail.com">Email</a>
          </div>
        </div>
        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-image-wrap">
          <Image
            className="hero-image"
            src="/images/hero-wedding-2512.jpg"
            alt="Wedding portraits at Independence Palace in Ho Chi Minh City"
            fill
            priority
            sizes="100vw"
          />
          <div className="hero-shade" />
        </div>
        <div className="hero-copy">
          <p className="eyebrow light">Photography · Visual stories</p>
          <h1 id="hero-title">Hold on to<span>what it felt like.</span></h1>
          <div className="hero-bottom">
            <p>Honest imagery for lovers, people, and independent brands.</p>
            <a className="round-link" href="#work" aria-label="Explore selected work"><Arrow /></a>
          </div>
        </div>
      </section>

      <section className="intro" aria-label="Introduction">
        <p className="eyebrow">Vietnam · Ho Chi Minh City · GMT+7</p>
        <p className="intro-statement">
          I photograph the energy between people—the fleeting, imperfect moments that make a story feel <em>alive.</em>
        </p>
        <div className="intro-aside">
          <span>(Approach)</span>
          <p>Quiet observation, gentle direction, and a little room for the unexpected.</p>
        </div>
      </section>

      <section className="work-section" id="work" aria-labelledby="work-title">
        <div className="section-heading">
          <p className="eyebrow">Selected work · 2024—26</p>
          <h2 id="work-title">Stories, closely seen.</h2>
        </div>
        <div className="filters" role="group" aria-label="Filter portfolio">
          {filters.map((item) => (
            <button
              className={filter === item ? "is-active" : ""}
              key={item}
              type="button"
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
            >{item}</button>
          ))}
        </div>
        <div className="work-grid" aria-live="polite">
          {visibleWorks.map((work, index) => (
            <article className={`work-card ${work.ratio}`} key={work.title}>
              <div className="work-image-wrap">
                <Image className="work-image" src={work.image} alt={work.alt} fill sizes="(max-width: 700px) 100vw, 50vw" />
                <span className="work-number">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="work-meta">
                <h3>{work.title}</h3>
                <p>{work.category} · {work.location}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="manifesto" id="about" aria-labelledby="about-title">
        <div className="manifesto-image-wrap">
          <Image src="/images/about-camera.jpg" alt="Hands holding a vintage film camera" fill sizes="(max-width: 760px) 100vw, 42vw" className="manifesto-image" />
        </div>
        <div className="manifesto-copy">
          <p className="eyebrow light">A note from NEL</p>
          <h2 id="about-title">Images that feel like memory, not performance.</h2>
          <div className="manifesto-body">
            <p>My work lives between documentary and editorial photography. I notice the in-between gestures, the atmosphere, and the details that are easy to miss while you are living them.</p>
            <p>Whether it is a wedding, a portrait, or a brand story, the goal is the same: create photographs that still feel true years from now.</p>
          </div>
          <p className="signature">NEL</p>
        </div>
      </section>

      <section className="services" aria-labelledby="services-title">
        <p className="eyebrow">Ways to work together</p>
        <h2 id="services-title">Made personal, from the first conversation.</h2>
        <div className="service-list">
          <div><span>01</span><h3>Weddings & celebrations</h3><p>Full stories, intimate ceremonies, and everything between.</p></div>
          <div><span>02</span><h3>Portraits & couples</h3><p>Relaxed sessions shaped around who you actually are.</p></div>
          <div><span>03</span><h3>Editorial & brands</h3><p>Distinctive imagery for campaigns, products, and culture.</p></div>
          <div><span>04</span><h3>Events</h3><p>Atmosphere, people, and the energy of the room.</p></div>
        </div>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <Image
          className="contact-background"
          src="/images/contact-img-1582.jpg"
          alt="Live performers on stage in Ho Chi Minh City"
          fill
          sizes="100vw"
        />
        <div className="contact-shade" />
        <div className="contact-topline">
          <p className="eyebrow">Bookings open · 2026</p>
          <p>Vietnam · Ho Chi Minh City · GMT+7</p>
        </div>
        <h2 id="contact-title">Have a story in mind?</h2>
        <a className="contact-link" href="mailto:ngolamanhkhoa169@gmail.com">
          Let&apos;s make something <em>lasting.</em>
        </a>
        <div className="contact-details">
          <div><span>Email</span><a href="mailto:ngolamanhkhoa169@gmail.com">ngolamanhkhoa169@gmail.com</a></div>
          <div><span>Phone</span><a href="tel:+84908634027">(+84) 908 634 027</a></div>
          <div><span>Instagram</span><a href="https://www.instagram.com/nel_khoe" target="_blank" rel="noreferrer">@nel_khoe</a></div>
        </div>
        <footer>
          <a className="wordmark footer-mark" href="#top">NEL<span>®</span></a>
          <div className="footer-links">
            <a href="mailto:ngolamanhkhoa169@gmail.com">Email</a>
            <a href="https://www.instagram.com/nel_khoe" target="_blank" rel="noreferrer">Instagram</a>
          </div>
          <p>© 2026 NEL Photography</p>
        </footer>
      </section>
    </main>
  );
}
