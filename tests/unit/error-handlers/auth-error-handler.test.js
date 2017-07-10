import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { spy, stub } from 'sinon'

import handler from '@/error-handlers/auth-error-handler'

describe('When handling auth errors', () => {
  let err, req, res, next

  beforeEach(() => {
    [ err, req, res, next ] = [
      {
        name: 'UnauthorizedError',
        status: 401,
        code: 'unauthorized',
        message: 'not authorized to proceed'
      },
      {},
      { status: stub().returns({ json: spy() }) },
      spy()
    ]
  })

  it('should only claim auth errors', () => {
    handler(err, req, res, next)

    expect(res.status.withArgs(401).calledOnce).to.equal(true)
    expect(next.withArgs(err).called).to.equal(false)
  })

  it('should not claim error when it is not an auth issue and instead move on to the next error handler', () => {
    err.name = 'error'

    handler(err, req, res, next)

    expect(res.status.withArgs(401).called).to.equal(false)
    expect(next.withArgs(err).calledOnce).to.equal(true)
  })
})
