import { useState } from 'react';

export const useSearchPopover = () => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return {
    isOpen: isFocused,
    handleFocus,
    handleBlur,
  };
};
