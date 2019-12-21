const mongoose=require('mongoose');

const marksSchema=mongoose.Schema({

    empno:Number,
    empName:String,
    empBatch:String,
    subjectList:[{

        subjectName:String,
        subjectMarks:Number,

    }]


});

module.exports=mongoose.model('EmployeeMarks',marksSchema);