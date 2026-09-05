// one motion vocabulary for the whole site — DESIGN.md section 4. A section is the
// conductor: its contents rise in sequence rather than the whole block arriving at once.
const EASE = [0.16, 1, 0.3, 1] as const;

export const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
};

// the hairline in a section header draws itself from the index outwards
export const wipe = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1.2, ease: EASE } },
};

// a high threshold on purpose: a section holds until its top has climbed past 70% of
// the screen, so it arrives once you have actually reached it rather than the moment
// its first pixel appears
export const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '0px 0px -30% 0px' }, variants: container } as const;
