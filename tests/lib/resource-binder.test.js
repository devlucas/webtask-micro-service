import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { spy, stub } from 'sinon'

import { unsafe, endpoint } from '@/lib/endpoint'

import { Factory } from '@/lib/resource-binder'

describe('When binding a resource to a route in the router', () => {
  const [ authenticityChecker, expectedAuthorityChecker, expectedValidator ] = [
    Symbol('authenticityChecker'),
    Symbol('expectedAuthorityChecker'),
    Symbol('expectedValidator')
  ]

  let bind, router, authorityChecker, payloadValidator

  beforeEach(() => {
    router = { get: spy() }
    authorityChecker = stub().returns(expectedAuthorityChecker)
    payloadValidator = stub().returns(expectedValidator)

    bind = Factory({ payloadValidator, authenticityChecker, authorityChecker })
  })

  it('should construct route as described on resource and add authenticity/authority checkers', () => {
    const [ address, requires, handler ] = [ '/hello-world', [ 'some', 'permission' ], Symbol('handler') ]

    let resultantRouter = bind(router, stub().returns(
      { endpoint: endpoint(address, 'get', handler, requires) }
    ))

    expect(authorityChecker.withArgs(requires).calledOnce).to.equal(true)
    expect(resultantRouter.get.withArgs(address, authenticityChecker, expectedAuthorityChecker, handler).calledOnce).to.equal(true)
  })

  it('should add authenticity/authority checkers even when no permissions are claimed out', () => {
    const [ address, handler ] = [ '/hello-world', Symbol('handler') ]

    let resultantRouter = bind(router, stub().returns(
      { endpoint: endpoint(address, 'get', handler) }
    ))

    expect(authorityChecker.withArgs(undefined).calledOnce).to.equal(true)
    expect(resultantRouter.get.withArgs(address, authenticityChecker, expectedAuthorityChecker, handler).calledOnce).to.equal(true)
    expect(resultantRouter.get.withArgs(address, handler).calledOnce).to.equal(false)
  })

  it('should not add authenticity/authority checkers when resource claims itself unsafe', () => {
    const [ address, handler ] = [ '/hello-world', Symbol('handler') ]

    let resultantRouter = bind(router, stub().returns(
      { endpoint: unsafe(endpoint(address, 'get', handler)) }
    ))

    expect(authorityChecker.called).to.equal(false)
    expect(resultantRouter.get.withArgs(address, authenticityChecker, expectedAuthorityChecker, handler).called).to.equal(false)
    expect(resultantRouter.get.withArgs(address, handler).calledOnce).to.equal(true)
  })

  it('should add validator middleware right before the request handler when a payloadSchema is present', () => {
    const [ address, handler, payloadSchema ] = [ '/hello-world', Symbol('handler'), { valid: true } ]

    let resultantRouter = bind(router, stub().returns(
      { endpoint: endpoint(address, 'get', handler, [], payloadSchema) }
    ))

    expect(payloadValidator.withArgs(payloadSchema).calledOnce).to.equal(true)
    expect(resultantRouter.get.withArgs(address, authenticityChecker, expectedAuthorityChecker, expectedValidator, handler).calledOnce).to.equal(true)
  })

  it('should add validator middleware right before the request handler when a payloadSchema is present even when endpoint is unsafe', () => {
    const [ address, handler, payloadSchema ] = [ '/hello-world', Symbol('handler'), { valid: true } ]

    let resultantRouter = bind(router, stub().returns(
      { endpoint: unsafe(endpoint(address, 'get', handler, [], payloadSchema)) }
    ))

    expect(payloadValidator.withArgs(payloadSchema).calledOnce).to.equal(true)
    expect(resultantRouter.get.withArgs(address, expectedValidator, handler).calledOnce).to.equal(true)
  })
})
