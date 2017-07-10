import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { spy } from 'sinon'

import helloWorld from '@/resources/hello-world'

describe('Hello World resource', () => {
  let resource, response

  beforeEach(() => {
    response = { json: spy() }

    resource = helloWorld()
  })

  describe('GET on /helloworld', () => {
    it('should map an endpoint', () => {
      expect(resource).to.have.deep.property('sayHello').that.includes({ method: 'get', address: '/helloworld' })
    })

    it('should respond with Hello World', () => {
      resource.sayHello.handler({}, response)

      expect(response.json.withArgs({ message: 'Hello World!' }).calledOnce).to.equal(true)
    })
  })

  describe('POST on /helloworld', () => {
    it('should map an endpoint', () => {
      expect(resource).to.have.deep.property('postHello').that.includes({ method: 'post', address: '/helloworld' })
    })

    it('should respond with Hello + provide name', () => {
      resource.postHello.handler({ body: { name: 'John' } }, response)

      expect(response.json.withArgs({ message: 'Hello John!' }).calledOnce).to.equal(true)
    })
  })
})
