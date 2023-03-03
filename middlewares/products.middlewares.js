const Product = require('../models/product.model');
const AppError = require('../utils/app.Error');

exports.validProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({
      where: {
        id,
        status: true,
      },
    });
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    //COLOCAR EL PRODUCT ANTES DEL NEXT()
    req.product = product;
    next();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
