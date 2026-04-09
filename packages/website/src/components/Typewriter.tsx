import { useEffect, useState } from 'react';

import { taglines } from '../data/taglines';

const TYPE_SPEED = 70;
const DELETE_SPEED = 40;
const PAUSE_AFTER_TYPE = 2000;
const PAUSE_AFTER_DELETE = 400;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Typewriter = () => {
  const [text, setText] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loop = async () => {
      let index = 0;
      while (!cancelled) {
        const phrase = taglines[index % taglines.length];

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

        index++;
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
