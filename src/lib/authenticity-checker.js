import Jwt from 'express-jwt'
import Jwks from 'jwks-rsa'

export const Factory = (deps = {}) => {
  const {
    jwt = Jwt,
    jwks = Jwks
  } = deps

  const retrieveSecret = (issuer) => {
    return jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${issuer}.well-known/jwks.json`
    })
  }

  return (req, res, next) => {
    const secrets = req.webtaskContext.secrets

    if (secrets.AUTH.toUpperCase() === 'OFF') {
      return next()
    }

    return jwt({
      issuer: `${secrets.AUTH_ISSUER}`,
      secret: retrieveSecret(secrets.AUTH_ISSUER),
      audience: secrets.AUTH_AUDIENCE,
      algorithms: [ secrets.AUTH_ALGORITHM ]
    })(req, res, next)
  }
}

export default Factory()
