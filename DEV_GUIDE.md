## **EndPoints:**
| Method | Endpoint         | Description                                                        |
|--------|------------------|--------------------------------------------------------------------|
| `GET`  | /api/users/:id    | To get a user by ID.                                               |
| `GET`  | /api/users/:id/tasks   | To get all tasks from an user.                                     |
| `GET`  | /api/users   | To get all users.                                     |


-------------------------

## Modules
| Modules             | Description                                                                 |
|----------------------|-----------------------------------------------------------------------------|
| `dotenv`             | Used to load environment variables from the `.env` file.                    |
| `ejs`                | Template engine for rendering views.                                        |
| `express`            | Framework used to create routes.                                            |
| `morgan`             | Middleware to log requests in the console.                                  |
| `path` and `url`     | Used to indicate the `__dirname` (root path).                               |
| `express-session`    | Used to create a user session and navigate between routes with the same session. |
| `method-override`    | Extends HTML methods (e.g., adding PUT, DELETE to forms, which normally only support GET and POST). |
| `mongoose`           | Used to connect with the `MongoDB` database.                               |
| `bcryptjs`           | Encrypts passwords and generates hashes.                                    |
| `connect-flash`      | Sends flash messages (e.g., showing alerts for invalid email or password). |
| `passport` and `passport-local` | Used to authenticate users.                                        |
| `chalk`              | Adds colors to the console output.                                          |
| `ora`                | Creates a spinner and customizes messages in the console (e.g., simulating loading). |



----------------------------------------

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

**CMD to run the server:**

```
npm run dev
```

(`run` cmd is to run a script created in 'package.json' and then the file name )

-----------------------------------------


To see the collections in 'mongoDB':
- In console: `mongosh`.
- Then `use <nombre DB>`. Ex: `use tasks-webapp`
- `show collections` to see all collections
- `db.<collection name>.find()` to see data. Ex: `db.users.find()`
- `db.dropDatabase()` to delete the all database.
- `db.<collection name>.drop()` to delete the collection.
