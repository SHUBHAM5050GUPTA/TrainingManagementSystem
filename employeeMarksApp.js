const express = require('express');
const app = express();

const EmployeeMarks = require('./model/modelMarks.js');
const Employee = require('./model/model.js');
const bodyParser = require('body-parser');

const dbConfig = require('./config/config.js');

const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, { useNewUrlParser: true }).then(() => {

    console.log("Connected successfully to mongoDb");

}).catch(err => {

    console.log("Failed to connect with mongoDb ");
    process.exit();
});

const port = process.env.PORT || 7000;
app.listen(port, () => console.log(`Listning to port ${port}`));

app.post('/trainer/postEmployeeMarks', (req, res) => {

    if (!req.body.empId) {
        return res.status(400).send({ message: "Id cant be null" });
    }

    const employeeMarks = new EmployeeMarks({

        empId: req.body.empId,
        empName: req.body.empName,
        empBatch: req.body.empBatch,
        subjectList: req.body.subjectList

    });

    employeeMarks.save().then(data => {
        res.send(data);
    }).catch(err => {

        console.log("error in post method");
        res.status(500).send({ message: err.message });

    });


});

router.post('/trainer/postEmployeesMarks', (req, res) => {

    if (!req.body) {
        return res.status(400).send({ message: "body cant be null" });
    }

    var marksArr=req.body;

   
        
        EmployeeMarks.find().then(marksList =>{
            console.log(marksList.length);

            for(var i=0;i<marksArr.length;i++)
            {
                for(var j=0;j<marksList.length;j++)
                {
                    if(marksArr[i].empId==marksList[j].empId)
                    {
                        
                        marksArr.splice(i,1);
                        i--;
                        console.log("after splice");
                        console.log(marksArr);
                        break;
                    }
                }
            }



            EmployeeMarks.insertMany(marksArr).then(data => {

                res.send(data);
        
            }).catch(err => {
        
                res.status(500).send(err.message);
            });
            
            
        }).catch(err => {
    
            console.log(err.message);
        });
        
    


    // console.log(req.body);
    console.log("marksArr");
    console.log(marksArr);




});

app.get('/trainer/getEmployeesMarks', (req, res) => {

    EmployeeMarks.find().then(employeesMarks => {

        res.send(employeesMarks);
    }).catch(err => {

        res.status(500).send({ message: err.message });
    });
});

app.get("/trainer/getEmployeesBatchWise", (req, res) => {

    var batch = req.query.batch;
    
    console.log(batch);

    Employee.find({
        empBatch: batch
    }).then(data => {

        res.send(data);

    }).catch(err => {

        res.status(500).send(err.message);

    });


});

app.put('/trainer/putEmployeeMarks/:id', (req, res) => {

    var empId = req.params.id;

    EmployeeMarks.updateMany({ empId: empId }, {
        $push: {
            subjectList: {
                subjectName: req.body.subjectName,
                subjectMarks: req.body.subjectMarks
            }
        }
    }).then(data => {
        res.send(data);
    }).catch(err => {

        res.status(500).send({ message: err.message });
    });
});

app.put('/trainer/putEmployeesMarks', (req, res) => {

   // console.log(req.body.length);
   console.log(req.body);
    var resList=[];
    for (var i = 0; i < req.body.length; i++) {


        var empId = req.body[i].empId;
        
        console.log(req.body[i].subjectList.subjectName);
        console.log(req.body[i].subjectList.subjectMarks);

        EmployeeMarks.updateMany({ empId: empId }, {


            $push: {
                subjectList: {
                    subjectName: req.body[i].subjectList.subjectName,
                    subjectMarks: req.body[i].subjectList.subjectMarks
                }
            }
        }).then(data => {

            resList.push(data);
            res.send(data);
            
            //console.log(resList[i]);
            
        }).catch(err => {

           resList.push(err);
        });



    }

   // res.send(resList);


});

app.put('/trainer/updateEmployeesMarks/:id', (req, res) => {

    var empId = req.params.id;

    if (!empId) {
        res.status(404).send("Employee not found with Employee Id:" + empName);
    }

    EmployeeMarks.updateMany({ 'empId': empId, 'subjectList.subjectName': req.body.subjectName }, {
        $set: {
            'subjectList.$.subjectMarks': req.body.subjectMarks
        }
    }).then(data => {
        res.send(data);

    }).catch(err => {

        res.status(500).send({ message: err.message });
    });
});

app.get("/trainer/compareBatchwiseEmployee", (req, res) => {

    var batch1 = req.query.batch1;
    var batch2 = req.query.batch2;
    console.log(batch1 + "  " + batch2);

    EmployeeMarks.find({
        $or: [{ empName: batch1 }, { empName: batch2 }]
    }).then(data => {

        res.send(data);

    }).catch(err => {

        res.status(500).send(err.message);

    });


});


app.get('/trainer/getByEmployeeId/:id',(req,res) =>{

    EmployeeMarks.findOne({empId:req.params.id}).then(employee =>{

        if(!employee)
        {
            return res.status(404).send("Employee Id not found");
        }
        
        console.log(employee);
        let employee_arr=[];
        employee_arr.push(employee);

        console.log(employee_arr);
        res.send(employee_arr);

    }).catch(err => {

        res.status(500).send(err.message);
    });

});
