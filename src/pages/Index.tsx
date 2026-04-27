import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockReports, formatCurrency, formatDate } from '@/lib/mock-data'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/StatusBadge'
import { Activity, AlertCircle, CheckCircle2, TrendingUp, Users } from 'lucide-react'

export default function Index() {
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const totalReports = mockReports.length
  const totalPoints = mockReports.reduce((acc, curr) => acc + curr.pontos, 0)
  const totalValue = mockReports.reduce((acc, curr) => acc + curr.valor, 0)
  const pendingCount = mockReports.filter((r) => r.status === 'Pendente').length
  const approvedCount = mockReports.filter((r) => r.status === 'Aprovado').length

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-3xl font-bold tracking-tight">Bem-vindo, Carlos</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Reports (Semana)
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{totalReports}</div>
            <p className="text-xs text-muted-foreground mt-1">+12% em relação à semana anterior</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pontos Instalados
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{totalPoints}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Média de {(totalPoints / totalReports).toFixed(1)} por reporte
            </p>
          </CardContent>
        </Card>

        <Card className="bg-primary border-transparent text-primary-foreground hover:shadow-md transition-all duration-200 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 bg-white/10 rounded-full w-24 h-24 blur-2xl" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-primary-foreground/90">
              Valor Total
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary-foreground/90" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-extrabold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-primary-foreground/80 mt-1">Acumulado do período atual</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status Geral
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 mt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Aprovados</span>
                </div>
                <span className="text-sm font-bold">{approvedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">Pendentes</span>
                </div>
                <span className="text-sm font-bold">{pendingCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle>Últimos Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Técnico</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Pontos</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockReports.slice(0, 5).map((report) => (
                  <TableRow
                    key={report.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => navigate('/meus-reports')}
                  >
                    <TableCell className="font-medium">{report.tecnico}</TableCell>
                    <TableCell>{formatDate(report.data)}</TableCell>
                    <TableCell>{report.pontos}</TableCell>
                    <TableCell className="font-semibold text-primary">
                      {formatCurrency(report.valor)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={report.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
