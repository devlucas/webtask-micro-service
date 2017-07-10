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
    res.json({ message: `Hello ${req.body.name}!` })
  }, [], postHelloSchema)

  let sayHello = endpoint('/helloworld', 'get', (req, res) => {
    res.json({ message: 'Hello World!' })
  })

  return { sayHello, postHello }
}
