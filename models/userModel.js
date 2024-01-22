import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from 'jsonwebtoken'

// schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    phoneNo: {
      type: Number,
      trim: true,
      required: [true, "Phone No. is required"],
    },
    pin: {
      type: String, // Change the type to String
      trim: true,
      required: [true, "Pin is required"],
    },
    userType:{
      type:String,
      trim:true,
      required:true,
    },
  },
  { timestamps: true }
);

// pre-save middleware
userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.pin = await bcrypt.hash(this.pin, salt);
    next();
  } catch (error) {
    next(error);
  }
});

//compare pin
userSchema.methods.comparePin = async function (userPin){
    const isMatch = await bcrypt.compare(userPin, this.pin);
    return isMatch;
}
//JSON webtoken

userSchema.methods.createJWT = function(){
    return JWT.sign({userId:this._id},process.env.JWT_SECRET, {expiresIn:"1d"});
}
export default mongoose.model("User", userSchema);
