import User from "../users/user.model.js"
import Bill from "../bill/bill.model.js"

export const getBillHistory = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                msg: "User is not authenticated"
            });
        }

        const userId = req.user._id;

        const user = await User.findById(userId);
        const bills = await Bill.find({ user: userId }).populate("products.product");

        if (!bills.length) {
            return res.status(404).json({
                success: false,
                msg: "No purchase history found"
            });
        }

        const history = bills.map(bill => ({
            client: {
                id: user._id,
                name: user.name
            },
            products: bill.products.map(item => ({
                id: item.product._id,
                name: item.product.name,
                price: item.price,
                quantity: item.quantity,
                total: bill.total
            }))
        }));

        res.status(200).json({
            success: true,
            history
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Ups, something went wrong while fetching purchase history",
            error: error.message
        });
    }
};

export const getBillDetails = async (req, res) => {
    try {
        const { billId } = req.params;

        const bill = await Bill.findOne({ _id: billId })
            .populate("user", "name _id") 
            .populate("products.product", "name _id price");

        if (!bill) {
            return res.status(404).json({ success: false, msg: "Bill not found" });
        }
        const billDetails = {
            client: {
                id: bill.user._id,
                name: bill.user.name
            },
            products: bill.products.map(item => ({
                id: item.product._id,
                name: item.product.name,
                price: item.price,
                quantity: item.quantity
            })),
            total: bill.total,
            createdAt: bill.createdAt
        };

        res.status(200).json({
            success: true,
            bill: billDetails
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error getting bill details",
            error: error.message
        });
    }
};

export const getUserBills = async (req, res) => {
    try {
        const { userId } = req.params;
        const bills = await Bill.find({ user: userId, status: "paid" })
            .populate("user", "name _id")
            .populate("products.product", "name _id price");

        res.json({ success: true, bills });

    } catch (error) {
        res.status(500).json({ success: false, msg: "Error getting user bills", error: error.message });
    }
};
