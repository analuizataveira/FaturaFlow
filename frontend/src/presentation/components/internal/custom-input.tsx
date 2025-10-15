import { EyeIcon, EyeOffIcon } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { withMask } from 'use-mask-input';
import { Button } from '../ui/button.js';
import { Input, Label } from '../ui/index.js';
import { thousandPointsFormatter } from '@/utils/formatters.js';
import { cn } from '@/utils/cn.js';

export type CustomInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: any;
  name: string;
  label?: string;
  initialValue?: string;
  prefixItem?: React.ReactNode;
  suffixItem?: React.ReactNode;
  fill?: string;
  errorMessage?: string;
  disabled?: boolean;
  mask?:
    | 'datetime'
    | 'email'
    | 'numeric'
    | 'currency'
    | 'decimal'
    | 'integer'
    | 'percentage'
    | 'url'
    | 'ip'
    | 'mac'
    | 'ssn'
    | 'brl-currency'
    | 'cpf'
    | 'cnpj'
    | (string & {})
    | (string[] & {})
    | null;
  customInputValue?: string;
  onChangeInputValue?: (value: string) => void;
};

interface SVGProps {
  fill?: string;
  prefixItem?: React.ReactNode;
  suffixItem?: React.ReactNode;
}

export function CustomInput({
  control,
  name,
  label,
  prefixItem,
  suffixItem,
  fill,
  errorMessage,
  className,
  type,
  mask,
  onChangeInputValue,
  customInputValue,
  disabled,
  ...props
}: CustomInputProps & SVGProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChangeInputValue) onChangeInputValue(e.target.value);
  };

  const formatValue = (value: string) => {
    if (mask === 'numeric') return thousandPointsFormatter(value);
    return value;
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        if (mask && mask !== 'numeric' && field.ref)
          field.ref = withMask(mask, {
            showMaskOnFocus: false,
            showMaskOnHover: false,
            placeholder: '',
          });

        return (
          <>
            {label && (
              <Label
                htmlFor={name}
                className={cn(
                  'dark:text-dark-stone-200 pl-2 text-[12px] font-semibold text-neutral-600',
                  !disabled && 'dark:text-dark-stone-200 text-neutral-900',
                  disabled && 'dark:text-dark-stone-400 text-neutral-400',
                )}
              >
                {label}
              </Label>
            )}
            <div
              className={cn(
                'relative flex h-10 w-full items-center gap-2 rounded-xl border-[1px] bg-transparent p-3 pr-2 text-sm shadow-sm outline-none',
                'dark:bg-blend-linear-dodge focus:bg-transparent dark:border-white/20 dark:bg-[radial-gradient(ellipse_96.10%_92.30%_at_4.41%_8.57%,_rgba(255,_255,_255,_0.15)_0%,_rgba(255,_255,_255,_0)_100%)] dark:hover:bg-transparent dark:focus:border-white',
                !disabled && 'border-neutral-400/20 text-neutral-600',
                disabled && 'border-neutral-200 text-neutral-400',
                className,
              )}
            >
              {prefixItem && prefixItem}
              <Input
                id={name}
                type={type === 'password' && showPassword ? 'text' : type}
                {...props}
                {...field}
                onChangeCapture={onChangeValue}
                disabled={disabled}
                value={customInputValue ?? formatValue(field.value)}
                className={cn(
                  'h-[98%] border-none py-0 pb-1 pl-2 shadow-none dark:bg-none',
                  prefixItem && 'mb-[3px] pl-0',
                )}
              />
              {type === 'password' && (
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='bg-transparent! h-full px-3 py-2 hover:bg-white dark:bg-transparent dark:hover:bg-transparent'
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOffIcon className={cn('h-4 w-4', `text-${fill}`)} />
                  ) : (
                    <EyeIcon className={cn('h-4 w-4', `text-${fill}`)} />
                  )}
                </Button>
              )}
              {suffixItem}
            </div>
            {errorMessage && <p className='p-1 text-[12px] text-red-500'>{errorMessage}</p>}
          </>
        );
      }}
    />
  );
}
