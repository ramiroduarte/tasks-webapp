import mongoose from 'mongoose'
import chalk from 'chalk'
import ora from 'ora'
import 'dotenv/config';

console.log(chalk.yellow('----------------------------------------'))
const spinner = ora(chalk.cyan('Database is connecting...')).start();
mongoose.connect(process.env.MONGODB_URI)
    .then(db => {
        spinner.succeed(`Database is ${chalk.green('connected')}! ${chalk.cyan(`(${db.connections[0].name})`)}`)
        console.log(chalk.yellow('----------------------------------------\n'))
    })
    .catch(err => console.error(err))