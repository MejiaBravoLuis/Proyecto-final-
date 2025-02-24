import { Router } from "express";
import { check } from "express-validator";
import { addCategory, listCategories, deleteCategory, updateCategory } from "./category.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js"
import { validarJWT } from "../middlewares/validar-jwt.js"
import { existCategory } from "../helpers/db-validator.js"
import { tieneRole } from "../middlewares/validar-role.js"

const router = Router();

router.get(
    "/",
    listCategories
)

router.post(
    "/",
    [
        validarJWT,
        tieneRole("ADMIN"),
        check("name", "The name is required").not().isEmpty(),
        validarCampos
    ],
    addCategory
)


router.put(
    "/:id",
    [
        validarJWT,
        tieneRole("ADMIN"),
        check("id", "This id ins't valid").isMongoId(),
        check("id").custom(existCategory),
        validarCampos
    ],
    updateCategory
)


router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole("ADMIN"),
        check("id", "This id ins't valid").isMongoId(),
        check("id").custom(existCategory),
        validarCampos,
    ],
    deleteCategory
);

export default router;
