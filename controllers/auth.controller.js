const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');
const AppError = require('../utils/app.Error');

exports.createUser = catchAsync(async (req, res, next) => {
  const { username, email, password, role = 'user' } = req.body;
  // Crear una instancia de la clase user
  const newUser = new User({ username, email, password, role });
  // Encriptar la contraseña
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(password, salt);
  // Guardar en la base de datos con las contraseñas encriptadas
  await newUser.save();
  // Generar el JWT
  const token = await generateJWT(newUser.id);
  res.status(201).json({
    status: 'success',
    message: 'The user was created sucessfully',
    token,
    newUser: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //Verificar si existe el user y password y es correcto.
  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
      status: true,
    },
  });
  if (!user) {
    return next(new AppError('The user could not be found', 404));
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // Si todo estat bien, enviar el token al client
  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.renewToken = catchAsync(async (req, res, next) => {
  const { id } = req.sessionUser;

  const token = await generateJWT(id);

  const user = await User.findOne({
    where: {
      status: true,
      id,
    },
  });
  return res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});
