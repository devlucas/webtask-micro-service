import 'babel-polyfill'

import Express from 'express'

import StartupMiddlewares from '@/lib/startup-middlewares'
import MiddlewareBinder from '@/lib/middleware-binder'
import ResourceBinder from '@/lib/resource-binder'
import ErrorHandlers from '@/lib/error-handlers'
import Mapper from '@/lib/mapper'

import * as Middlewares from '@/middlewares'
import * as Resources from '@/resources'

export const Factory = (deps = {}) => {
  const {
    $Express = Express,
    mapper = Mapper,
    startupMiddlewares = StartupMiddlewares,
    resourceBinder = ResourceBinder,
    middlewareBinder = MiddlewareBinder,
    resources = Resources,
    middlewares = Middlewares,
    errorHandlers = ErrorHandlers
  } = deps

  return (app) => {
    app = startupMiddlewares(app)

    const router = $Express.Router()

    app.use('/', mapper(router, middlewares, middlewareBinder))
    app.use('/', mapper(router, resources, resourceBinder))

    app = errorHandlers(app)

    return app
  }
}

export default Factory()
