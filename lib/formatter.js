// TODO check whether colored output follows the terminal styling (don't assume that blue/yellow looks good/readable everywhere)
// TODO extract the formatting functions into helpers that can be re-used by the tests
const path = require("path")
const chalk = require("chalk")
const requireindex = require("requireindex")

const DEFAULT_DONE_MESSAGE = "All done! Time to clean up."

function extractBoyscoutResults(results) {
  const byRuleId = {}

  for (const result of results) {
    for (const { ruleId, line, column } of result.messages) {
      if (ruleId && ruleId.startsWith("boyscout/")) {
        if (!byRuleId[ruleId]) {
          byRuleId[ruleId] = []
        }
        byRuleId[ruleId].push(`${result.filePath}:${line}:${column}`)
      }
    }
  }
  return byRuleId
}

function loadRuleDocs(allRules, ruleId) {
  const withoutPrefix = ruleId.replace("boyscout/", "")
  const rule = allRules[withoutPrefix]
  return (rule.meta || {}).docs || {}
}

function printMatches(matches, summary) {
  const count = matches.length
  const matchLabel = count === 1 ? "match" : "matches"

  if (summary) {
    return chalk.yellow(`\t${count} ${matchLabel}.\n\n`)
  }

  const matchReports = matches
    .map(match => chalk.yellow(`\t${match}`))
    .join("\n")
  return `${matchReports}\n\n`
}

module.exports = results => {
  const RULES_DIR = process.env.BOYSCOUT_DIR || "./boyscout-rules"
  const isSummary = process.env.BOYSCOUT_SUMMARY

  const allRules = requireindex(path.resolve(RULES_DIR))

  const resultsByRule = extractBoyscoutResults(results)
  let output = ""

  for (const ruleId of Object.keys(allRules)) {
    const docs = loadRuleDocs(allRules, ruleId)
    output += `${chalk.bold.underline.white(ruleId)}\n`

    const matches = resultsByRule[`boyscout/${ruleId}`]

    if (matches) {
      if (docs.description) {
        output += `\t${chalk.blue(docs.description)}\n`
      }

      output += printMatches(matches, isSummary)
    } else {
      const doneMessage = docs.doneMessage || DEFAULT_DONE_MESSAGE
      output += chalk.green(`\t${doneMessage}\n\n`)
    }
  }
  return output
}
