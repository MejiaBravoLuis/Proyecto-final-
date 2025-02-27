import { Schema, model } from "mongoose";

const BillSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
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
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                }
            }
        ],
        total: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["paid", "pending"],
            default: "pending"
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model("Bill", BillSchema);
