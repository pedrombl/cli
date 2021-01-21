const ora = require('ora')
const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const inquirer = require('inquirer')

module.exports.scaffold = async (filename, cmd = {}) => {
  if (cmd.args.length === 0) {
    await inquirer
      .prompt([
        {
          name: 'filename',
          message: 'File name',
          default: 'tailwind.config.js'
        },
        {
          name: 'directory',
          message: 'Directory to place it in',
          default: './'
        }
      ])
      .then(answers => {
        filename = answers.filename
        cmd.directory = answers.directory
      })
  }

  filename = filename || 'tailwind.config.js'
  cmd.directory = cmd.directory || './'

  const spinner = ora()

  if (path.parse(filename).ext !== '.js') {
    return spinner.fail(`File must have a .js extension, i.e. ${filename}${chalk.bold('.js')}`)
  }

  const html = fs.readFileSync(path.resolve(__dirname, '../../stubs/config/tailwind.config.js'), 'utf8')
  const destination = path.resolve(`${cmd.directory}/${filename}`)

  if (fs.existsSync(destination)) {
    return spinner.fail(`File exists: ${destination}`)
  }

  return fs.outputFile(destination, html)
    .then(() => spinner.succeed(`Created new Tailwind CSS config in ${destination}`))
    .catch(() => {})
}