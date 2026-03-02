export type ChangelogTag = {
  label: string;
  color: 'green' | 'cyan' | 'orange' | 'red' | 'yellow' | 'purple' | 'blue';
};

export type ChangelogEntryType =
  | 'feature'
  | 'fix'
  | 'improvement'
  | 'chore'
  | 'plugin'
  | 'docs';

export type ChangelogEntry = {
  date: string;
  description: string;
  type: ChangelogEntryType;
  contributors?: string[];
  tags?: ChangelogTag[];
};
