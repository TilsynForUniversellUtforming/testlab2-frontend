export interface AppContext {
  contextError?: Error;
  contextLoading: boolean;
  refresh?: () => void;
  setContextError: (e: Error | undefined) => void;
  setContextLoading: (loading: boolean) => void;
}

export type Size = 'xsmall' | 'small' | 'medium' | 'large';

export type Option = {
  label: string;
  value: string;
};

export type Severity = 'info' | 'warning' | 'success' | 'danger';

export type TestlabSeverity = Severity | 'neutral';

export const ButtonColor = {
  Primary: 'first',
  Secondary: 'second',
  Success: 'success',
  Danger: 'danger',
  Inverted: 'inverted',
} as const;

export type ButtonColorType = (typeof ButtonColor)[keyof typeof ButtonColor];

export const ButtonVariant = {
  Filled: 'filled',
  Outline: 'outline',
  Quiet: 'quiet',
} as const;

export type ButtonVariantType =
  (typeof ButtonVariant)[keyof typeof ButtonVariant];

export const ButtonSize = {
  Small: 'small',
  Medium: 'medium',
  Large: 'large',
} as const;

export type ButtonSizeType = (typeof ButtonSize)[keyof typeof ButtonSize];
