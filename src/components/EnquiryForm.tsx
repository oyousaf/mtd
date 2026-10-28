import { actions, isInputError } from 'astro:actions';
import { AnimatePresence, motion } from 'motion/react';
import { useState, type SubmitEvent } from 'react';

const services = ['£20 enrolment', 'Monthly bookkeeping', 'Catch-up', 'Year-end', 'Accountant partnership'];

type Status = { kind: 'idle' | 'sending' | 'sent' } | { kind: 'error'; message: string; mailto: string };

export default function EnquiryForm({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});
  const [service, setService] = useState(services[0]);

  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus({ kind: 'sending' });
    setFieldErrors({});
    const { error } = await actions.enquiry(data);
    if (!error) {
      setStatus({ kind: 'sent' });
      form.reset();
      return;
    }
    if (isInputError(error)) {
      setFieldErrors(error.fields);
      setStatus({ kind: 'idle' });
      return;
    }
    const body = [...data.entries()].filter(([k]) => k !== 'company').map(([k, v]) => `${k}: ${v}`).join('\n');
    setStatus({
      kind: 'error',
      message: error.code === 'SERVICE_UNAVAILABLE' ? 'Online sending isn’t switched on yet.' : 'Something went wrong sending your enquiry.',
      mailto: `mailto:${email}?subject=${encodeURIComponent('Website enquiry')}&body=${encodeURIComponent(body)}`,
    });
  }

  const field =
    'mt-2 w-full rounded-2xl border border-line bg-bg px-4 py-3.5 text-base text-fg placeholder:text-muted/70 transition focus:border-orange focus:ring-4 focus:ring-orange/15 focus:outline-none';
  const err = (name: string) =>
    fieldErrors[name]?.[0] && <p className="mt-1.5 text-sm text-orange-deep dark:text-orange">{fieldErrors[name]?.[0]}</p>;

  if (status.kind === 'sent') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="grid place-items-center gap-4 py-16 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-lime text-3xl text-ink">✓</span>
        <h3 className="font-display text-3xl font-extrabold">Enquiry sent</h3>
        <p className="max-w-sm text-muted">Thanks, we’ll be in touch within one working day to arrange your setup.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <fieldset>
        <legend className="text-sm font-semibold">What do you need help with?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {services.map((s) => (
            <label key={s} className="cursor-pointer">
              <input type="radio" name="service" value={s} checked={service === s} onChange={() => setService(s)} className="peer sr-only" />
              <span className="inline-block rounded-full border border-line px-4 py-2 text-sm font-medium transition peer-checked:border-ink peer-checked:bg-ink peer-checked:text-plaster peer-focus-visible:ring-4 peer-focus-visible:ring-lime dark:peer-checked:border-lime dark:peer-checked:bg-lime dark:peer-checked:text-ink">
                {s}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Full name
          <input name="name" autoComplete="name" required className={field} placeholder="e.g. Dave Mitchell" />
          {err('name')}
        </label>
        <label className="block text-sm font-semibold">
          Telephone number
          <input name="phone" type="tel" autoComplete="tel" required className={field} placeholder="07…" />
          {err('phone')}
        </label>
      </div>
      <label className="block text-sm font-semibold">
        Email address
        <input name="email" type="email" autoComplete="email" required className={field} placeholder="you@example.com" />
        {err('email')}
      </label>
      <label className="block text-sm font-semibold">
        Brief description of your business
        <textarea name="business" rows={4} required className={field} placeholder="e.g. Self-employed carpenter, CIS registered, about £35k a year" />
        {err('business')}
      </label>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <AnimatePresence>
        {status.kind === 'error' && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-orange/40 bg-orange/10 p-4 text-sm">
            {status.message}{' '}
            <a className="font-semibold underline" href={status.mailto}>
              Send it by email instead
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={status.kind === 'sending'} className="btn-primary disabled:opacity-60">
          {status.kind === 'sending' ? 'Sending…' : 'Send my enquiry →'}
        </button>
        <p className="text-xs text-muted sm:max-w-64">No payment is taken online. We’ll arrange the £20 enrolment fee with you after your enquiry.</p>
      </div>
    </form>
  );
}
