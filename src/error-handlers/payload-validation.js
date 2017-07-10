const isValidationError = (err) => typeof err.mapped === 'function'

export default (err, req, res, next) => {
  if (isValidationError(err)) {
    res.status(400).json({ errors: err.array() })

    return next()
  }

  return next(err)
}
