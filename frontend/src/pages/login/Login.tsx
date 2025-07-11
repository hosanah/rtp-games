import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { GamepadIcon } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true)
      setError('')
      await login(data.email, data.password)
      navigate('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <GamepadIcon className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-secondary-900">
          Entre na sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-secondary-600">
          Ou{' '}
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            crie uma nova conta
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-secondary-900">Login</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              <Input
                label="Email"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Senha"
                type="password"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
              />

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                Entrar
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-secondary-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-secondary-500">
                    Credenciais de teste
                  </span>
                </div>
              </div>
              <div className="mt-4 text-sm text-secondary-600 bg-secondary-50 p-3 rounded-md">
                <p><strong>Email:</strong> admin@rtpgames.com</p>
                <p><strong>Senha:</strong> 123456</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

