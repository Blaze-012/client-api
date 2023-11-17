const { UserSchema } = require("./User.schema");


const insertUser = (userObj) => {
    return new Promise((resolve, reject) => {
        UserSchema(userObj).save()
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
    if (!email) return reject(new Error("Email is required"));
    UserSchema.findOne({ email })
          .exec()
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
    });
};

const storeUserRefreshJWT = (_id, token) => {
  return new Promise((resolve, reject) => {
    try {
      UserSchema.findOneAndUpdate({ _id },
        { $set: { "refreshJWT.token": token, "refreshJWT.addedAt": Date.now() } },
        { new: true }
      ).then(data => resolve(data))
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    }
    catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const storeUserAccessJWT = (_id, token) => {
  return new Promise((resolve, reject) => {
    try {
      UserSchema.findOneAndUpdate({ _id },
        { $set: { "accessJWT.token": token, "accessJWT.addedAt": Date.now() } },
        { new: true }
      ).then(data => resolve(data))
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    }
    catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const  getUserById = (_id) => {
    return new Promise((resolve, reject) => {
    if (!_id) return reject(new Error("Email is required"));
    UserSchema.findOne({_id })
          .exec()
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
    });
};

module.exports = {
  insertUser,
  getUserByEmail,
  getUserById,
  storeUserRefreshJWT,
  storeUserAccessJWT,
};