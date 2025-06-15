import express from 'express'
import * as categoryController from '../controllers/category.controller.js'
const router = express.Router()

router.get('/categories/:id', categoryController.getCategory);

router.post('/categories', categoryController.createCategory);
router.put('/categories/:id', categoryController.editCategory);
router.delete('/categories/:id', categoryController.deleteCategory);


export default router