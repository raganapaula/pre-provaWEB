"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, TestTube, CheckCircle, XCircle, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ApiTester() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [results, setResults] = React.useState<
    Array<{ endpoint: string; status: number | null; success: boolean; data?: any; error?: string }>
  >([])
  const { toast } = useToast()

  const testEndpoints = async () => {
    setIsLoading(true)
    setResults([])

    const endpoints = [
      "https://68596078138a18086dfe32e8.mockapi.io/cars/cars",
      "https://68596078138a18086dfe32e8.mockapi.io/cars",
      "https://68596078138a18086dfe32e8.mockapi.io/api/v1/cars",
      "https://68596078138a18086dfe32e8.mockapi.io/api/cars",
    ]

    const testResults: Array<{
      endpoint: string
      status: number | null
      success: boolean
      data?: any
      error?: string
    }> = []

    for (const endpoint of endpoints) {
      try {
        console.log(`Testando endpoint: ${endpoint}`)

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
        })

        if (response.ok) {
          const data = await response.json()
          testResults.push({
            endpoint,
            status: response.status,
            success: true,
            data: Array.isArray(data) ? `${data.length} registros` : "Dados encontrados",
          })
        } else {
          testResults.push({
            endpoint,
            status: response.status,
            success: false,
            error: `HTTP ${response.status}`,
          })
        }
      } catch (error) {
        testResults.push({
          endpoint,
          status: null,
          success: false,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        })
      }
    }

    setResults(testResults)
    setIsLoading(false)
  }

  const copyEndpoint = (endpoint: string) => {
    navigator.clipboard.writeText(endpoint)
    toast({
      title: "Copiado!",
      description: "Endpoint copiado para a área de transferência",
    })
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Testador de API MockAPI
        </CardTitle>
        <CardDescription>
          Teste diferentes endpoints para encontrar a URL correta da API. Endpoint atual:{" "}
          <code className="bg-muted px-1 rounded">https://68596078138a18086dfe32e8.mockapi.io/cars/cars</code>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testEndpoints} disabled={isLoading} className="w-full">
          {isLoading ? "Testando endpoints..." : "Testar Todos os Endpoints"}
        </Button>

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Resultados dos Testes:</h3>
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-md border ${result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="font-mono text-sm break-all">{result.endpoint}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyEndpoint(result.endpoint)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-sm">
                  {result.success ? (
                    <div className="text-green-700">
                      <p>✅ Status: {result.status} - Funcionando!</p>
                      <p>📊 {result.data}</p>
                      {index === 0 && (
                        <p className="font-semibold mt-1">🎯 Este é o endpoint configurado atualmente!</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-red-700">
                      <p>❌ {result.error}</p>
                      {result.status && <p>Status: {result.status}</p>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuração Atual</AlertTitle>
          <AlertDescription>
            <div className="space-y-2 mt-2">
              <p>
                <strong>Endpoint configurado:</strong>{" "}
                <code className="bg-muted px-1 rounded">https://68596078138a18086dfe32e8.mockapi.io/cars/cars</code>
              </p>
              <p>
                <strong>Operações disponíveis:</strong>
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>GET /cars/cars - Listar todos os carros</li>
                <li>POST /cars/cars - Cadastrar novo carro</li>
                <li>DELETE /cars/cars/:id - Excluir carro por ID</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
