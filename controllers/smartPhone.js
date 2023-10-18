const SmartPhone = require("../models/smartPhone")
const bodyParser = require('body-parser')
const { validationResult, body } = require('express-validator');
const smartPhone = require("../routes/user");
const multer = require("multer")
const fs = require('fs');

const fn = require('../functions')


exports.smartPhone = async (req, res) => {
    const data = await SmartPhone.find();
    res.status(200).json(data);
}

exports.addSmartPhone = async (req, res) => {

    upload(req, res, (err) => {
        if (err) {
            res.status(400).json({
                error: err
            })
        } else {
            const newImage = new SmartPhone({
                model: req.body.model,
                os: req.body.os,
                condition: req.body.condition,
                imagePath: req.file.path
            })
            newImage.save()
                .then(() => res.send("Data of Smart Phone Uploded"))
                .catch((err) => console.log(err))
        }
    })
}

exports.deleteSmartPhone = async (req, res) => {
    const dataID = req.params.id;
    try {
        const deleteImageInfo = await SmartPhone.findOneAndDelete({ _id: dataID })
        const { imagePath } = deleteImageInfo;
        console.log(imagePath)
        if (imagePath) {
            const path = imagePath;
            fs.unlinkSync(path);
            return res.send("imge Deleted Succesfully")
        } else {
            return res.send("imge is Missing")
        }

    } catch (error) {
        return res.send(error)
    }
}

exports.updateSmartPhone = async (req, res) => {
    const dataID = req.params.id;
    const data = await SmartPhone.findOne({ _id: dataID })
    if (data == '' || data == null) {
        return res.status(400).json({
            "Error Message": "Invilied URL "
        })
    }

    const result = await SmartPhone.findByIdAndUpdate(dataID, req.body)
    return res.status(200).json({
        "Message": "Data Updated Succesfully",
    })

}

/////////////Extra Function About This Controller//////////

const Storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: Storage
}).single('image')
