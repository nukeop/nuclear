import { motion } from 'motion/react';
import { FC } from 'react';

import { loadingBarFade } from './cardActionsAnimation';

export const CardLoadingBar: FC = () => (
  <motion.div
    data-testid="card-loading-bar"
    {...loadingBarFade}
    className="bg-stripes-diagonal absolute inset-0"
  />
);
