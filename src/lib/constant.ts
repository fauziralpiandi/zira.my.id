type Constant = {
  baseUrl: string;
  title: string;
  description: string;
  authorName: string;
  locale: string;
  timeZone: string;
};

type NavItem = {
  name: string;
  path: string;
};

const constant: Constant = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
  title: 'fwzyrln_',
  description:
    'A West Java-based Scribe Developer\u2014Naturally a Selenophile.',
  authorName: 'Fauzira Alpiandi',
  locale: 'en-US',
  timeZone: 'Asia/Jakarta',
};

const navItems: NavItem[] = [
  { name: 'Stories', path: '/stories' },
  { name: 'Notes', path: '/notes' },
  { name: 'Misc', path: '/misc' },
];

export { constant, navItems };
