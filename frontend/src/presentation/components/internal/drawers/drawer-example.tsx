import { Button } from '@/presentation/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { LinkIcon, LucideSeparatorVertical } from 'lucide-react';
import { CustomInput } from '../custom-input';

const SocialMediaSchema = z.object({
  url: z.string().min(1, 'URL é obrigatória'),
});

type SocialMediaFormData = z.infer<typeof SocialMediaSchema>;

export function DrawerExample({ closeModal }: { closeModal: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SocialMediaFormData>({
    resolver: zodResolver(SocialMediaSchema),
  });

  const url = watch('url');

  return (
    <div
      className='w-full'
      onKeyDown={e => {
        if (e.key === 'Escape') {
          closeModal();
        }
      }}
    >
      <div className='flex flex-row'>
        <div className='dark:bg-dark-stone-200 mt-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 group-hover:bg-gray-200'>
          <LucideSeparatorVertical className='dark:fill-dark-stone-100 h-5 fill-neutral-800' />
        </div>
        <div className='ml-2 max-w-[calc(100%-50px)]'>
          <h1 className='dark:text-dark-stone-100 mb-1 text-[32px] text-base font-semibold text-black'>
            Social Media
          </h1>
          <p className='dark:text-dark-stone-200 mb-5 text-sm font-normal text-neutral-700'>
            Cole o link do conteúdo de uma rede social.
          </p>
        </div>
      </div>
      <CustomInput
        name='url'
        type='url'
        control={control}
        prefixItem={<LinkIcon className='dark:text-dark-stone-200 h-4 text-neutral-800' />}
        className='h-13'
        placeholder='Cole aqui o link'
        errorMessage={errors.url?.message}
        autoFocus
        required
      />
      <div className='bg-container-internal-background dark:bg-linear-to-l dark:from-dark-header-from dark:to-dark-header-to absolute bottom-0 left-0 mt-7 flex w-full items-center justify-end gap-4 rounded-b-xl p-8'>
        <Button variant='secondary' className='h-[52px]! min-w-36' onClick={closeModal}>
          Cancelar
        </Button>
        <Button
          id='add-social-media'
          className='h-[52px]! min-w-36'
          type='button'
          disabled={!url || isLoading}
          onClick={handleSubmit(data => {
            console.log('Social Media Data:', data);
          })}
          isLoading={isLoading}
        >
          Adicionar
        </Button>
      </div>
    </div>
  );
}
