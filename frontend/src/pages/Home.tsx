
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { GamepadIcon } from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        navigate('/dashboard')
      } else {
        navigate('/login')
      }
    }
  }, [isAuthenticated, loading, navigate])

  // Loading screen
  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col justify-center items-center">
      <div className="text-center">
        <GamepadIcon className="h-16 w-16 text-primary-600 mx-auto animate-pulse" />
        <h1 className="mt-4 text-2xl font-bold text-secondary-900">
          RTP Games Dashboard
        </h1>
        <p className="mt-2 text-secondary-600">Carregando...</p>
      </div>
    </div>
  )
}

