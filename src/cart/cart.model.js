import { Schema, model } from "mongoose";

const CartSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        products: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, "Quantity must be at least 1"]
                }
            }
        ],
        status: {
            type: String,
            enum: ["active", "paid"],
            default: "active"
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model("Cart", CartSchema);
