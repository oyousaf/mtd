import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useId, useState } from 'react';

const fmt = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });

function verdict(income: number) {
  if (income > 50000) return { when: '6 April 2026', note: 'MTD already applies if your 2024–25 qualifying income was over £50,000.', tone: 'now' as const };
  if (income > 30000) return { when: '6 April 2027', note: 'Based on your 2025–26 tax return. Enrol now for £20 and pay nothing monthly until April 2027.', tone: 'soon' as const };
  if (income > 20000) return { when: '6 April 2028', note: 'Based on your 2026–27 tax return. Getting digital early makes the switch painless.', tone: 'later' as const };
  return { when: 'Not yet', note: 'MTD isn’t planned for qualifying income of £20,000 or less, but digital records still save time at year end.', tone: 'none' as const };
}

const tones = {
  now: 'bg-orange text-ink',
  soon: 'bg-lime text-ink',
  later: 'bg-blueprint text-white',
  none: 'bg-surface-2 text-fg',
};

export default function MtdChecker() {
  const id = useId();
  const [income, setIncome] = useState(42000);
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const v = verdict(income);
  const pct = ((income - 5000) / 75000) * 100;

  return (
    <div className="card grid gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:p-10">
      <div>
        <p className="font-mono text-xs tracking-[0.18em] text-muted uppercase">Does MTD apply to me?</p>
        <label htmlFor={id} className="mt-3 block font-display text-2xl font-bold">
          Your yearly qualifying income
        </label>
        <p className="mt-1 text-sm text-muted">Gross self-employment and property income, before expenses and CIS deductions.</p>
        <output htmlFor={id} className="mono-num mt-6 block text-5xl font-medium sm:text-6xl">
          {fmt.format(income)}
          {income >= 80000 && '+'}
        </output>
        <input
          id={id}
          type="range"
          min={5000}
          max={80000}
          step={1000}
          value={income}
          onChange={(e) => setIncome(+e.target.value)}
          className="mt-6 h-2 w-full cursor-pointer appearance-none rounded-full accent-orange"
          style={{ background: `linear-gradient(90deg, var(--color-orange) ${pct}%, var(--line) ${pct}%)` }}
        />
        <div className="mt-2 flex justify-between font-mono text-[0.7rem] text-muted">
          <span>£5k</span>
          <span>£80k+</span>
        </div>
      </div>
      <motion.div
        key={v.when}
        initial={!mounted || reduce ? false : { opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className={`flex flex-col justify-between rounded-3xl p-6 sm:p-8 ${tones[v.tone]}`}
        aria-live="polite"
      >
        <p className="font-mono text-xs tracking-[0.18em] uppercase opacity-70">MTD starts for you</p>
        <p className="mt-4 font-display text-5xl leading-none font-extrabold tracking-tight sm:text-6xl">{v.when}</p>
        <p className="mt-6 text-base opacity-85">{v.note}</p>
        <a href="/contact#enquiry" className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-ink px-5 py-3 text-sm font-semibold text-plaster">
          Talk it through with us →
        </a>
      </motion.div>
      <p className="text-xs text-muted lg:col-span-2">A guide only, based on HMRC’s published thresholds. We’ll confirm your position when you get in touch.</p>
    </div>
  );
}
