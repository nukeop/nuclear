import clsx from 'clsx';
import { Check, Copy } from 'lucide-react';
import { ReactNode, useState, type FC } from 'react';

type CopyButtonProps = {
  text: string;
  className?: string;
  children?: ReactNode;
};

const RESET_DELAY = 2000;

export const CopyButton: FC<CopyButtonProps> = ({
  text,
  className,
  children,
}) => {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), RESET_DELAY);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        'inline-flex cursor-pointer flex-row items-center justify-center gap-2 rounded p-1 transition-colors',
        className,
      )}
      aria-label="Copy to clipboard"
    >
      <span className="text-sm">{children}</span>
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
};
