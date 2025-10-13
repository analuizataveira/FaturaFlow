import { cn } from "@/utils/cn"
import * as React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  showPassword?: boolean;
  fill?: string;
  search?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ showPassword, className, type, fill, search, ...props }, ref) => {
    return (
      <div
        className={cn(
          'flex h-10 w-full outline-none bg-transparent text-sm rounded',
          className,
          `text-${fill}`,
        )}
      >
        <input
          value={props.value}
          type={type === 'password' && showPassword ? 'text' : type}
          className={`w-full h-full outline-none bg-transparent text-sm ${search && 'mr-24'}`}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
