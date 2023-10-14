const express = require('express');
const { signup, signupVerification, login, users, signout } = require("../controllers/user");
const { check } = require("express-validator")
const router = express.Router();

router.get("/users", users);

router.post('/signup', [
    /*check("firstName", "Name atleaste Should be 3 ").isLength({min:3}),
    check("email", "Should be enter an email").isEmail(),
    check("password", "password atleaste Should be 6 character").isLength({min:6}) ,*/
],
    signup);
    

router.get("/signup/:verificationCode", signupVerification);

router.post('/login', login)
router.get('signout', signout)

module.exports = router