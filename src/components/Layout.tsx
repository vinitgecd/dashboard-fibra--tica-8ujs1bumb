import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home, Plus, List, FileText, LogOut } from 'lucide-react'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

export default function Layout() {
  const location = useLocation()
  const { user, signOut } = useAuth()

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b px-6 py-5 flex flex-row items-center gap-3">
          <div className="w-8 h-8 bg-secondary text-primary flex items-center justify-center font-bold text-xl rounded shadow-sm">
            K
          </div>
          <span className="font-bold text-lg text-foreground tracking-tight truncate">
            Krummenauer's
          </span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="mt-4">
            <SidebarMenu className="gap-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/'}>
                  <Link to="/">
                    <Home /> <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/novo-reporte'}>
                  <Link to="/novo-reporte">
                    <Plus /> <span>Novo Reporte</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/meus-reports'}>
                  <Link to="/meus-reports">
                    <List /> <span>Meus Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/invoices'}>
                  <Link to="/invoices">
                    <FileText /> <span>Invoices</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{user?.name || user?.email || 'Usuário'}</span>
            <span className="text-xs text-muted-foreground capitalize">
              {user?.perfil || 'Membro'}
            </span>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <h1 className="font-semibold text-lg ml-2 hidden sm:block">Reporte de Fibra Ótica</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <span className="hidden sm:block">Sair</span>
            <LogOut className="w-4 h-4" />
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
