import { endpoint } from '@/lib/endpoint'

export default () => {
  return {
    sayHello: endpoint('/helloworld', 'get', (req, res) => {
      res.send('Hello World')
    })
  }
}
