export interface AppContext {
  contextError?: any;
  contextLoading: boolean;
  refresh?: () => void;
  setContextError: (e: any) => void;
  setContextLoading: (loading: boolean) => void;
}

export type Option = {
  label: string;
  value: string;
};
