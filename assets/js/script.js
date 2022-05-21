var startButton = document.querySelector("#startQuiz");
var detailsSection = document.querySelector("#details");
var quizSection = document.querySelector("#quiz");
var timerSection = document.querySelector("#timer");
// var formSection = document.querySelector("#form");

var quizHeader = document.createElement("h1");

var choices = document.createElement("ol");
var choice1 = document.createElement("li");
var choice2 = document.createElement("li");
var choice3 = document.createElement("li");
var choice4 = document.createElement("li");

var result = document.createElement("p");
result.setAttribute("class", "result");

// var initialsSection = document.createElement("p");
// initialsSection.textContent = "Enter initials";

// var initialsField = document.createElement("form");
// initialsField.setAttribute("class", "initials");

// var initialsInput = document.createElement("input");
// initialsInput.setAttribute("id", "initials");

// var initialsButton = document.createElement("button");
// initialsButton.setAttribute("id", "submit");
// initialsButton.textContent = "Submit";

// initialsField.appendChild(initialsInput);
// initialsField.appendChild(initialsButton);

// initialsSection.appendChild(initialsField);

var initialsSection = document.createElement("section");
initialsSection.innerHTML = `
    <form>
        Enter initials: 
        <input id="initials" />
        <button id="submit">Submit</button>
    </form>
`;


var time = 0;
var score = 0;
var index = 0;
var isTakingQuiz = false;

// choice1 is correct in each question
var questions = shuffleArray([
    {
        "questionText": "Commonly used data types do NOT include:",
        "choice1": "Alerts",
        "choice2": "Booleans",
        "choice3": "Strings",
        "choice4": "Numbers"
    },
    {
        "questionText": "The condition in an if/else statement is enclused within:",
        "choice1": "Parentheses",
        "choice2": "Quotes",
        "choice3": "Curly braces",
        "choice4": "Square brackets"
    },
    {
        "questionText": "Arrays in JavaScript can be used to store which data types?",
        "choice1": "All data types",
        "choice2": "Other arrays",
        "choice3": "Booleans",
        "choice4": "Numbers and strings"
    },
    {
        "questionText": "String values must be enclosed within:",
        "choice1": "Quotes",
        "choice2": "Commas",
        "choice3": "Curly braces",
        "choice4": "Parentheses"
    },
    {
        "questionText": "How do you print content to the console in Javascript?",
        "choice1": "console.log",
        "choice2": "console.print",
        "choice3": "console.write",
        "choice4": "console.toString"
    },
    {
        "questionText": "A way to select an element with Javascript is:",
        "choice1": "document.querySelector",
        "choice2": "document.selectElement",
        "choice3": "element.get",
        "choice4": "element.select"
    },
    {
        "questionText": "How do you save an item to local storage with Javascript?",
        "choice1": "localStorage.setItem",
        "choice2": "localStorage.saveItem",
        "choice3": "document.getLocalStorage.setItem",
        "choice4": "document.getLocalStorage.saveItem"
    }
]);

startButton.addEventListener("click", function() {
    detailsSection.setAttribute("style", "display:none");
    time = 75;
    score = 0;
    index = 0;
    isTakingQuiz = true;
    quiz();
    timerSection.textContent = "Time: " + time;
    var timeInterval = setInterval(function () {
        if (isTakingQuiz && time > 0) {
            time--;
            timerSection.textContent = "Time: " + time;
        }
    }, 1000);
});

function quiz() {
    generateQuestion();
}

function generateQuestion() {
    currentQuestion = questions[index];
    quizHeader.textContent = currentQuestion.questionText;
    var answers = shuffleArray([currentQuestion.choice1, currentQuestion.choice2, currentQuestion.choice3, currentQuestion.choice4])

    choice1.innerHTML = makeButton(answers[0], answers[0] === currentQuestion.choice1);
    choice2.innerHTML = makeButton(answers[1], answers[1] === currentQuestion.choice1);
    choice3.innerHTML = makeButton(answers[2], answers[2] === currentQuestion.choice1);
    choice4.innerHTML = makeButton(answers[3], answers[3] === currentQuestion.choice1);
    choices.appendChild(choice1);
    choices.appendChild(choice2);
    choices.appendChild(choice3);
    choices.appendChild(choice4);
    choices.setAttribute("style", "display:block");
    quizSection.appendChild(quizHeader);
    quizSection.appendChild(choices);
}

quizSection.addEventListener("click", function(event) {
    var element = event.target;
    if (element.getAttribute("class") === "correct") {
        result.innerHTML = "<hr>Correct!";
        ++score;
    } else if (element.getAttribute("class") === "incorrect") {
        result.innerHTML = "<hr>Incorrect.";
        --score;
        time -= 10;
    } else {
        return;
    }

    // Generate new question
    if (index < questions.length - 1) {
        index++;
        generateQuestion();
    } else {
        isTakingQuiz = false;
        var initials = promptInitials();
        localStorage.getItem("highscores");

        displayHighScores();
    }
    quizSection.appendChild(result);
});

function makeButton(displayText, isCorrect) {
    if (isCorrect) {
        return '<button class="correct">' + displayText + '</button>';
    } else {
        return '<button class="incorrect">' + displayText + '</button>';
    }
}

function promptInitials() {

    quizSection.insertBefore(initialsSection, result);
    // formSection.setAttribute("style", "display:block");
    //quizHeader.textContent = "All done!";
    //choices.textContent = "Your final score is " + score;
    choices.setAttribute("style", "display:none");
    quizHeader.textContent = "Your final score is " + score;
}

function displayHighScores() {

}

function shuffleArray(array) {
    for (var i = 0; i < array.length; ++i) {
        var randIndex = Math.floor(Math.random() * array.length)
        var temp = array[i];
        array[i] = array[randIndex];
        array[randIndex] = temp;
    }
    return array;
}