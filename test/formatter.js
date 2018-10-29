require("chai").should()
const chalk = require("chalk")

const formatter = require("../lib/formatter")

describe("formatter", () => {
  describe("defaults", () => {
    it("should default the rules dir location", () => {
      delete process.env.BOYSCOUT_DIR
      formatter.should.throw(/ENOENT.*boyscout\/boyscout-rules/)
    })
  })

  beforeEach(() => (process.env.BOYSCOUT_DIR = `${__dirname}/rule-simple-test`))

  it("is a function", () => {
    process.env.BOYSCOUT_DIR = `${__dirname}/empty-rules`
    formatter.should.be.an("function")
  })

  it("supports empty results", () => {
    // eslint-disable-next-line no-unused-expressions
    ;(() => formatter([])).should.not.throw
  })

  it("should return a string", () => {
    formatter([]).should.be.a("string")
  })

  it("should ignore non boyscout rules", () => {
    process.env.BOYSCOUT_DIR = `${__dirname}/empty-rules`
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
      `${chalk.bold.underline.white("simple-test")}
\t${chalk.blue("A test rule")}
${chalk.yellow("\ttest.js:1:2")}

`
    )
  })

  it("supports rules that don't have any description", () => {
    process.env.BOYSCOUT_DIR = `${__dirname}/rule-nodesc`
    const result = formatter([
      {
        messages: [{ ruleId: "boyscout/nodesc-test", line: 1, column: 2 }],
        filePath: "test.js"
      }
    ])
    // eslint-disable-next-line no-unused-expressions
    result.should.be.a("string").that.is.equal(
      `${chalk.bold.underline.white("nodesc-test")}
${chalk.yellow("\ttest.js:1:2")}

`
    )
  })

  it("supports rules that don't have any meta", () => {
    process.env.BOYSCOUT_DIR = `${__dirname}/rule-nometa`
    const result = formatter([
      {
        messages: [{ ruleId: "boyscout/nometa-test", line: 1, column: 2 }],
        filePath: "test.js"
      }
    ])
    // eslint-disable-next-line no-unused-expressions
    result.should.be.a("string").that.is.equal(
      `${chalk.bold.underline.white("nometa-test")}
${chalk.yellow("\ttest.js:1:2")}

`
    )
  })

  describe("summary", () => {
    beforeEach(() => {
      process.env.BOYSCOUT_SUMMARY = true
      process.env.BOYSCOUT_DIR = `${__dirname}/rule-simple-test`
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
        `${chalk.bold.underline.white("simple-test")}
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
        `${chalk.bold.underline.white("simple-test")}
\t${chalk.blue("A test rule")}
${chalk.yellow("\t2 matches.\n\n")}`
      )
    })
  })

  describe("finished rules", () => {
    it("should report on rules that have no match", () => {
      process.env.BOYSCOUT_DIR = `${__dirname}/rule-nometa`
      const result = formatter([])
      // TODO configurable message posibly just acceping  a template so users can provide their own.
      // TODO allow the message to be part of the rule configuration so that it can differ per rule?
      result.should.be.a("string").that.is.equal(
        `${chalk.bold.underline.white("nometa-test")}
${chalk.green("\tAll done! Time to clean up.\n\n")}`
      )
    })

    it("should support the doneMessage configuration", () => {
      process.env.BOYSCOUT_DIR = `${__dirname}/rule-simple-test`
      const result = formatter([])
      // TODO configurable message posibly just acceping  a template so users can provide their own.
      // TODO allow the message to be part of the rule configuration so that it can differ per rule?
      result.should.be.a("string").that.is.equal(
        `${chalk.bold.underline.white("simple-test")}
${chalk.green("\tWell done bud.\n\n")}`
      )
    })
  })
})
