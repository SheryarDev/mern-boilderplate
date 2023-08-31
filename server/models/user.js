const  mongoose =require("mongoose")
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    profilePic: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    isCompany: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'company',
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const user= mongoose.model('User', userSchema);
module.exports=user;
