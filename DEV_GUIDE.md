> [!NOTE]
> I use EJS as view engine.

------------------------------------------

**Templates for _views_ 'ejs' files:**
```
<%- include('../partials/main', {
        titlePage: '', 
        frontend: '', 
        backend: ''
    })
%>
```

> `titlePage` is the title of the tab
> `frontend` is the frontend file path (if it doesn't have, it's empty)
> `backend` is the backend file path (if it doesn't have, it's empty)

------------------------------------------

**Nodemon CMD:** _(Nodemon is a module which it is used for initialize automatically the server every time what I save a backend file)_

`npm run dev`

('run' cmd is to run a script created in 'package.json' and then the file name )
(With nodemon I save to write 'node server.js' every time I make a change)

-----------------------------------------

In 'views/partials' folder, I add partial files which I can add them in other view file.
An example could be the header, which it is the same in the most of routes so I write it once in 'partials' and then I require it from each file as:
'<%- include('partials/header') #>'

-----------------------------------------

The 'routes' folder is to modulete the project routes and split them as I want (ex: shop, dashboard, settings).
So in each file I write the all routes related to each module.

----------------------------------------

I use the EJS template engine.
It's like a extension of HTML, because for example it may be required data from the DB and with that create a element depending on the data.

----------------------------------------

### **Modules:**
- `dotenv` is used to use the '.env' file.
- `ejs` is the template engine.
- `express` is the framework to create routes.
- `morgan` is a middleware to log data in console.
- `path` and `url` is used for indicate the __dirname (is the root path).
- `express-session` to craete a user session and navigate between the different routes with the same session.
- `method-override` to extend the HTML methods (ex: in forms only can be used GET and POST methods) so it add PUT, DELETE, etc methods.
- `moongose` to connect with 'MongoDB' database.
- `bcryptjs` to encrypt password and generate a hash.
- `connect-flash` to send alerts (ex: when the password is wrong because it is less than 4 characters or the email is incorrect)
- `passport` and `passport-local` to authenticate the user.
- `chalk` to use colors in the console.
- `ora` to create a spinner and edit messages in the console. (Ex: To simulate it's loading something)


---------------------------------------

To see the collections in 'mongoDB':
- In console: `mongosh`.
- Then `use <nombre DB>`. Ex: `use tasks-webapp`
- `show collections` to see all collections
- `db.<nombre DB>.find()` to see data. Ex: `db.users.find()`
