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
  Filled: 'primary',
  Outline: 'secondary',
  Quiet: 'tertiary',
} as const;

export type ButtonVariantType =
  (typeof ButtonVariant)[keyof typeof ButtonVariant];

export const ButtonSize = {
  Small: 'small',
  Medium: 'medium',
  Large: 'large',
} as const;

export type ButtonSizeType = (typeof ButtonSize)[keyof typeof ButtonSize];

export const CheckboxSize = {
  XSmall: 'xsmall',
  Small: 'small',
  Medium: 'medium',
  Large: 'large',
} as const;

export type CheckboxSizeType = (typeof CheckboxSize)[keyof typeof CheckboxSize];

export type Paths<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${'' | `.${Paths<T[K]>}`}`;
    }[keyof T]
  : never;

export type Leaves<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${Leaves<T[K]> extends never
        ? ''
        : `.${Leaves<T[K]>}`}`;
    }[keyof T]
  : never;
