import { FC } from 'react';
import { Composition } from 'remotion';

import { scenarios } from './scenarios';

export const RemotionRoot: FC = () => (
  <>
    {scenarios.map((scenario) => (
      <Composition key={scenario.id} {...scenario} />
    ))}
  </>
);
