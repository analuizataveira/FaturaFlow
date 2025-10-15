import { Cross2Icon } from '@radix-ui/react-icons';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { Check, Info, X } from 'lucide-react';
import { cn } from '@/utils/cn';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'z-100 sm:top-23 fixed top-0 flex h-fit max-h-screen w-fit flex-col-reverse p-4 sm:bottom-0 sm:right-10 sm:flex-col md:max-w-[330px]',
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-start overflow-hidden py-4 rounded-lg border shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-20 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full sm:data-[state=open]:slide-in-from-right-full border-[1px]',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive:
          'destructive group border-destructive bg-destructive text-destructive-foreground',
        success:
          'bg-neutral-100 dark:bg-dark-stone-800 px-4 text-neutral-600 dark:text-dark-stone-300',
        info: 'bg-neutral-100 dark:bg-dark-stone-800 px-4 text-neutral-600 dark:text-dark-stone-300',
        error:
          'bg-neutral-100 dark:bg-dark-stone-800 px-4 text-neutral-600 dark:text-dark-stone-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, duration = 5000, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      duration={duration}
      {...props}
    >
      <div className='flex flex-col gap-4'>
        <div className='flex'>
          <div className='dark:bg-dark-stone-800 mr-4 flex h-8 w-8 items-center justify-center rounded bg-white'>
            {variant === 'error' && (
              <div className='relative flex items-center justify-center rounded-full'>
                <div className='bg-linear-to-br absolute z-0 h-9 w-9 rounded-full from-neutral-300 to-neutral-400 opacity-60' />
                <div className='z-10 flex h-7 w-7 items-center justify-center rounded-full bg-red-500'>
                  <X className='h-5 w-5 stroke-neutral-100' />
                </div>
              </div>
            )}
            {variant === 'success' && (
              <div className='relative flex items-center justify-center rounded-full'>
                <div className='bg-linear-to-br absolute z-0 h-9 w-9 rounded-full from-neutral-300 to-neutral-400 opacity-60' />
                <div className='z-10 flex h-7 w-7 items-center justify-center rounded-full bg-green-500'>
                  <Check className='h-6 w-6 stroke-neutral-100' />
                </div>
              </div>
            )}
            {variant === 'info' && (
              <div className='relative flex items-center justify-center rounded-full'>
                <div className='bg-linear-to-br absolute z-0 h-9 w-9 rounded-full from-neutral-300 to-neutral-400 opacity-60' />
                <div className='z-10 flex h-7 w-7 items-center justify-center rounded-full bg-blue-500'>
                  <Info className='h-6 w-6 stroke-neutral-100' />
                </div>
              </div>
            )}
          </div>
          {props.children}
        </div>
      </div>
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'hover:bg-secondary focus:outline-hidden focus:ring-ring group-[.destructive]:border-muted/40 hover:group-[.destructive]:border-destructive/30 hover:group-[.destructive]:bg-destructive hover:group-[.destructive]:text-destructive-foreground focus:group-[.destructive]:ring-destructive inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors focus:ring-1 disabled:pointer-events-none disabled:opacity-50',
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'text-foreground/50 hover:text-foreground focus:outline-hidden absolute right-1 top-1 rounded-md p-1 opacity-0 transition-opacity focus:opacity-100 focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 hover:group-[.destructive]:text-red-50 focus:group-[.destructive]:ring-red-400 focus:group-[.destructive]:ring-offset-red-600',
      className,
    )}
    toast-close=''
    {...props}
  >
    <Cross2Icon className='h-4 w-4' />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-base font-semibold [&+div]:text-xs', className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastActionElement,
  type ToastProps,
};
