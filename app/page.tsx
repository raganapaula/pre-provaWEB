import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Car, Plus, List } from "lucide-react"

export default function HomePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <Car className="h-6 w-6" />
            <h1 className="text-lg font-semibold">Gerenciador de Carros</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sistema de Cadastro</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Carros</div>
                <p className="text-xs text-muted-foreground">Gerencie marca, modelo e placa</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cadastrar</CardTitle>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Novo Carro</div>
                <p className="text-xs text-muted-foreground">Adicione um novo veículo</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Listar</CardTitle>
                <List className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Ver Todos</div>
                <p className="text-xs text-muted-foreground">Visualize e gerencie carros</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Bem-vindo ao Sistema</CardTitle>
                <CardDescription>
                  Sistema completo para gerenciamento de carros com integração à API externa.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Use o menu lateral para navegar entre as funcionalidades:
                </p>
                <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                  <li>
                    • <strong>Lista de Carros:</strong> Visualize todos os carros cadastrados
                  </li>
                  <li>
                    • <strong>Cadastrar Carro:</strong> Adicione novos veículos ao sistema
                  </li>
                  <li>
                    • <strong>Excluir:</strong> Remova carros diretamente da lista
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Funcionalidades</CardTitle>
                <CardDescription>O que você pode fazer com este sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Cadastrar novos carros</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <List className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Listar todos os carros</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Gerenciar marca, modelo e placa</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
