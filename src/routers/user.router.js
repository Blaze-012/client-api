const express = require("express");
const router = express.Router();

const { insertUser, getUserByEmail, getUserById } = require("../model/user/User.model");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");
const { createAccessJWT, creatRefreshJWT } = require("../helpers/jwt.helper");
const { userAuthorization } = require("../middlewares/authorization.middleware");

router.all("/", (req, res, next) => {
    // res.json({ message: "return from user router" });

    next();
});

//Create new user route
router.post("/", async (req, res) => {
    try {
        const { name, company, address, phone, email, password } = req.body;

        //hash password
        const hashedPass = await hashPassword(password);

        const newUserObj = {
            name,
            company,
            address,
            phone,
            email,
            password: hashedPass,
        };

        const result = await insertUser(newUserObj);
        console.log(result);

        res.json({ message: "New User created", result });
        
    } catch (error) {
        console.log(error)
        res.json({status: 'error',message: error.message})
    }
});

// User sign in Router
router.post("/login", async(req, res) => {

    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.json({ status: "error", message: "Invalid form submission!" });
    }

    const user = await getUserByEmail(email);
    console.log(user);

    const passFromDb = user && user._id ? user.password : null;

    if (!passFromDb) {
        return res.json({ status: "error", message: "Invalid email or password!" });
    }


    const result = await comparePassword(password, passFromDb);
    console.log(result);

    if (!result) {
        res.json({ status: "error", message: "Invalid email or password!" });
    }
    
    const accessJWT = await createAccessJWT(user.email, `${user._id}`);
    const refrestJWT = await creatRefreshJWT(user.email, `${user._id}`);

    res.json({ status: "success", message: "Login successfully" ,accessJWT, refrestJWT})
});

// Get user profile router
router.get("/", userAuthorization, async (req, res) => {
    //this data coming from database
    // const user = {
    //     "name": "Adarsh",
    //     "company": "Company name",
    //     "address": "Some address",
    //     "phone": "654789310",
    //     "email": "e@me.com",
    //     "password": "secret@123",
    // };
    const _id = req.userId;

    const userProfile = await getUserById(_id)

    res.json({ user: userProfile });
})

module.exports = router;