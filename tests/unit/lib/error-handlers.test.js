import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { spy, stub } from 'sinon'

import { Factory } from '@/lib/error-handlers'

describe('Error handlers binding', () => {
  const errorHandlers = [ Symbol('errorHandlers') ]

  let resultantApp, finalHandler

  beforeEach(() => {
    resultantApp = Factory({ errorHandlers })({ use: spy() })

    finalHandler = resultantApp.use.args[1][0]
  })

  it('should bind all errorHandlers to the app and also the final handler', () => {
    expect(resultantApp.use.withArgs(errorHandlers[0]).calledOnce).to.equal(true)
    expect(typeof finalHandler).to.equal('function')
  })

  describe('final handler', () => {
    it('should set status to 500 and respond with a JSON error', () => {
      const [ response, expectedError ] = [
        { json: spy() },
        { error: { code: 'internalServerError', message: 'error' } }
      ]

      const [ err, res, next, req ] = [ 'error', { status: stub().returns(response) }, spy() ]

      finalHandler(err, req, res, next)

      expect(res.status.withArgs(500).calledOnce).to.equal(true)
      expect(response.json.withArgs(expectedError).calledOnce).to.equal(true)
      expect(next.calledOnce).to.equal(true)
    })
  })
})
