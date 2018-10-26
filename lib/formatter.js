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

module.exports = function(results) {
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
