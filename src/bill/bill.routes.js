import { Router } from "express";   
import { validarJWT } from "../middlewares/validar-jwt.js";
import { generateBill } from "../cart/cart.controller.js";
import { getBillHistory } from "../bill/bill.controller.js"

const router = Router();

router.post(
    "/getMyBill",
    [
        validarJWT,
    ],
    generateBill
)

router.get(
    "/getMyHistory",
    [
        validarJWT,
    ],
    getBillHistory
)

export default router;