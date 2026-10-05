type Timed = {
  startFrame: number;
};

export const activeIndex = (items: Timed[], frame: number) =>
  Math.max(0, items.filter((item) => item.startFrame <= frame).length - 1);
