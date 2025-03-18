import express from 'express';
import session from 'express-session';
import path from 'path';
import morgan from 'morgan';
import methodOverride from 'method-override';
import flash from 'connect-flash';
import passport from 'passport';
import chalk from 'chalk';
import ora from 'ora';
import 'dotenv/config';

//----- __dirname -----
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));                  //In ECMA Script doesn't exist '__dirname' as in CommonJS, so I need 'path' and 'url' packages to get it.


//----- Inicialiazations -----
const app = express();
import './config/database.js';
import './config/passport.js';

//----- Static files -----
app.use(express.static(path.join(__dirname, 'public')));                    //Indicate the folder of the static files

//----- Settings -----
app.set('port', process.env.PORT || 3000);                                  //Create a variable with 'port' name and value '3000'
app.set('case sensitive routing', true);                                    //Active case sensitive in routes (ex: is not the sema 'home' with 'Home')
app.set('view engine', 'ejs');                                              //Indicate the view engine that I'm going to use
app.set('views', path.join(__dirname, 'views'));                            //Indicate the folder with views where are HTML files

//----- Middlewares -----
app.use(morgan('short'));                                                   //Indicate the middleware what I use, Morgan logs in console when a user makes a request
app.use(express.urlencoded({ extended: false }));                           //Indicate how I want to receive the user data
app.use(methodOverride('_method'));                                         //Indicate that I'm going to use more methods in addition to HTML provides (GET and POST). It allows you to use PUT, DELETE, etc. (ex. in forms)
app.use(session({                                                           //Express default config. I didn't understand so much :)
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());                                             //This middleware initialize passport
app.use(passport.session())                                                 //This middleware use express sessions
app.use(flash())                                                            //Indicates to exprees that I'm goint to use the flash middleware

//----- Global variables -----
app.use((req, res, next) => {                                               //This middleware is used to pass local variables to views using 'res.locals'
    res.locals.success_msg = req.flash('success_msg');
    res.locals.warning_msg = req.flash('warning_msg');
    res.locals.danger_msg = req.flash('danger_msg');
    res.locals.user = req.user || null;
    next();
})

//----- Routes ------
import mainRouter from './routes/main.js';
import tasksRouter from './routes/tasks.js';
import userRouter from './routes/user.js'
app.use(mainRouter);
app.use(tasksRouter);
app.use(userRouter);

app.use((req, res, next) => {
    res.status(404).send('Página no encontrada.');
    next();
})




//----- Start server -----
const spinner = ora(chalk.cyan('Starting server...')).start();
const server = app.listen(app.get('port'), () => {
    spinner.succeed(`Server ${chalk.green('ready')} on port ${chalk.yellow(app.get('port'))}`);
});

//----- Close server event -----
process.on('SIGINT', () => {                                                //This runs when I want to shut down the server (ex. with CTRL + C)
    console.log(chalk.cyan('----------------------------------------'));
    spinner.info(chalk.yellow('Server shutting down...'));
    server.close(() => {
        spinner.succeed(`Server ${chalk.red('closed')}.`);
        console.log(chalk.cyan('----------------------------------------'));
        process.exit(0);
    });
});