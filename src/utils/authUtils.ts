const TOKEN_EXPIRATION_TIME = 60 * 60 * 1000 // 1 hour in milliseconds

// Save token with expiration time
export const saveToken = (token: string) => {
  const expirationTime = Date.now() + TOKEN_EXPIRATION_TIME
  const tokenWithExpiry = {
    token,
    expirationTime,
  }
  localStorage.setItem('authToken', JSON.stringify(tokenWithExpiry))
}

// Get token and check if it is expired
export const getToken = (): string | null => {
  const tokenWithExpiry = localStorage.getItem('authToken')
  if (!tokenWithExpiry) return null

  const parsedToken = JSON.parse(tokenWithExpiry)
  if (Date.now() > parsedToken.expirationTime) {
    removeToken() // Remove token if expired
    return null
  }
  return parsedToken.token
}

// Remove token (logout)
export const removeToken = () => {
  localStorage.removeItem('authToken')
}
