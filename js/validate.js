// COSC260
// ASSIGNMENT 2
// ANDREW BROWN


// loads the page before executing any of these functions
window.addEventListener("load", function (e) {
    document.getElementById("registration").addEventListener("submit", validate);
});

// clears the message box
function clearErrors() {
    document.getElementById("user_message").innerHTML = "";
    document.getElementById("user_message").classList.remove("error")
}

// adds an error to the message box
function addError(message) {
    var p = document.createElement("p");
    p.setAttribute('class', 'error');
    var text = document.createTextNode(message);
    p.appendChild(text);
    var um = document.getElementById('user_message');
    um.appendChild(p);
    um.classList.remove('invisible');
}

// validates the users registration input
function validate(e) {
    e.preventDefault();
    clearErrors();

    var success = true;
    var form = document.getElementById("registration");

    // validate name
    var name = form.elements["name"].value;
    if (name.length < 2 || name.length > 100) {
        addError("You must enter a name longer than 2 characters and no more than 100 characters."); 
        success = false;
    } else if (!/^[a-zA-Z'-]+$/.test(name)) { 
        addError("Your name contains invalid characters.")
        success = false;
    }

    // validate age
    var age = form.elements["age"].value;
    if (age.length ===0) {
        addError("You must enter an age.")
    } else if (age < 13 || age > 130) {
        addError("You must enter an age between 13 and 130.") 
    }
    
    // validate email
    var email = form.elements["email"].value;
    if (!/^[a-zA-Z-]([\w-.]+)?@([\w-]+\.)+[\w]+$/.test(email)) {
        addError("You must enter a valid email address.");
        success = false;
    }

    // validate phone
    var phone = form.elements["phone"].value;
    if (phone.length !== 0) {
        if (phone.length !== 10) {
            addError("Your phone number must be 10 digits long.");
            success = false;
        } else if (!/^[0-9]+$/.test(phone)) {
            addError("Your phone number must only contain the digits 0-9.");
            success = false;
        } else if (!/^04/.test(phone)) {
            addError("Your phone number must begin with 04.");
            success = false;
        }
    }
    
    if (success) {
        
        var postData = {name: form.elements["name"].value,
                        age: form.elements["age"].value, 
                        email: form.elements["email"].value, 
                        phone: form.elements["phone"].value}
        
        var user_id = document.getElementById('user_id');
        
        // AJAX request
        $.ajax({
            method: "POST",
            dataType: "json",
            url: "http://turing.une.edu.au/~jbisho23/assignment2/register.php",
            data: postData,
            success: function(data) {
                var userId = (data.user_id);
                user_id.innerHTML = ("<p>User ID: " + userId + "</p>");
                
                refreshScore();  // initiate the score board
                getQuestionId(); // gets the first question
                
                var quiz = document.getElementById('quiz');
                quiz.classList.remove('hidden');
                form.classList.add('hidden');
                document.getElementById('welcome').classList.add('hidden');
                document.getElementById('score').classList.remove('hidden');
            },
            error: function(data) {
                addError("Error, please try again.");
                console.log(data.error); // for debugging
            }
        });
          
    } 
}

