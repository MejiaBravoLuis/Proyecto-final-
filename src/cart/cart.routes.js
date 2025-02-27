import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { addToCart, getCart, updateCart, removeFromCart, clearCart } from "./cart.controller.js";
import { productExists } from "../helpers/db-validator.js"
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.post(
    "/addToMyCart",
    [
        validarJWT,
        check("productId", "Invalid product ID").isMongoId(),
        check("productId").custom(productExists),
        check("cant", "Quantity must be > than 0").isInt({ min: 1 }),
        validarCampos
    ], 
    addToCart
);


router.get(
    "/getMyCart",
    [
        validarJWT
    ], 
    getCart
);


router.put(
    "/update", 
    [
        validarJWT,
        check("productId", "Invalid product ID").isMongoId(),
        check("productId").custom(productExists),
        check("cant", "Quantity must be > than 0").isInt({ min: 1 }),
        validarCampos
    ], 
    updateCart
);


router.delete(
    "/removeProduct", 
    [
        validarJWT,
        check("productId", "Invalid product ID").isMongoId(),
        check("productId").custom(productExists),
        validarCampos
    ], 
    removeFromCart
);


router.delete(
    "/clear",
    [
        validarJWT
    ], 
    clearCart
);

router.put(
    "/update/:productId",
    [
        validarJWT,
        check("productId", "Invalid ID format").isMongoId(),
        check("productId").custom(productExists),
        check("cant", "Quantity must be a positive number").isInt({ min: 1 }),
        validarCampos
    ],
    updateCart
);

export default router;
