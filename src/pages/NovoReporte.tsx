import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Save } from 'lucide-react'

const formSchema = z.object({
  tecnico: z.string().min(2, 'Nome do técnico é obrigatório'),
  data: z.string().min(1, 'Data é obrigatória'),
  pontos: z.coerce.number().min(1, 'Deve ser pelo menos 1 ponto'),
  descricao: z.string().optional(),
})

export default function NovoReporte() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tecnico: '',
      data: new Date().toISOString().split('T')[0],
      pontos: 1,
      descricao: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: 'Reporte Criado',
        description: 'Seu reporte foi salvo com sucesso e está pendente de aprovação.',
      })
      form.reset()
    }, 1500)
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <Card className="hover:shadow-md transition-shadow border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle className="text-2xl">Novo Reporte</CardTitle>
          <CardDescription>
            Preencha os dados da instalação de fibra ótica realizada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="tecnico"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Técnico</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: João Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="data"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data da Instalação</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="pontos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade de Pontos</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição / Observações (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Adicione detalhes sobre a instalação, materiais extras usados, etc."
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto gap-2">
                  {isSubmitting ? (
                    <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Salvar Reporte
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
