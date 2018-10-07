# Boyscout

> Would you mind rewriting this with tool X instead of Y, we're gradually migrating to it

_A pull request reviewer_

> I have 20min spare, wish I knew what I could improve

_A developer_

> I wonder how we are doing with refactoring X

_A team member_

If any of those sound awfully familiar, you have come to the right place.

Boyscouts have a rule: "Leave the campground cleaner than you found it." and this tool helps you apply it to your codebase.

This is a combination of 2 concepts.
1. An [eslint plugin](https://github.com/nicolaslt/eslint-plugin-boyscout) that lets you define your own rules without creating and publishign a plugin.
2. A custom reporter that shows only the `boyscout` rules, aggregated by rules

Technically you can use it to track anything an AST tree visitor will allow you to, we use it to keep track of gradual refactoring, the type you only do when you happen to touch a file.

# Installation

`npm install --save-dev eslint-boyscout`

# Usage

1. Make sure to follow the steps in the [eslint plugin](https://github.com/nicolaslt/eslint-plugin-boyscout)
2. Refactoring errors/warning will now be delivered through your favourite IDE/CI `eslint` integration.

# Reporter

`boyscout report`: shows the list of files you still need to refactor, grouped by rule

`boyscout report --summary`: to only show a count per rule.

Example summary output with a very simple rule:

![Summary reporter screenshot](https://github.com/nicolaslt/eslint-boyscout/raw/master/reporter-summary.png)

