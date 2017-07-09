import AuthenticityChecker from '@/lib/authenticity-checker'
import AuthorityChecker from '@/lib/authority-checker'
import PayloadValidator from '@/lib/payload-validator'

export const Factory = (deps = {}) => {
  const {
    authenticityChecker = AuthenticityChecker,
    authorityChecker = AuthorityChecker,
    payloadValidator = PayloadValidator
  } = deps

  const isSchemaPresent = (schema) => {
    return typeof schema !== 'undefined' && Object.keys(schema).length
  }

  return (router, resource) => {
    let endpoints = resource()

    for (let endpoint in endpoints) {
      const { method, address, handler, requires, unsafe, payloadSchema } = endpoints[endpoint]

      let handlersChain = []

      if (!unsafe) {
        handlersChain.push(authenticityChecker)
        handlersChain.push(authorityChecker(requires))
      }

      if (isSchemaPresent(payloadSchema)) {
        handlersChain.push(payloadValidator(payloadSchema))
      }

      handlersChain.push(handler)

      router[method](address, ...handlersChain)
    }

    return router
  }
}

export default Factory()
