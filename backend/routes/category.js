import passport from 'passport'
import * as categoryController from '../controllers/category.controller.js'
const router = passport.Router()

router.get('/categories/:id', categoryController.getCategory);

router.post('/categories', categoryController.createCategory);
router.put('/categories/:id', categoryController.editCategory);
router.delete('/categories/:id', categoryController.deleteCategory);
router.patch('/categories/:id/active', categoryController.setCategoryActive);

export default router