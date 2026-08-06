import { Search, X } from 'lucide-react';
import { ChangeEvent, FC } from 'react';

import { cn } from '../../utils';

export type NuclearJamSearchBarLabels = {
  placeholder: string;
};

export type NuclearJamSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  labels: NuclearJamSearchBarLabels;
  className?: string;
};

export const NuclearJamSearchBar: FC<NuclearJamSearchBarProps> = ({
  value,
  onChange,
  labels,
  className,
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div
      className={cn(
        'border-border flex min-w-0 flex-1 items-center gap-2 self-stretch border-x-(length:--border-width) px-3',
        className,
      )}
      data-testid="jam-search-bar"
    >
      <Search className="text-foreground-secondary size-5 shrink-0" />
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={labels.placeholder}
        enterKeyHint="search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        className="text-foreground placeholder:text-foreground-secondary min-w-0 flex-1 bg-transparent font-semibold outline-none [&::-webkit-search-cancel-button]:appearance-none"
        data-testid="jam-search-input"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          className="text-foreground-secondary hover:text-foreground shrink-0 transition-colors"
          data-testid="jam-search-clear"
        >
          <X className="size-5" />
        </button>
      )}
    </div>
  );
};
