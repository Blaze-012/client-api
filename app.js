require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require('mongoose');


const port = process.env.PORT || 3001;


//API security
// app.use(helmet());

//handle CORS error
app.use(cors());

//Setting up mongodb using mongoose
mongoose.connect(process.env.MONGO_URL);

if (process.env.NODE_ENV !== "production") {
    const mDb = mongoose.connection;
    mDb.on("open", () => {
        console.log("Connected to Mongo!");
    });
    mDb.on("error", (error) => {
        console.log(error);
    });

    //Logger
    app.use(morgan('tiny'));
}



//Set body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




//Load Routers
const userRouter = require("./src/routers/user.router");

const ticketRouter = require("./src/routers/ticket.router");


// Use Routers
app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);

//Error handler
const handleError = require("./src/utils/errorHandler");

app.use((req, res, next) => {
    const error = new Error("Resources not found!")
    error.status = 404;


    next(error);
});

app.use((error, req, res, next) => {
    handleError(error, res);
});



app.listen(port, () => {
    console.log(`API is ready on http://localhost:${port}`);
})