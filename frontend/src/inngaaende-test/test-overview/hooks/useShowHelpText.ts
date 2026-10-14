import { useState } from 'react';

export const useShowHelpText = () => {
  const [showHelpText, setShowHelpText] = useState(true);
  const toggleShowHelpText = () => setShowHelpText((prev) => !prev);

  return { showHelpText, setShowHelpText, toggleShowHelpText };

}