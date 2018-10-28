require("chai").should()
const chalk = require("chalk")

const formatter = require("../lib/formatter")

describe("formatter", () => {
  describe("defaults", () => {
    before(() => delete process.env.BOYSCOUT_DIR)
    it("should default the rules dir location", () => {
      formatter.should.throw(/ENOENT.*boyscout\/boyscout-rules/)
    })
  })

  before(() => (process.env.BOYSCOUT_DIR = `${__dirname}/rules`))

  it("is a function", () => {
    formatter.should.be.an("function")
  })

  it("supports empty results", () => {
    // eslint-disable-next-line no-unused-expressions
    ;(() => formatter([])).should.not.throw
  })

  it("should return a string", () => {
    // eslint-disable-next-line no-unused-expressions
    formatter([]).should.be.a("string").that.is.empty
  })

  it("should ignore non boyscout rules", () => {
    const result = formatter([{ messages: [{ ruleId: "not-a-boyscout" }] }])
    // eslint-disable-next-line no-unused-expressions
    result.should.be.a("string").that.is.empty
  })

  it("should report a boyscout rule", () => {
    const result = formatter([
      {
        messages: [{ ruleId: "boyscout/simple-test", line: 1, column: 2 }],
        filePath: "test.js"
      }
    ])
    // eslint-disable-next-line no-unused-expressions
    result.should.be.a("string").that.is.equal(
      `${chalk.bold.underline.white("boyscout/simple-test")}
\t${chalk.blue("A test rule")}
${chalk.yellow("\ttest.js:1:2")}

`
    )
  })

  it("supports rules that don't have any description", () => {
    const result = formatter([
      {
        messages: [{ ruleId: "boyscout/nodesc-test", line: 1, column: 2 }],
        filePath: "test.js"
      }
    ])
    // eslint-disable-next-line no-unused-expressions
    result.should.be.a("string").that.is.equal(
      `${chalk.bold.underline.white("boyscout/nodesc-test")}
${chalk.yellow("\ttest.js:1:2")}

`
    )
  })

  it("supports rules that don't have any meta", () => {
    const result = formatter([
      {
        messages: [{ ruleId: "boyscout/nometa-test", line: 1, column: 2 }],
        filePath: "test.js"
      }
    ])
    // eslint-disable-next-line no-unused-expressions
    result.should.be.a("string").that.is.equal(
      `${chalk.bold.underline.white("boyscout/nometa-test")}
${chalk.yellow("\ttest.js:1:2")}

`
    )
  })

  describe("summary", () => {
    before(() => {
      process.env.BOYSCOUT_SUMMARY = true
      process.env.BOYSCOUT_DIR = `${__dirname}/rules`
    })
    after(() => delete process.env.BOYSCOUT_SUMMARY)

    it("should report a count rather than the list of matches", () => {
      const result = formatter([
        {
          messages: [{ ruleId: "boyscout/simple-test", line: 1, column: 2 }],
          filePath: "test.js"
        }
      ])
      // eslint-disable-next-line no-unused-expressions
      result.should.be.a("string").that.is.equal(
        `${chalk.bold.underline.white("boyscout/simple-test")}
\t${chalk.blue("A test rule")}
${chalk.yellow("\t1 match.\n\n")}`
      )
    })

    it("should support matches plural", () => {
      const result = formatter([
        {
          messages: [{ ruleId: "boyscout/simple-test", line: 1, column: 2 }],
          filePath: "test.js"
        },
        {
          messages: [{ ruleId: "boyscout/simple-test", line: 1, column: 2 }],
          filePath: "othertest.js"
        }
      ])
      // eslint-disable-next-line no-unused-expressions
      result.should.be.a("string").that.is.equal(
        `${chalk.bold.underline.white("boyscout/simple-test")}
\t${chalk.blue("A test rule")}
${chalk.yellow("\t2 matches.\n\n")}`
      )
    })
  })
})
