'use client';

import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion';
import { useRef } from 'react';

const ease = [0.22, 1, 0.36, 1] as const;

const poseVariants: Variants = {
  messy: { rotate: -3.5, x: -7, y: 8, opacity: 0.94 },
  transitioning: { rotate: -1.5, x: -3, y: 3, opacity: 1 },
  clear: { rotate: 0, x: 0, y: 0, opacity: 1 },
};

const clutterVariants: Variants = {
  messy: { opacity: 0.78, scale: 1, filter: 'blur(0.7px)' },
  transitioning: { opacity: 0.35, scale: 0.9, filter: 'blur(1px)' },
  clear: { opacity: 0, scale: 0.76, filter: 'blur(2px)' },
};

const cardVariants: Variants = {
  messy: { opacity: 0, y: 18, x: 8, scale: 0.94 },
  transitioning: { opacity: 0.45, y: 8, x: 3, scale: 0.98 },
  clear: { opacity: 1, y: 0, x: 0, scale: 1 },
};

export function ChaosToClarityVisual() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.45 });
  const reducedMotion = useReducedMotion();
  const state = reducedMotion ? 'clear' : inView ? 'clear' : 'messy';
  const duration = reducedMotion ? 0 : 1.55;

  return (
    <div ref={root} className="ctc" aria-label="From scattered to sorted: a person and workspace becoming organized">
      <div className="ctc-copy">
        <span>From scattered to sorted.</span>
        <small>Turn noise into a clear next move.</small>
      </div>

      <div className="ctc-stage">
        <motion.div
          className="ctc-glow"
          initial={false}
          animate={state}
          variants={{
            messy: { opacity: 0.3, scale: 0.86, filter: 'blur(18px)' },
            transitioning: { opacity: 0.55, scale: 0.95, filter: 'blur(13px)' },
            clear: { opacity: 0.88, scale: 1, filter: 'blur(9px)' },
          }}
          transition={{ duration, ease }}
        />

        <div className="ctc-fallback" aria-hidden="true">✦</div>

        <motion.svg
          className="ctc-person"
          viewBox="0 0 420 520"
          role="img"
          aria-label="A composed person becoming organized"
          initial={reducedMotion ? 'clear' : 'messy'}
          animate={state}
          variants={poseVariants}
          transition={{ duration, delay: reducedMotion ? 0 : 0.08, ease }}
        >
          <defs>
            <linearGradient id="jacket" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#76577d" />
              <stop offset="1" stopColor="#563c60" />
            </linearGradient>
            <linearGradient id="shirt" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fffdf9" />
              <stop offset="1" stopColor="#eee6dd" />
            </linearGradient>
          </defs>

          <motion.g className="ctc-person-base">
            <ellipse cx="211" cy="478" rx="132" ry="18" fill="#6b4e71" opacity="0.1" />
            <path d="M106 486c5-113 38-164 105-164 68 0 102 51 108 164Z" fill="url(#jacket)" />
            <path d="M155 342c18-16 36-24 56-24 21 0 42 8 60 24l-30 109h-61Z" fill="url(#shirt)" />
            <path d="m156 345 36 30-28 35-26-60Zm111 0-36 30 28 35 27-60Z" fill="#f7f0e8" />
            <rect x="194" y="286" width="35" height="51" rx="15" fill="#d7a489" />
            <ellipse cx="211" cy="224" rx="70" ry="86" fill="#dfae92" />
            <path d="M171 233c7 7 15 7 22 0M228 233c7 7 15 7 22 0" fill="none" stroke="#5d4541" strokeWidth="3" strokeLinecap="round" />
            <path d="M202 262c7 6 15 6 22 0" fill="none" stroke="#9b5f61" strokeWidth="3" strokeLinecap="round" />
            <path d="M212 237c-2 8-3 13 3 15" fill="none" stroke="#bd826f" strokeWidth="2.5" strokeLinecap="round" />
          </motion.g>

          <motion.g
            className="ctc-hair"
            variants={{
              messy: { rotate: -4, x: -7, y: 2 },
              transitioning: { rotate: -1.5, x: -2, y: 1 },
              clear: { rotate: 0, x: 0, y: 0 },
            }}
            transition={{ duration: duration * 0.9, ease }}
            style={{ transformOrigin: '211px 188px' }}
          >
            <path d="M144 223c-7-60 17-112 68-113 53-1 83 41 70 113-10-18-16-33-15-52-28 19-71 25-105 10-1 19-7 31-18 42Z" fill="#41353e" />
            <path d="M156 173c-16 30-16 81-7 123-20-18-25-58-16-92 7-27 12-38 23-49Z" fill="#41353e" />
            <motion.path
              d="M267 163c21 19 28 50 19 84-4-23-13-39-28-49Z"
              fill="#41353e"
              variants={{ messy: { rotate: 10, x: 6 }, clear: { rotate: 0, x: 0 } }}
              style={{ transformOrigin: '270px 176px' }}
            />
            <motion.path
              d="M172 124c-15 4-27 16-32 30 14-5 27-4 39 3Z"
              fill="#41353e"
              variants={{ messy: { rotate: -14, x: -5, y: -4 }, clear: { rotate: 0, x: 0, y: 0 } }}
              style={{ transformOrigin: '170px 145px' }}
            />
          </motion.g>

          <motion.g
            className="ctc-collar"
            variants={{ messy: { rotate: -4, x: -4 }, clear: { rotate: 0, x: 0 } }}
            transition={{ duration: duration * 0.82, delay: reducedMotion ? 0 : 0.15, ease }}
            style={{ transformOrigin: '211px 358px' }}
          >
            <path d="m194 347 17 18-13 80-17-20 17-60Z" fill="#e8896a" />
            <path d="m211 365 16-18 13 78-17 20-12-80Z" fill="#cf6f55" />
            <circle cx="211" cy="363" r="9" fill="#d97b60" />
          </motion.g>
        </motion.svg>

        <motion.div className="ctc-clutter" initial={reducedMotion ? 'clear' : 'messy'} animate={state} variants={clutterVariants} transition={{ duration: duration * 0.75, ease }} aria-hidden="true">
          <motion.span className="ctc-note note-one" animate={state === 'messy' && !reducedMotion ? { y: [0, -5, 0], rotate: [-5, -3, -5] } : { y: 6, rotate: 0 }} transition={{ duration: state === 'messy' ? 4.5 : 0.8, repeat: state === 'messy' ? Infinity : 0 }}>later / maybe</motion.span>
          <motion.span className="ctc-note note-two" animate={state === 'messy' && !reducedMotion ? { y: [0, 4, 0], rotate: [4, 2, 4] } : { y: 8, rotate: 0 }} transition={{ duration: state === 'messy' ? 5.2 : 0.8, repeat: state === 'messy' ? Infinity : 0 }}>7 unread</motion.span>
          <span className="ctc-task task-one"><i /> follow up</span>
          <span className="ctc-line line-one" />
          <span className="ctc-line line-two" />
          <span className="ctc-dot dot-one" />
          <span className="ctc-dot dot-two" />
        </motion.div>

        <motion.div className="ctc-results" initial={reducedMotion ? 'clear' : 'messy'} animate={state} variants={cardVariants} transition={{ duration: duration * 0.72, delay: reducedMotion ? 0 : 0.55, ease }}>
          <motion.div className="ctc-result-card result-focus" animate={!reducedMotion && state === 'clear' ? { y: [0, -3, 0] } : { y: 0 }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}>
            <span>Today’s focus</span><b>Finish the first draft</b><i><em /></i>
          </motion.div>
          <motion.div className="ctc-result-card result-week" animate={!reducedMotion && state === 'clear' ? { y: [0, 3, 0] } : { y: 0 }} transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut' }}>
            <span>This week</span><b>4 of 5 clear</b><div>✓ ✓ ✓ ✓ ○</div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
