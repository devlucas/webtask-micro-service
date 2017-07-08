import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { stub } from 'sinon'

import { Factory } from '@/lib/authenticity-checker'

describe('When intercepting requests for authentication enforcement', () => {
  const [ expectedNext, expectedNextFromJwt, expectedJwks ] = [
    Symbol('expectedNext'),
    Symbol('expectedNextFromJwt'),
    Symbol('expectedSecret')
  ]

  let checker, jwt, innerJwt, jwks, req, res, next

  beforeEach(() => {
    innerJwt = stub().returns(expectedNextFromJwt)
    jwks = { expressJwtSecret: stub().returns(expectedJwks) }

    jwt = stub().returns(innerJwt)
    next = stub().returns(expectedNext)

    req = { webtaskContext: { secrets: { AUTH: 'OFF' } } }
    res = {}

    checker = Factory({ jwt, jwks })
  })

  it('should call next right away when auth is turned off', () => {
    expect(checker(req, res, next)).to.equal(expectedNext)
    expect(jwt.called).to.equal(false)
    expect(next.calledOnce).to.equal(true)
  })

  describe('with auth turned on', () => {
    it('should delegate to jwt', () => {
      req.webtaskContext.secrets.AUTH = 'ON'

      expect(checker(req, res, next)).to.equal(expectedNextFromJwt)
      expect(jwt.calledOnce).to.equal(true)
      expect(innerJwt.calledOnce).to.equal(true)
      expect(next.called).to.equal(false)
    })

    it('should pass a proper config to jwt', () => {
      const [ issuer, audience, algorithm ] = [ 'https://test.data', Symbol('expectedAudience'), Symbol('expectedAlgorithm') ]

      req.webtaskContext.secrets = {
        AUTH: 'ON',
        AUTH_ISSUER: issuer,
        AUTH_AUDIENCE: audience,
        AUTH_ALGORITHM: algorithm
      }

      checker(req, res, next)

      expect(jwks.expressJwtSecret.calledWithMatch({ jwksUri: `${issuer}.well-known/jwks.json` })).to.equal(true)
      expect(jwt.withArgs({ secret: expectedJwks, audience, issuer, algorithms: [algorithm] }).calledOnce).to.equal(true)
    })
  })
})
