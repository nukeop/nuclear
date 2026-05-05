import { useEffect, useState } from 'react';

import { taglines } from '../data/taglines';

const TYPE_SPEED = 70;
const DELETE_SPEED = 40;
const PAUSE_AFTER_TYPE = 2000;
const PAUSE_AFTER_DELETE = 400;
const INITIAL_TEXT = "that's free and open-source";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Typewriter = () => {
  const [text, setText] = useState(INITIAL_TEXT);

  useEffect(() => {
    let cancelled = false;

    const loop = async () => {
      await sleep(PAUSE_AFTER_TYPE);
      for (let i = INITIAL_TEXT.length; i >= 0 && !cancelled; i--) {
        setText(INITIAL_TEXT.slice(0, i));
        await sleep(DELETE_SPEED);
      }
      await sleep(PAUSE_AFTER_DELETE);

      let lastIndex = -1;
      while (!cancelled) {
        let nextIndex: number;
        do {
          nextIndex = Math.floor(Math.random() * taglines.length);
        } while (nextIndex === lastIndex && taglines.length > 1);
        lastIndex = nextIndex;

        const phrase = taglines[nextIndex];

        for (let i = 0; i <= phrase.length && !cancelled; i++) {
          setText(phrase.slice(0, i));
          await sleep(TYPE_SPEED);
        }
        await sleep(PAUSE_AFTER_TYPE);

        for (let i = phrase.length; i >= 0 && !cancelled; i--) {
          setText(phrase.slice(0, i));
          await sleep(DELETE_SPEED);
        }
        await sleep(PAUSE_AFTER_DELETE);
      }
    };

    loop();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {text}
      <span style={{ animation: 'blink 0.8s step-end infinite' }}>|</span>
    </>
  );
};
