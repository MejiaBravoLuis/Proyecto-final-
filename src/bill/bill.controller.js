import Bill from "../bill/bill.model.js";
import Cart from "../cart/cart.model.js";
import User from "../users/user.model.js";

export const completePurchase = async (req, res) => {
    try {
        const userId = req.user._id;
        const { billId } = req.params;
        const { confirmWord } = req.body; // Cambiado de "password" a "confirmWord"

        if (!confirmWord) {
            return res.status(400).json({
                success: false,
                msg: "Confirm word is required to complete the purchase"
            });
        }

        if (confirmWord !== "CONFIRMAR") {
            return res.status(401).json({
                success: false,
                msg: "Incorrect confirm word"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }

        const bill = await Bill.findOne({ _id: billId, user: userId });
        if (!bill) {
            return res.status(404).json({
                success: false,
                msg: "Bill not found or does not belong to the user"
            });
        }

        if (bill.status === "paid") {
            return res.status(400).json({
                success: false,
                msg: "This bill has already been paid"
            });
        }

        // Marcar la factura como pagada
        bill.status = "paid";
        await bill.save();

        // Vaciar el carrito y crear un nuevo carrito si es necesario
        await Cart.findOneAndUpdate({ user: userId, status: "active" }, { status: "inactive" });

        // Crear un nuevo carrito (si el usuario desea agregar nuevos productos)
        const newCart = new Cart({ user: userId, status: "active", products: [] });
        await newCart.save();

        res.status(200).json({
            success: true,
            msg: "Purchase completed successfully, new cart created",
            bill,
            newCart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Something went wrong while completing the purchase",
            error: error.message
        });
    }
};

