// COSC260
// ASSIGNMENT 2
// ANDREW BROWN


// loads the page before executing any of these functions
window.addEventListener("load", function (e) {
    document.getElementById("quiz").addEventListener("submit", submitAnswer);
    document.getElementById("next").addEventListener("click", next);
});

// global variables
var questionId;
var questionCount = 0;
var correctAnswers = 0;

// adds answer result to message box
function questionResult(answer) {
    var p = document.createElement("p");
    if(answer) {
        p.setAttribute('class', 'correct');
        var text = document.createTextNode("Correct!");
    } else {
        p.setAttribute('class', 'error');
        var text = document.createTextNode("Incorrect!");
    }
    p.appendChild(text);
    document.getElementById("user_message").appendChild(p);
    
}

// updates the score on sidebar
function refreshScore() {
    document.getElementById('attempted').innerHTML = ('Attempted: ' + questionCount);
    document.getElementById('correct').innerHTML = ('Correct: ' + correctAnswers);
    document.getElementById('incorrect').innerHTML = ('Incorrect: ' + (questionCount - correctAnswers));
}

// resets the radio buttons
function clearAnswer() {
    
    document.getElementById("answer_a").checked = false;
    document.getElementById("answer_b").checked = false;
    document.getElementById("answer_c").checked = false;
    document.getElementById("answer_d").checked = false;
    
}

// gets question IDs through GET request
function getQuestionId() {
    
    var questions;
    $.get("http://turing.une.edu.au/~jbisho23/assignment2/quiz.php", function(data, textStatus) {
        if (textStatus=="success") {
            console.log("success");
            questions = data.questions;
            populateQuestions(questions);
        }
        else {
            addError("Error: Cannot get question.");
            console.log("error" + jsXHR.status);
        }
    });
}

// fills the page with question and answers
function populateQuestions(q) {
    
    questionId = q[0]; // first question in array
    
    var questionText;
    var choices;
    
    var question = document.getElementById('quiz_question');
    var ans_a = document.getElementById('ans_a');
    var ans_b = document.getElementById('ans_b');
    var ans_c = document.getElementById('ans_c');
    var ans_d = document.getElementById('ans_d');
    
    // get the question
    $.ajax({
    method: "POST",
    dataType: "json",
    url: "http://turing.une.edu.au/~jbisho23/assignment2/quiz.php",
    data: {q: questionId},
    success: function(data) {
        questionText = (data.text);
        choices = (data.choices);
        
        // add question + answers into DOM
        question.innerHTML = questionText;
        ans_a.innerHTML = choices.A;
        ans_b.innerHTML = choices.B;
        ans_c.innerHTML = choices.C;
        ans_d.innerHTML = choices.D;
            
    },
    error: function(data) {
        addError("Error, please try again.");
        console.log(data.error); // for debugging
    }
    });
}

// gets the users answer
function getAnswer() {
    
    var A = document.getElementById("answer_a");
    var B = document.getElementById("answer_b");
    var C = document.getElementById("answer_c");
    var D = document.getElementById("answer_d");
    
    if (A.checked){
        return "A";
    } else if (B.checked) {
        return "B";
    } else if (C.checked) {
        return "C";
    } else if (D.checked) {
        return "D"
    } else {
        return null;
    }
}

// checks users answer through POST request and updates score
function checkAnswer() {
    
    clearErrors();
    ans = getAnswer();
    
        $.ajax({
            method: "POST",
            dataType: "json",
            url: "http://turing.une.edu.au/~jbisho23/assignment2/quiz.php",
            data: {q: questionId, a: ans},
            success: function(data) {
                var isCorrect = data.correct;
                result = document.getElementById('user_message');
                questionResult(isCorrect);
                result.classList.remove('invisible');
                if(isCorrect) {
                    correctAnswers += 1;
                }
                questionCount += 1;
                refreshScore();
            },
            error: function(data) {
                addError("Error, please try again.");
                var result = document.getElementById('user_message');
                result.classList.remove('invisible');
                console.log(data.error);
            }
        });
    
}

// moves onto next question
function next(e) {
    e.preventDefault(); 
    clearErrors();
    clearAnswer();
    getQuestionId();
    document.getElementById("submit").classList.remove("hidden");
    document.getElementById("next").classList.add("hidden");
    $("input[type=radio]").attr('disabled', false);
    
}

// for making sure user selects an answer
function submitAnswer(e) {
    e.preventDefault();
    var isEmpty = getAnswer();
    if (isEmpty == null){ 
        clearErrors();
        addError("Please select an answer.");
    } else {
        checkAnswer(questionId);
        document.getElementById("submit").classList.add("hidden");
        document.getElementById("next").classList.remove("hidden");
        $("input[type=radio]").attr('disabled', true);
    }
}