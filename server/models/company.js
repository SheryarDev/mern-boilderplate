const  mongoose =require("mongoose")
const { Schema } = mongoose;

const CompanySchema = new Schema(
  {
    companyName: {
      type: String,
    },
    companyLogo: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Company= mongoose.model("company", CompanySchema);
module.exports=Company;
