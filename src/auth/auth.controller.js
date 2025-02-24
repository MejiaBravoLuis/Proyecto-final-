import User from '../users/user.model.js';
import { hash, verify } from 'argon2';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const lowerEmail = email ? email.toLowerCase() : null;
        const lowerUsername = username ? username.toLowerCase() : null;

        const user = await User.findOne({
            $or: [{ email: lowerEmail }, { username: lowerUsername }]
        });

        if (!user) {
            return res.status(400).json({
                msg: 'Invalid credentials, email does not exist in the database'
            });
        }

        if (!user.status) {
            return res.status(400).json({
                msg: 'The user does not exist in the database'
            });
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'The password is incorrect'
            });
        }

        const token = await generarJWT(user.id);

        return res.status(200).json({
            msg: 'Login successful!',
            userDetails: {
                username: user.username,
                token: token,
            }
        });

    } catch (e) {
        console.log(e);

        return res.status(500).json({
            message: "Server error",
            error: e.message
        });
    }
}

export const register = async (req, res) => {
    try {
        const data = req.body;
        const encryptedPassword = await hash(data.password);

        const user = await User.create({
            name: data.name,
            username: data.username,
            email: data.email,
            password: encryptedPassword,
        });

        return res.status(201).json({
            message: "User registered successfully",
            userDetails: {
                username: user.username,
                email: user.email,
            },
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "User registration failed",
            error: error.message
        });
    }
}
