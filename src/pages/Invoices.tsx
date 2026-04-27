import { mockReports, formatCurrency, formatDate } from '@/lib/mock-data'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Invoices() {
  const { toast } = useToast()

  // Simulate invoices generation grouped by technician (only Approved ones)
  const invoices = mockReports.reduce((acc, report) => {
    if (report.status !== 'Aprovado') return acc

    const existing = acc.find((i) => i.tecnico === report.tecnico)
    if (existing) {
      existing.total += report.valor
      existing.pontos += report.pontos
      existing.reports++
    } else {
      acc.push({
        id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        tecnico: report.tecnico,
        total: report.valor,
        pontos: report.pontos,
        reports: 1,
        data: new Date().toISOString(),
      })
    }
    return acc
  }, [] as any[])

  const handleDownload = (id: string) => {
    toast({
      title: 'Download Iniciado',
      description: `A fatura ${id} está sendo gerada em PDF.`,
    })
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
        <p className="text-muted-foreground mt-1">
          Faturas financeiras geradas automaticamente a partir dos reports aprovados.
        </p>
      </div>

      {invoices.length === 0 ? (
        <Card className="bg-muted/30 border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center p-16 text-center">
            <div className="h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold mb-1">Nenhuma fatura disponível</h3>
            <p className="text-muted-foreground max-w-sm">
              As faturas aparecerão aqui assim que existirem reports marcados como "Aprovado" no
              sistema.
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
                    <CardTitle className="text-xl font-bold">{inv.tecnico}</CardTitle>
                    <CardDescription className="mt-1 font-mono text-xs tracking-wider">
                      FATURA: {inv.id}
                    </CardDescription>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Data de Emissão</span>
                    <span className="font-medium">{formatDate(inv.data)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Reports Consolidados</span>
                    <span className="font-medium">{inv.reports}</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Total de Pontos</span>
                    <span className="font-medium">{inv.pontos} pt</span>
                  </div>
                </div>
                <div className="mt-6 bg-muted/50 rounded-lg p-4 flex justify-between items-center">
                  <span className="font-semibold text-muted-foreground">Total a Pagar</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(inv.total)}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="outline"
                  className="w-full gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/50"
                  onClick={() => handleDownload(inv.id)}
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
