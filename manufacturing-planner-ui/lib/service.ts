import materialOperations from "./operations/material"
import productOperations from "./operations/product"

const service = () => {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin.replace('3000', '8080')
    : ''

  const baseProductUrl = `${ baseUrl }/product`
  const baseMaterialUrl = `${ baseUrl }/material`

  const baseConfig : RequestInit = {}

  return {
    fetchTestApi: () => {
      return fetch(`${ baseUrl }/hello`, baseConfig)
        .then(response => response.text())
    },
    ...productOperations(baseProductUrl, baseConfig),
    ...materialOperations(baseMaterialUrl, baseConfig)
  }
}

export default service()