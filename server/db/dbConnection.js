const mongoose =require('mongoose');
require('dotenv').config()

const MONGO_URL=process.env.MONGO_URI
 async function connectToMonog(){

 await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("database connected");
  })
  .catch(err => {
    console.log("Could not connect", err);
  });


    }




module.exports=connectToMonog