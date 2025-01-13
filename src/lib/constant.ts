type Constant = {
  baseUrl: string;
  title: string;
  description: string;
  authorName: string;
  locale: string;
  timeZone: string;
};

export const constant: Constant = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
  title: 'fwzyrln_',
  description:
    'An enthusiastic frontend developer with a passionate storyteller who\u2019s all in\u2014 slapping semicolons and sprinkling quotations with ease.',
  authorName: 'Fauzira Alpiandi',
  locale: 'en-US',
  timeZone: 'Asia/Jakarta',
};
