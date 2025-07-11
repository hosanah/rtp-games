import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { useAuth } from '@/hooks/useAuth'
import { GamepadIcon, TrendingUpIcon, BarChart3Icon, ClockIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="mt-2 text-blue-100">
            Monitore e analise o RTP dos seus jogos favoritos
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <GamepadIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total de Jogos
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    8
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUpIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    RTP Médio
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    96.2%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <BarChart3Icon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Registros RTP
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    0
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Última Atividade
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    -
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">
                Ações Rápidas
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link
                  to="/games"
                  className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <GamepadIcon className="h-5 w-5 text-blue-600" />
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      Ver Todos os Jogos
                    </span>
                  </div>
                </Link>
                <Link
                  to="/rtp-history"
                  className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <BarChart3Icon className="h-5 w-5 text-blue-600" />
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      Histórico RTP
                    </span>
                  </div>
                </Link>
                <Link
                  to="/stats"
                  className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <TrendingUpIcon className="h-5 w-5 text-blue-600" />
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      Estatísticas Detalhadas
                    </span>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">
                Atividade Recente
              </h3>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ClockIcon className="h-12 w-12 text-gray-300 mx-auto" />
                <p className="mt-2 text-sm text-gray-500">
                  Nenhuma atividade recente
                </p>
                <p className="text-xs text-gray-400">
                  Comece adicionando registros RTP para ver sua atividade aqui
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

