import type React from "react"

import { UserPlus, Loader2, AlertCircle, ArrowLeft } from "lucide-react"
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input, Label } from "@/presentation/components"

interface User {
  name: string
  email: string
  password: string
}

interface RegisterFormProps {
  user: User
  error: string
  isLoading: boolean
  onUserChange: (user: User) => void
  onSubmit: (event: React.FormEvent) => void
  onBackToLogin: () => void
}

export default function RegisterForm({
  user,
  error,
  isLoading,
  onUserChange,
  onSubmit,
  onBackToLogin,
}: RegisterFormProps) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUserChange({ ...user, [e.target.name]: e.target.value })
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/5 via-background to-primary/5 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
          </div>
          <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
          <CardDescription>Preencha os dados abaixo para criar sua conta</CardDescription>
        </CardHeader>

        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="mb-4 rounded bg-red-100 p-2 text-center text-sm text-red-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="João Silva"
                value={user.name}
                onChange={handleChange}
                required
                minLength={3}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={user.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={user.password}
                onChange={handleChange}
                required
                minLength={6}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">A senha deve ter no mínimo 6 caracteres</p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" disabled={isLoading} className="w-full" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Criar conta
                </>
              )}
            </Button>

            <Button type="button" variant="ghost" className="w-full" onClick={onBackToLogin}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Já tem uma conta? Faça login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
