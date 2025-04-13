const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");


const cors = require("cors");

const userRoutes = require("./routes/User.js");
const memoryRoutes = require("./routes/Memory.js");


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use("/users",userRoutes);
app.use("/memories",memoryRoutes);


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); 
  });



if(require.main === module){
    app.listen(process.env.PORT || 3000, ()=> {
        console.log(`API is now running at port ${process.env.PORT || 3000}`);
	})
	};

module.exports = { app, mongoose};
