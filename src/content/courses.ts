import { publications } from './research';

// A course is an explicit curriculum, not every article added to the library.
export const financialSystemsSlugs = [
  'ipo-from-private-company-to-public-market',
  'how-interest-rates-move-through-the-economy',
  'upi-payments-and-the-economics-of-a-network',
  'reading-an-economic-claim-without-getting-fooled',
] as const;

export const financialSystemsLessons = financialSystemsSlugs.map(slug => {
  const lesson = publications.find(publication => publication.slug === slug);
  if (!lesson) throw new Error(`Missing financial systems course lesson: ${slug}`);
  return lesson;
});
export const financialSystemsMinutes = financialSystemsLessons.reduce((total, lesson) => total + lesson.readMinutes, 0);
