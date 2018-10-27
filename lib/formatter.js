/* TODO change how the rules are leaded
 * - load them all with requireindex
 * - env var to allow loading from somewhere else that cwd (which will allow cleaner tests)
 */
// TODO report on rules that have no match, with a nice configurable message
// TODO check whether colored output follows the terminal styling (don't assume that blue/yellow looks good/readable everywhere)
const path = require("path")
const chalk = require("chalk")

function extractBoyscoutResults(results) {
  return results.reduce((memo, result) => {
    result.messages
      .filter(({ ruleId }) => ruleId && ruleId.startsWith("boyscout/"))
      .forEach(({ ruleId, line, column }) => {
        if (!memo[ruleId]) {
          memo[ruleId] = { matches: [] }
        }
        memo[ruleId].matches.push(`${result.filePath}:${line}:${column}`)
      })
    return memo
  }, {})
}

function loadRuleDocs(ruleId) {
  const withoutPrefix = ruleId.replace("boyscout/", "")
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const rule = require(path.resolve(`./boyscout-rules/${withoutPrefix}`))
  return (rule.meta || {}).docs
}

function printMatches(matches) {
  const count = matches.length
  const matchLabel = count === 1 ? "match" : "matches"

  if (process.env.BOYSCOUT_SUMMARY) {
    return "\t" + chalk.yellow(`${count} ${matchLabel}.\n\n`)
  }

  return matches.map(match => chalk.yellow(`\t${match}`)).join("\n") + "\n\n"
}

module.exports = results => {
  const byRule = extractBoyscoutResults(results)
  let output = ""
  for (const rule in byRule) {
    const docs = loadRuleDocs(rule)
    output += chalk.bold.underline.white(rule) + "\n"

    if (docs.description) {
      output += "\t" + chalk.blue(docs.description) + "\n"
    }

    output += printMatches(byRule[rule].matches)
  }
  return output
}
