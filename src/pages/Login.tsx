import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Leaf } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Formato de email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    const { error } = await signIn(values.email, values.password)
    setIsLoading(false)

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro de Autenticação',
        description: 'Credenciais inválidas. Tente novamente.',
      })
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50/60 p-0 md:p-4">
      <Card className="w-full h-full md:h-auto md:max-w-md rounded-none md:rounded-xl shadow-none md:shadow-lg border-0 md:border flex flex-col justify-center animate-fade-in-up bg-white">
        <CardHeader className="space-y-3 items-center text-center pb-8 pt-16 md:pt-6">
          <div className="w-16 h-16 bg-primary text-primary-foreground flex items-center justify-center rounded-2xl shadow-sm mb-2">
            <Leaf className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Krummenauer's LLC</CardTitle>
          <CardDescription>Acesse o painel de controle</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Senha</FormLabel>
                      <a
                        href="#"
                        className="text-xs text-primary hover:underline"
                        onClick={(e) => e.preventDefault()}
                      >
                        Esqueceu a senha?
                      </a>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
