"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { CarForm } from "@/components/car-form"
import { ConnectionStatus } from "@/components/connection-status"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"

export default function NewCarPage() {
  const router = useRouter()

  const handleSuccess = () => {
    // Redireciona para a lista de carros após cadastro bem-sucedido
    setTimeout(() => {
      router.push("/cars")
    }, 2000)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/cars">Lista de Carros</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Cadastrar Carro</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <ConnectionStatus />
          <div className="flex justify-center">
            <CarForm onSuccess={handleSuccess} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
