import * as ErrorHandlers from '@/error-handlers'

export const Factory = (deps = {}) => {
  const {
    errorHandlers = ErrorHandlers
  } = deps

  return (app) => {
    for (let handler in errorHandlers) {
      app.use(errorHandlers[handler])
    }

    app.use((err, req, res, next) => {
      res.status(500).json({ error: { code: 'internalServerError', message: err.toString() } })

      return next()
    })

    return app
  }
}

export default Factory()
