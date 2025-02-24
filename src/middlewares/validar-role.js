export const tieneRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(500).json({
                success: false,
                msg: 'Trying to verify a role without validating the token first'
            });
        }
        console.log("User role in middleware:", req.user.role, "👤");

        if (!roles.includes(req.user.role)) {
            return res.status(401).json({
                success: false,
                msg: `User not authorized, has role ${req.user.role}, authorized roles are ${roles}`
            });
        }

        next();
    }
}
