import { Router } from "express";
import { check } from "express-validator";
import { getUsers, getUserById, updateUser, deleteUser, updateClient } from "./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-role.js";
 
const router = Router();
 
router.get("/", getUsers);
 
router.get(
    "/findUser/:id",
    [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    getUserById
)
 
router.put(
    "/update",
    [
        validarJWT,
        validarCampos
    ],
    updateUser
)

router.delete(
    "/delete/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    deleteUser
);

router.put(
    "/updateClient/:userId",
    [
        validarJWT,
        tieneRole("ADMIN"),
        check("userId", "No es un ID válido").isMongoId(),
        check("userId").custom(existeUsuarioById),
        validarCampos
    ],
    updateClient
)


export default router;