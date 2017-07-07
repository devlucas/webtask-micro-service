import Express from 'express'
import dotenv from 'dotenv'

import App from '~/app'

const [ app, port, config ] = [
  new Express(),
  process.argv[2] || 8080,
  dotenv.config({ path: 'local.env' || process.argv[3] }).parsed
]

app.use((req, res, next) => {
  req.webtaskContext = { data: config, secrets: config }

  next()
})

App(app).listen(port, () => {
  console.log(`Listening on port ${port}`)
})
