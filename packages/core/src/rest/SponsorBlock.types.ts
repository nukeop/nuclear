export type VideoID = string;
export type Category = 'sponsor' | 'intro' | 'outro' | 'interaction' | 'selfpromo' | 'music_offtopic';
export type Segment = {
  startTime: number;
  endTime: number;
  category: Category;
};
