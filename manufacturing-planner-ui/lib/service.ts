const service = () => {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin.replace('3000', '8080')
    : ''
  
  const baseConfig : RequestInit = {

  }

  return {
    fetchTestApi: () => {
      return fetch(`${ baseUrl }/hello`, baseConfig)
        .then(response => response.text())
    }
  }
}

export default service()