const Categories = require('../models/categories.model');
const catchAsync = require('../utils/catchAsync');

exports.findCategories = catchAsync(async (req, res, next) => {
  const category = await Categories.findAll({
    where: {
      status: true,
    },
  });
  res.status(200).json({
    status: 'success',
    message: 'The categories were found sucessfully',
    category,
  });
});

exports.findCategory = catchAsync(async (req, res, next) => {
  const { category } = req;
  res.status(200).json({
    status: 'success',
    message: 'The category was found successfully',
    category,
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const newCategory = await Categories.create({
    name: name.toLowerCase(),
  });
  res.status(201).json({
    status: 'success',
    message: 'The category was created successfully ',
    newCategory,
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const { category } = req;
  const { name } = req.body;
  await category.update({
    name: name.toLowerCase(),
  });
  res.status(200).json({
    status: 'success',
    message: 'The category was updated successfully',
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const { category } = req;
  await category.update({ status: false });
  res.status(200).json({
    status: 'success',
    message: 'The category has been deleted successfully',
  });
});
