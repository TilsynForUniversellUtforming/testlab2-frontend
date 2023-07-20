export interface AppContext {
  contextError?: Error;
  contextLoading: boolean;
  refresh?: () => void;
  setContextError: (e: Error | undefined) => void;
  setContextLoading: (loading: boolean) => void;
}

export type Option = {
  label: string;
  value: string;
};

export type Severity = 'info' | 'warning' | 'success' | 'danger';
