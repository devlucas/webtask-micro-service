import { wrap } from 'async-middleware'

export const Factory = (deps = {}) => {
  const {
    $wrap = wrap
  } = deps

  return (schema) => {
    const validator = async (req, res, next) => {
      req.checkBody(schema)

      let result = await req.getValidationResult()

      result.throw()

      next()
    }

    return $wrap(validator)
  }
}

export default Factory()
