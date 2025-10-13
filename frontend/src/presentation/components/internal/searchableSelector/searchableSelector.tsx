import { Check, ChevronsUpDown } from 'lucide-react'
import { ReactNode, useState } from 'react'
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../ui'
import { cn } from '@/utils/cn'

interface SearchableItem {
  value: string
  content: ReactNode
}

interface SearchableSelectorProps {
  label?: string
  presentationValue?: string
  selectedValue: string
  data: SearchableItem[]
  placeholder?: string
  inputPlaceholder?: string
  emptyMessage?: string
  labelClassName?: string
  triggerClassName?: string
  contentClassName?: string
  prefixItem?: ReactNode
  suffixItem?: ReactNode
  onInputValueChange?: (value: string) => void
  onSelectValue?: (value: string) => void
}

export function SearchableSelector({
  label,
  selectedValue,
  presentationValue,
  data,
  placeholder,
  inputPlaceholder,
  emptyMessage,
  labelClassName,
  triggerClassName,
  contentClassName,
  prefixItem,
  suffixItem,
  onInputValueChange,
  onSelectValue,
}: SearchableSelectorProps) {
  const [open, setOpen] = useState(false)

  const text =
    presentationValue === undefined ? selectedValue : presentationValue

  return (
    <>
      {label && (
        <Label className={cn('text-sm text-neutral-700', labelClassName)}>
          {label}
        </Label>
      )}
      <div className='flex w-full items-center justify-center gap-2'>
        {prefixItem}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              className={cn(
                'flex h-10 w-full items-center justify-between rounded border border-neutral-500 px-2 font-normal',
                'from-transparent to-transparent hover:from-transparent hover:to-transparent',
                text !== '' && 'text-black',
                text === '' && 'text-neutral-400',
                triggerClassName,
              )}
            >
              {text !== '' ? text : (placeholder ?? '')}
              <ChevronsUpDown className='opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent align='start' className={cn('p-0', contentClassName)}>
            <Command>
              <CommandInput
                placeholder={inputPlaceholder ?? ''}
                onValueChange={text => {
                  if (onInputValueChange) onInputValueChange(text)
                }}
              />
              <CommandList>
                <CommandEmpty>
                  {emptyMessage ?? 'Nenhum dado encontrado'}
                </CommandEmpty>
                <CommandGroup>
                  {data.map(item => (
                    <CommandItem
                      key={`${item.value}`}
                      value={`${item.value}`}
                      onSelect={currentValue => {
                        const selectedItem = data.find(
                          item => item.value === currentValue,
                        )
                        if (!selectedItem) return
                        if (onSelectValue) onSelectValue(selectedItem.value)
                        setOpen(false)
                      }}
                    >
                      {item.content}
                      <Check
                        className={cn(
                          'ml-auto',
                          selectedValue === item.value
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {suffixItem}
      </div>
    </>
  )
}
