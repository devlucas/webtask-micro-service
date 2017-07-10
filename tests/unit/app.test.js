import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { spy, stub } from 'sinon'

import { Factory } from '@/app'

describe('App bootstrapping', () => {
  const [ router, resources, middlewares, resourceBinder, middlewareBinder ] = [
    Symbol('expectedRouter'),
    Symbol('expectedResources'),
    Symbol('expectedMiddlewares'),
    Symbol('expectedResourceBinder'),
    Symbol('expectedMiddlewareBinder')
  ]

  let app, mapper, startupMiddlewares, errorHandlers

  beforeEach(() => {
    let $Express = { Router: stub().returns(router) }

    mapper = stub().returnsArg(0)
    startupMiddlewares = stub().returnsArg(0)
    errorHandlers = stub().returnsArg(0)

    app = Factory({
      startupMiddlewares,
      mapper,
      resources,
      middlewares,
      errorHandlers,
      resourceBinder,
      middlewareBinder,
      $Express
    })({ use: spy() })
  })

  it('should bind initial middlewares', () => {
    expect(startupMiddlewares.withArgs(app).calledOnce).to.equal(true)
  })

  it('should bind error handlers', () => {
    expect(errorHandlers.withArgs(app).calledOnce).to.equal(true)
  })

  it('should get a router back from mapper for both resources and middlewares', () => {
    expect(app.use.withArgs('/', router).calledTwice).to.equal(true)
  })

  describe('when binding resource routes', () => {
    it('should call mapper providing the router, list of resources and the binder', () => {
      expect(mapper.withArgs(router, resources, resourceBinder).calledOnce).to.equal(true)
    })
  })

  describe('when binding middlewares', () => {
    it('should call mapper providing the router, list of middlewares and the binder', () => {
      expect(mapper.withArgs(router, middlewares, middlewareBinder).calledOnce).to.equal(true)
    })
  })
})
