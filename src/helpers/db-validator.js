import User from '../users/user.model.js';
import Role from '../role/role.model.js';
import Category from "../category/category.model.js"; 
import Product from "../products/product.model.js";
import { Types } from "mongoose";

export const esRoleValido = async (role = ' ') => {
    const existeRol = await Role.findOne({ role });

    if(!existeRol){
        throw new Error(`Role ${ role } does not exist in DB`);
    }
}

export const existenteEmail = async (email = '') => {
    const existeEmail = await User.findOne({ email });

    if(existeEmail){
        throw new Error(`Email ${ email } does not exist in DB`);
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);

    if (!existeUsuario) {
        throw new Error(`ID ${id} does not exist in DB`);
        
    }
}

export const existCategory = async (id = '') => {
    if (!Types.ObjectId.isValid(id)) {
        throw new Error(`The ID ${id} is not a valid ObjectId`);
    }

    const category = await Category.findById(id);
    if (!category) {
        throw new Error(`Category with ID ${id} does not exist`);
    }
};

export const esObjectIdValido = async (id) => {
    if (!Types.ObjectId.isValid(id)) {
        throw new Error(`The ID ${id} is not a valid ObjectId`);
    }
};

export const productExists = async (id) => {
    const product = await Product.findById(id);
    if (!product || !product.status) {
        throw new Error(`The product with ID ${id} does not exist or is inactive.`);
    }
};
