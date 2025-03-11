import mongoose from 'mongoose'
import chalk from 'chalk'
import ora from 'ora'

console.log(chalk.yellow('----------------------------------------'))
const spinner = ora(chalk.cyan('Database is connecting...')).start();
mongoose.connect('mongodb://127.0.0.1:27017/tasks-webapp')
    .then(db => {
        spinner.succeed(`Database is ${chalk.green('connected')}! ${chalk.cyan(`(${db.connections[0].name})`)}`)
        console.log(chalk.yellow('----------------------------------------\n'))
    })
    .catch(err => console.error(err))