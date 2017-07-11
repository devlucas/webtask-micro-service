import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { stub, spy } from 'sinon'

import { Factory } from '@/resources/twitter-monitor'

describe('Twitter Monitor resource', () => {
  const expectedResponse = Symbol('expectedresponse')

  let resource, logger, expressHandler, request

  beforeEach(() => {
    logger = spy()

    request = stub().resolves(expectedResponse)

    resource = Factory({ logger, expressHandler, request })()
  })

  describe('POST on /monitor/tweet', () => {
    it('should map an endpoint', () => {
      expect(resource).to.have.deep.property('captureTweet').that.includes({ method: 'post', address: '/monitor/tweet' })
    })

    describe('request handling', () => {
      const expectedUri = Symbol('expectedUri')

      let handler, req, res

      beforeEach(() => {
        [ req, res ] = [ { body: {}, webtaskContext: { secrets: { SLACK_URL: expectedUri } } }, { json: spy() } ]

        handler = resource.captureTweet.handler
      })

      it('should send a message to Slack once a valid request has been received', async () => {
        await handler(req, res)

        expect(request.args[0][0].uri).to.equal(expectedUri)
        expect(request.calledOnce).to.equal(true)

        expect(res.json.withArgs({ status: expectedResponse }))
      })

      it('should correctly compose the message', async() => {
        const [ timestamp, username, message, reference ] = [ new Date().toGMTString(), 'username', 'message', 'a link' ]

        const expectedMessage = `[${timestamp}]: ${username} said on Twitter: "${message}".\n You can see it for yourself right there => ${reference}`

        req.body = { timestamp, username, message, reference }

        await handler(req, res)

        expect(request.args[0][0].body.text).to.equal(expectedMessage)
      })

      it('should respond 500 with an error when something goes wrong', async () => {
        const expectedError = Symbol('expectedError')

        request.rejects(expectedError)

        let innerRes = { send: spy() }

        res.status = stub().returns(innerRes)

        try {
          await handler(req, res)
        } catch (err) {
          expect(res.status.withArgs(500).calledOnce).to.equal(true)
          expect(innerRes.send.withArgs(expectedError).calledOnce).to.equal(true)
        }

        expect(res.json.called).to.equal(false)
      })
    })
  })
})
