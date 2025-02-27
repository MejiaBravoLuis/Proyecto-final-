import { request, response } from "express";
import Cart from "./cart.model.js";
import Product from "../products/product.model.js";
import Bill from "../bill/bill.model.js"

export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id; 
        const { productId, cant } = req.body; 

        console.log("Request Body:", req.body);
        const product = await Product.findById(productId);
        if (!product || !product.status) {
            return res.status(404).json({
                success: false,
                msg: "Product not found or is inactive"
            });
        }

        
        if (product.stock < cant) {
            return res.status(400).json({
                success: false,
                msg: "Not enough stock available"
            });
        }

        let cart = await Cart.findOne({ user: userId, status: "active" });
        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
        }

        const productInCart = cart.products.find(item => item.product.toString() === productId);
        if (productInCart) {
            productInCart.quantity += cant;
        } else {
            cart.products.push({ product: productId, quantity: cant });
        }
        product.stock -= cant;

        await product.save();
        await cart.save();

        res.status(200).json({
            success: true,
            msg: "Product added to cart successfully 🛒",
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Something went wrong while adding product to cart",
            error: error.message
        });
    }
};

export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId, status: "active" })
            .populate("products.product", "name price")
            .populate("user", "name");


        if (!cart) {
            return res.status(404).json({
                success: false,
                msg: "Cart not found"
            });
        }

        const response = {
            cartId: cart._id,
            userId: cart.user,
            products: cart.products.map(item => ({
                Product_ID: item.product._id,
                Product_Name: item.product.name,
                Price: item.product.price,
                Cant: item.quantity
            }))
        };

        res.status(200).json({
            success: true,
            cart: response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Something went wrong while getting the cart",
            error: error.message
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        const cart = await Cart.findOne({ user: userId, status: "active" });

        if (!cart) {
            return res.status(404).json({
                success: false,
                msg: "Cart not found"
            });
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                msg: "Product not found in cart"
            });
        }

        const quantityToReturn = cart.products[productIndex].quantity;

        cart.products.splice(productIndex, 1);
        await cart.save();

        const product = await Product.findById(productId);

        if (product) {
            product.stock += quantityToReturn;
            await product.save();
        }

        res.status(200).json({
            success: true,
            msg: "Product removed from cart and stock updated",
            cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Something went wrong while removing the product from the cart",
            error: error.message
        });
    }
};

export const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId, status: "active" })
        .populate("products.product");

        if (!cart) {
            return res.status(404).json({
                success: false,
                msg: "Cart not found"
            });
        }

        for (const item of cart.products) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: item.quantity }
            });
        }

        await Cart.findOneAndUpdate({ user: userId, status: "active" }, { products: [] });

        res.status(200).json({
            success: true,
            msg: "Cart cleared successfully and stock restored",
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Something went wrong while clearing the cart",
            error: error.message
        });
    }
};

export const updateCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const { cant } = req.body; 

        if (!cant || isNaN(cant) || cant < 0) {
            return res.status(400).json({
                success: false,
                msg: "The quantity must be a number > than or equal to 0"
            });
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                msg: "Cart not found"
            });
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                msg: "Product not found in cart"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                msg: "Product not found"
            });
        }

        const previousQuantity = cart.products[productIndex].quantity;

        if (cant === 0) {
            cart.products.splice(productIndex, 1);
            await Product.findByIdAndUpdate(productId, {
                $inc: { stock: previousQuantity }
            });
        } else {
            const quantityDifference = cant - previousQuantity;

            if (quantityDifference > 0 && product.stock < quantityDifference) {
                return res.status(400).json({
                    success: false,
                    msg: "Not enough stock available"
                });
            }
            cart.products[productIndex].quantity = cant;

            await Product.findByIdAndUpdate(productId, {
                $inc: { stock: -quantityDifference }
            });
        }

        await cart.save();

        res.status(200).json({
            success: true,
            msg: "Cart updated successfully",
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Something went wrong while updating the cart",
            error: error.message
        });
    }
};

export const generateBill = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                msg: "User is not authenticated"
            });
        }

        const userId = req.user._id;
        const Client = req.user.name;

        // Obtener el carrito activo del usuario
        const cart = await Cart.findOne({ user: userId, status: "pending" }).populate("products.product");

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({
                success: false,
                msg: "Cart is empty or not found"
            });
        }

        // Generar la factura
        const bill = new Bill({
            user: userId,
            client: Client,
            products: cart.products.map(item => ({
                product: item.product._id, // Asegúrate de incluir el ID del producto aquí
                productName: item.product.name,
                price: item.product.price,
                quantity: item.quantity
            })),
            total: cart.products.reduce((acc, item) => acc + (item.product.price * item.quantity), 0),
            status: "pending"  // Puedes agregar el estado como "pendiente" o algo similar si lo deseas
        });

        // Guardar la factura
        await bill.save();

        // Vaciar el carrito después de generar la factura
        cart.status = "inactive"; // O "completed", según la lógica de tu negocio
        await cart.save();

        res.status(200).json({
            success: true,
            msg: "Bill generated successfully",
            bill
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Ups, Something went wrong while generating the bill",
            error: error.message
        });
    }
};
