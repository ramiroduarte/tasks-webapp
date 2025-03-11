import express from 'express'
import User from '../models/User.js'
import Task from '../models/Task.js'
import { isAuthenticated } from '../helpers/auth.js';
const router = express.Router();



router.get('/tasks', isAuthenticated, async (req, res) => {
    let user = await User.findById(req.user.id);
    
    if (user && user.view.length > 0) {
        if (req.query.sort === "desc" || req.query.sort === "asc") {
            await User.updateOne(
                { _id: req.user.id },
                { $set: { "view.0.sort": req.query.sort } }
            );
        }

        if (["creationDate", "dueDate", "priority"].includes(req.query.view)) {
            await User.updateOne(
                { _id: req.user.id },
                { $set: { "view.0.name": req.query.view } }
            );
        }
    }

    user = await User.findById(req.user.id);
    let tasks;
    if (user.view[0].name === "creationDate") {
        tasks = await Task.find({ user: req.user.id, completed: false }).sort({ creationDate: user.view[0].sort });
    } else if (user.view[0].name === "dueDate") {
        tasks = await Task.find({ user: req.user.id, completed: false }).sort({ dueDate: user.view[0].sort });
    } else if (user.view[0].name === "priority") {
        tasks = await Task.find({ user: req.user.id, completed: false }).sort({ priority: user.view[0].sort });
    }
    let completedTasks = await Task.find({ user: req.user.id, completed: true });
    tasks = tasks.concat(completedTasks);

    res.render('tasks/index', { alerts: [], tasks, user });
});


router.get('/tasks/edit/:id', isAuthenticated, async (req, res) => {
    const task = await Task.findById(req.params.id);
    res.render('tasks/edit', { alerts: [], task })
})


//////////////////////////////////////////////////////////////////
//----------------------- API ------------------------------------

//Add task
router.post('/tasks', isAuthenticated, async (req, res) => {
    const { taskTitle, taskDescription, taskDueDate, taskPriority, taskCategory } = req.body;
    const { categories } = await User.findById(req.user.id);
    const newTask = new Task({
        user: req.user.id,
        title: taskTitle,
        description: taskDescription,
        dueDate: taskDueDate,
        priority: taskPriority,
        category: categories[taskCategory].name
    });
    await newTask.save();
    req.flash('success_msg', '¡Tarea creada correctamente!');
    res.redirect('/tasks');
})

// Tick task as completed
router.patch('/tasks/:id', isAuthenticated, async (req, res) => {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed;
    await task.save();
    res.redirect('/tasks');
})


// Edit task
router.put('/tasks/:id', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    await Task.findByIdAndUpdate(req.params.id, { title, description });
    req.flash('success_msg', '¡Tarea editada correctamente!')
    res.redirect('/tasks')
})


// Delete task
router.delete('/tasks/:id', isAuthenticated, async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    req.flash('success_msg', '¡Tarea eliminada correctamente!')
    res.redirect('/tasks')
})



export default router