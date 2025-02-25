'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js';
import userRoutes from '../src/users/user.routes.js'
import authRoutes from '../src/auth/auth.routes.js'
import categoryRoutes from '../src/category/category.routes.js'
import productRoutes from '../src/products/product.routes.js'

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) => {
    app.use("/ProyectoFinal/v1/users", userRoutes);
    app.use("/ProyectoFinal/v1/auth", authRoutes);
    app.use("/ProyectoFinal/v1/category", categoryRoutes);
    app.use("/ProyectoFinal/v1/product", productRoutes);
}

const conectarDB = async () => {
    try{
        await dbConnection();
        console.log("Data base conected successfully !!!");
    }catch(error){
        console.error('Error connecting to Data base', error);
        process.exit(1);
    }
}

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port: ${port}`);
    } catch (err) {
        console.log(`Server init failed: ${err}`);
    }
}