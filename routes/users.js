const express = require('express');
const router = express.Router();
var path = require('path');
const bcrypt = require('bcryptjs');



const passport = require('passport');

// User

const Employee  = require('../models/User');
const EmployeeMarks = require('../models/modelMarks');


const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Login page
router.get('/login', (req, res) => 


res.render('login'));

router.get('/ann1', (req, res) => 
res.sendFile( path.join(__dirname, "../views/ann1.html" ))
);


router.get('/addmarks', (req, res) => 
res.sendFile( path.join(__dirname, "../views/addmarks.html" ))
);

router.get('/updatesubject', (req, res) => 
res.sendFile( path.join(__dirname, "../views/updatesubject.html" ))
);

router.get('/updatemarks', (req, res) => 
res.sendFile( path.join(__dirname, "../views/updatemarks.html" ))
);

router.get('/getmarks', (req, res) => 
res.sendFile( path.join(__dirname, "../views/getmarks.html" ))
);




router.get('/ann2', (req, res) => 
res.sendFile( path.join(__dirname, "../views/ann2.html" ))
);
router.get('/addUser1', (req, res) => 
res.sendFile( path.join(__dirname, "../views/addUser1.html" )));

router.get('/getUser', (req, res) => 
res.sendFile( path.join(__dirname, "../views/getUser.html" )));

router.get('/updateUser', (req, res) => 
res.sendFile( path.join(__dirname, "../views/updateUser.html" )));

router.get('/deleteUser', (req, res) => 
res.sendFile( path.join(__dirname, "../views/deleteUser.html" )));


router.get('/blockUser', (req, res) => 
res.sendFile( path.join(__dirname, "../views/blockUser.html" )));

// Register Page
router.get('/register', (req, res) => res.render('register'));


// admin page
router.get('/addUser1', ensureAuthenticated, (req, res) =>
  res.render('addUser1', {
    user: req.user
  })
);

// admin page
router.get('/addUser1', ensureAuthenticated, (req, res) =>
  res.render('addUser1', {
    user: req.user
  })
);


// manager page
router.get('/manager', ensureAuthenticated, (req, res) =>
  res.render('manager', {
    user: req.user
  })
);

// coordinator page
router.get('/coordinator', ensureAuthenticated, (req, res) =>
  res.render('coordinator', {
    user: req.user
  })
);

// trainee page
router.get('/trainee', ensureAuthenticated, (req, res) =>
  res.render('trainee', {
    user: req.user
  })
);




// Register-delete this 
router.post('/register', (req, res) => {
    const { empFirstName, empno, empRole, password, empConfirmPassword } = req.body;
    let errors = [];
  
    if (!empFirstName || !empno || !empRole || !password || !empConfirmPassword) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (password!= empConfirmPassword) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (errors.length > 0) {
      res.render('register', {
        errors,
        empFirstName, 
        empno, 
        empRole, 
        password, 
        empConfirmPassword 
      });
    } else {
      Employee.findOne({ empno: empno }).then(employee => {
        if (employee) {
          errors.push({ msg: 'user already exists' });
          res.render('register', {
            errors,
            empFirstName, 
            empno, 
            empRole, 
            password, 
            empConfirmPassword 
          });
        } // bycript
        else {
          const newEmployee = new Employee({
            empFirstName,
            empno,
            empRole,
            password
          });
          //hash mapping
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newEmployee.password, salt, (err, hash) => {
              if (err) throw err;
              newEmployee.password = hash;
              newEmployee
                .save()
                .then(employee => {
                  //flash stores in a session and redirects when it is redirected 
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
  });
  
  

//calling passport for authenetication- login 
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, employee, info) {
    if (err) { return next(err); 
     }
    if (!employee) {
   
      req.flash(
        'error_msg',
        'Wrong Credentials'
      );
  
      return res.redirect('/users/login');    }
    req.logIn(employee, function(err) {
      if (err) { 
        
        return next(err); }


     

      if(req.user.empRole === "admin"){
      
        res.sendFile( path.join(__dirname, "../views/addUser1.html" ));
          //   res.redirect('/users/addUser1');
            }
      if(req.user.empRole === "manager"){

        res.sendFile( path.join(__dirname, "../views/ann1.html" ))

        //      res.redirect('/users/manager');
    }

      if(req.user.empRole === "coordinator"){
        res.sendFile( path.join(__dirname, "../views/addmarks.html" ));
  
 //       res.redirect('/users/coordinator');
    }
 
      if(req.user.empRole === "trainee"){
      res.redirect('/users/trainee');
    }
    if(req.user.empRole === "trainer"){
      res.redirect('/users/trainer');
    }
    });
  })(req, res, next);
});







// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});


module.exports = router;



//...........................................Admin API..........................................................................
router.post('/admin/addEmployee', (req, res) => {

  if (!req.body.empno) {
      return res.status(400).send({ message: "Id cant be null" });
  }

  var employee1 = new Employee({

    empno: req.body.empno,
      empRole: req.body.empRole,
      empFirstName: req.body.empFirstName,
      empLastName: req.body.empLastName,
      empBatch: req.body.empBatch,
      empEmailId: req.body.empEmailId,
      password: req.body.password,
      empConfirmPassword: req.body.empConfirmPassword,
      empAddress: req.body.empAddress,
      empMobile: req.body.empMobile,
      empStatus: req.body.empStatus

  });



  

  Employee.findOne({empno:employee1.empno}).then(employee =>{

    if(employee)
    {
        return res.status(500).send("Employee Id already exists!");
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(employee1.password, salt, (err, hash) => {
        if (err) throw err;
        employee1.password = hash;
        employee1.save().then(data => {
        res.send(data);
    }).catch(err => {
  
        console.log("error in post method");
        res.status(500).send({ message: err.message });
  
    });});});

}).catch(err => {

    res.status(500).send(err.message);
});





});

router.get('/admin/getEmployees', (req, res) => {

  Employee.find().then(employees => {

      res.send(employees);
  }).catch(err => {

      res.status(500).send({ message: err.message });
  });
});

router.put('/admin/updateEmployee/:id', (req, res) => {

  const empno = req.params.id;

  Employee.findOne({empno:req.params.id}).then(employee =>{

      if(!employee)
      {
          return res.status(404).send("Employee Id not found");
      }

      Employee.update({ empno: empno }, req.body).then(data => {

          console.log("updated successfully");
          res.send(data);
  
      }).catch(err => {
          console.log("Error in put method");
          res.status(500).send({ message: err.message });
      });

  }).catch(err => {

      res.status(500).send(err.message);
  });


  

});

router.delete('/admin/deleteEmployee/:id', (req, res) => {

  const empno = req.params.id;

  Employee.find({empno:empno},(err,result) =>{

      if(result.length==0)
      {
          console.log("user doesnt exist");
          return res.status(404).send("Employee Id doestnt exists"); 
          
      }else{

          Employee.deleteOne({ empno: empno }).then(data => {

              res.send("Employee deleted with the Employee Id:"+empno);
              
      
          }).catch(err => {
              console.log("Error in delete method");
              res.status(500).send({ message: err.message });
          });



      }
  }).catch(err => {
      console.log("Error in delete method");
      res.status(500).send({ message: err.message });
  });
      

  

});

router.get('/admin/getByEmployeeId/:id',(req,res) =>{

  Employee.findOne({empno:req.params.id}).then(employee =>{

      if(!employee)
      {
          return res.status(404).send("Employee Id not found");
      }
      
      // json object cant be returned u need to convert the object into array of
      // object and then return it

      console.log(employee);
      let employee_arr=[];
      employee_arr.push(employee);

      console.log(employee_arr);
      res.send(employee_arr);

  }).catch(err => {

      res.status(500).send(err.message);
  });


});





// .......................................coordinator..............................................................................



router.post('/trainer/postEmployeeMarks', (req, res) => {

  if (!req.body.empno) {
      return res.status(400).send({ message: "Id cant be null" });
  }

  const employeeMarks = new EmployeeMarks({

      empno: req.body.empno,
      empName: req.body.empName,
      subjectList:req.body.subjectList

  });

  employeeMarks.save().then(data => {
      res.send(data);
  }).catch(err => {

      console.log("error in post method");
      res.status(500).send({ message: err.message });

  });


});
//multiple post
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
                  if(marksArr[i].empno==marksList[j].empno)
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
  console.log("marksArr");
  console.log(marksArr);

});

router.get('/trainer/getEmployeesMarks', (req, res) => {

  EmployeeMarks.find().then(employeesMarks => {

      res.send(employeesMarks);
  }).catch(err => {

      res.status(500).send({ message: err.message });
  });
});

//get batchwise details for adding subject
router.get("/trainer/getEmployeesBatchWise", (req, res) => {

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


//add new subject
router.put('/trainer/putEmployeesMarks', (req, res) => {

  console.log(req.body);
   var resList=[];
   for (var i = 0; i < req.body.length; i++) {

    var empno = req.body[i].empno;
       
       console.log(req.body[i].subjectList.subjectName);
       console.log(req.body[i].subjectList.subjectMarks);

       EmployeeMarks.updateMany({ empno: empno }, {

          $push: {
               subjectList: {
                   subjectName: req.body[i].subjectList.subjectName,
                   subjectMarks: req.body[i].subjectList.subjectMarks
               }
           }
       }).then(data => {
          resList.push(data);
           res.send(data);
           
       }).catch(err => {

          resList.push(err);
       });
      }
});

//update employeeMarks

router.put('/trainer/updateEmployeesMarks/:id', (req, res) => {

  var empno = req.params.id;

  if (!empno) {
      res.status(404).send("Employee not found with Employee Id:" + empName);
  }

  EmployeeMarks.updateMany({ 'empno': empno, 'subjectList.subjectName': req.body.subjectName }, {
      $set: {
          'subjectList.$.subjectMarks': req.body.subjectMarks
      }
  }).then(data => {
      res.send(data);

  }).catch(err => {

      res.status(500).send({ message: err.message });
  });
});

router.get("/trainer/compareBatchwiseEmployee",(req,res) => {

  var batch1=req.query.batch1;
  var batch2=req.query.batch2;
  console.log(batch1+"  "+batch2);

  EmployeeMarks.find({
      $or:[{empName:batch1},{empName:batch2}]
  }).then(data =>{

      res.send(data);

  }).catch(err =>{

      res.status(500).send(err.message);

  });


});

//get employeemarks by batch
router.get('/trainer/getByEmployeeBatch/:batch',(req,res) =>{

  EmployeeMarks.find({empBatch:req.params.batch}).then(employee =>{

      if(!employee)
      {
          return res.status(404).send("Employee Id not found");
      }
      
      let employee_arr=[];
      employee_arr.push(employee);

      console.log(employee_arr);
      res.send(employee_arr);

  }).catch(err => {

      res.status(500).send(err.message);
  });

});

//get by id
router.get('/trainer/getByEmployeeId/:id',(req,res) =>{

  EmployeeMarks.findOne({empno:req.params.id}).then(employee =>{

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




//........................................................Manager API...........................................................

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
                  if(marksArr[i].empno==marksList[j].empno)
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




router.get('/trainer/getByEmployeeId/:id',(req,res) =>{

  EmployeeMarks.findOne({empno:req.params.id}).then(employee =>{

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



router.get('/trainer/getEmployeesMarks', (req, res) => {

  EmployeeMarks.find().then(employeesMarks => {

      res.send(employeesMarks);
  }).catch(err => {

      res.status(500).send({ message: err.message });
  });
});

router.get("/trainer/getEmployeeMarksByBatch", (req, res) => {

  var batch = req.query.batch;
  
  console.log(batch);

  EmployeeMarks.find({
      empBatch: batch
  }).then(data => {

      res.send(data);

  }).catch(err => {

      res.status(500).send(err.message);

  });
});