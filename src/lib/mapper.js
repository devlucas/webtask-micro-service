export default (router, routes, callback) => {
  for (let route in routes) {
    router = callback(router, routes[route])
  }

  return router
}
