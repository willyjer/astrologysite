import { forwardRef } from 'react';
import { InputProps } from './types';
import styles from './styles.module.css';
import clsx from 'clsx';

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    label,
    error,
    variant = 'default',
    fullWidth,
    icon,
    iconPosition = 'left',
    helperText,
    className,
    wrapperClassName,
    labelClassName,
    inputClassName,
    errorClassName,
    helperClassName,
    ...inputProps
  } = props;

  return (
    <div
      className={clsx(
        styles.wrapper,
        fullWidth && styles.fullWidth,
        wrapperClassName
      )}
    >
      {label && (
        <label
          htmlFor={inputProps.id}
          className={clsx(styles.label, labelClassName)}
        >
          {label}
        </label>
      )}

      <div className={styles.inputWrapper}>
        {icon && iconPosition === 'left' && (
          <span className={clsx(styles.icon, styles.iconLeft)}>{icon}</span>
        )}

        <input
          ref={ref}
          className={clsx(
            styles.input,
            icon && iconPosition === 'left' && styles.hasLeftIcon,
            icon && iconPosition === 'right' && styles.hasRightIcon,
            error && styles.hasError,
            inputClassName
          )}
          {...inputProps}
        />

        {icon && iconPosition === 'right' && (
          <span className={clsx(styles.icon, styles.iconRight)}>{icon}</span>
        )}
      </div>

      {error && (
        <div className={clsx(styles.error, errorClassName)}>{error}</div>
      )}

      {helperText && !error && (
        <div className={clsx(styles.helperText, helperClassName)}>
          {helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';
