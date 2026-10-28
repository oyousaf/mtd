import { animate, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const options = [
  { id: 'enrol', name: 'Enrolment & setup', detail: '£20 one-off', yearOne: 20 },
  { id: 'monthly', name: 'Monthly bookkeeping', detail: '£20 × 12 months', yearOne: 240 },
  { id: 'catchup', name: 'Catch-up bookkeeping', detail: 'from £99 one-off', yearOne: 99 },
  { id: 'yearend', name: 'Year-end support', detail: 'from £200 per year', yearOne: 200 },
] as const;

type Id = (typeof options)[number]['id'];

export default function Estimator() {
  const [picked, setPicked] = useState<Set<Id>>(new Set(['enrol', 'monthly']));
  const total = options.filter((o) => picked.has(o.id)).reduce((sum, o) => sum + o.yearOne, 0);
  const out = useRef<HTMLSpanElement>(null);
  const prev = useRef(total);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = out.current;
    if (!el) return;
    const from = prev.current;
    prev.current = total;
    if (reduce) {
      el.textContent = `£${total}`;
      return;
    }
    const controls = animate(from, total, {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = `£${Math.round(v)}`),
    });
    return () => controls.stop();
  }, [total, reduce]);

  const toggle = (id: Id) =>
    setPicked((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <fieldset className="grid gap-3 sm:grid-cols-2 lg:col-span-3">
        <legend className="sr-only">Choose the services you need</legend>
        {options.map((o) => {
          const on = picked.has(o.id);
          return (
            <label
              key={o.id}
              className={`card flex cursor-pointer items-start gap-4 p-5 transition duration-300 ${on ? '!border-orange ring-2 ring-orange/30' : 'hover:border-fg/30'}`}
            >
              <input type="checkbox" checked={on} onChange={() => toggle(o.id)} className="mt-1 size-5 shrink-0 accent-orange" />
              <span>
                <span className="block font-display text-lg font-bold">{o.name}</span>
                <span className="font-mono text-xs text-muted">{o.detail}</span>
              </span>
            </label>
          );
        })}
      </fieldset>
      <div className="flex flex-col justify-between rounded-[1.75rem] bg-ink p-7 text-plaster lg:col-span-2 dark:border dark:border-line">
        <div>
          <p className="font-mono text-xs tracking-[0.18em] text-plaster/60 uppercase">Your first year, from</p>
          <p className="mt-3 font-mono text-7xl font-medium tracking-tighter text-lime tabular-nums" aria-live="polite">
            <span ref={out}>£{total}</span>
          </p>
          <p className="mt-3 text-sm text-plaster/65">
            Starting prices for non-VAT sole traders. April 2027 starters pay no monthly fees until April 2027.
          </p>
        </div>
        <a href="/contact#enquiry" className="btn-primary mt-8">
          Get a confirmed price →
        </a>
      </div>
    </div>
  );
}
