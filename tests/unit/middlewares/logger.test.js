import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { spy } from 'sinon'

import { Factory } from '@/middlewares/logger'

describe('Logger middleware', () => {
  const expectedLogger = Symbol('expectedLogger')

  let loggerInjector, downstreamLogger, req, next

  beforeEach(() => {
    [ downstreamLogger, next, req ] = [ spy(), spy(), { webtaskContext: { backingServices: { LOGGER: () => expectedLogger } } } ]

    loggerInjector = Factory({ downstreamLogger })()
  })

  it('should not inject the logger when it is already a function', () => {
    loggerInjector(req, {}, next)

    expect(next.calledOnce).to.equal(true)
    expect(req.webtaskContext.backingServices.LOGGER()).to.equal(expectedLogger)
  })

  it('should inject the logger but turn it off', () => {
    req.webtaskContext.backingServices.LOGGER = Symbol('notFunction')
    req.webtaskContext.secrets = { LOGGER: 'OFF' }

    loggerInjector(req, {}, next)
    req.webtaskContext.backingServices.LOGGER('test')

    expect(downstreamLogger.called).to.equal(false)
    expect(next.calledOnce).to.equal(true)
  })

  it('should inject the logger when backingServices have not yet been set', () => {
    req.webtaskContext.backingServices = undefined
    req.webtaskContext.secrets = { LOGGER: 'ON' }

    loggerInjector(req, {}, next)
    req.webtaskContext.backingServices.LOGGER('test')

    expect(downstreamLogger.withArgs('test').calledOnce).to.equal(true)
    expect(next.calledOnce).to.equal(true)
  })

  it('should inject the logger and turn it on', () => {
    req.webtaskContext.backingServices.LOGGER = Symbol('notFunction')
    req.webtaskContext.secrets = { LOGGER: 'ON' }

    loggerInjector(req, {}, next)
    req.webtaskContext.backingServices.LOGGER('test')

    expect(downstreamLogger.withArgs('test').calledOnce).to.equal(true)
    expect(next.calledOnce).to.equal(true)
  })
})
