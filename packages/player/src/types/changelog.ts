export type ChangelogTag = {
  label: string;
  color: 'green' | 'cyan' | 'orange' | 'red' | 'yellow' | 'purple' | 'blue';
};

export type ChangelogEntryType =
  | 'feature'
  | 'fix'
  | 'improvement'
  | 'chore'
  | 'plugins'
  | 'docs';

export type ChangelogChange = {
  description: string;
  type: ChangelogEntryType;
  contributor?: string;
  tags?: ChangelogTag[];
};

export type ChangelogVersion = {
  version: string;
  date: string;
  changes: ChangelogChange[];
};

export type Changelog = {
  entries: ChangelogVersion[];
};
