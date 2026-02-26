import { getSupabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './letter-view.module.css';
import type { Metadata } from 'next';

/* ── Sticker & Paper Types ── */
interface Sticker {
    id: string;
    src: string;
    x: number;
    y: number;
    size: number;
    rotation: number;
}

interface Letter {
    slug: string;
    type: string;
    recipient: string;
    sender: string;
    body: string;
    stickers: Sticker[];
    paper_theme: string;
    font: string;
    created_at: string;
}

const PAPER_THEMES: Record<string, { bg: string; lines: string }> = {
    cream: { bg: '#fdfaf4', lines: '#e8e0d0' },
    aged: { bg: '#f5edd8', lines: '#d8c9a8' },
    white: { bg: '#fefefe', lines: '#ececec' },
    blush: { bg: '#fdf0f3', lines: '#f0cdd5' },
    sage: { bg: '#f0f4ef', lines: '#ccddc8' },
};

const FONTS: Record<string, string> = {
    cormorant: "'Cormorant Garamond', Georgia, serif",
    garamond: "'EB Garamond', Georgia, serif",
    crimson: "'Crimson Text', Georgia, serif",
};

/* ── Metadata ── */
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const { data } = await getSupabase()
        .from('letters')
        .select('recipient, type')
        .eq('slug', slug)
        .single();

    if (!data) return { title: 'A Letter | Mektup' };

    return {
        title: `A ${data.type} letter for ${data.recipient} | Mektup`,
        description: `Someone wrote a heartfelt ${data.type} letter just for ${data.recipient}.`,
        robots: { index: false },
    };
}

/* ── Page ── */
export default async function LetterViewPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const { data, error } = await getSupabase()
        .from('letters')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !data) notFound();

    const letter = data as Letter;
    const theme = PAPER_THEMES[letter.paper_theme] ?? PAPER_THEMES.cream;
    const fontFamily = FONTS[letter.font] ?? FONTS.cormorant;

    const paperStyle = {
        backgroundColor: theme.bg,
        backgroundImage: `
      repeating-linear-gradient(
        transparent,
        transparent 31px,
        ${theme.lines} 31px,
        ${theme.lines} 32px
      ),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")
    `,
    };

    const formattedDate = new Date(letter.created_at).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <main className={styles.main}>
            {/* Floating petals */}
            <div className={styles.petals} aria-hidden='true'>
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className={styles.petal}
                        style={{
                            left: `${(i * 12.5) % 100}%`,
                            animationDelay: `${i * 1.8}s`,
                            animationDuration: `${14 + (i % 4) * 3}s`,
                        }}
                    />
                ))}
            </div>

            <div className={styles.wrapper}>
                {/* Logo */}
                <div className={styles.logoRow}>
                    <Link href='/' className={`script ${styles.logo}`}>Mektup</Link>
                </div>

                {/* Recipient label */}
                <div className={styles.forLabel}>
                    <span className={styles.forIcon}>✉️</span>
                    <p className={`script ${styles.forText}`}>
                        A letter for <em>{letter.recipient}</em>
                    </p>
                </div>

                {/* Envelope + Letter */}
                <div className={styles.envelopeScene}>
                    {/* Flower accents */}
                    <div className={styles.flowerLeft} aria-hidden='true'>
                        <Image src='/assets/flower-branch-left.svg' alt='' width={120} height={240} />
                    </div>
                    <div className={styles.flowerRight} aria-hidden='true'>
                        <Image src='/assets/flower-branch-right.svg' alt='' width={120} height={240} />
                    </div>

                    {/* The Letter */}
                    <article
                        className={styles.letterPaper}
                        style={paperStyle}
                        aria-label={`Letter for ${letter.recipient}`}
                    >
                        <p className={`script ${styles.dateText}`}>{formattedDate}</p>
                        <p className={`script ${styles.greetingText}`}>Dear {letter.recipient},</p>

                        <div className={styles.letterBody}>
                            {letter.body.split('\n').map((line, i) =>
                                line ? (
                                    <p key={i} className={styles.bodyLine} style={{ fontFamily }}>
                                        {line}
                                    </p>
                                ) : (
                                    <br key={i} />
                                )
                            )}
                        </div>

                        {letter.sender && (
                            <p className={`script ${styles.signText}`}>
                                {letter.sender} ✦
                            </p>
                        )}

                        {/* Stickers */}
                        {letter.stickers?.map((s: Sticker) => (
                            <div
                                key={s.id}
                                style={{
                                    position: 'absolute',
                                    left: s.x,
                                    top: s.y,
                                    width: s.size,
                                    transform: `rotate(${s.rotation}deg)`,
                                    pointerEvents: 'none',
                                    userSelect: 'none',
                                }}
                            >
                                <Image src={s.src} alt='' width={s.size} height={s.size} />
                            </div>
                        ))}
                    </article>
                </div>

                {/* CTA Footer */}
                <div className={styles.ctaFooter}>
                    <div className={styles.dividerLine} />
                    <p className={styles.ctaText}>
                        Moved by this letter? Write one of your own.
                    </p>
                    <Link href='/letter' className='btn btn-primary' id='view-write-cta'>
                        ✦ Write a Letter
                    </Link>
                    <p className={styles.poweredBy}>
                        Made with <span style={{ color: 'var(--rose)' }}>♥</span> on{' '}
                        <Link href='/' className={styles.poweredLink}>mektup.app</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
