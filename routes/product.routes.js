const { Router } = require('express');
const { check } = require('express-validator');
const {
  findProduct,
  updateProduct,
  createProduct,
  deleteProduct,
  findProducts,
} = require('../controllers/product.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validProductById } = require('../middlewares/products.middlewares');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

router.get('/', findProducts);

router.get('/:id', validProductById, findProduct);

router.use(protect);

router.post(
  '/',
  [
    check('title', 'The title is required').not().isEmpty(),
    check('description', 'The description is required').not().isEmpty(),
    check('quantity', 'The quantity is required').not().isEmpty(),
    check('quantity', 'The quantity must be a number').isNumeric(),
    check('price', 'The price is required').not().isEmpty(),
    check('price', 'The price must be a number').isNumeric(),
    check('categoryId', 'The categoryId is required').not().isEmpty(),
    check('categoryId', 'The categoryId must be a number').isNumeric(),
    check('userId', 'The userId is required').not().isEmpty(),
    check('userId', 'The userId must be a number').isNumeric(),
    validateFields,
  ],
  createProduct
);

router.patch(
  '/:id',
  [
    check('title', 'The title is required').not().isEmpty(),
    check('description', 'The description is required').not().isEmpty(),
    check('quantity', 'The quantity is required').not().isEmpty(),
    check('quantity', 'The quantity must be a number').isNumeric(),
    check('price', 'The price is required').not().isEmpty(),
    check('price', 'The price must be a number').isNumeric(),
    validateFields,
    validProductById,
  ],
  updateProduct
);

// Siempre enviar en dos puntos :
router.delete('/:id', validProductById, deleteProduct);

module.exports = {
  productRouter: router,
};
