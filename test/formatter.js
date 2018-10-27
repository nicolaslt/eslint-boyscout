require('chai').should()
const chalk = require("chalk")

const formatter = require('../lib/formatter')

describe('formatter', () => {
  it('is a function', () => {
    formatter.should.be.an('function')
  })

  it('supports empty results', () => {
    // eslint-disable-next-line no-unused-expressions
    (() => formatter([])).should.not.throw
  })

  it('should return a string', () => {
    // eslint-disable-next-line no-unused-expressions
    formatter([]).should.be.a('string').that.is.empty
  })

  it('should ignore non boyscout rules', () => {
    const result = formatter([ {messages: [ { ruleId: 'not-a-boyscout'}]} ])
    // eslint-disable-next-line no-unused-expressions
    result.should.be.a('string').that.is.empty
  })

  it('should report a boyscout rule', () => {
    const result = formatter([ {messages: [ { ruleId: 'boyscout/simple-test', line: 1, column: 2 }], filePath: 'test.js'} ])
    // eslint-disable-next-line no-unused-expressions
    result.should.be.a('string').that.is.equal(
`${chalk.bold.underline.white('boyscout/simple-test')}
\t${chalk.blue('A test rule')}
${chalk.yellow('\ttest.js:1:2')}

`
    )
  })
  
  // TODO test it survives rules that don't define optional meta/docs

})
