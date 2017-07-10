import { describe, it } from 'mocha'
import { expect } from 'chai'
import { stub } from 'sinon'

import { Factory } from '@/middlewares/helmet'

describe('Helmet middleware', () => {
  it('should return a middleware function', () => {
    const expectedMiddleware = Symbol('expectedMiddleware')
    let middleware = Factory({ helmet: stub().returns(expectedMiddleware) })

    expect(middleware()).to.equal(expectedMiddleware)
  })
})
