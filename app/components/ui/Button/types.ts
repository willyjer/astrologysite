import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'cart'
  | 'learn'
  | 'text'
  | 'close';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Base props for all button components
 */
export interface BaseButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant of the button */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Whether the button is in a loading state */
  isLoading?: boolean;
  /** Additional CSS class name */
  className?: string;
}

/**
 * Props for the main Button component
 */
export interface ButtonProps extends BaseButtonProps {
  /** Content to be rendered inside the button */
  children: ReactNode;
  /** Icon to be rendered before the content */
  leftIcon?: ReactNode;
  /** Icon to be rendered after the content */
  rightIcon?: ReactNode;
  /** Whether the button should take up the full width of its container */
  fullWidth?: boolean;
}

/**
 * Props for the IconButton component
 */
export interface IconButtonProps extends BaseButtonProps {
  /** Icon to be rendered inside the button */
  icon: ReactNode;
  /** Accessible label for the button */
  label: string;
}
