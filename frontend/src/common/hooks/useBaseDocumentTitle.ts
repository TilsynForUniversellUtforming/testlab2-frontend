import { useEffect } from 'react';

/**
 * * Sets the document's base/default title.
 *
 * @param {string} baseTitle - The default title for a component.
 */
const useBaseDocumentTitle = (baseTitle: string) => {
  useEffect(() => {
    window.document.title = baseTitle;
  }, [baseTitle]);
};

export default useBaseDocumentTitle;
