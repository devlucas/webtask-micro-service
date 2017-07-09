import { endpoint } from '@/lib/endpoint'

export default () => {
  const postHelloSchema = {
    name: {
      notEmpty: {
        errorMessage: 'you must provide a name'
      }
    }
  }

  let postHello = endpoint('/helloworld', 'post', (req, res) => {
    res.send(`Hello ${req.body.name}!`)
  }, [], postHelloSchema)

  let sayHello = endpoint('/helloworld', 'get', (req, res) => {
    res.send('Hello World!')
  })

  return { sayHello, postHello }
}
