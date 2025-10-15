import React from 'react'
import { Button } from '../../ui'

interface ModalDeleteProps {
  icon?: React.ReactNode
  title: string
  message: string
  isLoading?: boolean
  onCancel?: () => void
  onConfirm: () => void
  textButtonConfirm?: string
}

export function ModalConfirm({
  icon,
  title,
  message,
  isLoading,
  onCancel,
  onConfirm,
  textButtonConfirm,
}: ModalDeleteProps) {
  return (
    <div className='flex h-full w-full max-w-[540px] min-w-[400px] flex-col items-center justify-center gap-2 select-none'>
      {icon}
      <label className='text-center text-2xl font-bold text-primary-600'>
        {title}
      </label>
      <label className='text-center text-base font-normal text-neutral-500'>
        {message}
      </label>

      <div className='mt-6 flex w-full flex-row items-center justify-center gap-4'>
        {onCancel && (
          <Button variant='ghost' className='w-full' onClick={() => onCancel()}>
            Cancelar
          </Button>
        )}
        <Button
          variant='default'
          isLoading={isLoading}
          className='w-full'
          onClick={onConfirm}
        >
          {textButtonConfirm}
        </Button>
      </div>
    </div>
  )
}
