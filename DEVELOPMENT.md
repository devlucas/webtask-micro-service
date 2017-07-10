# Development Guide

## Namespacing

ES6 `import` is a great feature, but having to deal with relative paths inside our code is annoying and troublesome. For this reason, this project is configured to transpile `@` character as the repository root when it appears on `import` like this:
```js
import resource from '@/resource'

```

This applies for all code living inside `src/` and `tests/unit`. For other javascript files on the repository, the character `~` will be transpiled as project root instead. This is necessary due to the way the build system is configured, but you are very unlikely to have to worry about it.

## Extensible middleware definition

In order to define your own middlewares, simply drop a new file at `src/middlewares` that looks like the following:
```js
export default (req, res, next) => {
    console.log('do something interesting')

    // and don't forget to call next!
    next()
}
```

There is a default middleware located at `src/middlewares/helmet.js` that can be used as a reference.

If you want to learn more about Express middlewares, you can do so [here](http://expressjs.com/en/guide/writing-middleware.html).

## Extensible resource definition

In order to define your own resources, simply drop a new file at `src/resources` that looks like the following:
```js
import { endpoint } from '@/lib/endpoint'

export default () => {
    const PATH = '/hello-world'

    const sayHelloWorld = endpoint(PATH, 'get', (req, res) => {
        res.status(200).json({ message: 'Hello World!' })
    })

    const sayHelloUniverse = endpoint(PATH, 'post', (req, res) => {
        res.status(201).json({ message: 'Hello Universe!' })
    })

    return { sayHelloWorld, sayHelloUniverse }
}
```

This will automatically be bound to the application's router and accessible through the `PATH` you defined, in this case "/hello-world".

*But there is more about resources!*

Each endpoint can specify which permissions are required in order to access them, see bellow:
```js
// previous code omitted for brevity
// ...
    const requiredPermissions = ['read:admin', 'write:admin']

    const sayHelloForAdmin = endpoint(PATH, 'get', (req, res) => {
        res.status(200).json({ message: 'Hello Admin!' })
    }, requiredPermissions)

// returning code omitted for brevity
// ...
```

When authentication is turned on, every endpoint is preceded by an authentication middleware which stops the request before it gets to its handler if auth fails, and an *authorization* middleware which enforces those `requiredPermissions` after authentication. Unless of course the endpoint flags itself as unsafe.

An endpoint can also flag itself as unsafe, bypassing authentication and authorization even when auth is turned on, by doing the following:
```js
import { endpoint, unsafe } from '@/lib/endpoint'

export default () => {
    const PATH = '/unsafe/hello-world'

    const sayUnsafeHelloWorld = unsafe(endpoint(PATH, 'get', (req, res) => {
        res.status(200).json({ message: 'Unsafe Hello World!' })
    }))

    return { sayUnsafeHelloWorld }
}
```

And last but not least, an endpoint can provide a schema to be validated against the request payload before it gets to its handler, stopping right there if validation fails. See bellow:
```js
// previous code omitted for brevity
// ...
    const sayHelloNameSchema = {
        name: {
            notEmpty: {
                errorMessage: 'you must provide a name'
            }
        }
    }

    const sayHelloName = endpoint(PATH, 'post', (req, res) => {
        res.status(200).json({ message: `Hello ${req.body.name}!` })
    }, [], sayHelloNameSchema)

// returning code omitted for brevity
// ...
```
If you want to learn more about Validation Schemas, you can do so [here](https://github.com/ctavan/express-validator#validation-by-schema).

And don't worry, both auth and validation errors are outputted nicely on the final response, thanks to the error handlers we will learn about [down the road](#error-handling)!

## Startup middlewares

The [json body parser](https://github.com/expressjs/body-parser#bodyparserjsonoptions) and [express validator](https://github.com/ctavan/express-validator) middlewares come pre-installed and configured for you, as they are the foundation for facilities like validating and parsing request payload beforehand, as already described on [Extensible resource definition](#extensible-resource-definition).

## Error handling
In order to define your own error handlers, simply drop a new file at `src/error-handlers` that looks like the following:
```js
const isCustomError = (err) => err.name === 'CustomError'

export default (err, req, res, next) => {
    if (isCustomError(err)) {
        res.status(500).json({ error: { code: 'customError', message: err.message } })

        // return next to indicated the error has been handled and no longer need to be passed down the error handling chain
        return next()
    }

    // in case it is not a custom error, you must return next(err) so it keeps going down the error handling chain
    return next(err)
}
```

There are two default error handlers:
- `src/error-handlers/auth-error-handler.js` to catch all auth errors and properly format them
- `src/error-handlers/payload-validation.js` to catch all payload validation errors and properly format them

You can use both as references to implement your own.

If you want to learn more about Express Error Handlers, you can do so [here](http://expressjs.com/en/guide/error-handling.html).

## Support for ES7 async and await

*In case you need some clarity on what is this async/await buzz all about, I would say go check [this](https://medium.com/@rdsubhas/es6-from-callbacks-to-promises-to-generators-87f1c0cd8f2e) out first!*

If you want to create a middleware that will perform some short of promise-based asynchronous operation, like making a HTTP request for instance, you can do so using async/await syntax even though Express doesn't support them by default. See the code bellow:
```js
import request from 'request'
import { wrap } from 'async-middleware'

const middleware = async (req, res, next) => {
    await request(`https://my.external.log.aggregator/event?name=${req.body.name}`)

    next()
}

export default wrap(middleware)
```

You can use the same approach on error/request handlers as well, go test it out!

## Authentication and Authorization

You get Auth out of the box as long as you setup your environment file correctly with the following properties:
```shell
AUTH=ON
AUTH_ISSUER=<your Auth0 domain here>/ # Usually looks like https://<username>.auth0.com/
AUTH_AUDIENCE=<your Api identifier here> # This is the value you provide when creating an API on Auth0 Dashboard/Management API
AUTH_ALGORITHM=RS256 # Unless you know very well what you are doing, leave it like RS256
```

You can bypass authentication and authorization on an endpoint basis, and you can also specify authorization rules (permissions) as described [previously](#extensible-resource-definition).

## Unit testing setup
Unit testing should always be pretty straightforward, and we aren't going to break that rule, is that right!? See the code bellow:
```js
// file to be tested: src/middlewares/helmet.js

import Helmet from 'helmet'

export const Factory = (deps = {}) => {
  const {
    helmet = Helmet
  } = deps

  return helmet
}

export default Factory()

// test file: tests/unit/middlewares/helmet.test.js

import { describe, it } from 'mocha'
import { expect } from 'chai'
import { stub } from 'sinon'

import { Factory } from '@/middlewares/helmet'

describe('Helmet middleware', () => {
  it('should return a middleware function', () => {
    const expectedMiddleware = Symbol('expectedMiddleware')
    let middleware = Factory({ helmet: stub().returns(expectedMiddleware) })

    expect(middleware()).to.equal(expectedMiddleware)
  })
})
```

A few things to note:
- Yes, mocha/chai/sinon all come pre-installed to your pleasure
- `tests/unit` is a replica of `src`

  This means everytime you create a file at `src/resources/my-resource.js` you should create a test at `tests/unit/resources/my-resource.test.js`

- The Factory pattern

  You will note the `export const Factory...` line and the later importation from the test, although you are not required to follow it, it uses modern features of the language to delivery very elegant dependency injection capabilities, I suggest you to adopt that idea! :)

## Integration testing setup
Postman is our tool of choice, you should import the collection bellow and modify it according to your needs:

`tests/integration/integration.postman_collection.json`

There is also the following postman environment template that you should use to get started.

`tests/integration/example.postman_environment.json`

Once you have your postman collection up and running, just export it to override the base files mentioned above and then run:
```shell
npm run test:integration
```

## Transparent encryptation for environment files using git-crypt with multiple keys

This projects is shipped with a pre-configured git-crypt setup as follows:
```shell
# .gitattributes

local.env filter=git-crypt-dev diff=git-crypt-dev
prod.env filter=git-crypt-prod diff=git-crypt-prod
test.env filter=git-crypt-test diff=git-crypt-test
tests/integration/test.postman_environment.json filter=git-crypt-test diff=git-crypt-test
```

If you don't have access to the original keys, the way to move forward is to override these files and their respective keys, **BEFORE** you commit any changes you want to keep secret! You can use the following commands to do so:
```shell
git-crypt init -k dev && git-crypt init -k test && git-crypt init -k prod
find . -name "*.env" | awk '!/node/ {print $0}' | while read secret_file; do cat env.example > $secret_file; done
```
