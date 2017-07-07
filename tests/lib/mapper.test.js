import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { stub } from 'sinon'

import mapper from '@/lib/mapper'

describe('When mapping routes', () => {
  const expectedRouter = Symbol('router')

  let routes, callback

  beforeEach(() => {
    [ routes, callback ] = [ {}, stub().returnsArg(0) ]
  })

  it('should return a mapped router', () => {
    expect(mapper(expectedRouter, routes, callback)).to.equal(expectedRouter)
  })

  it('should call the callback function passing the ledger router and one route at a time', () => {
    [ routes.first, routes.second ] = [ stub().returnsArg(0), stub().returnsArg(0) ]

    mapper(expectedRouter, routes, callback)

    expect(callback.withArgs(expectedRouter, routes.first).calledOnce).to.equal(true)
    expect(callback.withArgs(expectedRouter, routes.second).calledOnce).to.equal(true)
  })
})
