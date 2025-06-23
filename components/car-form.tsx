"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CarAPI } from "@/lib/api"

interface CarFormProps {
  onSuccess?: () => void
}

export function CarForm({ onSuccess }: CarFormProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  const [formData, setFormData] = React.useState({
    marca: "",
    modelo: "",
    placa: "",
  })
  const { toast } = useToast()

  const validatePlaca = (placa: string): boolean => {
    // Validação básica de placa brasileira (ABC-1234 ou ABC1234)
    const placaRegex = /^[A-Z]{3}[-]?[0-9]{4}$/i
    return placaRegex.test(placa.replace(/\s/g, ""))
  }

  const formatPlaca = (placa: string): string => {
    // Remove espaços e converte para maiúsculo
    const cleaned = placa.replace(/\s/g, "").toUpperCase()
    // Adiciona hífen se não tiver
    if (cleaned.length === 7 && !cleaned.includes("-")) {
      return cleaned.slice(0, 3) + "-" + cleaned.slice(3)
    }
    return cleaned
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    // Validações
    if (!formData.marca.trim() || !formData.modelo.trim() || !formData.placa.trim()) {
      setError("Todos os campos são obrigatórios.")
      setIsLoading(false)
      return
    }

    const placaFormatada = formatPlaca(formData.placa)
    if (!validatePlaca(placaFormatada)) {
      setError("Formato de placa inválido. Use o formato ABC-1234.")
      setIsLoading(false)
      return
    }

    try {
      // Testar conexão primeiro
      const isConnected = await CarAPI.testConnection()
      if (!isConnected) {
        throw new Error("Não foi possível conectar com a API. Verifique sua conexão.")
      }

      await CarAPI.createCar({
        ...formData,
        marca: formData.marca.trim(),
        modelo: formData.modelo.trim(),
        placa: placaFormatada,
      })

      setSuccess(true)
      toast({
        title: "Sucesso!",
        description: "Carro cadastrado com sucesso.",
      })

      // Limpar formulário
      setFormData({ marca: "", modelo: "", placa: "" })

      // Chamar callback de sucesso
      onSuccess?.()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao cadastrar carro"
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Limpar mensagens ao digitar
    if (error) setError(null)
    if (success) setSuccess(false)
  }

  return (
    <div className="space-y-4">
      {/* Mensagem de sucesso */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Sucesso!</AlertTitle>
          <AlertDescription className="text-green-700">Carro cadastrado com sucesso no sistema.</AlertDescription>
        </Alert>
      )}

      {/* Mensagem de erro */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Cadastrar Novo Carro</CardTitle>
          <CardDescription>Preencha os dados do carro para cadastrá-lo no sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="marca">Marca *</Label>
              <Input
                id="marca"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                placeholder="Ex: Toyota, Honda, Ford"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo *</Label>
              <Input
                id="modelo"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                placeholder="Ex: Corolla, Civic, Focus"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="placa">Placa *</Label>
              <Input
                id="placa"
                name="placa"
                value={formData.placa}
                onChange={handleChange}
                placeholder="Ex: ABC-1234"
                required
                disabled={isLoading}
                maxLength={8}
              />
              <p className="text-xs text-muted-foreground">Formato: ABC-1234 (3 letras + hífen + 4 números)</p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Cadastrando..." : "Cadastrar Carro"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
