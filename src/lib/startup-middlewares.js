import BodyParser from 'body-parser'
import ExpressValidator from 'express-validator'

export const Factory = (deps = {}) => {
  const {
    bodyParser = BodyParser,
    expressValidator = ExpressValidator
  } = deps

  return (app) => {
    app.use(bodyParser.json())
    app.use(expressValidator())

    return app
  }
}

export default Factory()
