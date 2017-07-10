import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { spy, stub } from 'sinon'

import handler from '@/error-handlers/payload-validation'

describe('When handling validation errors', () => {
  let err, req, res, next

  beforeEach(() => {
    [ err, req, res, next ] = [
      { mapped: () => {}, array: spy() },
      {},
      { status: stub().returns({ json: spy() }) },
      spy()
    ]
  })

  it('should only claim validation errors', () => {
    handler(err, req, res, next)

    expect(res.status.withArgs(400).calledOnce).to.equal(true)
    expect(next.withArgs(err).called).to.equal(false)
  })

  it('should not claim error when it is not a validation issue and instead move on to the next error handler', () => {
    err.mapped = {}

    handler(err, req, res, next)

    expect(res.status.withArgs(400).called).to.equal(false)
    expect(next.withArgs(err).calledOnce).to.equal(true)
  })
})
