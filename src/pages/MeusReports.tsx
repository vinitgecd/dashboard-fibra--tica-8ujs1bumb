import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { mockReports, formatCurrency, formatDate } from '@/lib/mock-data'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/StatusBadge'
import { Search, Inbox, Plus } from 'lucide-react'

export default function MeusReports() {
  const [search, setSearch] = useState('')

  const filteredReports = useMemo(() => {
    return mockReports.filter(
      (r) =>
        r.tecnico.toLowerCase().includes(search.toLowerCase()) ||
        r.status.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase()),
    )
  }, [search])

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Meus Reports</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie e acompanhe todos os relatórios de instalação.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por ID, técnico ou status..."
              className="pl-8 bg-card"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button asChild size="icon" className="shrink-0 hidden sm:flex">
            <Link to="/novo-reporte">
              <Plus className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          {filteredReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center animate-fade-in">
              <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                <Inbox className="h-10 w-10 text-muted-foreground/60" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nenhum reporte encontrado</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Não encontramos nenhum reporte correspondente à sua busca ou você ainda não criou
                nenhum.
              </p>
              <Button asChild>
                <Link to="/novo-reporte">Criar primeiro reporte</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px] whitespace-nowrap">ID</TableHead>
                    <TableHead className="whitespace-nowrap">Técnico</TableHead>
                    <TableHead className="whitespace-nowrap">Data</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Pontos</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Valor</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-muted/50 group">
                      <TableCell className="font-medium text-muted-foreground">
                        {report.id}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {report.tecnico}
                      </TableCell>
                      <TableCell>{formatDate(report.data)}</TableCell>
                      <TableCell className="text-right">{report.pontos}</TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        {formatCurrency(report.valor)}
                      </TableCell>
                      <TableCell className="text-right">
                        <StatusBadge status={report.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
