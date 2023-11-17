const jwt = require('jsonwebtoken');
const { UserSchema } = require("../model/user/User.schema");
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


const verifyAccessJWT = (userJWT) => {
    try {
        return Promise.resolve(jwt.verify(userJWT, process.env.JWT_ACCESS_SECRET))
        
    } catch (error) {
        return Promise.reject(error)
    }
};

const getAccessJWT = async (key) => {
  try {
      const user = await UserSchema.findOne({ 'accessJWT.token': key });
      const userId = user?._id || null;
      console.log("inside getAccess JWt: ",userId);
    return Promise.resolve(user?._id || null);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
    createAccessJWT,
    creatRefreshJWT,
    verifyAccessJWT,
    getAccessJWT,
};


