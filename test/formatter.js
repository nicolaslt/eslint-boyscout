require('chai').should()

const formatter = require('../lib/formatter')

describe('formatter', () => {
  it('is a function', () => {
    formatter.should.be.an('function')
  })

  it('supports empty results', () => {
    // eslint-disable-next-line no-unused-expressions
    (() => formatter([])).should.not.throw
  })
})
