import { useEffect } from 'react';

/**
 * Sets the document's title based on the specific subject or content.
 *
 * @param {string} baseTitle - The base/backup title.
 * @param {string} [contentTitle] - Title representing the specific content or context, i.e. a fetched value.
 */
const useContentDocumentTitle = (baseTitle: string, contentTitle?: string) => {
  useEffect(() => {
    window.document.title = !contentTitle
      ? baseTitle
      : `${baseTitle} - ${contentTitle}`;

    return () => {
      window.document.title = baseTitle;
    };
  }, [baseTitle, contentTitle]);
};

export default useContentDocumentTitle;
