import Helmet from 'helmet'

export const Factory = (deps = {}) => {
  const {
    helmet = Helmet
  } = deps

  return helmet
}

export default Factory()
