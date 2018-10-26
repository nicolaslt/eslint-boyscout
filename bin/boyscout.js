#!/usr/bin/env node

const program = require("commander")

program
  .command("report", "Outputs a report of all the boyscout work left to do")
  .parse(process.argv)
