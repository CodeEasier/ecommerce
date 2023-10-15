const User = require("../models/user")
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const user = require("../routes/user");
const { date } = require("joi");
const argon2 = require('argon2')
const nodemailer = require("nodemailer");
const fn = require('../functions')

exports.users = async (req, res) => {
    const data = await User.find();
    res.status(200).json(data);
}

exports.signup = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()[0].msg
        })
    }

    const user = new User(req.body);
    try {
        const verificationCode = Math.floor(Math.random() * (10000 - 1 + 4));

        const hash = await argon2.hash(user.password);
        const newUser = await User.create({
            firstName: user.firstName,
            lastName: user.lastName,
            encry_password: hash,
            email: user.email,
            role: user.role,
            active: 0,
            verificationCode: verificationCode
        })

        const from = "tiyaabali@gmail.com";
        const to = "tiyaabali@gmail.com";
        const subject = "subcject";
        const text = "www.tiyaabali.com/signup/verificationCode=" + verificationCode;
        fn.sendEmailFunction(from, to, subject, text)

        res.status(200).json({
            meassge: "saved",
            newUser
        })
    } catch (err) {
        res.status(400).json({
            error: err,

        })
    }
}
exports.signupVerification = async (req, res) => {
    //console.log(req.params.verificationCode)
    const user = await User.findOne({ verificationCode: req.params.verificationCode })
    //console.log(user)
    if (user == '' || user == null) {
        return res.status(400).json({
            "Error Message": "Invilied URL and Code"
        })
    }

    const result = await User.findOneAndUpdate(
        { verificationCode: req.params.verificationCode },
        { active: 1, verificationCode: '' },
        {
            new: true
        }
    )
    //console.log(result)
    return res.status(200).json({
        "Message": "Accout Activated Succesfully",
    })
}


exports.login = async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({
            error: "email not exist"
        })
    }

    //athuntication
    try {
        if (user.active === 0) {
            return res.status(400).json({
                "Message": "Account not Active Please Visit your Email"
            })
        }

        const data = await argon2.verify(user.encry_password, req.body.password);
        //console.log(data)
        if (data) {
            //create Token
            const token = jwt.sign(
                { _id: user._id },
                process.env.SECRET,
                {
                    expiresIn: "2h",
                }
            );
            //put Token into COKKEE
            res.cookie('token', token, { expire: new date() + 1 })
            ///send response to front end
            //user.token = token;
            res.json({
                "Message": "Login",
                token,
                id: user._id,
                User_Name: user.firstName + " " + user.lastName,
                email: user.email
            })
        } else {
            return res.status(400).json({
                message: "email and Password not Match"
            })
        }
    } catch (err) {
        return res.status(400).json({
            error: err
        })
    }

}

exports.forgetpassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({
            error: "email not exist"
        })
    }
    if (user.active === 0) {
        return res.status(400).json({
            "Message": "Account not Active Please Visit your Email"
        })
    }

    const verificationCode = Math.floor(Math.random() * (10000 - 1 + 4));
    const from = "tiyaabali@gmail.com";
    const to = "tiyaabali@gmail.com";
    const subject = "subcject";
    const text = "www.tiyaabali.com/forgetpassword/" + verificationCode;
    fn.sendEmailFunction(from, to, subject, text)

    const result = await User.findOneAndUpdate(
        { email: req.body.email },
        { forgetpasswordVerificationCode: verificationCode },
        {
            new: true
        }
    )

    return res.status(200).json({
        "Message": "Please Visit your Email"
    })
}

exports.forgetpasswordVerificationCode = async (req, res) => {
    // console.log(req.body.oldPassword)
    // console.log(req.params.forgetpasswordVerificationCode)
    const user = await User.findOne({ forgetpasswordVerificationCode: req.params.forgetpasswordVerificationCode })
    if (user == '' || user == null) {
        return res.status(400).json({
            "Error Message": "Invilied URL and Code"
        })
    }
    const hash = await argon2.hash(req.body.password);
    const data = await argon2.verify(user.encry_password, req.body.oldPassword);
    if (data) {
        const result = await User.findOneAndUpdate(
            { forgetpasswordVerificationCode: req.params.forgetpasswordVerificationCode },
            {
                forgetpasswordVerificationCode: "",
                encry_password: hash
            },
            {
                new: true
            }
        )
        return res.status(200).json({
            "Message": "password change successfully"
        })
    } else {
        return res.status(400).json({
            "Error": "Old Paasword is Incorrect"
        })
    }

    return res.status(200).json({
        "Message": "Go to and http://localhost:8080/api/setNewPasswordForget"
    })
}

exports.changePassword = async (req, res) => {
  const getUser = jwt.decode(req.headers.token, process.env.SECRET)
  //console.log(user._id)
  const user = await User.findOne({ _id: getUser._id})
  if (user == '' || user == null) {
      return res.status(400).json({
          "Error Message": "Invilied Token"
      })
  }

  const data = await argon2.verify(user.encry_password, req.body.oldPassword);
  const hash = await argon2.hash(req.body.password);
  if (data) {
      const result = await User.findOneAndUpdate(
          {  _id: getUser._id },
          {
              encry_password: hash
          },
          {
              new: true
          }
      )
      return res.status(200).json({
          "Message": "password change successfully"
      })
  } else {
      return res.status(400).json({
          "Error": "Old Paasword is Incorrect"
      })
  }
   
  //res.status(200).send("Welcome 🙌 ");
}

exports.signout = (req, res) => {
    res.clearCookie('token');
    return res.json({
        message: 'signout Done'
    })
}