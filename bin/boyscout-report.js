#!/usr/bin/env node

const path = require("path")
const program = require("commander")
const { CLIEngine } = require("eslint")

program
  .description("Runs a report specific to the rules you defined for boyscout")
  .option("--summary", "Only output a count, not the list of all files")
  .parse(process.argv)

if (program.summary) {
  process.env.BOYSCOUT_SUMMARY = true
}

const engine = new CLIEngine({ useEslintrc: true })
const report = engine.executeOnFiles(["."])
const formatter = engine.getFormatter(
  path.join(__dirname, "..", "lib", "formatter.js")
)
console.log(formatter(report.results))
