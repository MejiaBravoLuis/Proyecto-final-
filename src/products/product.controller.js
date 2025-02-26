import { request, response } from "express";
import Product from "./product.model.js";
import Category from "../category/category.model.js";


export const addProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                msg: "Invalid category ID"
            });
        }

        const newProduct = new Product({ name, description, price, stock, category });
        await newProduct.save();

        res.status(201).json({
            success: true,
            msg: "Product created successfully",
            product: newProduct
        });

    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({
            success: false,
            msg: "Something went wrong while creating the product",
            error: error.message || error
        });
    }
};

export const listProducts = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .populate("category", "name")
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            products
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            success: false,
            msg: "Something went wrong while fetching products",
            error: error.message || error
        });
    }
};

export const getProductById = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id).populate("category", "name");

        if (!product || !product.status) {
            return res.status(404).json({
                success: false,
                msg: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({
            success: false,
            msg: "Something went wrong while fetching the product",
            error: error.message || error
        });
    }
};

export const updateProduct = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { category, ...data } = req.body;

        // Si se quiere cambiar la categoría, verificar si existe
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(400).json({
                    success: false,
                    msg: "Invalid category ID"
                });
            }
            data.category = category;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            success: false,
            msg: "Something went wrong while updating the product",
            error: error.message || error
        });
    }
};

export const deleteProduct = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product || !product.status) {
            return res.status(404).json({
                success: false,
                msg: "Product not found"
            });
        }

        await Product.findByIdAndUpdate(id, { status: false });

        res.status(200).json({
            success: true,
            msg: "Product deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            success: false,
            msg: "Something went wrong while deleting the product",
            error: error.message || error
        });
    }
};

export const searchProductsBy = async (req, res) => {
    try {
        const { query } = req.params; // Obtener la cadena de búsqueda de los parámetros
        const regex = new RegExp(query, "i"); // Crear una expresión regular (case insensitive)

        const products = await Product.find({ name: regex, status: true });

        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al buscar productos.",
            error: error.message
        });
    }
};

export const listBestSold = async (req, res) => {
    try {
        const { limite = 10 } = req.query;

        const products = await Product.find({ status: true })
            .sort({ stock: 1 })
            .limit(Number(limite));

        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Ups, something went wrong trying to list the best sold prodcuts.",
            error: error.message
        });
    }
}

export const addStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { cant } = req.body;

        if (!cant || isNaN(cant) || cant <= 0) {
            return res.status(400).json({
                success: false,
                msg: "Cant must be > 0"
            });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                msg: "Couldnt find the product"
            });
        }

        product.stock += Number(cant);
        await product.save();

        res.status(200).json({
            success: true,
            msg: `Stock updated succesfully. New Stock: ${product.stock}`,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Ups, something went wrong trying to add stock",
            error: error.message
        });
    }
};

export const listByCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const categoryExists = await Category.findById(id);
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                msg: "Invalid category ID"
            });
        }

        const products = await Product.find({ category: id, status: true }).populate("category", "name");

        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error fetching products by category.",
            error: error.message
        });
    }
};
