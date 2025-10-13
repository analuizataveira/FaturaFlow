import type React from 'react';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/presentation/components';
import { Loader2, LogIn } from 'lucide-react';

interface LoginFormProps {
  email: string;
  password: string;
  error: string;
  isLoading: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onCreateAccount: () => void;
}

export default function LoginForm({
  email,
  password,
  error,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onCreateAccount,
}: LoginFormProps) {

  return (
    <div className='from-primary/5 via-background to-accent/5 flex min-h-screen items-center justify-center bg-gradient-to-br p-4'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='space-y-1 text-center'>
          <div className='mb-4 flex justify-center'>
            <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full'>
              <LogIn className='text-primary h-6 w-6' />
            </div>
          </div>
          <CardTitle className='text-2xl font-bold'>Bem-vindo de volta</CardTitle>
          <CardDescription>Entre com suas credenciais para acessar sua conta</CardDescription>
        </CardHeader>

        <form onSubmit={onSubmit}>
          <CardContent className='space-y-4'>
            {error && (
              <div className='mb-4 rounded bg-red-100 p-2 text-center text-sm text-red-700'>
                {error}
              </div>
            )}

            <div className='space-y-2'>
              <Label htmlFor='email'>E-mail</Label>
              <Input
                id='email'
                name='email'
                type='email'
                autoComplete='username'
                placeholder='seu@email.com'
                value={email}
                onChange={e => onEmailChange(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Senha</Label>
              <Input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                placeholder='••••••••'
                value={password}
                onChange={e => onPasswordChange(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>

          <CardFooter className='flex flex-col space-y-4'>
            <Button type='submit' disabled={isLoading} className='w-full' size='lg'>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className='mr-2 h-4 w-4' />
                  Entrar
                </>
              )}
            </Button>

            <div className='text-muted-foreground text-center text-sm'>
              Não tem uma conta?{' '}
              <Button
                type='button'
                variant='link'
                className='h-auto p-0 font-semibold'
                onClick={onCreateAccount}
              >
                Criar conta
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
