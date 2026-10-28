import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

const TARGET = new Date('2027-04-06T00:00:00+01:00').getTime();

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [
    { label: 'Days', value: Math.floor(s / 86400) },
    { label: 'Hrs', value: Math.floor((s % 86400) / 3600) },
    { label: 'Min', value: Math.floor((s % 3600) / 60) },
    { label: 'Sec', value: s % 60 },
  ];
}

export default function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = now === null ? null : parts(TARGET - now);

  return (
    <div role="timer" aria-label="Time until Making Tax Digital starts for April 2027 starters">
      <dl className="grid grid-cols-4 gap-2">
        {(units ?? parts(0)).map((u) => (
          <div key={u.label} className="rounded-2xl border border-plaster/10 bg-plaster/5 px-2 py-3 text-center">
            <dd className="relative h-9 overflow-hidden font-mono text-2xl leading-9 sm:text-3xl font-medium tabular-nums tracking-tighter text-lime">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={units ? u.value : 'blank'}
                  className="block"
                  initial={reduce ? false : { y: '-100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduce ? undefined : { y: '100%', opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                >
                  {units ? String(u.value).padStart(u.label === 'Days' ? 3 : 2, '0') : '––'}
                </motion.span>
              </AnimatePresence>
            </dd>
            <dt className="mt-1 font-mono text-[0.65rem] tracking-[0.18em] text-plaster/60 uppercase">{u.label}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}
