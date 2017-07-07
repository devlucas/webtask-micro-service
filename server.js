import App from '~/app'

const port = process.argv[2] || 8080

App().listen(port, () => {
  console.log(`Listening on port ${port}`)
})
