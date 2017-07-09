import { describe, it } from 'mocha'
import { expect } from 'chai'

import { endpoint, unsafe } from '@/lib/endpoint'

describe('When creating an endpoint', () => {
  const [ address, method, handler, requires, payloadSchema ] = [
    Symbol('expectedAddress'),
    Symbol('expectedMethod'),
    Symbol('expectedHandler'),
    Symbol('expectedRequires'),
    Symbol('payloadSchema')
  ]

  it('should return an object containing the necessary keys', () => {
    let result = endpoint(address, method, handler, requires, payloadSchema)

    expect(result).to.deep.equal({ address, method, handler, requires, payloadSchema })
  })

  it('should return an endpoint with unsafe flag', () => {
    let result = unsafe(endpoint(address, method, handler, requires, payloadSchema))

    expect(result).to.deep.equal({ address, method, handler, requires, payloadSchema, unsafe: true })
  })
})
