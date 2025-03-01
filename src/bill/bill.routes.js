import { Router } from "express";   
import { validarJWT } from "../middlewares/validar-jwt.js";
import { generateBill } from "../cart/cart.controller.js";
import { tieneRole } from "../middlewares/validar-role.js"
import { check } from "express-validator";
import { getBillHistory, getBillDetails, getUserBills } from "../bill/bill.controller.js"

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

router.get(
    "/billDetails/:billId",
    [
        validarJWT,
        tieneRole("ADMIN"),
        check("billId", "This id ins't valid").isMongoId(),
    ],
    getBillDetails
)

router.get(
    "/getUserBill/:userId",
    [
        validarJWT,
        tieneRole("ADMIN"),
        check("userId", "This id ins't valid").isMongoId(),
    ],
    getUserBills
)

export default router;