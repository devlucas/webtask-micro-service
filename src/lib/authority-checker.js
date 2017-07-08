import JwtAuthz from 'express-jwt-authz'

export const Factory = (deps = {}) => {
  const {
    jwtAuthz = JwtAuthz
  } = deps

  return (permissions) => {
    return (req, res, next) => {
      const authIsOff = req.webtaskContext.secrets.AUTH.toUpperCase() === 'OFF'
      const emptyPermissions = Array.isArray(permissions) && !permissions.length

      if (authIsOff || emptyPermissions) {
        return next()
      }

      return jwtAuthz(permissions)(req, res, next)
    }
  }
}

export default Factory()
