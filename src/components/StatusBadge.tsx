import { Badge } from '@/components/ui/badge'

export function StatusBadge({ status }: { status: string }) {
  if (status === 'Aprovado') {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none font-medium">
        Aprovado
      </Badge>
    )
  }
  if (status === 'Rejeitado') {
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-none font-medium">
        Rejeitado
      </Badge>
    )
  }
  return (
    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none font-medium">
      Pendente
    </Badge>
  )
}
