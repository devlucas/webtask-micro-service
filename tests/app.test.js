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

  let app, mapper

  beforeEach(() => {
    let $Express = stub().returns({ use: spy() })
    $Express.Router = stub().returns(router)

    mapper = stub().returnsArg(0)

    app = Factory({ mapper, resources, middlewares, resourceBinder, middlewareBinder, $Express })()
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
