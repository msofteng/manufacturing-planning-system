import { Product } from "../mp.entities"

const productOperations = (baseUrl: string, baseConfig: RequestInit) => ({
  getProducts: () => {
    return fetch(`${ baseUrl }/list`, baseConfig)
      .then(response => response.json() as Promise<Product[]>)
  }
})

export default productOperations