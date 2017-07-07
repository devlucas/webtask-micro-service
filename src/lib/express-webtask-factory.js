import Webtask from 'webtask-tools'

export const Factory = (deps = {}) => {
  const {
        webtask = Webtask
    } = deps

  return app => webtask.fromExpress(app)
}

export default Factory()
