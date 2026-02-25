const service = () => {
  const baseUrl = window.location.origin.replace('3000', '8080')
  
  return {
    fetchTestApi: () => {
      return fetch(`${ baseUrl }/hello`)
        .then(response => response.text())
    }
  }
}

export default service()