import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { GamepadIcon, UserIcon, LogOutIcon, BarChart3Icon } from 'lucide-react'

export default function Header() {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white/80 dark:bg-black/70 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <GamepadIcon className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              RTP Games Dashboard
            </span>
          </Link>

          {/* Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/games"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Jogos
              </Link>
              <Link
                to="/houses"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Casas
              </Link>
              <Link
                to="/stats"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <BarChart3Icon className="h-4 w-4 inline mr-1" />
                Estatísticas
              </Link>
            </nav>
          )}

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600"
                >
                  <LogOutIcon className="h-4 w-4 mr-1" />
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

