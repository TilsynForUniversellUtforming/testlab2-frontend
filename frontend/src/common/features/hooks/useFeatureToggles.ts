import fetchFeatures from '../api/features-api';

const useFeatureToggles = (
  key: string,
  callback: () => void,
  loadingCallback: (loading: boolean) => void,
  errorCallback?: (e: any) => void
) => {
  fetchFeatures()
    .then(async (features) => {
      const feature = features.find((f) => f.key === key);
      if (feature && feature.active) {
        await callback();
      } else if (feature && !feature.active) {
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

export default useFeatureToggles;
