var startButton = document.querySelector("#startQuiz");
var detailsSection = document.querySelector("#details");
var quizSection = document.querySelector("#quiz");
var timerSection = document.querySelector("#timer");
var question = document.createElement("h1");
var choices = document.createElement("ol");
var choice1 = document.createElement("li");
var choice2 = document.createElement("li");
var choice3 = document.createElement("li");
var choice4 = document.createElement("li");
var result = document.createElement("p");
result.setAttribute("class", "result");
var time = 60;
var score = 0;
var index = 0;

// The first entry in each answer list is correct
var questions = [
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
        "choice3": "Curly Braces",
        "choice4": "Square brackets"
    }
];

startButton.addEventListener("click", function() {
    detailsSection.setAttribute("style", "display:none");
    time = 60;
    score = 0;
    index = 0;
    quiz();
    timerSection.textContent = "Time: " + time;
    var timeInterval = setInterval(function () {
        if (time > 0) {
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
    question.textContent = currentQuestion.questionText;
    var answers = [currentQuestion.choice1, currentQuestion.choice2, currentQuestion.choice3, currentQuestion.choice4].sort((a,b) => 0.5 - Math.random());

    choice1.innerHTML = makeButton(answers[0], answers[0] === currentQuestion.choice1);
    choice2.innerHTML = makeButton(answers[1], answers[1] === currentQuestion.choice1);
    choice3.innerHTML = makeButton(answers[2], answers[2] === currentQuestion.choice1);
    choice4.innerHTML = makeButton(answers[3], answers[3] === currentQuestion.choice1);
    choices.appendChild(choice1);
    choices.appendChild(choice2);
    choices.appendChild(choice3);
    choices.appendChild(choice4);
    quizSection.appendChild(question);
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
    }

    // Generate new question
    if (index < questions.length) {
        index++;
        generateQuestion();
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