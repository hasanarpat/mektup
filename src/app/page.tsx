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
              ✦ Mektup Yaz
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
            Sözcükler bazen yetmez...
          </p>

          <h1 className={`animate-fade-up delay-2 ${styles.heroTitle}`}>
            Kalbinden gelen
            <br />
            <em>özür mektubu</em>
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
            Bazen bir özür, bir sarılmadan daha güçlüdür. Duygularını en güzel
            sözcüklerle, çiçeklerle süslenmiş bir kâğıda dök.
          </p>

          <div className={`animate-fade-up delay-4 ${styles.heroCta}`}>
            <Link
              href='/letter'
              className='btn btn-primary'
              id='hero-write-btn'
            >
              ✦ Şimdi Yaz
            </Link>
            <a href='#nasil' className='btn btn-outline' id='hero-learn-btn'>
              Nasıl çalışır?
            </a>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id='nasil' className={`section ${styles.howSection}`}>
        <div className='container'>
          <div className={`divider ${styles.sectionDivider}`}>
            çiçekli adımlar
          </div>
          <h2 className={`animate-fade-up ${styles.sectionTitle}`}>
            Üç adımda mektubun hazır
          </h2>

          <div className={styles.steps}>
            {[
              {
                icon: '✦',
                step: '01',
                title: 'Hissettiklerini yaz',
                desc: 'Boş kâğıt korkusu yok. Sana yol gösterecek nazik sorularla başla — her sözcük senin.',
              },
              {
                icon: '❀',
                step: '02',
                title: 'Çiçeklerle süsle',
                desc: 'Mektubuna romantik çiçek illüstrasyonları ekle, yerlerini istediğin gibi ayarla.',
              },
              {
                icon: '✉',
                step: '03',
                title: 'Paylaş veya yazdır',
                desc: 'Mektubunu dijital olarak gönder ya da gerçek kâğıda yazdır — seçim sende.',
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
          <div className={`divider ${styles.sectionDivider}`}>örnek mektup</div>
          <h2 className={`${styles.sectionTitle}`}>Böyle görünüyor</h2>

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
              <p className={`script ${styles.letterDate}`}>25 Şubat 2026</p>
              <p className={`script ${styles.letterGreeting}`}>Sevgili Ayşe,</p>
              <p className={styles.letterBody}>
                Dün yaşanan o anı defalarca düşündüm. Sana karşı haksız
                davrandım ve bunu çok iyi biliyorum. Söylediklerim seni
                incitmişse — ve kesinlikle incitmiştir — bunun için içtenlikle
                özür dilerim.
              </p>
              <p className={styles.letterBody}>
                Senin için önemliyim ve bu ilişkimizi kaybetmek istemiyorum.
                Umarım bağışlamanın bir yolunu bulabiliriz.
              </p>
              <p className={`script ${styles.letterSign}`}>
                Sevgiyle,
                <br />
                Leyla ✦
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
            <h2 className={styles.ctaTitle}>Hazır mısın?</h2>
            <p className={styles.ctaDesc}>
              Belki tek bir mektup her şeyi değiştirir.
            </p>
            <Link href='/letter' className='btn btn-primary' id='cta-write-btn'>
              ✦ Mektubumu Yaz
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <p className={`script ${styles.footerScript}`}>Mektup</p>
        <p className={styles.footerTagline}>
          Sözcüklerle iyileştir · Çiçeklerle süsle
        </p>
      </footer>
    </main>
  );
}
