import React from 'react'
import Layout from '@/components/layout/Layout'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { useAuth } from '@/hooks/useAuth'
import { GamepadIcon, TrendingUpIcon, BarChart3Icon, ClockIcon } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="mt-2 text-primary-100">
            Monitore e analise o RTP dos seus jogos favoritos
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <GamepadIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">
                    Total de Jogos
                  </p>
                  <p className="text-2xl font-bold text-secondary-900">
                    8
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-success-100 rounded-lg">
                  <TrendingUpIcon className="h-6 w-6 text-success-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">
                    RTP Médio
                  </p>
                  <p className="text-2xl font-bold text-secondary-900">
                    96.2%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-warning-100 rounded-lg">
                  <BarChart3Icon className="h-6 w-6 text-warning-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">
                    Registros RTP
                  </p>
                  <p className="text-2xl font-bold text-secondary-900">
                    0
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-error-100 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-error-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">
                    Última Atividade
                  </p>
                  <p className="text-2xl font-bold text-secondary-900">
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
              <h3 className="text-lg font-medium text-secondary-900">
                Ações Rápidas
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a
                  href="/games"
                  className="block p-3 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  <div className="flex items-center">
                    <GamepadIcon className="h-5 w-5 text-primary-600" />
                    <span className="ml-3 text-sm font-medium text-secondary-900">
                      Ver Todos os Jogos
                    </span>
                  </div>
                </a>
                <a
                  href="/rtp-history"
                  className="block p-3 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  <div className="flex items-center">
                    <BarChart3Icon className="h-5 w-5 text-primary-600" />
                    <span className="ml-3 text-sm font-medium text-secondary-900">
                      Histórico RTP
                    </span>
                  </div>
                </a>
                <a
                  href="/stats"
                  className="block p-3 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  <div className="flex items-center">
                    <TrendingUpIcon className="h-5 w-5 text-primary-600" />
                    <span className="ml-3 text-sm font-medium text-secondary-900">
                      Estatísticas Detalhadas
                    </span>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-secondary-900">
                Atividade Recente
              </h3>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ClockIcon className="h-12 w-12 text-secondary-300 mx-auto" />
                <p className="mt-2 text-sm text-secondary-500">
                  Nenhuma atividade recente
                </p>
                <p className="text-xs text-secondary-400">
                  Comece adicionando registros RTP para ver sua atividade aqui
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

