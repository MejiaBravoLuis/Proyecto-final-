import { Router } from "express";
import { check } from "express-validator";
import { getUsers, getUserById, updateUser } from "./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
 
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
 
export default router;