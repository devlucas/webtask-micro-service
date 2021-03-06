import Express from 'express'

import ExpressWebtaskFactory from '~/lib/express-webtask-factory'
import App from '~/app'

module.exports = ExpressWebtaskFactory(App(new Express()))
