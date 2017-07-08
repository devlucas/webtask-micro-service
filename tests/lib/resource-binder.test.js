import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { stub } from 'sinon'

import { Factory } from '@/lib/resource-binder'

describe('When binding a resource to a route in the router', () => {
  const expectedAuthorityChecker = Symbol('expectedAuthorityChecker')

  let bind, authenticityChecker, authorityChecker

  beforeEach(() => {
    [ authenticityChecker, authorityChecker ] = [ stub(), stub().returns(expectedAuthorityChecker) ]

    bind = Factory({ authenticityChecker, authorityChecker })
  })

  it('should construct route as described on resource and add authenticity/authority checkers', () => {
    const [ router, address, requires, handler ] = [ { get: stub() }, '/hello-world', [ 'some', 'permission' ], Symbol('handler') ]

    expect(bind(router, stub().returns({ endpoint: { method: 'get', address, handler, requires } }))).to.equal(router)
    expect(router.get.withArgs(address, authenticityChecker, expectedAuthorityChecker, handler).calledOnce).to.equal(true)
  })

  it('should add authenticity/authority checkers even when no permissions are claimed out', () => {
    const [ router, address, handler ] = [ { get: stub() }, '/hello-world', Symbol('handler') ]

    expect(bind(router, stub().returns({ endpoint: { method: 'get', address, handler } }))).to.equal(router)
    expect(router.get.withArgs(address, authenticityChecker, expectedAuthorityChecker, handler).calledOnce).to.equal(true)
    expect(router.get.withArgs(address, handler).calledOnce).to.equal(false)
  })

  it('should not add authenticity/authority checkers when resource claims itself unsafe', () => {
    const [ router, address, handler ] = [ { get: stub() }, '/hello-world', Symbol('handler') ]

    expect(bind(router, stub().returns({ endpoint: { unsafe: true, method: 'get', address, handler } }))).to.equal(router)
    expect(router.get.withArgs(address, authenticityChecker, expectedAuthorityChecker, handler).called).to.equal(false)
    expect(router.get.withArgs(address, handler).calledOnce).to.equal(true)
  })
})
