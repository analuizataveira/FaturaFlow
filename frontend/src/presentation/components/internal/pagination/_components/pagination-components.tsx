import * as React from 'react'

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
} from '@radix-ui/react-icons'
import { cn } from '@/utils/cn'
import { ButtonProps, buttonVariants } from '@/presentation/components/ui'

const PaginationContainer = ({
  className,
  ...props
}: React.ComponentProps<'nav'>) => (
  <nav
    role='navigation'
    aria-label='PaginationContainer'
    className={cn('flex justify-center rounded-md px-3 py-1.5', className)}
    {...props}
  />
)
PaginationContainer.displayName = 'PaginationContainer'

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
))
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'default' : 'outline',
        size,
      }),
      'border-primary-100 cursor-pointer select-none rounded-md font-normal transition-colors',
      className,
    )}
    {...props}
  />
)
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label='Go to previous page'
    size='default'
    className={cn(
      'border-primary-100 max-h-9 min-h-9 min-w-9 max-w-9 cursor-pointer select-none gap-1 rounded-md px-2 transition-colors',
      className,
    )}
    {...props}
  >
    <ChevronLeftIcon className='h-6 w-6' />
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label='Go to next page'
    size='default'
    className={cn(
      'border-primary-100 max-h-9 min-h-9 min-w-9 max-w-9 cursor-pointer select-none gap-1 rounded-md px-2 transition-colors',
      className,
    )}
    {...props}
  >
    <ChevronRightIcon className='h-6 w-6' />
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn(
      'text-primary flex max-h-9 min-h-9 min-w-5 max-w-5 items-end justify-center',
      className,
    )}
    {...props}
  >
    <DotsHorizontalIcon className='h-4 w-4' />
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  PaginationContainer,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
