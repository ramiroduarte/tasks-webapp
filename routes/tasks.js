import express from 'express'
import User from '../models/User.js'
import Task from '../models/Task.js'
import Category from '../models/Category.js';
import { isAuthenticated } from '../helpers/auth.js';
const router = express.Router();



router.get('/tasks', isAuthenticated, async (req, res) => {
    const categories = await Category.find({ user: req.user.id }).sort({ creationDate: 1 });;
    let user = await User.findById(req.user.id);
    

    if(req.query.sort === "desc" || req.query.sort === "asc") {
        await User.findByIdAndUpdate(req.user.id, {
            $set: { "view.sort": req.query.sort }
        });
    }

    if(["creationDate", "dueDate", "priority"].includes(req.query.view)) {
        await User.findByIdAndUpdate(req.user.id, {
            $set: { "view.name": req.query.view }
        });
    }

    if (req.query.category) {
        const category = await Category.findById(req.query.category);
        if (category) {
            await User.findByIdAndUpdate(req.user.id, {
                $set: { "categoryActive": req.query.category }
            })
        }
    }


    user = await User.findById(req.user.id);    
    let tasks, completedTasks;
    if (user.view.name === "creationDate") {
        tasks = await Task.find({ user: req.user.id, completed: false, category: user.categoryActive }).sort({ creationDate: user.view.sort });
        completedTasks = await Task.find({ user: req.user.id, completed: true, category: user.categoryActive }).sort({ creationDate: user.view.sort });
    } else if (user.view.name === "dueDate") {
        tasks = await Task.find({ user: req.user.id, completed: false, category: user.categoryActive }).sort({ dueDate: user.view.sort });
        completedTasks = await Task.find({ user: req.user.id, completed: true, category: user.categoryActive }).sort({ dueDate: user.view.sort });
    } else if (user.view.name === "priority") {
        tasks = await Task.find({ user: req.user.id, completed: false, category: user.categoryActive }).sort({ priority: user.view.sort });
        completedTasks = await Task.find({ user: req.user.id, completed: true, category: user.categoryActive }).sort({ priority: user.view.sort });
    }
    tasks = tasks.concat(completedTasks);

    res.render('tasks/index', { alerts: [], tasks, user, categories});
});


router.get('/tasks/edit/:id', isAuthenticated, async (req, res) => {
    const task = await Task.findById(req.params.id);
    res.render('tasks/edit', { alerts: [], task })
})

router.get('/categories/edit', isAuthenticated, async (req, res) => {
    const categories = await Category.find({ user: req.user.id });
    res.render('tasks/editCategories', { alerts: [], categories })
})

//////////////////////////////////////////////////////////////////
//----------------------- API ------------------------------------

//Add task
router.post('/tasks', isAuthenticated, async (req, res) => {
    const { taskTitle, taskDescription, taskDueDate, taskPriority, taskCategory } = req.body;
    const category = await Category.findById(taskCategory)
    const newTask = new Task({
        user: req.user.id,
        title: taskTitle,
        description: taskDescription,
        dueDate: taskDueDate,
        priority: taskPriority,
        category: category._id
    });
    await newTask.save();
    await Category.findByIdAndUpdate(category._id, {
        $set: { tasksCount: category.tasksCount + 1 }
    })
    req.flash('success_msg', '¡Tarea creada correctamente!');
    res.redirect('/tasks');
})

// Tick task as completed
router.patch('/tasks/:id', isAuthenticated, async (req, res) => {
    const task = await Task.findById(req.params.id);
    await Task.findByIdAndUpdate(req.params.id, {
        $set: { completed: !task.completed }
    }) 
    const category = await Category.findById(task.category);

    //If task have been completed
    if (!task.completed) {
        await Category.findByIdAndUpdate(task.category, {
            $set: { tasksCompletedCount: category.tasksCompletedCount + 1 }
        })
    } else {  //If task haven't been completed
        await Category.findByIdAndUpdate(task.category, {
            $set: { tasksCompletedCount: category.tasksCompletedCount - 1 }
        })
    }
    res.redirect('/tasks');
})


// Edit task
router.put('/tasks/:id', isAuthenticated, async (req, res) => {
    let { taskTitle, taskDescription, taskDueDate, taskPriority, taskCategory } = req.body;
    taskDescription = taskDescription.trim()
    await Task.findByIdAndUpdate(req.params.id, {
        $set: {
            "title": taskTitle,
            "description": taskDescription,
            "dueDate": taskDueDate,
            "priority": taskPriority,
            "category": taskCategory
        }
    });
    req.flash('success_msg', '¡Tarea editada correctamente!')
    res.redirect('/tasks')
})


// Delete task
router.delete('/tasks/:id', isAuthenticated, async (req, res) => {
    const task = await Task.findById(req.params.id);
    const category = await Category.findById(task.category)
    await Task.findByIdAndDelete(req.params.id);
    if (task.completed) {
        await Category.findByIdAndUpdate(task.category, {
            $set: {
                tasksCount: category.tasksCount - 1,
                tasksCompletedCount: category.tasksCompletedCount - 1
            }
        })
    } else {
        await Category.findByIdAndUpdate(task.category, {
            $set: { tasksCount: category.tasksCount - 1 }
        })
    }
    req.flash('success_msg', '¡Tarea eliminada correctamente!')
    res.redirect('/tasks')
})

// Create category
router.post('/categories', isAuthenticated, async (req, res) => {
    const { categoryName } = req.body;
    const newCategory = new Category({
        title: categoryName,
        user: req.user.id
    });
    await newCategory.save();
    req.flash('success_msg', '¡Categoría creada correctamente!');
    res.redirect('/categories/edit');
})

// Edit category
router.put('/categories/:id', isAuthenticated, async (req, res) => {
    const { categoryName } = req.body;
    const categoryId = req.params.id; 
    await Category.findByIdAndUpdate(categoryId, {
        $set: { "title": categoryName }
    });
    req.flash('success_msg', '¡Categoría editada correctamente!');
    res.redirect('/categories/edit');
})

// Delete category
router.delete('/categories/:id', isAuthenticated, async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    await Task.deleteMany({ category: req.params.id });
    req.flash('success_msg', '¡Categoría eliminada correctamente!')
    res.redirect('/categories/edit')
})

export default router