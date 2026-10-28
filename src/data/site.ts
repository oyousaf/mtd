export const site = {
  name: 'MTD Trade Books',
  tagline: 'Bookkeeping for the building trade',
  founder: 'Steven Ambrose',
  phone: '020 8191 3662',
  phoneHref: 'tel:+442081913662',
  email: 'mtdbookkeeping.uk@gmail.com',
  hours: 'Monday to Friday, 9am – 5pm',
  location: 'Uxbridge, London',
  mtdStart: '2027-04-06',
};

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/bookkeeping-services', label: 'Bookkeeping' },
  { href: '/cis-subcontractors', label: 'CIS' },
  { href: '/making-tax-digital', label: 'Making Tax Digital' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/for-accountants', label: 'For Accountants' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];

export type Plan = {
  id: string;
  name: string;
  price: number;
  from?: boolean;
  unit: string;
  blurb: string;
  features: string[];
  featured?: boolean;
  badge?: string;
};

export const plans: Plan[] = [
  {
    id: 'enrol',
    name: 'Enrolment & setup',
    price: 20,
    unit: 'one-off',
    blurb: 'Get MTD-ready now. No monthly payments until April 2027.',
    features: ['FreeAgent setup and access', 'Help connecting your bank feed', 'Records organised from day one', 'No monthly fees until April 2027'],
    featured: true,
    badge: 'April 2027 starters',
  },
  {
    id: 'monthly',
    name: 'Monthly bookkeeping',
    price: 20,
    unit: 'per month',
    blurb: 'Keep your records up to date, stay compliant and reduce stress.',
    features: ['Record your income and expenses', 'Quarterly MTD updates', 'Keep you HMRC compliant', 'Support from someone who knows the trade'],
  },
  {
    id: 'catchup',
    name: 'Catch-up bookkeeping',
    price: 99,
    from: true,
    unit: 'one-off',
    blurb: 'Behind with your books? We’ll get your records back up to date.',
    features: ['Typically covers 1–2 missed quarters', 'Helps avoid HMRC penalties', 'Records ready for MTD', 'Clear, fixed price'],
  },
  {
    id: 'yearend',
    name: 'Year-end support',
    price: 200,
    from: true,
    unit: 'per year',
    blurb: 'Year-end records and tax return support, as a separate service.',
    features: ['Prepare year-end records', 'Support with your tax return', 'All income and expenses included', 'For monthly clients or stand-alone'],
  },
];
