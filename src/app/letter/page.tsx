'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './letter.module.css';

const FLOWER_STICKERS = [
  { id: 'stamp', src: '/assets/flower-stamp.svg', label: 'Gül' },
  { id: 'garland-mini', src: '/assets/flower-garland.svg', label: 'Çelenk' },
];

const GUIDED_PROMPTS = [
  'Sana karşı haksız davrandım çünkü...',
  'O anda nasıl hissettirdiğimi düşününce...',
  'Seninle ilişkimi önemsiyorum çünkü...',
  'Değiştirmek istediğim şey...',
  'Umuyorum ki...',
];

interface Sticker {
  id: string;
  src: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

export default function LetterPage() {
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [letterText, setLetterText] = useState('');
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showPrompts, setShowPrompts] = useState(false);
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const letterRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const today = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Add a sticker to letter
  const addSticker = (src: string) => {
    const newSticker: Sticker = {
      id: Date.now().toString(),
      src,
      x: 60 + Math.random() * 200,
      y: 60 + Math.random() * 200,
      size: src.includes('garland') ? 180 : 64,
      rotation: -15 + Math.random() * 30,
    };
    setStickers((prev) => [...prev, newSticker]);
  };

  // Remove sticker
  const removeSticker = (id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
  };

  // Drag handling
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
      prev.map((s) => (s.id === draggingId ? { ...s, x, y } : s)),
    );
  };

  const handleMouseUp = () => setDraggingId(null);

  // Insert prompt into textarea
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
    setShowPrompts(false);
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = ta.selectionEnd = pos + prompt.length + 2;
    }, 0);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className={styles.main}>
      {/* NAV */}
      <nav className={styles.nav}>
        <div className={`container ${styles.navInner}`}>
          <Link href='/' className={`script ${styles.logo}`}>
            ← Mektup
          </Link>
          <div className={styles.navRight}>
            <button
              className='btn btn-outline'
              onClick={handlePrint}
              id='print-btn'
            >
              ⎙ Yazdır
            </button>
          </div>
        </div>
      </nav>

      <div className={`container ${styles.editor}`}>
        {/* ── LEFT PANEL: Controls ── */}
        <aside className={styles.sidebar}>
          <div className={`paper-card ${styles.sideCard}`}>
            <h3 className={`serif ${styles.sideTitle}`}>Mektup Bilgileri</h3>

            <label className={styles.label} htmlFor='recipient'>
              Kime yazıyorsun?
            </label>
            <input
              id='recipient'
              type='text'
              placeholder='Adı veya unvanı...'
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className={styles.input}
            />

            <label className={styles.label} htmlFor='sender'>
              İmzan
            </label>
            <input
              id='sender'
              type='text'
              placeholder='Senin adın...'
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Guided prompts */}
          <div className={`paper-card ${styles.sideCard}`}>
            <h3 className={`serif ${styles.sideTitle}`}>İlham Cümleleri</h3>
            <p className={styles.sideDesc}>
              Nereden başlayacağını bilmiyorsan, bir cümleyle başla:
            </p>
            <div className={styles.prompts}>
              {GUIDED_PROMPTS.map((p) => (
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

          {/* Sticker panel */}
          <div className={`paper-card ${styles.sideCard}`}>
            <h3 className={`serif ${styles.sideTitle}`}>Çiçek Stickerleri</h3>
            <p className={styles.sideDesc}>
              Ekle, sürükle, istediğin yere koy:
            </p>
            <div className={styles.stickerPicker}>
              {FLOWER_STICKERS.map((f) => (
                <button
                  key={f.id}
                  className={styles.stickerChoiceBtn}
                  onClick={() => addSticker(f.src)}
                  title={`${f.label} ekle`}
                >
                  <Image src={f.src} alt={f.label} width={48} height={48} />
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
              ✍ Yaz
            </button>
            <button
              className={`${styles.tab} ${tab === 'preview' ? styles.tabActive : ''}`}
              onClick={() => setTab('preview')}
              id='tab-preview'
            >
              👁 Önizle
            </button>
          </div>

          {/* WRITE TAB */}
          {tab === 'write' && (
            <div className={styles.writeContainer}>
              {/* Floral accents */}
              <div className={styles.floralTopRight} aria-hidden='true'>
                <Image
                  src='/assets/flower-branch-right.svg'
                  alt=''
                  width={100}
                  height={200}
                />
              </div>

              <div
                className={`letter-paper ${styles.letterPaper}`}
                ref={letterRef}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                <p className={`script ${styles.dateText}`}>{today}</p>
                <p className={`script ${styles.greetingText}`}>
                  {recipientName ? `Sevgili ${recipientName},` : 'Sevgili ___,'}
                </p>

                <textarea
                  ref={textareaRef}
                  className={`${styles.textarea} serif`}
                  placeholder='Mektubunu buraya yaz... Her sözcük önemli.'
                  value={letterText}
                  onChange={(e) => setLetterText(e.target.value)}
                  id='letter-textarea'
                />

                <p className={`script ${styles.signText}`}>
                  {senderName ? `${senderName} ✦` : '... ✦'}
                </p>

                {/* Draggable stickers */}
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
                      title='Kaldır'
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PREVIEW TAB */}
          {tab === 'preview' && (
            <div
              className={`letter-paper ${styles.previewPaper}`}
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
                {recipientName ? `Sevgili ${recipientName},` : 'Sevgili ___,'}
              </p>

              <div className={styles.previewBody}>
                {letterText ? (
                  letterText.split('\n').map((line, i) =>
                    line ? (
                      <p key={i} className={`serif ${styles.previewLine}`}>
                        {line}
                      </p>
                    ) : (
                      <br key={i} />
                    ),
                  )
                ) : (
                  <p className={styles.emptyHint}>Henüz mektup yazılmamış...</p>
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
    </main>
  );
}
