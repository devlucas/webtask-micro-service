import Express from 'express'

const stubServer = new Express()

stubServer.post('/', (req, res) => {
  res.send('ok')
})

export default (callback) => {
  stubServer.listen(8081, () => {
    callback()
  })
}
