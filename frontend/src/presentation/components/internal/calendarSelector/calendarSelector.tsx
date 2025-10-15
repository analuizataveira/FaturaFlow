import { CalendarIcon } from 'lucide-react'
import {
  Button,
  Calendar,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../index'
import { format } from 'date-fns'
import { cn } from '@/utils/cn'

interface CalendarSelectorProps {
  label?: string
  selectedDate?: Date
  placeholder?: string
  mask?: string
  onSelectDate?: (date?: Date) => void
}

export function CalendarSelector({
  label,
  selectedDate,
  placeholder,
  mask,
  onSelectDate,
}: CalendarSelectorProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          {label && <Label className='text-sm text-neutral-700'>{label}</Label>}
          <div className='flex items-center gap-2'>
            <Button
              type='button'
              className={cn(
                'flex h-10 w-full items-center justify-start rounded border border-neutral-500 px-2 font-normal',
                'from-transparent to-transparent hover:from-transparent hover:to-transparent',
                selectedDate && 'text-black',
                !selectedDate && 'text-neutral-400',
              )}
            >
              {selectedDate && format(selectedDate, mask ?? 'dd/MM/yyyy')}
              {!selectedDate && placeholder}
            </Button>
            <div className='flex max-h-7 min-h-7 max-w-7 min-w-7 cursor-pointer items-center justify-center rounded-sm bg-gradient-to-b from-primary to-primary-700'>
              <CalendarIcon className='max-h-4 min-h-4 max-w-4 min-w-4 stroke-white stroke-2' />
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={selectedDate}
          onSelect={date => {
            if (onSelectDate) onSelectDate(date)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
