import AuthenticityChecker from '@/lib/authenticity-checker'
import AuthorityChecker from '@/lib/authority-checker'

export const Factory = (deps = {}) => {
  const {
    authenticityChecker = AuthenticityChecker,
    authorityChecker = AuthorityChecker
  } = deps

  return (router, resource) => {
    let endpoints = resource()

    for (let endpoint in endpoints) {
      const { method, address, handler, requires, unsafe } = endpoints[endpoint]

      if (unsafe) {
        router[method](address, handler)
      } else {
        router[method](address, authenticityChecker, authorityChecker(requires), handler)
      }
    }

    return router
  }
}

export default Factory()
