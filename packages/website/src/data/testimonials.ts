export type Testimonial = {
  quote: string;
  author: string;
  source?: string;
  url?: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      'Yea this is 100% going to be shit-canned in no time. Either with cease and decists or threats of lawsuits.',
    author: 'itismyjob',
    source: 'redditor',
  },
  {
    quote:
      "I used nuclear and had a horrible experience with it. It looks bad, you wait for 1 minute to play a 3 minute song, it's slow as fuck. Probably it's because of Electron, but it is used by so many people that I started cringing.",
    author: 'Anonymous /g/ user',
    url: 'https://desuarchive.org/g/thread/80081582/#80096271',
  },
  {
    quote:
      "If they aren't paying the artists this will be wiped off the face of the net in a month.",
    author: 'VelvetElvis',
    source: 'redditor',
  },
  {
    quote: 'As a musician, fuck everything about this',
    author: 'Rockytriton',
    source: 'redditor',
    url: 'https://www.reddit.com/r/linux/comments/ag82rn/nuclear_a_free_alternative_to_spotify_no_drm_100/ee5q1ds/',
  },
  {
    quote:
      'How incredibly arrogant. (...) High-and-mighty types like this are exactly why working in IT or contributing to FLOSS is so draining at times.',
    author: 'japanoise',
    source: 'HN user',
    url: 'https://news.ycombinator.com/item?id=18921643',
  },
  {
    quote:
      "This is why I don't like Linux anymore. You guys are in some fucking sort of communist hippy paradise mode where you deserve everything now and only other people should pay for it. HACK THE WORLD!",
    author: 'IllDecision',
    source: 'redditor',
  },
];
