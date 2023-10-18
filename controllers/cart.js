const Cart = require("../models/cart")
const bodyParser = require('body-parser')
const { validationResult, body } = require('express-validator');
const cart = require("../routes/cart");
const jwt = require('jsonwebtoken');

const fn = require('../functions');
const { empty } = require("@hapi/joi/lib/types/alternatives");


exports.carts = async (req, res) => {
    const data = await Cart.find();
    res.status(200).json({
        "data": data
    });
}

exports.addCart = async(req, res)=>{
    const getUser = jwt.decode(req.headers.token, process.env.SECRET)
    //const getUser ="11"
    const smartPhoneID = req.headers.smartphoneid;
    const user = await Cart.findOne({userID:getUser});
  //  console.log(user[0].userID)
    if(!user || user===null){
        try{
            const newData = await Cart.create({
                userID: getUser,
            })
        
            newData.smartPhoneID.push(smartPhoneID);
            const data = await newData.save();
            
            return res.status(200).json({
                meassge: "New User and Data Saved ",   
            })
        } catch (err) {
           return  res.status(400).json({
                error: err.meassge
        
            })
        }
    }else{
        try{
        const cart = await Cart.findOne({userID:user.userID});
       //console.log(cart)
        cart.smartPhoneID.push(smartPhoneID);
       const data = await cart.save();
       return res.status(200).json({
        meassge: "saved with existing User",   
    })
        }catch(err){
            return  res.status(400).json({
                error: err.meassge
        
            })
        }
    }
}


exports.deleteCart = async (req, res) => {
    const dataID = req.params.id;
    try {
        const result = await Cart.findOneAndDelete({ _id: dataID })
        
         return res.send("Cart is Empty Succesfully")
    } catch (error) {
        return res.send(error)
    }
}
