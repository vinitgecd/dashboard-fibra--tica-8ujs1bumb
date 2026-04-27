export type ReportStatus = 'Pendente' | 'Aprovado' | 'Rejeitado'

export interface Report {
  id: string
  tecnico: string
  data: string
  pontos: number
  valor: number
  status: ReportStatus
  descricao?: string
}

export const mockReports: Report[] = [
  {
    id: 'REP-001',
    tecnico: 'João Silva',
    data: '2023-10-25',
    pontos: 12,
    valor: 360,
    status: 'Aprovado',
  },
  {
    id: 'REP-002',
    tecnico: 'Carlos Sousa',
    data: '2023-10-25',
    pontos: 8,
    valor: 240,
    status: 'Pendente',
  },
  {
    id: 'REP-003',
    tecnico: 'Ana Lima',
    data: '2023-10-24',
    pontos: 15,
    valor: 450,
    status: 'Aprovado',
  },
  {
    id: 'REP-004',
    tecnico: 'Marcos Paulo',
    data: '2023-10-24',
    pontos: 5,
    valor: 150,
    status: 'Rejeitado',
  },
  {
    id: 'REP-005',
    tecnico: 'João Silva',
    data: '2023-10-23',
    pontos: 20,
    valor: 600,
    status: 'Aprovado',
  },
  {
    id: 'REP-006',
    tecnico: 'Beatriz Costa',
    data: '2023-10-23',
    pontos: 10,
    valor: 300,
    status: 'Pendente',
  },
  {
    id: 'REP-007',
    tecnico: 'Felipe Ramos',
    data: '2023-10-22',
    pontos: 7,
    valor: 210,
    status: 'Aprovado',
  },
  {
    id: 'REP-008',
    tecnico: 'João Silva',
    data: '2023-10-21',
    pontos: 22,
    valor: 660,
    status: 'Aprovado',
  },
]

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export const formatDate = (dateString: string) => {
  // Adds fake timezone consistency for dates just displayed as 'YYYY-MM-DD'
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR')
}
