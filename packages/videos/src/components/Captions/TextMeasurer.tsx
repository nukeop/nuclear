import { forwardRef } from 'react';

import { captionTextClassName } from './captionTextClassName';

type TextMeasurerProps = {
  texts: string[];
};

export const TextMeasurer = forwardRef<HTMLDivElement, TextMeasurerProps>(
  function TextMeasurer({ texts }, ref) {
    return (
      <div ref={ref} aria-hidden className="invisible absolute w-3xl">
        {texts.map((text, textIndex) => (
          <p key={textIndex} className={captionTextClassName}>
            {text}
          </p>
        ))}
      </div>
    );
  },
);
