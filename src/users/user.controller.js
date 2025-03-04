import { hash, verify } from 'argon2';
import User from "./user.model.js";

export const getUsers = async (req, res) => {
    try {
        const { limite = 10 , desde = 0 } = req.query;
        const query = { status: true };

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            users
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Something failed getting the users',
            error
        })
    }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({
                succes: false,
                msg: 'Usuario not found'
            })
        }

        res.status(200).json({
            succes: true,
            user
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al obtener usuario',
            error
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                msg: "Unauthorized: No user found in request"
            });
        }

        const userId = req.user._id;
        const { password, newPassword, ...data } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                msg: "User ID is missing from request"
            });
        }

        const existUser = await User.findById(userId);
        if (!existUser) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }
        delete data.email;

        if (newPassword) {
            if (!password) {
                return res.status(400).json({
                    success: false,
                    msg: "You must type your old password to change it"
                });
            }

            const isSame = await verify(existUser.password, password);
            if (!isSame) {
                return res.status(400).json({
                    success: false,
                    msg: "Incorrect password"
                });
            }

            if (newPassword.length < 8) {
                return res.status(400).json({
                    success: false,
                    msg: "New password must have at least 8 characters"
                });
            }

            data.password = await hash(newPassword);
        }

        console.log("Updating user with data:", data);

        const user = await User.findByIdAndUpdate(userId, data, { new: true });

        res.status(200).json({
            success: true,
            msg: "You've updated your profile successfully!",
            user
        });
    } catch (error) {
        console.error("Error en updateUser:", error);

        res.status(500).json({
            success: false,
            msg: "Ups, something went wrong trying to update the user",
            error: error.message || error
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                msg: " No user found in request"
            });
        }

        const { id } = req.params;
        const authUser = req.user;

        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return res.status(404).json({
                success: false,
                msg: "User not found in database"
            });
        }

        if (!userToDelete.status) {
            return res.status(400).json({
                success: false,
                msg: "The user has already been deleted"
            });
        }

        if (authUser.role === "CLIENT" && authUser._id.toString() !== id) {
            return res.status(403).json({
                success: false,
                msg: "CLIENT users can only delete their own account"
            });
        }

        if (authUser.role === "ADMIN" && userToDelete.role !== "CLIENT") {
            return res.status(403).json({
                success: false,
                msg: "ADMIN can only delete users with CLIENT role"
            });
        }

        await User.findByIdAndUpdate(id, { status: false });

        res.status(200).json({
            success: true,
            msg: "User deleted successfully"
        });

    } catch (error) {
        console.error("Error in deleteUser:", error);
        res.status(500).json({
            success: false,
            msg: "Something went wrong trying to delete the user",
            error: error.message || error
        });
    }
};

export const updateClient = async (req, res) => {
    try {

        const { userId } = req.params; 
        const { name, email, role } = req.body;
        console.log('USER ID GOT:' , userId)
        const updatedClient = await User.findByIdAndUpdate(
            userId,
            { name, email, role },
            { new: true, runValidators: true }
        );

        if (!updatedClient) {
            return res.status(404).json({
                success: false,
                msg: "Client not found"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Client updated successfully",
            client: {
                id: updatedClient._id,
                name: updatedClient.name,
                email: updatedClient.email,
                role: updatedClient.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Ups, something went wrong while updating the client",
            error: error.message
        });
    }
};