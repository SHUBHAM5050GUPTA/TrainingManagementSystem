<script>
CKEDITOR.replace('editor1');
// $("#add_button").click(function(){

//     $(".panel-body").load("admin.html");
// });


</script>

<!-- Bootstrap core JavaScript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->

<!-- <script src="js/index.js"></script> -->
<script type="text/javascript">

$(document).ready(function () {
    $('#reg_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {


            employee_id: {
                validators: {
                    notEmpty: {
                        message: 'Please supply users employee role'
                    }
                }
            },

            employee_role: {
                validators: {
                    stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Please supply users employee role'
                    }
                }
            },

            first_name: {
                validators: {
                    stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Please supply users first name'
                    }
                }
            },
            last_name: {
                validators: {
                    stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Please supply users last name'
                    }
                }
            },

            employee_batch: {
                validators: {
                    stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Please supply users batch name'
                    }
                }
            },

            phone: {
                validators: {
                    notEmpty: {
                        message: 'Please supply your phone number'
                    },
                    phone: {
                        country: 'US',
                        message: 'Please supply a vaild phone number with area code'
                    }

                }
            },
            address: {
                validators: {
                    stringLength: {
                        min: 8,
                    },
                    notEmpty: {
                        message: 'Please supply your street address'
                    }
                }
            },

            status: {
                validators: {
                    notEmpty: {
                        message: 'Please supply employee status'
                    }
                }
            },

            email: {
                validators: {
                    notEmpty: {
                        message: 'Please supply your email address'
                    },
                    emailAddress: {
                        message: 'Please supply a valid email address'
                    }
                }
            },

            password: {
                validators: {
                    identical: {
                        field: 'confirmPassword',
                        message: 'Confirm your password below - type same password please'
                    }
                }
            },
            confirmPassword: {
                validators: {
                    identical: {
                        field: 'password',
                        message: 'The password and its confirm are not the same'
                    }
                }
            },


        }
    });


    //   .on('success.form.bv', function (e) {
    //       $('#success_message').slideDown({ opacity: "show" }, "slow") // Do something ...
    //      // $('#reg_form').data('bootstrapValidator').resetForm();

    //       // Prevent form submission
    //       e.preventDefault();

    //       // Get the form instance
    //       var $form = $(e.target);

    //       // Get the BootstrapValidator instance
    //       var bv = $form.data('bootstrapValidator');

    //       // Use Ajax to submit form data
    //     //   $.post($form.attr('action'), $form.serialize(), function (result) {
    //     //       console.log(result);
    //     //   }, 'json');
    //   });
});



</script>

<script>

$(document).ready(function () {





    $("#post_button").click(function () {

        console.log("In post method");
        $("#getPara").append("In post method");
        var empno = $("#empno").val();
        var empRole = $("#role").val();
        var empFirstName = $("#first_name").val();
        var empLastName = $("#last_name").val();
        var empBatch = $("#batch").val();
        var empEmail = $("#emailId").val();
        var password = $("#userPw").val();
        var empConfirmPassword = $("#userPw2").val();
        var empAddress = $("#address").val();
        var empNumber = $("#mobile").val();
        var empStatus = $("#status").val();


        console.log(empno + " " + empFirstName + " " + empEmail + empNumber);

        
        if (empno === '' || empRole===''|| empFirstName === '' || empLastName === '' || empBatch === '' || empEmail==='' ||
        password === '' || empConfirmPassword === '' || empAddress === '' || empNumber === '' || empStatus === '') {
                console.log(empno+empFirstName+empLastName+empBatch+empEmail+password+empConfirmPassword+empAddress+empNumber+empStatus);
                console.log("Empty fields");
        } else {


            $.ajax("http://localhost:3000/users/admin/addEmployee", {


                type: "POST",
                data: {

                    "empno": empno,
                    "empRole": empRole,
                    "empFirstName": empFirstName,
                    "empLastName": empLastName,
                    "empBatch": empBatch,
                    "empEmailId": empEmail,
                    "password": password,
                    "empConfirmPassword": empConfirmPassword,
                    "empAddress": empAddress,
                    "empMobile": empNumber,
                    "empStatus": empStatus
                },
                success: function (data, status, xhr) {   // success callback function

                    $("#getPara").append("In success");


                },
                error: function (jqXhr, textStatus, errorMessage) { // error callback 
                    $("#getPara").append('Error: ' + errorMessage);
                }
            });


        }




    });


});

</script>

<!-- <script>
// Disable form submissions if there are invalid fields
(function() {
  'use strict';
  window.addEventListener('load', function() {
    // Get the forms we want to add validation styles to
    var forms = document.getElementById('reg_form');
    console.log(forms);
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {


        console.log("In validation");

      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {

            console.log("In invalid");
          event.preventDefault();
          event.stopPropagation();
        }

        console.log("In valid");
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();
</script>  -->
<script>
$(document).ready(function () {

    var getCount = 0;
    $.ajax("http://localhost:3000/users/admin/getEmployees", {

        dataType: "json", // type of response data
        type: "GET",
        success: function (data, status, xhr) {

            getCount = data.length;
            console.log(getCount);
            $("#get_count").html(getCount);

        },
        error: function (jqXhr, textStatus, errorMessage) { // error callback

            console.log('Error: ' + errorMessage);
        }
    });



});
</script>

