export interface AppContext {
  error?: any;
  loading: boolean;
  refresh?: () => void;
  setContextError: (e: any) => void;
  setLoading: (loading: boolean) => void;
}

export type Option = {
  label: string;
  value: string;
};
