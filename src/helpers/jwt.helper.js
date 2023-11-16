const jwt = require('jsonwebtoken');
const { storeUserRefreshJWT, storeUserAccessJWT } = require("../model/user/User.model");

const createAccessJWT = async(email, _id) => {

    try {
        const accessJWT = jwt.sign({ payload: email },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
        );
        
        await storeUserAccessJWT(_id, accessJWT);
        return Promise.resolve(accessJWT);
    } catch (error) {
        return Promise.reject(error);
    }
};

const creatRefreshJWT = async (email, _id) => {
    try {
       const refreshJWT = jwt.sign({ email },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '30d' }
        ); 
        
        await storeUserRefreshJWT(_id, refreshJWT)
        return Promise.resolve(refreshJWT);
    } catch (error) {
        return Promise.reject(error);
    }
};

module.exports = {
    createAccessJWT,
    creatRefreshJWT,
};


