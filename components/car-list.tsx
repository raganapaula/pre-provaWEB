"use client"

import * as React from "react"
import { Trash2, RefreshCw, AlertCircle, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { CarAPI, type Car } from "@/lib/api"

export function CarList() {
  const [cars, setCars] = React.useState<Car[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isOnline, setIsOnline] = React.useState(true)
  const { toast } = useToast()

  // Verificar status da conexão
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const fetchCars = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Testar conexão primeiro
      const isConnected = await CarAPI.testConnection()
      if (!isConnected) {
        throw new Error("Não foi possível conectar com a API. Verifique sua conexão.")
      }

      const data = await CarAPI.getCars()
      setCars(data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este carro?")) {
      return
    }

    try {
      setDeletingId(id)
      await CarAPI.deleteCar(id)
      setCars((prev) => prev.filter((car) => car.id !== id))
      toast({
        title: "Sucesso!",
        description: "Carro excluído com sucesso.",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao excluir carro"
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  React.useEffect(() => {
    fetchCars()
  }, [])

  return (
    <div className="space-y-4">
      {/* Status da conexão */}
      {!isOnline && (
        <Alert variant="destructive">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>Sem conexão</AlertTitle>
          <AlertDescription>Você está offline. Verifique sua conexão com a internet.</AlertDescription>
        </Alert>
      )}

      {/* Erro de API */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro de Conexão</AlertTitle>
          <AlertDescription>
            {error}
            <Button variant="outline" size="sm" className="ml-2" onClick={fetchCars}>
              Tentar Novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Lista de Carros
                {isOnline ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
              </CardTitle>
              <CardDescription>
                Gerencie todos os carros cadastrados no sistema.
                {cars.length > 0 &&
                  ` (${cars.length} ${cars.length === 1 ? "carro" : "carros"} encontrado${cars.length === 1 ? "" : "s"})`}
              </CardDescription>
            </div>
            <Button onClick={fetchCars} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-muted-foreground">Carregando carros...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <p className="text-muted-foreground">Não foi possível carregar os carros.</p>
                <Button onClick={fetchCars} variant="outline" className="mt-2">
                  Tentar Novamente
                </Button>
              </div>
            </div>
          ) : cars.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="text-center">
                <p className="text-muted-foreground">Nenhum carro cadastrado.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Clique em "Cadastrar Carro" no menu para adicionar o primeiro veículo.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Marca</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Placa</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cars.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell className="font-medium">{car.marca}</TableCell>
                      <TableCell>{car.modelo}</TableCell>
                      <TableCell className="font-mono">{car.placa}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => car.id && handleDelete(car.id)}
                          disabled={deletingId === car.id}
                        >
                          {deletingId === car.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
