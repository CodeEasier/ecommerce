const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    userID:{
        type:String
    },
    smartPhoneID:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'SmartPhone'
        }
    ]
  
},
{timestamp:true}
)

module.exports = mongoose.model("cart", cartSchema);
