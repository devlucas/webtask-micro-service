import { describe, it } from 'mocha'
import { expect } from 'chai'
import { spy } from 'sinon'

import helloWorld from '@/resources/hello-world'

describe('Hello World resource', () => {
  it('should declare an endpoint at /helloworld for GET operations', () => {
    expect(helloWorld()).to.have.deep.property('sayHello').that.includes({ method: 'get', address: '/helloworld' })
  })

  describe('GET on /helloworld', () => {
    it('should respond with Hello World', () => {
      const response = { send: spy() }

      helloWorld().sayHello.handler({}, response)

      expect(response.send.withArgs('Hello World').calledOnce).to.equal(true)
    })
  })
})
