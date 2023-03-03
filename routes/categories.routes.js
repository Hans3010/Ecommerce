const { Router } = require('express');
const { check } = require('express-validator');
const {
  findCategories,
  findCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categories.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validCategoryById } = require('../middlewares/category.middleware');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

router.get('/', findCategories);

router.get('/:id', validCategoryById, findCategory);
//se pone el protect arriba de las rutas a proteger
router.use(protect);

router.post(
  '/',
  [check('name', 'The name is required').not().isEmpty(), validateFields],
  createCategory
);

router.patch(
  '/:id',
  [
    check('name', 'The name is required').not().isEmpty(),
    validateFields,
    validCategoryById,
  ],
  updateCategory
);

router.delete('/:id', validCategoryById, deleteCategory);

module.exports = {
  categoriesRouter: router,
};
