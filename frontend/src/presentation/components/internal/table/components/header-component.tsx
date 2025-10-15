/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@/utils/cn'
import ChevronSort from '../../../icons/ChevronSort'

export const HeaderComponent = ({
  title,
  column,
  isSorted = true,
}: {
  title: string
  column: any
  isSorted?: boolean
  className?: string
}) => (
  <div className={cn('flex w-full flex-row items-center justify-between')}>
    <p className='truncate text-start text-white select-none'>{title}</p>
    {isSorted && (
      <ChevronSort
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='h-3 w-3 cursor-pointer fill-white'
      />
    )}
  </div>
)
