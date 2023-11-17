const { verifyAccessJWT } = require("../helpers/jwt.helper");
const { getAccessJWT } = require("../helpers/jwt.helper");
const {UserSchema} = require("../model/user/User.schema");

const userAuthorization = async (req, res, next) => {
    const { authorization } = req.headers;
    // console.log(authorization);

    

    const decoded = await verifyAccessJWT(authorization);
    const decoded_email = decoded.payload;
    console.log("Decoded: ", decoded);

    if (decoded_email) {
        const userId = await getAccessJWT(authorization);
        console.log("userId inside auth: ", userId);

        if (!userId) {
           return res.status(403).json({ message: "Forbidden" });
        }

        req.userId = userId;
        return next();
    }

    return res.status(403).json({ message: "Forbidden" });
};

module.exports = {
    userAuthorization,
}