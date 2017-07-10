import Express from 'express'
import newman from 'newman'
import dotenv from 'dotenv'

import App from '~/app'

import collection from '~/tests/integration/integration.postman_collection.json'
import environment from '~/tests/integration/test.postman_environment.json'

const config = dotenv.config({ path: 'test.env' }).parsed
const app = new Express()

app.use((req, res, next) => {
  req.webtaskContext = { data: config, secrets: config }

  next()
})

App(app).listen(8080, () => {
  newman.run({ collection, environment, reporters: 'cli' }, (err) => {
    process.exit(err ? 1 : 0)
  })
})
