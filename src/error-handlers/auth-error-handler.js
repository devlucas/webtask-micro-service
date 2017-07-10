const isAuthError = (err) => err.name === 'UnauthorizedError'

export default (err, req, res, next) => {
  if (isAuthError(err)) {
    res.status(err.status).json({ error: { code: err.code, message: err.message } })

    return next()
  }

  return next(err)
}
