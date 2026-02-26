'use client';

import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import styles from './letter.module.css';

/* ────────────── CONSTANTS ────────────── */

const LETTER_TYPES = [
  { id: 'apology', icon: '🙏', label: 'Apology', color: '#c8788a' },
  { id: 'love', icon: '💌', label: 'Love', color: '#d4688a' },
  { id: 'thank-you', icon: '🌸', label: 'Thank You', color: '#7ba05b' },
  { id: 'birthday', icon: '🎂', label: 'Birthday', color: '#c4a267' },
  { id: 'sympathy', icon: '🕊️', label: 'Sympathy', color: '#9b8ab4' },
  { id: 'pen-pal', icon: '✉️', label: 'Pen Pal', color: '#7a9fb0' },
  { id: 'custom', icon: '✦', label: 'Custom', color: '#9a8f7e' },
];

const GUIDED_PROMPTS: Record<string, string[]> = {
  apology: [
    'I know I hurt you when I...',
    'What you must have felt in that moment...',
    'Our relationship matters to me because...',
    'What I want to change going forward is...',
    'I hope that one day...',
  ],
  love: [
    'The first time I realized I loved you was...',
    'You make ordinary moments feel like...',
    'What I admire most about you is...',
    'When I think about our future, I see...',
    'Words feel small, but I want you to know...',
  ],
  'thank-you': [
    'What you did for me meant more than you know because...',
    'At that moment, I felt...',
    'Your kindness showed me that...',
    'I want you to know the difference you made...',
    'I hope I can one day return that same...',
  ],
  birthday: [
    'A year older, a year more...',
    'My favorite memory of us this year is...',
    'What I wish for you on this birthday is...',
    'You\'ve grown so much in ways like...',
    'Here\'s to another year of...',
  ],
  sympathy: [
    'There are no words that truly...',
    'I remember them as someone who...',
    'Please know that you are not alone in...',
    'Whenever you need to talk or simply...',
    'I am holding you in my heart during...',
  ],
  'pen-pal': [
    'Where I\'m writing from today is...',
    'Something small but delightful that happened recently...',
    'A book / song / place I\'ve been thinking about...',
    'A question I\'ve been sitting with lately...',
    'Until your next letter finds me...',
  ],
  custom: [
    'I\'ve been meaning to tell you...',
    'Something I\'ve never said out loud...',
    'What you mean to me is...',
    'I want you to know that...',
    'My hope for you is...',
  ],
};

const PAPER_THEMES = [
  { id: 'cream', label: 'Cream', bg: '#fdfaf4', lines: '#e8e0d0' },
  { id: 'aged', label: 'Aged', bg: '#f5edd8', lines: '#d8c9a8' },
  { id: 'white', label: 'White', bg: '#fefefe', lines: '#ececec' },
  { id: 'blush', label: 'Blush', bg: '#fdf0f3', lines: '#f0cdd5' },
  { id: 'sage', label: 'Sage', bg: '#f0f4ef', lines: '#ccddc8' },
];

const FONTS = [
  { id: 'cormorant', label: 'Cormorant', style: "'Cormorant Garamond', Georgia, serif" },
  { id: 'garamond', label: 'EB Garamond', style: "'EB Garamond', Georgia, serif" },
  { id: 'crimson', label: 'Crimson', style: "'Crimson Text', Georgia, serif" },
];

const FLOWER_STICKERS = [
  { id: 'stamp', src: '/assets/flower-stamp.svg', label: 'Rose' },
  { id: 'garland', src: '/assets/flower-garland.svg', label: 'Garland' },
  { id: 'branch-l', src: '/assets/flower-branch-left.svg', label: 'Branch' },
  { id: 'branch-r', src: '/assets/flower-branch-right.svg', label: 'Sprig' },
];

const AUTOSAVE_KEY = 'mektup_draft';
const AI_USES_KEY = 'mektup_ai_uses';
const MAX_FREE_AI = 3;

/* ────────────── TYPES ────────────── */

interface Sticker {
  id: string;
  src: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

/* ────────────── WORD COUNT ────────────── */
function countWords(text: string) {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

/* ────────────── MAIN COMPONENT (inner) ────────────── */

function LetterEditor() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') ?? 'apology';

  const [letterType, setLetterType] = useState(
    LETTER_TYPES.find((t) => t.id === initialType) ?? LETTER_TYPES[0]
  );
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [letterText, setLetterText] = useState('');
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [paperTheme, setPaperTheme] = useState(PAPER_THEMES[0]);
  const [font, setFont] = useState(FONTS[0]);
  const [draftSaved, setDraftSaved] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiUsesLeft, setAiUsesLeft] = useState(MAX_FREE_AI);
  const [shareModal, setShareModal] = useState(false);
  const [shareSlug, setShareSlug] = useState<string | null>(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const letterRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const today = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  /* ── Restore draft from localStorage ── */
  useEffect(() => {
    const saved = localStorage.getItem(AUTOSAVE_KEY);
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.recipient) setRecipientName(d.recipient);
        if (d.sender) setSenderName(d.sender);
        if (d.text) setLetterText(d.text);
        if (d.stickers) setStickers(d.stickers);
        if (d.paperTheme) setPaperTheme(PAPER_THEMES.find((p) => p.id === d.paperTheme) ?? PAPER_THEMES[0]);
        if (d.font) setFont(FONTS.find((f) => f.id === d.font) ?? FONTS[0]);
        if (d.type) setLetterType(LETTER_TYPES.find((t) => t.id === d.type) ?? LETTER_TYPES[0]);
      } catch { /* ignore */ }
    }
    const uses = parseInt(localStorage.getItem(AI_USES_KEY) ?? `${MAX_FREE_AI}`, 10);
    setAiUsesLeft(isNaN(uses) ? MAX_FREE_AI : uses);
  }, []);

  /* ── Autosave ── */
  const triggerAutosave = useCallback(() => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      localStorage.setItem(
        AUTOSAVE_KEY,
        JSON.stringify({
          recipient: recipientName,
          sender: senderName,
          text: letterText,
          stickers,
          paperTheme: paperTheme.id,
          font: font.id,
          type: letterType.id,
        })
      );
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    }, 1500);
  }, [recipientName, senderName, letterText, stickers, paperTheme, font, letterType]);

  useEffect(() => {
    triggerAutosave();
  }, [triggerAutosave]);

  /* ── Sticker operations ── */
  const addSticker = (src: string) => {
    const newSticker: Sticker = {
      id: Date.now().toString(),
      src,
      x: 60 + Math.random() * 200,
      y: 60 + Math.random() * 200,
      size: src.includes('garland') || src.includes('branch') ? 140 : 64,
      rotation: -15 + Math.random() * 30,
    };
    setStickers((prev) => [...prev, newSticker]);
  };

  const removeSticker = (id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
  };

  const handleStickerMouseDown = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDraggingId(id);
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !letterRef.current) return;
    const containerRect = letterRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left - dragOffset.x;
    const y = e.clientY - containerRect.top - dragOffset.y;
    setStickers((prev) =>
      prev.map((s) => (s.id === draggingId ? { ...s, x, y } : s))
    );
  };

  const handleMouseUp = () => setDraggingId(null);

  /* ── Insert prompt ── */
  const insertPrompt = (prompt: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const newText =
      letterText.slice(0, pos) +
      (pos > 0 && letterText[pos - 1] !== '\n' ? '\n\n' : '') +
      prompt +
      ' ' +
      letterText.slice(pos);
    setLetterText(newText);
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = ta.selectionEnd = pos + prompt.length + 2;
    }, 0);
  };

  /* ── AI Polish ── */
  const handleAiPolish = async () => {
    if (!letterText.trim()) return;
    if (aiUsesLeft <= 0) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: letterText,
          type: letterType.label,
          recipient: recipientName || 'someone',
        }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      if (data.polished) {
        setLetterText(data.polished);
        const newUses = Math.max(0, aiUsesLeft - 1);
        setAiUsesLeft(newUses);
        localStorage.setItem(AI_USES_KEY, String(newUses));
      }
    } catch {
      // silently fail
    } finally {
      setAiLoading(false);
    }
  };

  /* ── Save & Share ── */
  const handleSaveAndShare = async () => {
    if (!letterText.trim() || !recipientName.trim()) return;
    setShareLoading(true);
    try {
      const res = await fetch('/api/letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: letterType.id,
          recipient: recipientName,
          sender: senderName,
          body: letterText,
          stickers,
          paper_theme: paperTheme.id,
          font: font.id,
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      const data = await res.json();
      setShareSlug(data.slug);
      setShareModal(true);
    } catch {
      alert('Could not save your letter. Please try again.');
    } finally {
      setShareLoading(false);
    }
  };

  const shareUrl = shareSlug
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/l/${shareSlug}`
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => window.print();

  /* ── Paper style ── */
  const paperStyle = {
    backgroundColor: paperTheme.bg,
    backgroundImage: `
      repeating-linear-gradient(
        transparent,
        transparent 31px,
        ${paperTheme.lines} 31px,
        ${paperTheme.lines} 32px
      ),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")
    `,
  };

  const wordCount = countWords(letterText);
  const prompts = GUIDED_PROMPTS[letterType.id] ?? GUIDED_PROMPTS.custom;

  return (
    <main className={styles.main}>
      {/* NAV */}
      <nav className={styles.nav}>
        <div className={`container ${styles.navInner}`}>
          <Link href='/' className={`script ${styles.logo}`}>
            ← Mektup
          </Link>
          <div className={styles.navRight}>
            {draftSaved && (
              <span className={styles.draftBadge}>✓ Draft saved</span>
            )}
            <button
              className='btn btn-outline'
              onClick={handlePrint}
              id='print-btn'
            >
              ⎙ Print
            </button>
            <button
              className='btn btn-primary'
              onClick={handleSaveAndShare}
              disabled={shareLoading || !letterText.trim() || !recipientName.trim()}
              id='save-share-btn'
            >
              {shareLoading ? '...' : '✦ Save & Share'}
            </button>
          </div>
        </div>
      </nav>

      <div className={`container ${styles.editor}`}>
        {/* ── LEFT PANEL ── */}
        <aside className={styles.sidebar}>

          {/* Letter Type */}
          <div className={`paper-card ${styles.sideCard}`}>
            <h3 className={`serif ${styles.sideTitle}`}>Letter Type</h3>
            <div className={styles.typeGrid}>
              {LETTER_TYPES.map((t) => (
                <button
                  key={t.id}
                  className={`${styles.typeBtn} ${letterType.id === t.id ? styles.typeBtnActive : ''}`}
                  onClick={() => setLetterType(t)}
                  style={letterType.id === t.id ? { borderColor: t.color, color: t.color } : {}}
                  title={t.label}
                >
                  <span>{t.icon}</span>
                  <span className={styles.typeBtnLabel}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Letter Info */}
          <div className={`paper-card ${styles.sideCard}`}>
            <h3 className={`serif ${styles.sideTitle}`}>Letter Details</h3>

            <label className={styles.label} htmlFor='recipient'>
              Who are you writing to?
            </label>
            <input
              id='recipient'
              type='text'
              placeholder='Their name...'
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className={styles.input}
            />

            <label className={styles.label} htmlFor='sender'>
              Your signature
            </label>
            <input
              id='sender'
              type='text'
              placeholder='Your name...'
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Guided Prompts */}
          <div className={`paper-card ${styles.sideCard}`}>
            <h3 className={`serif ${styles.sideTitle}`}>Writing Prompts</h3>
            <p className={styles.sideDesc}>
              Don't know where to start? Click a line:
            </p>
            <div className={styles.prompts}>
              {prompts.map((p) => (
                <button
                  key={p}
                  className={styles.promptBtn}
                  onClick={() => insertPrompt(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Paper Theme */}
          <div className={`paper-card ${styles.sideCard}`}>
            <h3 className={`serif ${styles.sideTitle}`}>Paper</h3>
            <div className={styles.themeRow}>
              {PAPER_THEMES.map((t) => (
                <button
                  key={t.id}
                  className={`${styles.themeSwatch} ${paperTheme.id === t.id ? styles.themeSwatchActive : ''}`}
                  style={{ backgroundColor: t.bg, borderColor: t.lines }}
                  onClick={() => setPaperTheme(t)}
                  title={t.label}
                />
              ))}
            </div>
          </div>

          {/* Font Selector */}
          <div className={`paper-card ${styles.sideCard}`}>
            <h3 className={`serif ${styles.sideTitle}`}>Font</h3>
            <div className={styles.fontRow}>
              {FONTS.map((f) => (
                <button
                  key={f.id}
                  className={`${styles.fontBtn} ${font.id === f.id ? styles.fontBtnActive : ''}`}
                  style={{ fontFamily: f.style }}
                  onClick={() => setFont(f)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sticker Panel */}
          <div className={`paper-card ${styles.sideCard}`}>
            <h3 className={`serif ${styles.sideTitle}`}>Flower Stickers</h3>
            <p className={styles.sideDesc}>Add & drag anywhere on the letter:</p>
            <div className={styles.stickerPicker}>
              {FLOWER_STICKERS.map((f) => (
                <button
                  key={f.id}
                  className={styles.stickerChoiceBtn}
                  onClick={() => addSticker(f.src)}
                  title={`Add ${f.label}`}
                >
                  <Image src={f.src} alt={f.label} width={40} height={40} />
                  <span>{f.label}</span>
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* ── RIGHT: Letter area ── */}
        <div className={styles.letterArea}>
          {/* Tab switcher */}
          <div className={styles.tabBar}>
            <button
              className={`${styles.tab} ${tab === 'write' ? styles.tabActive : ''}`}
              onClick={() => setTab('write')}
              id='tab-write'
            >
              ✍ Write
            </button>
            <button
              className={`${styles.tab} ${tab === 'preview' ? styles.tabActive : ''}`}
              onClick={() => setTab('preview')}
              id='tab-preview'
            >
              👁 Preview
            </button>
          </div>

          {/* WRITE TAB */}
          {tab === 'write' && (
            <div className={styles.writeContainer}>
              <div className={styles.floralTopRight} aria-hidden='true'>
                <Image
                  src='/assets/flower-branch-right.svg'
                  alt=''
                  width={100}
                  height={200}
                />
              </div>

              <div
                className={`${styles.letterPaper}`}
                style={paperStyle}
                ref={letterRef}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                <p className={`script ${styles.dateText}`}>{today}</p>
                <p className={`script ${styles.greetingText}`}>
                  {recipientName ? `Dear ${recipientName},` : 'Dear ___,'}
                </p>

                <textarea
                  ref={textareaRef}
                  className={styles.textarea}
                  style={{ fontFamily: font.style }}
                  placeholder='Write your letter here... every word matters.'
                  value={letterText}
                  onChange={(e) => setLetterText(e.target.value)}
                  id='letter-textarea'
                />

                <p className={`script ${styles.signText}`}>
                  {senderName ? `${senderName} ✦` : '... ✦'}
                </p>

                {stickers.map((s) => (
                  <div
                    key={s.id}
                    className={styles.stickerOnLetter}
                    style={{
                      left: s.x,
                      top: s.y,
                      width: s.size,
                      transform: `rotate(${s.rotation}deg)`,
                      cursor: draggingId === s.id ? 'grabbing' : 'grab',
                    }}
                    onMouseDown={(e) => handleStickerMouseDown(e, s.id)}
                  >
                    <Image src={s.src} alt='' width={s.size} height={s.size} />
                    <button
                      className={styles.stickerRemoveBtn}
                      onClick={() => removeSticker(s.id)}
                      title='Remove'
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* AI Polish + word count toolbar */}
              <div className={styles.editorToolbar}>
                <span className={styles.wordCount}>
                  {wordCount} {wordCount === 1 ? 'word' : 'words'}
                </span>
                <button
                  className={styles.aiBtn}
                  onClick={handleAiPolish}
                  disabled={aiLoading || aiUsesLeft <= 0 || !letterText.trim()}
                  title={aiUsesLeft <= 0 ? 'No free AI uses left' : `${aiUsesLeft} uses remaining`}
                  id='ai-polish-btn'
                >
                  {aiLoading ? '✨ Polishing...' : `✨ Polish with AI (${aiUsesLeft} left)`}
                </button>
              </div>
            </div>
          )}

          {/* PREVIEW TAB */}
          {tab === 'preview' && (
            <div
              className={styles.previewPaper}
              style={paperStyle}
              id='letter-preview'
            >
              <div className={styles.previewFlowerCorner} aria-hidden='true'>
                <Image
                  src='/assets/flower-branch-left.svg'
                  alt=''
                  width={80}
                  height={160}
                />
              </div>

              <p className={`script ${styles.dateText}`}>{today}</p>
              <p className={`script ${styles.greetingText}`}>
                {recipientName ? `Dear ${recipientName},` : 'Dear ___,'}
              </p>

              <div className={styles.previewBody}>
                {letterText ? (
                  letterText.split('\n').map((line, i) =>
                    line ? (
                      <p key={i} className={styles.previewLine} style={{ fontFamily: font.style }}>
                        {line}
                      </p>
                    ) : (
                      <br key={i} />
                    )
                  )
                ) : (
                  <p className={styles.emptyHint}>Nothing written yet...</p>
                )}
              </div>

              <p className={`script ${styles.signText}`}>
                {senderName ? `${senderName} ✦` : '... ✦'}
              </p>

              {stickers.map((s) => (
                <div
                  key={s.id}
                  className={styles.stickerOnLetter}
                  style={{
                    left: s.x,
                    top: s.y,
                    width: s.size,
                    transform: `rotate(${s.rotation}deg)`,
                    pointerEvents: 'none',
                  }}
                >
                  <Image src={s.src} alt='' width={s.size} height={s.size} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── SHARE MODAL ── */}
      {shareModal && (
        <div className={styles.modalOverlay} onClick={() => setShareModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShareModal(false)}>×</button>
            <div className={styles.modalIcon}>✉️</div>
            <h2 className={`serif ${styles.modalTitle}`}>Your letter is ready</h2>
            <p className={styles.modalDesc}>
              Share this private link with {recipientName || 'your recipient'}.
              Only people with this link can read it.
            </p>
            <div className={styles.urlRow}>
              <input
                className={styles.urlInput}
                value={shareUrl}
                readOnly
                id='share-url-input'
              />
              <button className='btn btn-primary' onClick={handleCopy} id='copy-link-btn'>
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
            <div className={styles.shareButtons}>
              <a
                href={`https://wa.me/?text=${encodeURIComponent('I wrote you something: ' + shareUrl)}`}
                target='_blank'
                rel='noopener noreferrer'
                className={`btn btn-outline ${styles.shareBtn}`}
                id='share-whatsapp-btn'
              >
                💬 WhatsApp
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent('A letter for you')}&body=${encodeURIComponent('I wrote you something: ' + shareUrl)}`}
                className={`btn btn-outline ${styles.shareBtn}`}
                id='share-email-btn'
              >
                ✉️ Email
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ────────────── WRAPPER (Suspense for useSearchParams) ────────────── */
export default function LetterPage() {
  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', fontFamily: 'serif' }}>Loading editor...</div>}>
      <LetterEditor />
    </Suspense>
  );
}
