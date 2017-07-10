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

There is an default middleware located at `src/middlewares/helmet.js` that can be used as a reference.

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
The [json body parser](https://github.com/expressjs/body-parser#bodyparserjsonoptions) and [express validator](https://github.com/ctavan/express-validator) middlewares come pre-installed and configured for you as well, as they allow for further facilities like [Incoming request payload validation](DEVELOPMENT.md#incoming-request-payload-validation) and [Incoming request payload json parsing](DEVELOPMENT.md#incoming-request-payload-json-parsing) out of the box.

## Error handling

TBD.

## Support for ES7 async and await

TBD.

## Authentication and Authorization

TBD.

## Unit testing setup

TBD.

## Integration testing setup

TBD.

## Transparent encryptation for environment files using git-crypt with multiple keys

TBD.
