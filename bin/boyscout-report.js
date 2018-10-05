#!/usr/bin/env node

const eslint = require('eslint').CLIEngine
const engine = new eslint({
    useEslintrc: true
    // TODO add formatter
    // TODO check if we can disale all rules but the boyscout ones
    // TODO list by default, --summary toggle
})
engine.executeOnFiles(['.'])
