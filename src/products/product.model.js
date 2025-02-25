import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, "The product name is required"],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: [true, "The product price is required"],
        min: [0, "The price cannot be negative"]
    },
    stock: {
        type: Number,
        required: [true, "The stock is required"],
        min: [0, "Stock cannot be negative"]
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "The category is required"]
    },
    status: {
        type: Boolean,
        default: true
    },
    
},
    {
        timestamps: true,
        versionKey: false
    }
);

export default model("Product", ProductSchema);
