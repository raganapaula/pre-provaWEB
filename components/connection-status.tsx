"use client"

import * as React from "react"
import { WifiOff, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CarAPI } from "@/lib/api"

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = React.useState(true)
  const [apiStatus, setApiStatus] = React.useState<"connected" | "disconnected" | "checking">("checking")

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Verificar status da API
    const checkApiStatus = async () => {
      try {
        const isConnected = await CarAPI.testConnection()
        setApiStatus(isConnected ? "connected" : "disconnected")
      } catch (error) {
        setApiStatus("disconnected")
      }
    }

    checkApiStatus()

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!isOnline) {
    return (
      <Alert variant="destructive">
        <WifiOff className="h-4 w-4" />
        <AlertDescription>Você está offline. Verifique sua conexão com a internet.</AlertDescription>
      </Alert>
    )
  }

  if (apiStatus === "disconnected") {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Não foi possível conectar com a API. Verifique sua conexão ou tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    )
  }

  return null
}
