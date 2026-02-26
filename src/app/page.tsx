import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* ── Floating petals background ── */}
      <div className={styles.petalsContainer} aria-hidden='true'>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={styles.petal}
            style={{
              left: `${(i * 8.3) % 100}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${12 + (i % 5) * 3}s`,
              width: `${8 + (i % 4) * 4}px`,
              height: `${8 + (i % 4) * 4}px`,
            }}
          />
        ))}
      </div>

      {/* ── NAV ── */}
      <nav className={styles.nav}>
        <div className={`container ${styles.navInner}`}>
          <span className={`script ${styles.logo}`}>Mektup</span>
          <div className={styles.navLinks}>
            <Link href='/letter' className='btn btn-primary' id='nav-write-btn'>
              ✦ Write a Letter
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        {/* Left floral decoration */}
        <div
          className={`${styles.floralLeft} animate-float`}
          aria-hidden='true'
        >
          <Image
            src='/assets/flower-branch-left.svg'
            alt=''
            width={180}
            height={360}
            priority
          />
        </div>

        {/* Right floral decoration */}
        <div
          className={`${styles.floralRight} animate-float`}
          style={{ animationDelay: '2s' }}
          aria-hidden='true'
        >
          <Image
            src='/assets/flower-branch-right.svg'
            alt=''
            width={180}
            height={360}
            priority
          />
        </div>

        <div className={`container ${styles.heroContent}`}>
          <p className={`script animate-fade-up delay-1 ${styles.heroEyebrow}`}>
            Because some things need more than a text...
          </p>

          <h1 className={`animate-fade-up delay-2 ${styles.heroTitle}`}>
            Write a letter
            <br />
            <em>from the heart</em>
          </h1>

          <div
            className={`${styles.garlandWrap} animate-fade delay-3`}
            aria-hidden='true'
          >
            <Image
              src='/assets/flower-garland.svg'
              alt=''
              width={500}
              height={80}
            />
          </div>

          <p className={`animate-fade-up delay-3 ${styles.heroSubtitle}`}>
            Apology, love, gratitude, sympathy — whatever you need to say,
            say it beautifully. Decorate with flowers, save your letter,
            and share a private link with the person who matters.
          </p>

          <div className={`animate-fade-up delay-4 ${styles.heroCta}`}>
            <Link
              href='/letter'
              className='btn btn-primary'
              id='hero-write-btn'
            >
              ✦ Start Writing
            </Link>
            <a href='#how-it-works' className='btn btn-outline' id='hero-learn-btn'>
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* ── LETTER TYPES ── */}
      <section className={`section ${styles.typesSection}`}>
        <div className='container'>
          <div className={`divider ${styles.sectionDivider}`}>
            every occasion
          </div>
          <h2 className={`animate-fade-up ${styles.sectionTitle}`}>
            A letter for every feeling
          </h2>
          <div className={styles.typesGrid}>
            {[
              { icon: '🙏', label: 'Apology', desc: 'Say sorry the right way' },
              { icon: '💌', label: 'Love', desc: 'Pour your heart out' },
              { icon: '🌸', label: 'Thank You', desc: 'Express real gratitude' },
              { icon: '🎂', label: 'Birthday', desc: 'Make it unforgettable' },
              { icon: '🕊️', label: 'Sympathy', desc: 'Comfort with words' },
              { icon: '✉️', label: 'Pen Pal', desc: 'Keep the tradition alive' },
            ].map(({ icon, label, desc }) => (
              <Link
                key={label}
                href={`/letter?type=${label.toLowerCase().replace(' ', '-')}`}
                className={`paper-card ${styles.typeCard}`}
                id={`type-${label.toLowerCase().replace(' ', '-')}`}
              >
                <span className={styles.typeIcon}>{icon}</span>
                <h3 className={styles.typeLabel}>{label}</h3>
                <p className={styles.typeDesc}>{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id='how-it-works' className={`section ${styles.howSection}`}>
        <div className='container'>
          <div className={`divider ${styles.sectionDivider}`}>
            simple steps
          </div>
          <h2 className={`animate-fade-up ${styles.sectionTitle}`}>
            Your letter, ready in minutes
          </h2>

          <div className={styles.steps}>
            {[
              {
                icon: '✦',
                step: '01',
                title: 'Write what you feel',
                desc: 'No blank-page anxiety. Guided prompts help you find the right words — every one of them yours.',
              },
              {
                icon: '❀',
                step: '02',
                title: 'Decorate with flowers',
                desc: 'Add romantic floral illustrations, drag them anywhere on the page, choose your paper theme.',
              },
              {
                icon: '✉',
                step: '03',
                title: 'Share a private link',
                desc: 'Save your letter and get a unique URL. Your recipient opens a beautiful, private letter — just for them.',
              },
            ].map(({ icon, step, title, desc }) => (
              <div key={step} className={`paper-card ${styles.stepCard}`}>
                <div className={styles.stepIcon}>{icon}</div>
                <span className={styles.stepNum}>{step}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREVIEW / SAMPLE LETTER ── */}
      <section className={`section ${styles.previewSection}`}>
        <div className='container'>
          <div className={`divider ${styles.sectionDivider}`}>sample letter</div>
          <h2 className={`${styles.sectionTitle}`}>This is what it looks like</h2>

          <div className={styles.letterPreviewWrap}>
            {/* Flower decorations on corners */}
            <div className={styles.previewFlowerTL} aria-hidden='true'>
              <Image
                src='/assets/flower-stamp.svg'
                alt=''
                width={64}
                height={64}
              />
            </div>
            <div className={styles.previewFlowerBR} aria-hidden='true'>
              <Image
                src='/assets/flower-stamp.svg'
                alt=''
                width={48}
                height={48}
              />
            </div>

            <div className={`letter-paper ${styles.letterPreview}`}>
              <p className={`script ${styles.letterDate}`}>February 26, 2026</p>
              <p className={`script ${styles.letterGreeting}`}>Dear Sarah,</p>
              <p className={styles.letterBody}>
                I&apos;ve been thinking about what happened and I keep coming back
                to how careless I was with your feelings. You deserved so much
                better from me in that moment, and I am truly sorry.
              </p>
              <p className={styles.letterBody}>
                You matter to me more than I sometimes show. I hope we can find
                our way back to each other.
              </p>
              <p className={`script ${styles.letterSign}`}>
                With love,
                <br />
                Jamie ✦
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className={`section ${styles.ctaSection}`}>
        <div className='container'>
          <div className={styles.ctaCard}>
            <Image
              src='/assets/flower-garland.svg'
              alt=''
              width={400}
              height={64}
              className={styles.ctaGarland}
            />
            <h2 className={styles.ctaTitle}>Ready to write?</h2>
            <p className={styles.ctaDesc}>
              Sometimes, one letter changes everything.
            </p>
            <Link href='/letter' className='btn btn-primary' id='cta-write-btn'>
              ✦ Write My Letter
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <p className={`script ${styles.footerScript}`}>Mektup</p>
        <p className={styles.footerTagline}>
          Heal with words · Bloom with flowers
        </p>
      </footer>
    </main>
  );
}
