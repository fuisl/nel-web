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
    image: "/images/couple-tan-thu.jpg",
    alt: "Couple holding hands on a bridge in the city",
    ratio: "tall",
  },
  {
    title: "Việt Phục",
    category: "Editorial",
    location: "Saigon",
    image: "/images/editorial-viet-phuc.jpg",
    alt: "Woman in traditional Vietnamese dress holding a fan",
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
    image: "/images/event-funky.jpg",
    alt: "Performers on a concert stage in black and white",
    ratio: "landscape",
  },
  {
    title: "The Ceremony",
    category: "Wedding",
    location: "Ho Chi Minh City",
    image: "/images/wedding-ceremony.jpg",
    alt: "Wedding party entering a church",
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
];

const filters = ["All", "Wedding", "Portrait", "Editorial", "Event"] as const;

const heroImages = [
  {
    src: "/images/hero-wedding-2512.jpg",
    alt: "Wedding portraits at Independence Palace in Ho Chi Minh City",
  },
  {
    src: "/images/hero-tan-thu.jpg",
    alt: "A couple moving together through Ho Chi Minh City",
  },
] as const;

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
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => {
      setHeroSlide((current) => (current + 1) % heroImages.length);
    }, 5500);
    return () => window.clearInterval(interval);
  }, []);

  const visibleWorks = filter === "All" ? works : works.filter((work) => work.category === filter);
  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <header className="site-header">
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
          {heroImages.map((image, index) => (
            <Image
              className={heroSlide === index ? "hero-image is-active" : "hero-image"}
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              key={image.src}
            />
          ))}
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
        <div className="hero-pagination" aria-label="Choose hero image">
          {heroImages.map((image, index) => (
            <button
              className={heroSlide === index ? "is-active" : ""}
              type="button"
              onClick={() => setHeroSlide(index)}
              aria-label={`Show image ${index + 1}: ${image.alt}`}
              aria-pressed={heroSlide === index}
              key={image.src}
            >{String(index + 1).padStart(2, "0")}</button>
          ))}
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
          <p className="signature">Nel</p>
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
        <div className="contact-topline">
          <p className="eyebrow">Bookings open · 2026</p>
          <p>Vietnam · Ho Chi Minh City · GMT+7</p>
        </div>
        <h2 id="contact-title">Have a story in mind?</h2>
        <a className="contact-link" href="mailto:ngolamanhkhoa169@gmail.com">
          Let&apos;s make something <em>lasting.</em>
          <span><Arrow diagonal /></span>
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
