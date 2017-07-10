import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { spy, stub } from 'sinon'

import { Factory } from '@/lib/payload-validator'

describe('When intercepting request for payload validation', () => {
  const [ schema, res ] = [ { valid: true }, {} ]

  let middleware, req, next, validationResult

  beforeEach(() => {
    validationResult = { throw: stub() }

    req = {
      checkBody: spy(),
      getValidationResult: stub().resolves(validationResult)
    }

    next = spy()

    middleware = Factory({ $wrap: stub().returnsArg(0) })(schema)
  })

  describe('checks schema against body', () => {
    it('should call next when validation succeeds', async () => {
      await middleware(req, res, next)

      expect(req.checkBody.withArgs(schema).calledOnce).to.equal(true)
      expect(next.calledOnce).to.equal(true)
    })

    it('should not call next when a validation error is thrown', async () => {
      const expectedError = 'ExpectedError'

      validationResult.throw.throws(expectedError)

      try {
        await middleware(req, res, next)
      } catch (e) {
        expect(e.name).to.equal(expectedError)
      }

      expect(req.checkBody.withArgs(schema).calledOnce).to.equal(true)
      expect(next.called).to.equal(false)
    })
  })
})
