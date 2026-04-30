import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, CheckCircle, Clock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/use-auth'

export default function Invoices() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()

  const loadData = async () => {
    try {
      const filter = user?.perfil === 'tecnico' ? `usuario_id = "${user?.id}"` : ''
      const records = await pb.collection('invoices').getFullList({
        filter,
        sort: '-created',
        expand: 'usuario_id',
      })
      setInvoices(records)
    } catch {
      toast({ title: 'Erro ao carregar invoices', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) loadData()
  }, [user])

  useRealtime('invoices', () => {
    loadData()
  })

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    if (currentStatus === 'gerada') return
    try {
      await pb.collection('invoices').update(id, { status: 'gerada' })
      toast({ title: 'Fatura gerada com sucesso!' })
    } catch {
      toast({ title: 'Erro ao atualizar fatura', variant: 'destructive' })
    }
  }

  const handleDownload = (id: string) => {
    toast({
      title: 'Download Iniciado',
      description: `A fatura ${id.substring(0, 8)} está sendo gerada em PDF.`,
    })
  }

  const canApprove = user?.perfil === 'admin' || user?.perfil === 'supervisor'

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
        <p className="text-muted-foreground mt-1">
          Faturas financeiras geradas automaticamente a partir dos reports aprovados.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : invoices.length === 0 ? (
        <Card className="bg-muted/30 border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center p-16 text-center">
            <div className="h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold mb-1">Nenhuma fatura disponível</h3>
            <p className="text-muted-foreground max-w-sm">
              As faturas aparecerão aqui assim que forem geradas pelo sistema.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invoices.map((inv) => (
            <Card
              key={inv.id}
              className="hover:shadow-md transition-shadow duration-200 border-t-4 border-t-primary flex flex-col bg-card"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold">
                      {inv.expand?.usuario_id?.name ||
                        inv.expand?.usuario_id?.email ||
                        'Desconhecido'}
                    </CardTitle>
                    <CardDescription className="mt-1 font-mono text-xs tracking-wider uppercase">
                      FATURA: {inv.id.substring(0, 8)}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={inv.status === 'gerada' ? 'default' : 'secondary'}
                    className="ml-2"
                  >
                    {inv.status === 'gerada' ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Gerada
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Rascunho
                      </span>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Período</span>
                    <span className="font-medium text-xs">
                      {new Intl.DateTimeFormat('pt-BR').format(new Date(inv.semana_inicio))} -{' '}
                      {new Intl.DateTimeFormat('pt-BR').format(new Date(inv.semana_fim))}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Total de Pontos</span>
                    <span className="font-medium">{inv.total_pontos} pt</span>
                  </div>
                </div>
                <div className="mt-6 bg-muted/50 rounded-lg p-4 flex justify-between items-center">
                  <span className="font-semibold text-muted-foreground">Total a Pagar</span>
                  <span className="text-2xl font-bold text-primary">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(inv.valor_total || 0)}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex flex-col gap-2">
                {canApprove && inv.status === 'rascunho' && (
                  <Button
                    className="w-full gap-2"
                    onClick={() => handleUpdateStatus(inv.id, inv.status)}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Aprovar para Geração
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/50"
                  onClick={() => handleDownload(inv.id)}
                  disabled={inv.status !== 'gerada'}
                >
                  <Download className="h-4 w-4" />
                  Baixar Relatório (PDF)
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
