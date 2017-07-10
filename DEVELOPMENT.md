# Development Guide

## Namespacing
ES6 `import` is a great feature, but having to deal with relative paths inside our code is annoying and troublesome. For this reason, this project is configured to transpile `@` character as the repository root when it appears on `import` like this:
```js
import resource from '@/resource'

```

This applies for all code living inside `src/` and `tests/unit`. For other javascript files on the repository, the character `~` will be transpiled as project root instead. This is necessary due to the way the build system is configured, but you are very unlikely to have to worry about it.

## Extensible middleware definition

TBD.

## Extensible resource definition

TBD.

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
