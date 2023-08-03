import fetchFeatures from '../api/features-api';

/**
 * Custom React hook for feature toggling based on a key.
 * @param {string} key - The key used to look up the feature toggle.
 * @param {(loading: boolean) => void} loadingCallback - The function to execute while the feature toggle is being fetched.
 * @param {(e: any) => void} errorCallback - Optional function to execute if an error occurs while fetching the feature toggle.
 * @returns {void}
 */

const fetchFeatureToggles = (
  key: string,
  loadingCallback: (loading: boolean) => void,
  errorCallback?: (e: unknown) => void
): Promise<void> => {
  return fetchFeatures()
    .then(async (features) => {
      const feature = features.find((f) => f.key === key);
      if (feature && !feature.active) {
        throw new Error(`Feature ${key} er låst`);
      } else {
        throw new Error(`Feature ${key} finnes ikke`);
      }
    })
    .catch((e: Error) => {
      if (errorCallback) {
        errorCallback(e.message);
      } else {
        loadingCallback(false);
      }
    });
};

export default fetchFeatureToggles;
