export interface AppContext {
  error?: any;
  refresh?: () => void;
}

export type Option = {
  label: string;
  value: string;
};
