import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { stub } from 'sinon'

import { Factory } from '@/lib/authority-checker'

describe('When intercepting requests for authorization enforcement', () => {
  const [ expectedNext, expectedNextFromJwtAuthz ] = [ Symbol('expectedNext'), Symbol('expectedNextFromJwtAuthz') ]

  let checker, jwtAuthz, innerJwtAuthz, permissions, req, res, next

  beforeEach(() => {
    permissions = []

    res = {}
    req = { webtaskContext: { secrets: { AUTH: 'OFF' } } }

    innerJwtAuthz = stub().returns(expectedNextFromJwtAuthz)
    jwtAuthz = stub().returns(innerJwtAuthz)
    next = stub().returns(expectedNext)

    checker = Factory({ jwtAuthz })
  })

  describe('with no permissions to enforce', () => {
    it('should call next right away when permissions are empty', () => {
      expect(checker(permissions)(req, res, next)).to.equal(expectedNext)
      expect(jwtAuthz.called).to.equal(false)
      expect(next.calledOnce).to.equal(true)
    })

    it('should call next right away when permissions are undefined', () => {
      expect(checker(undefined)(req, res, next)).to.equal(expectedNext)
      expect(jwtAuthz.called).to.equal(false)
      expect(next.calledOnce).to.equal(true)
    })
  })

  it('should call next right away when auth is turned off', () => {
    permissions = ['some']

    expect(checker(permissions)(req, res, next)).to.equal(expectedNext)
    expect(jwtAuthz.called).to.equal(false)
    expect(next.calledOnce).to.equal(true)
  })

  it('should delegate to jwtAuthz when there are permissions to enforce and auth is turned on', () => {
    [ permissions, req.webtaskContext.secrets.AUTH ] = [ ['some'], 'ON' ]

    expect(checker(permissions)(req, res, next)).to.equal(expectedNextFromJwtAuthz)
    expect(jwtAuthz.withArgs(permissions).calledOnce).to.equal(true)
    expect(innerJwtAuthz.withArgs(req, res, next).calledOnce).to.equal(true)
  })
})
