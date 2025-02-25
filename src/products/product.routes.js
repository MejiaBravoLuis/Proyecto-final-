import { Router } from "express";
import { check } from "express-validator";
import { addProduct, listProducts, getProductById, updateProduct, deleteProduct, searchProductsBy } from "./product.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-role.js";

const router = Router();

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
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    getProductById
);

router.put(
    "/:id",
    [
        validarJWT,
        tieneRole("ADMIN"),
        check("id", "No es un ID válido").isMongoId(),
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
        validarJWT, // Opcional: solo si deseas que la búsqueda requiera autenticación
        check("query", "La búsqueda no puede estar vacía").notEmpty(),
        validarCampos
    ],
    searchProductsBy
);

export default router;
