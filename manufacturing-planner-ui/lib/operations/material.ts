import { RawMaterial } from "../mp.entities"

const materialOperations = (baseUrl: string, baseConfig: RequestInit) => ({
  getRawMaterials: () => {
    return fetch(`${ baseUrl }/list`, baseConfig)
      .then(response => response.json() as Promise<RawMaterial[]>)
  }
})

export default materialOperations