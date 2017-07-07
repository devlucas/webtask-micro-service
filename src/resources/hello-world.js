export default () => {
  const sayHello = { method: 'get',
    address: '/helloworld',
    handler: (req, res) => {
      res.send('Hello World')
    }}

  return { sayHello }
}
