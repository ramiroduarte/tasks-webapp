import Task from '../models/Task.js'
import Category from '../models/Category.js'
import { createResponse } from '../helpers/responseHelper.js'

export const getTasksByUserId = async ({ userId, categoryId, view, sort, completed }) => {
	if (!userId) {
		return createResponse({
			success: false,
			msg: 'Missing parameters',
			statusCode: 400
		})
	};

	const query = { user: userId };
	if (categoryId) query.category = categoryId;
	if (completed) query.completed = completed === 'true';

	const allowedViews = ['creationDate', 'dueDate', 'priority'];
	const sortField = allowedViews.includes(view) ? view : 'creationDate';
	const sortOrder = sort === 'asc' ? 1 : -1;

	try {
		const tasks = await Task.find(query).sort({ [sortField]: sortOrder });
		return createResponse({
			data: tasks
		});
	} catch (err) {
		return createResponse({
			success: false,
			msg: 'Server error while getting task from user',
			error: err.message.message,
			statusCode: 500
		})
	}
};

export const getTask = async (taskId) => {
	if (!taskId) {
		return createResponse({
			success: false,
			msg: 'Missing parameters',
			statusCode: 400
		})
	};
	try {
		const task = await Task.findById(taskId);
		return createResponse({
			data: task
		})
	} catch (err) {
		return createResponse({
			success: false,
			msg: 'Server error while getting task',
			error: err.message.message,
			statusCode: 500
		})
	}
};

export const setTask = async (userId, { title, description, categoryId, dueDate, priority }) => {
	if (!userId || !title || !categoryId) {
		return createResponse({
			success: false,
			msg: 'Missing parameters',
			statusCode: 400
		})
	}

	try {
		const category = await Category.findById(categoryId)
		if (!category) {
			return createResponse({
				success: false,
				msg: 'Category not found',
				statusCode: 404
			});
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

		return createResponse({
			data: newTask,
			statusCode: 201
		});
	} catch (err) {
		return createResponse({
			success: false,
			msg: 'Server error while creating task',
			error: err.message.message,
			statusCode: 500
		});
	}
};

export const setTaskAsCompleted = async (taskId) => {
	if (!taskId) {
		return createResponse({
			success: false,
			msg: 'Missing parameters',
			statusCode: 400
		})
	}

	try {
		const task = await Task.findById(taskId);
		if (!task) {
			return createResponse({
				success: false,
				msg: 'Task not found',
				statusCode: 404
			})
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
		return createResponse({
			data: taskUpdated
		})
	} catch (err) {
		return createResponse({
			success: false,
			msg: 'Server error while setting task as completed',
			error: err.message,
			statusCode: 500
		})
	}
};

export const editTask = async (taskId, { title, description, category, dueDate, priority }) => {
	if (!title || !description || !category || !dueDate || !priority) {
		return createResponse({
			success: false,
			msg: 'Missing parameters',
			statusCode: 400
		})
	}
	description = description.trim()

	try {
		const task = await Task.findByIdAndUpdate(taskId,
			{
				$set: {
					title,
					description,
					dueDate,
					priority,
					category
				}
			},
			{
				new: true
			}
		);
		if (!task) {
			return createResponse({
				success: false,
				msg: 'Task not found',
				statusCode: 404
			})
		}

		return createResponse({
			data: task
		})
	} catch (err) {
		return createResponse({
			success: false,
			msg: 'Server error while editing task',
			error: err.message,
			statusCode: 500
		})
	}
};

export const deleteTask = async (taskId) => {
	if (!taskId) {
		return createResponse({
			success: false,
			msg: 'Missing parameters',
			statusCode: 400
		})
	}

	try {
		const task = await Task.findById(taskId);
		if (!task) {
			return createResponse({
				success: false,
				msg: 'Task not found',
				statusCode: 400
			})
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

		return createResponse({
			data: task
		})
	} catch (err) {
		return createResponse({
			success: false,
			msg: 'Server error while deleting task',
			error: err.message,
			statusCode: 500
		})
	}
};