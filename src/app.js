import Express from 'express'

import MiddlewareBinder from '@/lib/middleware-binder'
import ResourceBinder from '@/lib/resource-binder'
import Mapper from '@/lib/mapper'

import * as Middlewares from '@/middlewares'
import * as Resources from '@/resources'

export const Factory = (deps = {}) => {
  const {
        $Express = Express,
        mapper = Mapper,
        resourceBinder = ResourceBinder,
        middlewareBinder = MiddlewareBinder,
        resources = Resources,
        middlewares = Middlewares
    } = deps

  return (app) => {
    const router = $Express.Router()

    app.use('/', mapper(router, middlewares, middlewareBinder))
    app.use('/', mapper(router, resources, resourceBinder))

    return app
  }
}

export default Factory()
