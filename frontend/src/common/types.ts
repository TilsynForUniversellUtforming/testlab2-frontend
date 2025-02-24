export type TestlabLocale = 'nn' | 'nb' | 'en';

export interface AppContext {
  contextError?: Error;
  contextLoading: boolean;
  refresh?: () => void;
  setContextError: (e: Error | undefined) => void;
  setContextLoading: (loading: boolean) => void;
}

export type Size = 'xsmall' | 'small' | 'medium' | 'large';

export type OptionType = {
  label: string;
  value: string;
  title?: string;
  disabled?: boolean;
};

export type OptionExtended = {
  description: string;
} & OptionType;

export type Severity = 'info' | 'warning' | 'success' | 'danger';

export type TestlabSeverity = Severity | 'neutral';

export type TestlabColor = TestlabSeverity | 'first' | 'second' | 'third';

export const ButtonColor = {
  Primary: 'first',
  Secondary: 'second',
  Success: 'success',
  Danger: 'danger',
} as const;

export type ButtonColorType = (typeof ButtonColor)[keyof typeof ButtonColor];

export const ButtonVariant = {
  Filled: 'primary',
  Outline: 'secondary',
  Quiet: 'tertiary',
} as const;

export type ButtonVariantType =
  (typeof ButtonVariant)[keyof typeof ButtonVariant];

export const ButtonSize = {
  Small: 'sm',
  Medium: 'md',
  Large: 'lg',
} as const;

export type ButtonSizeType = (typeof ButtonSize)[keyof typeof ButtonSize];

export const CheckboxSize = {
  Small: 'sm',
  Medium: 'md',
  Large: 'lg',
} as const;

export type CheckboxSizeType = (typeof CheckboxSize)[keyof typeof CheckboxSize];
