const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");


const cors = require("cors");


const userRoutes = require("./routes/user.js");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use("/users",userRoutes);



mongoose.connect(process.env.MONGODB_URI);

let db = mongoose.connection;
db.on("error", console.error.bind(console, "Error in the database connection!"));
db.once("open", ()=> console.log("Now connected to MongoDB Atlas."));



if(require.main === module){
    app.listen(process.env.PORT || 3000, ()=> {
        console.log(`API is now running at port ${process.env.PORT || 3000}`);
	})
	};

module.exports = { app, mongoose};
