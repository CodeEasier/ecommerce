const express = require('express');
const { signup, signupVerification, login, forgetpassword, forgetpasswordVerificationCode
 ,changePassword, users, signout } = require("../controllers/user");
const { check } = require("express-validator")
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/users", users);

router.post('/signup', [
    /*check("firstName", "Name atleaste Should be 3 ").isLength({min:3}),
    check("email", "Should be enter an email").isEmail(),
    check("password", "password atleaste Should be 6 character").isLength({min:6}) ,*/
],
    signup);
    

router.get("/signup/:verificationCode", signupVerification);
router.post('/login', login)
router.post("/forgetpassword", forgetpassword);
router.post("/forgetpassword/:forgetpasswordVerificationCode", forgetpasswordVerificationCode)
router.post('/changePassword', auth, changePassword);
router.get('signout', signout)

module.exports = router