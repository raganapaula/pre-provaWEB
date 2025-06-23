const API_BASE_URL = "https://68596078138a18086dfe32e8.mockapi.io/cars"

export interface Car {
  id?: string
  marca: string
  modelo: string
  placa: string
}

export class CarAPI {
  static async getCars(): Promise<Car[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/cars`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
      })

      if (!response.ok) {
        if (response.status === 404) {
          // Se não encontrar a coleção, retorna array vazio
          return []
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("Erro ao buscar carros:", error)
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Erro de conexão. Verifique sua internet ou tente novamente.")
      }
      throw new Error("Erro ao carregar carros. Tente novamente.")
    }
  }

  static async createCar(car: Omit<Car, "id">): Promise<Car> {
    try {
      const response = await fetch(`${API_BASE_URL}/cars`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(car),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Erro na resposta da API:", response.status, errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Erro ao criar carro:", error)
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Erro de conexão. Verifique sua internet ou tente novamente.")
      }
      throw new Error("Erro ao cadastrar carro. Tente novamente.")
    }
  }

  static async deleteCar(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Erro na resposta da API:", response.status, errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error("Erro ao excluir carro:", error)
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Erro de conexão. Verifique sua internet ou tente novamente.")
      }
      throw new Error("Erro ao excluir carro. Tente novamente.")
    }
  }

  // Método para testar a conexão com a API
  static async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/cars`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
      })
      return response.ok || response.status === 404 // 404 é OK se a coleção não existir ainda
    } catch (error) {
      console.error("Erro ao testar conexão:", error)
      return false
    }
  }

  // Método para testar diferentes endpoints
  static async testEndpoints(): Promise<void> {
    const endpoints = [
      "https://68596078138a18086dfe32e8.mockapi.io/cars/cars",
      "https://68596078138a18086dfe32e8.mockapi.io/cars",
      "https://68596078138a18086dfe32e8.mockapi.io/api/v1/cars",
      "https://68596078138a18086dfe32e8.mockapi.io/api/cars",
    ]

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
        console.log(`Status: ${response.status}`)
        if (response.ok) {
          const data = await response.json()
          console.log(`Dados:`, data)
        }
      } catch (error) {
        console.error(`Erro no endpoint ${endpoint}:`, error)
      }
    }
  }
}
