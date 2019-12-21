const mongoose=require('mongoose');

const employeeSchema=mongoose.Schema({

    empno:Number,
    empRole:String,
    empFirstName:String,
    empLastName:String,
    empBatch:String,
    empEmailId:String,
    password:String,
    empConfirmPassword:String,
    empAddress:String,
    empMobile:Number,
    empStatus:String

});

module.exports=mongoose.model('Employee',employeeSchema);