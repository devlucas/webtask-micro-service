import { endpoint } from '@/lib/endpoint'
import { wrap } from 'async-middleware'
import Request from 'request-promise'

export const Factory = (deps = {}) => {
  const {
    logger = console.log,
    request = Request,
    expressHandler = wrap
  } = deps

  function asMessage (tweet) {
    let timestamp = new Date(tweet.timestamp).toGMTString()

    return {
      text: `[${timestamp}]: ${tweet.username} said on Twitter: "${tweet.message}".\n You can see it for yourself right there => ${tweet.reference}`
    }
  }

  async function sendToSlack (req, res) {
    logger('A new tweet has been captured, sending it to Slack ...')

    let [ method, uri, body ] = [ 'POST', req.webtaskContext.secrets.SLACK_URL, asMessage(req.body) ]

    try {
      let response = await request({ method, uri, body, json: true })

      logger('Slack returned: ', response)

      res.json({ status: response })
    } catch (err) {
      logger('Slack returned with an error: ', err)

      res.status(500).send(err)
    }
  }

  let captureTweet = endpoint('/monitor/tweet', 'post', expressHandler(sendToSlack), ['write:tweet'], {
    username: {
      notEmpty: {
        errorMessage: 'A username must be provided'
      }
    },
    message: {
      notEmpty: {
        errorMessage: 'A message must be provided'
      }
    },
    reference: {
      notEmpty: {
        errorMessage: 'A reference link must be provided'
      }
    },
    timestamp: {
      notEmpty: {
        errorMessage: 'A timestamp must be provided'
      }
    }
  })

  let resource = { captureTweet }

  return () => resource
}

export default Factory()
