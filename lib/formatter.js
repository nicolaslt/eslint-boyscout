// TODO report on rules that have no match, with a nice configurable message
// TODO check whether colored output follows the terminal styling (don't assume that blue/yellow looks good/readable everywhere)
// TODO extract the formatting functions into helpers that can be re-used by the tests
const path = require("path")
const chalk = require("chalk")
const requireindex = require("requireindex")

function extractBoyscoutResults(results) {
  const byRuleId = {}

  for (const result of results) {
    for (const { ruleId, line, column } of result.messages) {
      if (ruleId.startsWith("boyscout/")) {
        if (!byRuleId[ruleId]) {
          byRuleId[ruleId] = { ruleId, matches: [] }
        }
        byRuleId[ruleId].matches.push(`${result.filePath}:${line}:${column}`)
      }
    }
  }
  return Object.values(byRuleId)
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

  const byRule = extractBoyscoutResults(results)
  let output = ""
  for (const { ruleId, matches } of byRule) {
    const docs = loadRuleDocs(allRules, ruleId)
    output += `${chalk.bold.underline.white(ruleId)}\n`

    if (docs.description) {
      output += `\t${chalk.blue(docs.description)}\n`
    }

    output += printMatches(matches, isSummary)
  }
  return output
}
