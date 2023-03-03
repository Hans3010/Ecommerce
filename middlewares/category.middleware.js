const Categories = require('../models/categories.model');
const AppError = require('../utils/app.Error');
const catchAsync = require('../utils/catchAsync');

exports.validCategoryById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await Categories.findOne({
    where: {
      id,
      status: true,
    },
  });
  if (!category) {
    return next(new AppError('The category was not found', 404));
  }
  req.category = category;
  next();
});
