# Buzz Monitor
*A secure serverless micro-service that receives notifications from IFTTT and sends them to a Slack Channel.*

## Status
[![Maintenance](https://img.shields.io/maintenance/yes/2017.svg?style=flat-square)](https://github.com/devlucas/buzz-monitor/commits/master)
[![Known Vulnerabilities](https://snyk.io/test/github/devlucas/buzz-monitor/badge.svg?style=flat-square)](https://snyk.io/test/github/devlucas/buzz-monitor)
[![license](https://img.shields.io/github/license/devlucas/buzz-monitor.svg?style=flat-square)](https://github.com/devlucas/buzz-monitor/blob/master/LICENSE)
[![Build Status](https://img.shields.io/travis/devlucas/buzz-monitor.svg?style=flat-square&maxAge=0)](https://travis-ci.org/devlucas/buzz-monitor)
[![Coverage Status](https://img.shields.io/coveralls/devlucas/buzz-monitor.svg?style=flat-square&maxAge=0)](https://coveralls.io/github/devlucas/buzz-monitor?branch=master)
[![Dependencies Status](https://img.shields.io/david/devlucas/buzz-monitor.svg?style=flat-square&maxAge=360)](https://david-dm.org/devlucas/buzz-monitor)
[![DevDependencies Status](https://img.shields.io/david/dev/devlucas/buzz-monitor.svg?style=flat-square&maxAge=360)](https://david-dm.org/devlucas/buzz-monitor?type=dev)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)

## Description

This is a reference implementation of a well structured and completely tested serveless micro-service built on top of [Express](http://expressjs.com/), [Webtask](https://webtask.io) and [JWT/Auth0](https://auth0.com), that aims to delivery ease for developing RESTful APIs and to remove as much roadblocks as possible on the way to production, while guaranteeing quality predictable outcome by pairing high testability/extensibility.

You can see a live demo [here](https://wt-2835e325db07479831e69908cbe682a4-0.run.webtask.io/buzz-monitor).

## Features
- [Incoming request payload validation]()
- [Incoming request payload json parsing]()
- [Helmet enabled by default]()
- [Support for ES7 async/await on middlewares]()
- [Extensible resources definition]()
- [Extensible middlewares definition]()
- [Error handling for validation issues]()
- [Error handling for authentication/authorization issues]()
- [Configuration based JWT authentication middleware]()
- [Granular authorization requirements through OAuth 2.0 scopes at endpoint level]()
- [Unit testing setup using Mocha/Chai/Sinon]()
- [Integration testing setup using Postman/Newman]()
- [Environment files transparent encryptation using git-crypt with multiple keys]()

## Getting started

### Dependencies
- git-crypt >= 0.5.0
- node >= v8.1.3
- npm >= 5.1.0

#### Unlocking environments
In case you have access to a symetric key to unencrypted environment files on this repository, do as follows:
```shell
git-crypt unlock path/to/key
```
In order to see if it worked:
```shell
find . -name "*.env" | while read secret_file; do echo "\n$secret_file" && cat "$secret_file"; done
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
$ npm run start
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
In order to run the integration tests, you first need an unencrypted postman environment file, follow me:

TBD.

And state what happens step-by-step.


### Deploying

TBD.

## Future features

What will be coming soon?
* Mongoose integration
* Logs to ELK stack
* Do you miss something? Feel free to [open an issue]()!

## Configuration
TBD.

#### Argument 1
Type: `String`
Default: `'default value'`

TBD.

Example:
```bash
awesome-project "Some other value"  # Prints "You're nailing this readme!"
```

## Contributing

If you'd like to contribute, please fork the repository and use a feature
branch. Pull requests are warmly welcome.

Make sure you write tests for anything you add, mainly unitary but also integration when relevant.

We follow [code standard](TBD), please do the same when sending pull requests.

## Licensing

The code in this project is licensed under MIT license. See [LICENSE]().
