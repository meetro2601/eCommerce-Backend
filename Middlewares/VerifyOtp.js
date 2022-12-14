const bcrypt = require("bcryptjs");
const OTPSchema = require("../SchemaModels/OTPSchema");

const verifyOtp = (req, res, next) => {
  if (req.body.otpObj) {
    OTPSchema.findOne({ _id: req.body.otpObj.otpId }, async (err, doc) => {
      if(err){
        return res.status(500).send();
      }

      if (!doc) {
        return res
          .status(400)
          .send({ error: "Invalid OTP. Please try with new one" });
      }

      const emailVerified = await bcrypt.compare(
        req.body.otpObj.emailOTP,
        doc.emailOTP
      );
      const mobileVerified = await bcrypt.compare(
        req.body.otpObj.mobileOTP,
        doc.mobileOTP
      );

      if (!emailVerified || !mobileVerified) {
        OTPSchema.deleteOne(doc,(error,result)=>{
          if(error){
            return res.status(500).send();
          }
        })
        return res
        .status(400)
        .send({ error: "Invalid OTP. Please try with new one" });
      }
      next();
    });
  }
};

module.exports = verifyOtp;
