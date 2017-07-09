import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { spy, stub } from 'sinon'

import { Factory } from '@/lib/startup-middlewares'

describe('When bootstrapping the initial middlewares', () => {
  const [ expectedJsonBodyParserResult, expectedValidatorResult ] = [
    Symbol('expectedJsonBodyParserResult'),
    Symbol('expectedValidatorResult')
  ]

  let app

  beforeEach(() => {
    let bootstrap = Factory({
      bodyParser: { json: stub().returns(expectedJsonBodyParserResult) },
      expressValidator: stub().returns(expectedValidatorResult)
    })

    app = bootstrap({ use: spy() })
  })

  it('should bind bodyParser json', () => {
    expect(app.use.withArgs(expectedJsonBodyParserResult).calledOnce).to.equal(true)
  })

  it('should bind expressValidator', () => {
    expect(app.use.withArgs(expectedValidatorResult).calledOnce).to.equal(true)
  })
})
