import { useEffect } from 'react';

/**
 * Sets the document's title based on the specific subject or content.
 *
 * @param {string} baseTitle - The base/backup title.
 * @param {boolean} loading - If the page is loading, use the backup title.
 * @param {string} [contentTitle] - Title representing the specific content or context, i.e. a fetched value.
 */
const useContentDocumentTitle = (
  baseTitle: string,
  loading: boolean,
  contentTitle?: string
) => {
  useEffect(() => {
    window.document.title =
      loading || !contentTitle ? baseTitle : `${baseTitle} - ${contentTitle}`;

    return () => {
      window.document.title = baseTitle;
    };
  }, [baseTitle, loading, contentTitle]);
};

export default useContentDocumentTitle;
