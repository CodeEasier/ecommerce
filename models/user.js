const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const uuidv1 = require('uuid').v1;


const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        require:true,
        maxlength:32,
        trim:true
    },
    lastName:{
        require:true,
        type:String,
        maxlength:32,
        trim:true
    },
    email:{
        type:String
        //require:true,
       // trim:true
        //unique:true
    },
    
    encry_password:{
        type : String,
        require : true
    },

    role:{
        type: String,
    },

    active:{
        type:Number,
    },

    verificationCode:{
        type:String
    },

    forgetpasswordVerificationCode:{
        type:String
    },
    salt:String,
    author :{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Cart',
    }
},
{timestamp:true}
)


userSchema.virtual("password")
    .set(function(password){
        
        this._password = password;
        this.salt = "eee"
        this.encry_password = this.securePassowrd(password) 
    })
    .get(function(){
        return this._password;
    })

    userSchema.methods={
        authenticate : function(plainpassword){
            this.securePassowrd(plainpassword)===this.encry_password
        },

    securePassowrd: function(plainpassword){ 
        if(!plainpassword) return "";

        try{
           /* const saltRounds = 10;
            //return crypto.createHmac("sha256", this.salt).update(plainpassword).digest("hex")
            bcrypt.hash(plainpassword, saltRounds, function(err, hash) {
                console.log(err)
                console.log(hash)
                this.encry_password=hash;
                console.log(plainpassword)
                return this.encry_password
            });*/
        }catch(err){
            return "";
        }
    }}

module.exports = mongoose.model("data", userSchema);
