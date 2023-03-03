const express = require('express');
const cors = require('cors');
const { db } = require('../database/db');
const morgan = require('morgan');
const { usersRouter } = require('../routes/user.routes');
const { productRouter } = require('../routes/product.routes');
const { categoriesRouter } = require('../routes/categories.routes');
const globalErrorHandler = require('../controllers/error.controller');
const AppError = require('../utils/app.Error');
const { authRouter } = require('../routes/auth.routes');
//1. CREAMOS UNA CLASE

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;
    this.paths = {
      user: '/api/v1/user',
      products: '/api/v1/products',
      categories: '/api/v1/categories',
      auth: '/api/v1/auth',
    };
    //Llamo el metodo de conexion a la base de datos
    this.database();
    //Siempre ejecutar de primero los middlewares
    this.middlewares();

    this.routes();
  }

  middlewares() {
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }

    this.app.use(cors());
    this.app.use(express.json());
  }

  //RUTAS
  routes() {
    this.app.use(this.paths.categories, categoriesRouter);
    this.app.use(this.paths.products, productRouter);
    this.app.use(this.paths.user, usersRouter);
    this.app.use(this.paths.auth, authRouter);
    this.app.all('*', (req, res, next) => {
      return next(
        new AppError(`can't find ${req.originalUrl} on this server!`, 404)
      );
    });
    this.app.use(globalErrorHandler);
  }

  database() {
    db.authenticate()
      .then(() => console.log('Database authenticated'))
      .catch(error => console.log(error));
    //AL CAMBIAR CUALQUIER MODEL DEBO ESCRIBIR EN EL SYNC ({ force : true })
    //IMPORTANTE!! EL FORCE TRUE BORRA TODA LA BASE DE DATOS!!
    db.sync()
      .then(() => console.log('Database synced'))
      .catch(error => console.log(error));
  }

  //METODO PARA ESCUCHAR SOLICITUDES POR EL PUERTO
  listen() {
    this.app.listen(this.port, () => {
      console.log('Server is running on port', this.port);
    });
  }
}

//2. EXPORTAMOS EL SERVIDOR
module.exports = Server;
