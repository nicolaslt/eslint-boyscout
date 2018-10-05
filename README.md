# Boyscout
Something to help you keep track of your refactoring effort, by semi-abusing eslint.

This is a combination of 2 concepts.
1. An [eslint plugin](https://github.com/nicolaslt/eslint-plugin-boyscout) that lets you define your own rules without creating a plugin for yourself.
2. A custom reporter that shows only the `boyscout` rules, aggregated by rules


# Installation

`npm install --save-dev eslint-boyscout`

# Usage

1. Make sure to follow the steps in the [eslint plugin](https://github.com/nicolaslt/eslint-plugin-boyscout)
2. Your refactoring will now be delivered through whatever `eslint` integration you might have in your IDE/CI

# Reporter

`boyscout report`: shows the list of files you still need to refactor, grouped by rule
`boyscout report --summary`: to only show a count per rule.


