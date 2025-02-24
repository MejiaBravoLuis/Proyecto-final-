import { Schema, model } from "mongoose";

const CategorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            maxLength: [100, "Name can't exceed 100 characeters"],
            minLength: [4, "4 Charactersmin"],
            trim: true,
            unique: true
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
)

export default model("Category", CategorySchema)