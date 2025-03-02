import { Router } from "express";   
import { validarJWT } from "../middlewares/validar-jwt.js";
import { generateBill } from "../cart/cart.controller.js";
import { tieneRole } from "../middlewares/validar-role.js"
import { validarCampos } from "../middlewares/validar-campos.js" 
import { check } from "express-validator";
import { getBillHistory, getBillDetails, getUserBills, updateBill } from "../bill/bill.controller.js"
import { stockProduct, productExists } from "../helpers/db-validator.js"

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

router.put(
    "/updateBill/:billId",
    [
        validarJWT,
        tieneRole("ADMIN"),
        check("billId", "Invalid bill ID").isMongoId(),
        check("productId", "Invalid product ID").isMongoId().custom(productExists),
        check("quantity", "Quantity must be a positive number").isInt({ min: 1 }),
        check("productId").custom((id, { req }) => stockProduct(id, req.body.quantity)),
        validarCampos
    ],
    updateBill
);

export default router;