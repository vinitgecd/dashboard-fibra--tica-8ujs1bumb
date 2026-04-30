import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
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
import { Search, Inbox, Plus, Edit, Trash2, CheckCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import pb from '@/lib/pocketbase/client'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { useToast } from '@/hooks/use-toast'

export default function MeusReports() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { user } = useAuth()
  const { toast } = useToast()

  const loadData = async () => {
    try {
      const filter = user?.perfil === 'tecnico' ? `usuario_id = "${user?.id}"` : ''
      const records = await pb.collection('reports').getFullList({
        filter,
        sort: '-created',
        expand: 'usuario_id',
      })
      setReports(records)
    } catch {
      toast({ title: 'Erro ao carregar reports', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) loadData()
  }, [user])

  useRealtime('reports', () => {
    loadData()
  })

  const handleApprove = async (id: string) => {
    try {
      await pb.collection('reports').update(id, { status: 'aprovado' })
      toast({ title: 'Reporte aprovado com sucesso!' })
    } catch {
      toast({ title: 'Erro ao aprovar', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await pb.collection('reports').delete(id)
      toast({ title: 'Reporte excluído com sucesso!' })
    } catch {
      toast({ title: 'Erro ao excluir', variant: 'destructive' })
    }
  }

  const filteredReports = useMemo(() => {
    return reports.filter(
      (r) =>
        r.expand?.usuario_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.expand?.usuario_id?.email?.toLowerCase().includes(search.toLowerCase()) ||
        r.status.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase()),
    )
  }, [search, reports])

  const canApprove = user?.perfil === 'admin' || user?.perfil === 'supervisor'

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
          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : filteredReports.length === 0 ? (
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
                    <TableHead className="w-[100px] whitespace-nowrap">ID</TableHead>
                    <TableHead className="whitespace-nowrap">Técnico</TableHead>
                    <TableHead className="whitespace-nowrap">Data</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Pontos</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Valor</TableHead>
                    <TableHead className="text-center whitespace-nowrap">Status</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-muted/50 group">
                      <TableCell className="font-medium text-muted-foreground text-xs uppercase">
                        {report.id.substring(0, 8)}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {report.expand?.usuario_id?.name ||
                          report.expand?.usuario_id?.email ||
                          'Desconhecido'}
                      </TableCell>
                      <TableCell>
                        {new Intl.DateTimeFormat('pt-BR').format(new Date(report.data))}
                      </TableCell>
                      <TableCell className="text-right">{report.pontos_totais}</TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(report.valor_total || 0)}
                      </TableCell>
                      <TableCell className="text-center">
                        <StatusBadge status={report.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {canApprove && report.status === 'pendente' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600 hover:text-green-700 hover:bg-green-100"
                              onClick={() => handleApprove(report.id)}
                              title="Aprovar"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" asChild title="Editar">
                            <Link to={`/editar-reporte/${report.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:bg-red-100 hover:text-red-700"
                                title="Excluir"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir Reporte?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. O reporte e todos os seus pontos
                                  serão excluídos permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(report.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Sim, excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
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
