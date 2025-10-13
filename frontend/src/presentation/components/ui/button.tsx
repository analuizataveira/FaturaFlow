import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/utils/cn'
import { Spinner } from './spinner'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-white hover:bg-gradient-to-b hover:from-primary-500 hover:to-primary-700 dark:bg-gradient-to-b dark:from-primary dark:to-primary-600  dark:text-neutral-900 dark:hover:bg-neutral-50/90',
        darkness:
          'bg-gradient-to-b from-primary-600 to-primary-700 text-neutral-50 hover:bg-gradient-to-b hover:from-primary-500 hover:to-primary-600 dark:bg-gradient-to-b dark:from-primary dark:to-primary-600  dark:text-neutral-900 dark:hover:bg-neutral-50/90',
        destructive:
          'bg-red-500 text-neutral-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90',
        outline:
          'border border-primary-600 text-primary-600 bg-transparent hover:bg-gradient-to-b hover:from-primary-600 hover:to-primary-700 hover:text-white',
        secondary:
          'bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80',
        ghost:
          'hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
        link: 'text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50',
        icon: 'bg-transparent border-none',
        none: 'bg-transparent border-none hover:bg-white p-0',
        select:
          'flex h-12 w-full items-center justify-between rounded border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        clear:
          'text-neutral-500 fill-neutral-500 underline-offset-4 hover:underline dark:text-neutral-50 decoration-neutral-500',
      },
      size: {
        default: 'h-12 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, isLoading, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          isLoading && 'pointer-events-none cursor-wait',
        )}
        ref={ref}
        {...props}
      >
        {isLoading ? <Spinner /> : props.children}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
