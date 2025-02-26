import { Router } from "express";
import { check } from "express-validator";
import { addProduct, listProducts, getProductById, updateProduct, deleteProduct, searchProductsBy, listBestSold, addStock, listByCategory } from "./product.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-role.js";

const router = Router();
router.get(
    "/bestsold",
    [
        validarJWT,
        validarCampos
    ],
    listBestSold
);

router.put(
    "/addStock/:id",
    [
        validarJWT,
        check("id", "This id isnt valid").isMongoId(),
        check("cant", "The stock must be > 0").isNumeric().custom(value => value > 0),
        validarCampos
    ],
    addStock
);

router.get(
    "/category/:id", 
    listByCategory
);

router.post(
    "/",
    [
        validarJWT, 
        tieneRole("ADMIN"),
        check("name", "The product name is required").notEmpty(),
        check("price", "The product price is required").notEmpty(),
        check("stock", "The product stock is required").notEmpty(),
        check("category", "Seems like the category ID does not exist").isMongoId(),
        validarCampos
    ],
    addProduct
);

router.get("/", listProducts);

router.get(
    "/:id",
    [
        check("id", "This id isnt valid").isMongoId(),
        validarCampos
    ],
    getProductById
);

router.put(
    "/:id",
    [
        validarJWT,
        tieneRole("ADMIN"),
        check("id", "This id isnt valid").isMongoId(),
        validarCampos
    ],
    updateProduct
);

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole("ADMIN"),
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    deleteProduct
);

router.get(
    "/search/:query",
    [
        check("query", "Query cant be empty").notEmpty(),
        validarCampos
    ],
    searchProductsBy
);

export default router;
