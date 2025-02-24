import Category from "./category.model.js";

export const listCategories = async (req, res) => {
    try {
        const cateories = await Category.find({ status: true })
        res.json({
            success: true,
            cateories
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to get the categories",
            error
        })
    }
}

export const addCategory = async (req, res) => {
    try {
        
        const authenticatedUser = req.user;

        if (!authenticatedUser || authenticatedUser.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "This action is only availiable for admins"
            })
        }

        const { name } = req.body;
        const existCategory = await Category.findOne({ name });

        if (existCategory) {
            return res.status(400).json({
                success: false,
                message: `Category with name ${name} already exists`
            })
        }

        const category = new Category({ name })
        await category.save()

        res.status(200).json({
            success: true,
            message: `Category ${name} created succesfully`,
            category
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to create the category",
            error
        })
    }
}

export const updateCategory = async (req, res) => {
    try {
        
        const { id } = req.params;
        const authenticatedUser = req.user;

        if (!authenticatedUser || authenticatedUser.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to edit this category"
            });
        }

        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true })
        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: "Could not find the category"
            });
        }

        res.json({
            success: true,
            message: "You've just updated the category successfully!!!",
            category: updatedCategory
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "Ups, something went wrong trying to update the category"
        })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params
        const authenticatedUser = req.user

        if (!authenticatedUser || authenticatedUser.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "This action is only availiable for admins"
            })
        }

        const category = await Category.findByIdAndUpdate( id, { status: false }, { new : true });

        res.status(200).json({
            success: true,
            message: "Category deactivated succesfully",
            category
        })
    } catch (error) {
        res.status(200).json({
            success: false,
            message: "Ups, something went wrong trying to deactivate the category",
            error
        })
    }
}