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

  return () => {
    const app = new $Express()
    const router = $Express.Router()

    app.use('/', mapper(router, resources, resourceBinder))
    app.use('/', mapper(router, middlewares, middlewareBinder))

    return app
  }
}

export default Factory()
