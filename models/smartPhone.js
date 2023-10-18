const { string } = require('joi');
const mongoose = require('mongoose');


const smartPhoneSchema = mongoose.Schema({
    model: {
        type: String,
        maxlength: 32,
    },
    os: {
        type: String,
        maxlength: 25
    },
    condition: String,

    imagePath:{
        type : String
        // data:Buffer,
        // contentType: String
    },

},
    { timestamp: true }
)

module.exports = mongoose.model("smartPhone", smartPhoneSchema);
