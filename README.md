# Webtask micro-service
*Reference implementation of a secure serverless micro-service built on top of ExpressJS, Webtask and Auth0.*

## Status

[![Maintenance](https://img.shields.io/maintenance/yes/2017.svg?style=flat-square)](https://github.com/devlucas/webtask-micro-service/commits/master)
[![Known Vulnerabilities](https://snyk.io/test/github/devlucas/webtask-micro-service/badge.svg?style=flat-square)](https://snyk.io/test/github/devlucas/webtask-micro-service)
[![license](https://img.shields.io/github/license/devlucas/webtask-micro-service.svg?style=flat-square)](https://github.com/devlucas/webtask-micro-service/blob/master/LICENSE)
[![Build Status](https://img.shields.io/travis/devlucas/webtask-micro-service.svg?style=flat-square&maxAge=0)](https://travis-ci.org/devlucas/webtask-micro-service)
[![Coverage Status](https://img.shields.io/coveralls/devlucas/webtask-micro-service.svg?style=flat-square&maxAge=0)](https://coveralls.io/github/devlucas/webtask-micro-service?branch=master)
[![Dependencies Status](https://img.shields.io/david/devlucas/webtask-micro-service.svg?style=flat-square&maxAge=360)](https://david-dm.org/devlucas/webtask-micro-service)
[![DevDependencies Status](https://img.shields.io/david/dev/devlucas/webtask-micro-service.svg?style=flat-square&maxAge=360)](https://david-dm.org/devlucas/webtask-micro-service?type=dev)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)

## Description

This is a reference implementation of a well structured and completely tested serveless micro-service built on top of [Express](http://expressjs.com/), [Webtask](https://webtask.io) and [JWT/Auth0](https://auth0.com), that aims to delivery ease for developing RESTful APIs and to remove as much roadblocks as possible on the way to production, while guaranteeing quality predictable outcome by pairing high testability/extensibility.

This implementation is used in a wider integration comprised of:
- A [Zapier](https://zapier.com/) task that searches for #exploit on twitter every 5 minutes and sends what it found to a deployment of this codebase on Webtask
- This [Webtask](https://webtask.io/) deployment, which receives data from Zapier or whatever authenticated source, and then sends it to a Slack channel properly formatted
- A [Slack Channel](https://join.slack.com/t/devlucas/shared_invite/MjExNDM2MzQ0MDY4LTE0OTk4MTIxNzgtYjZkOWVjYzY5ZQ) where all messages posted by the webtask deployment can be seen

You can see a live demo [here](https://join.slack.com/t/devlucas/shared_invite/MjExNDM2MzQ0MDY4LTE0OTk4MTIxNzgtYjZkOWVjYzY5ZQ).

## Features

- [Standardized root module namespacing](DEVELOPMENT.md#namespacing)
- [Extensible middleware definition](DEVELOPMENT.md#extensible-middleware-definition)
- [Extensible resource definition](DEVELOPMENT.md#extensible-resource-definition)
- [Incoming request payload validation](DEVELOPMENT.md#startup-middlewares)
- [Incoming request payload json parsing](DEVELOPMENT.md#startup-middlewares)
- [Helmet enabled by default](DEVELOPMENT.md#extensible-middleware-definition)
- [Extensible error handling definition](DEVELOPMENT.md#error-handling)
- [Error handling for validation issues](DEVELOPMENT.md#error-handling)
- [Error handling for authentication/authorization issues](DEVELOPMENT.md#error-handling)
- [Support for ES7 async/await on middlewares](DEVELOPMENT.md#support-for-es7-async-and-await)
- [Configuration based JWT authentication middleware](DEVELOPMENT.md#authentication-and-authorization)
- [Granular authorization requirements through OAuth 2.0 scopes at endpoint level](DEVELOPMENT.md#authentication-and-authorization)
- [Unit testing setup using Mocha/Chai/Sinon](DEVELOPMENT.md#unit-testing-setup)
- [Integration testing setup using Postman/Newman](DEVELOPMENT.md#integration-testing-setup)
- [Transparent encryptation for environment files using git-crypt with multiple keys](DEVELOPMENT.md#transparent-encryptation-for-environment-files-using-git-crypt-with-multiple-keys)

## Getting started

### Dependencies

- [git-crypt](https://github.com/AGWA/git-crypt) >= 0.5.0
- [node](https://nodejs.org/en/) >= v8.1.3
- [npm](https://www.npmjs.com/) >= 5.1.0

#### Unlocking environments

In case you have access to a symetric key to unencrypted environment files on this repository, do as follows:
```shell
git-crypt unlock path/to/key
```

In order to see if it worked:
```shell
find . -name "*.env" | awk '!/node/ {print $0}' | while read secret_file; do echo "\n$secret_file" && cat "$secret_file"; done
```

If it worked, this will output some environment file's content in plain text. In case you don't have access to the symetric key:
```shell
cat env.example > local.env
```

This will copy the template env.example into local.env, which you should go ahead and fill with your data as follows:
```shell
$EDITOR local.env # or open with your favorite editor
```

Once you have a local.env properly configured, before you go any further, it is **EXTREMELY** important that you generate a dev key to transparently encrypt local.env, to do so you must run:
```shell
git-crypt init -k dev
```

This will initiate the proper key and you should be all set.

#### Running locally

Once you have a local.env properly configured, and your encryption key in place, just starts the application as follows:
```shell
npm install
npm start
```

You should see a similar output:
```shell
$ npm start
...
...
...
Listening on port 8080
```

Go grab your favorite API client and hack around!

*Note*: there is a postman collection at ```tests/integration/integration.postman_collection.json```

## Testing

#### Unit testing

In order to run the unit tests, just do:
```shell
npm test -- --reporter nyan # you don't actually need --reporter nyan, but I like it :)
```

#### Integration testing

In order to run the integration tests, you first need to unlock `test/integration/test.postman_environment.json` file, if you have access to the symetric key used to encrypt it, and you have been following the steps, it should already be decrypted, try the following:
```shell
cat test/integration/test.postman_environment.json
```

You should see the content of the file in plain text, in case you don't see it, create one yourself as follows:
```shell
cat test/integration/example.postman_environment.json > test/integration/test.postman_environment.json
```

Import it on postman and edit it to contain a valid configuration for you test environment. Once you are done, export it and replace the existent file with the same name.

You should be good to go, run the following:
```shell
npm run test:integration # no fancy flying cats here :(
```

### Development

See [DEVELOPMENT.md](DEVELOPMENT.md)

### Deploying
In order to deploy, you need a prod.env file unlocked, if you have access to the symetric key used to encrypt it, and you have been following the steps, it should already be decrypted, try the following:
```shell
cat prod.env
```

You should see the content of the file in plain text, in case you don't see it, create one yourself as follows:
```shell
cat env.example > prod.env
```

Edit it to contain a valid configuration for you production environment and move on to the next step.

Before you can deploy your application to webtask.io, you also need to have the wt-cli proper configured, verify it with the following command:
```shell
node_modules/.bin/wt profile ls
```

You should see something similar to:
```shell
Profile:     default
URL:         https://webtask.it.auth0.com
Container:   wt-2835e352db07966831e69908cbe682a4-1
```

If you don't have one yet, just run the command bellow and follow its instructions:
```shell
node_modules/.bin/wt init
```

Once you have a proper configured wt-cli, all you have to do is:
```shell
npm run deploy
```

This will output your webtask url, go ahead and test it out!

## Future features

What will be coming soon?
- [ ] Mongoose integration
- [ ] Logs to ELK stack
- [ ] Extract library utilities to their own npm package
- [ ] Yeoman Generator

Do you miss something? Feel free to [open an issue](https://github.com/devlucas/webtask-micro-service/issues)!

## Configuration

Currently the following configuration is expected to be found:
```shell
AUTH=<ON or OFF>
AUTH_ISSUER=<your Auth0 domain here>
AUTH_AUDIENCE=<your Api identifier here>
AUTH_ALGORITHM=<signing algorithm here (RS256 is recommended)>
LOGGER=<ON or OFF>

# this is used on src/resources/twitter-monitor.js and can be remove if you don't need it
SLACK_URL=<your slack incoming webhook url>
```

## Contributing

If you'd like to contribute, please fork the repository and use a feature
branch. Pull requests are warmly welcome.

Make sure you write tests for anything you add, mainly unitary but also integration when relevant.

We follow [code standard](https://standardjs.com), please do the same when sending pull requests.

## Licensing

The code in this project is licensed under MIT license. See [LICENSE](LICENSE).
