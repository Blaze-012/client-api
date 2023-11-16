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

module.exports = {
    insertUser,
    getUserByEmail,
};