export const Factory = (deps = {}) => {
  const {
    downstreamLogger = console.log
  } = deps

  function createLogger (turnedOn) {
    return (...message) => {
      if (turnedOn) {
        downstreamLogger(...message)
      }
    }
  }

  return () => (req, res, next) => {
    req.webtaskContext.backingServices = req.webtaskContext.backingServices || {}

    if (typeof req.webtaskContext.backingServices.LOGGER !== 'function') {
      req.webtaskContext.backingServices.LOGGER = createLogger(req.webtaskContext.secrets.LOGGER === 'ON')
    }

    next()
  }
}

export default Factory()
