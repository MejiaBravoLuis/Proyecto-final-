import { Router } from "express";   
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { generateBill } from "../cart/cart.controller.js";
import { completePurchase } from "./bill.controller.js";

const router = Router();

router.post(
    "/getMyBill/:id",
    [
        validarJWT,
    ],
    generateBill
)

router.post(
    "/payMyBill/:billId",
    [
        validarJWT,
        completePurchase
    ]
)

export default router;