import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate } from 'react-router-dom'
import { InteractiveMap } from '@/components/InteractiveMap'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'
import { Trash2, Plus } from 'lucide-react'

const pontoSchema = z.object({
  id: z.string(),
  numero_ponto: z.string(),
  lat: z.number(),
  lng: z.number(),
  tipo: z.string().min(1, 'Obrigatório'),
  valor: z.coerce.number().min(0, 'Inválido'),
})

const formSchema = z.object({
  data: z.string().min(1, 'Obrigatório'),
  localizacao: z.string().min(1, 'Obrigatório'),
  observacoes: z.string().optional(),
  pontos: z.array(pontoSchema).min(1, 'Adicione pelo menos 1 ponto no mapa'),
})

export default function NovoReporte() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: new Date().toISOString().split('T')[0],
      localizacao: '',
      observacoes: '',
      pontos: [],
    },
  })

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'pontos' })

  const handleMapClick = (lat: number, lng: number) => {
    append({
      id: crypto.randomUUID(),
      numero_ponto: `P${fields.length + 1}`,
      lat,
      lng,
      tipo: '',
      valor: 0,
    })
  }

  const handleMarkerDrag = (id: string, lat: number, lng: number) => {
    const index = form.getValues('pontos').findIndex((p) => p.id === id)
    if (index > -1) {
      form.setValue(`pontos.${index}.lat`, lat, { shouldValidate: true })
      form.setValue(`pontos.${index}.lng`, lng, { shouldValidate: true })
    }
  }

  const addManualPoint = () => {
    append({
      id: crypto.randomUUID(),
      numero_ponto: `P${fields.length + 1}`,
      lat: -23.55,
      lng: -46.6,
      tipo: '',
      valor: 0,
    })
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      const report = await pb.collection('reports').create({
        usuario_id: user.id,
        data: new Date(values.data).toISOString(),
        pontos_totais: values.pontos.length,
        valor_total: values.pontos.reduce((a, p) => a + p.valor, 0),
        status: 'pendente',
      })

      await Promise.all(
        values.pontos.map((p) =>
          pb.collection('pontos_instalacao').create({
            report_id: report.id,
            numero_ponto: p.numero_ponto,
            coordenadas_lat: p.lat,
            coordenadas_lng: p.lng,
            tipo_instalacao: p.tipo,
            valor: p.valor,
          }),
        ),
      )

      toast({ title: 'Reporte salvo com sucesso!' })
      navigate('/meus-reports')
    } catch {
      toast({ title: 'Erro ao salvar', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const pontos = form.watch('pontos')
  const totalValor = pontos.reduce((a, p) => a + (Number(p.valor) || 0), 0)

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-6rem)] gap-6 animate-fade-in-up">
      <div className="w-full lg:w-[60%] h-[50vh] lg:h-auto min-h-[400px] relative">
        <InteractiveMap
          points={pontos}
          onMapClick={handleMapClick}
          onMarkerDrag={handleMarkerDrag}
          onClear={() => form.setValue('pontos', [])}
        />
      </div>

      <div className="w-full lg:w-[40%] flex flex-col h-auto lg:h-[calc(100vh-6rem)]">
        <Card className="flex flex-col h-full shadow-sm border-t-4 border-t-primary overflow-hidden">
          <CardHeader className="shrink-0 pb-4">
            <CardTitle>Novo Reporte</CardTitle>
            <CardDescription>Registre os pontos de instalação realizados.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <ScrollArea className="flex-1 px-6">
                <div className="space-y-4 pb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="data"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="localizacao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Localização</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Centro" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-b pb-2">
                    <h3 className="font-semibold text-sm">Pontos Marcados</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addManualPoint}>
                      <Plus className="h-4 w-4 mr-1" /> Manual
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-3 border rounded-lg bg-muted/30 space-y-3 relative group hover:bg-muted/50 transition-colors"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="shadow-sm">
                          {field.numero_ponto}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          Lat: {form.watch(`pontos.${index}.lat`).toFixed(4)}, Lng:{' '}
                          {form.watch(`pontos.${index}.lng`).toFixed(4)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name={`pontos.${index}.tipo`}
                          render={({ field }) => (
                            <FormItem>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-8 text-xs bg-background">
                                    <SelectValue placeholder="Tipo" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {['Fibra', 'Poste', 'Âncora', 'Outro'].map((t) => (
                                    <SelectItem key={t} value={t}>
                                      {t}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-[10px] m-0" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`pontos.${index}.valor`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="Valor"
                                  className="h-8 text-xs bg-background"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-[10px] m-0" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                  {form.formState.errors.pontos?.root && (
                    <p className="text-sm text-destructive font-medium">
                      {form.formState.errors.pontos.root.message}
                    </p>
                  )}

                  <FormField
                    control={form.control}
                    name="observacoes"
                    render={({ field }) => (
                      <FormItem className="pt-2">
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Notas adicionais sobre a instalação..."
                            {...field}
                            value={field.value || ''}
                            className="resize-none"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </ScrollArea>

              <div className="p-6 border-t bg-muted/30 shrink-0 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Total de Pontos</p>
                    <p className="text-3xl font-extrabold">{pontos.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground font-medium">Valor Total</p>
                    <p className="text-3xl font-extrabold text-primary">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(totalValor)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/')}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="w-full shadow-md">
                    {isSubmitting ? 'Salvando...' : 'Salvar Reporte'}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  )
}
