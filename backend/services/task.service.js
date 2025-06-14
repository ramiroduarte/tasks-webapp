import Task from '../models/Task.js'
import Category from '../models/Category.js'
import { createRes } from '../helpers/responseHelper.js'

export const getTask = async (taskId) => {
	if (!taskId) {
		return createRes(400, { msg: 'Missing parameters' })
	};
	try {
		const task = await Task.findById(taskId);
		return createRes(200, { data: task })
	} catch (error) {
		return createRes(500, { msg: 'Server error while getting task', error })
	}
};

export const setTask = async (userId, { title, description, categoryId, dueDate, priority }) => {
	if (!userId || !title || !categoryId) {
		return createRes(400, { msg: 'Missing parameters' })
	}

	try {
		const category = await Category.findById(categoryId)
		if (!category) {
			return createRes(404, { msg: 'Category not found' });
		}
		const newTask = new Task({
			user: userId,
			title,
			description,
			dueDate,
			priority,
			category: category._id
		});
		await newTask.save();
		await Category.findByIdAndUpdate(category._id, {
			$set: { tasksCount: category.tasksCount + 1 }
		});

		return createRes(201, { data: newTask });
	} catch (error) {
		return createRes(500, { msg: 'Server error while creating task', error });
	}
};

export const setTaskAsCompleted = async (taskId) => {
	if (!taskId) {
		return createRes(400, { msg: 'Missing parameters' })
	}

	try {
		const task = await Task.findById(taskId);
		if (!task) {
			return createRes(404, { msg: 'Task not found' });
		}

		const taskUpdated = await Task.findByIdAndUpdate(taskId,
			{
				$set: { completed: !task.completed }
			},
			{
				new: true
			}
		)
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
		return createRes(200, { data: taskUpdated })
	} catch (error) {
		return createRes(500, { msg: 'Server error while setting task as completed', error });
	}
};

export const editTask = async (taskId, { title, description, category, dueDate, priority }) => {
	if (!taskId || !title || !category || !dueDate || !priority) {
		return createRes(400, { msg: 'Missing parameters' })
	}
	description = description.trim()

	try {
		const task = await Task.findByIdAndUpdate(taskId,
			{
				$set: { title, description, dueDate, priority, category }
			},
			{
				new: true
			}
		);
		if (!task) {
			return createRes(404, { msg: 'Task not found' });
		}

		return createRes(200, { data: task })
	} catch (error) {
		return createRes(500, { msg: 'Server error while editing task', error });
	}
};

export const deleteTask = async (taskId) => {
	if (!taskId) {
		return createRes(400, { msg: 'Missing parameters' })
	}

	try {
		const task = await Task.findById(taskId);
		if (!task) {
			return createRes(400, { msg: 'Task not found' })
		}

		const category = await Category.findById(task.category)
		await Task.findByIdAndDelete(taskId);
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

		return createRes(200, { data: task });
	} catch (error) {
		return createRes(500, { msg: 'Server error while deleting task', error })
	}
};