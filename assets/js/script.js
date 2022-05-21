// var detailsSection = document.querySelector("#details");
var quizSection = document.querySelector("#quiz");
var timerSection = document.querySelector("#timer");
var highscoresLink = document.querySelector("#highscores");

// Main sections
var quizHeader = document.createElement("h1");
var main = document.createElement("section");
var result = document.createElement("p");

result.setAttribute("class", "result");

// Main: Home
var descriptionSection = document.createElement("section");
descriptionSection.setAttribute("style", "text-align:center");
descriptionSection.innerHTML = `
    <p>
        Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score/time by ten seconds!
    </p>
    <button id="startQuiz">Start!</button>
`;

// Main: Quiz
var choices = document.createElement("ol");
var choice1 = document.createElement("li");
var choice2 = document.createElement("li");
var choice3 = document.createElement("li");
var choice4 = document.createElement("li");

// Main: Results
var initialsSection = document.createElement("section");
initialsSection.innerHTML = `
    <form>
        Enter initials: 
        <input id="initials" />
        <button id="submit">Submit</button>
    </form>
`;

// Main: High scores
var scoresSection = document.createElement("section");

var time = 0;
var score = 0;
var index = 0;
var isTakingQuiz = false;

// Set home page up
quizHeader.textContent = "Coding Quiz Challenge";
quizSection.appendChild(quizHeader);
quizSection.appendChild(descriptionSection);
var startButton = document.querySelector("#startQuiz");

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
    time = 75;
    score = 0;
    index = 0;
    isTakingQuiz = true;
    quizSection.removeChild(descriptionSection);
    quizSection.appendChild(choices);
    quizSection.appendChild(result);
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
    // quizSection.appendChild(quizHeader);
    // quizSection.appendChild(choices);
}

highscoresLink.addEventListener("click", function(event) {
    quizSection.removeChild(descriptionSection);
    displayHighScores();
});

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
        promptInitials();

        // localStorage.getItem("highscores");
        // displayHighScores();
    }
    // quizSection.appendChild(result);
});

function makeButton(displayText, isCorrect) {
    if (isCorrect) {
        return '<button class="correct">' + displayText + '</button>';
    } else {
        return '<button class="incorrect">' + displayText + '</button>';
    }
}

function promptInitials() {
    // choices.setAttribute("style", "display:none");
    quizHeader.textContent = "Your final score is " + score;
    quizSection.removeChild(choices);
    quizSection.insertBefore(initialsSection, result);
    var submitButton = document.querySelector("#submit");
    submitButton.addEventListener("click", saveScore);
}

function saveScore(event) {
    event.preventDefault();

    var initials = document.querySelector("#initials").value;
    var highscores = localStorage.getItem("highscores");
    if (highscores == null) {
        highscores = {initials: [], scores: []}
    } else {
        highscores = JSON.parse(highscores);
    }
    console.log("Retrieving: " + highscores)
    console.log(highscores.scores.length)

    for (i = highscores.scores.length; i >= 0 ; --i) {
        if (i === 0 || score <= highscores.scores[i-1]) {
            highscores.scores.splice(i, 0, score);
            highscores.initials.splice(i, 0, initials);
            break;
        }
    }
    localStorage.setItem("highscores", JSON.stringify(highscores));
    console.log("Saving: " + highscores);
    quizSection.removeChild(initialsSection);
    quizSection.removeChild(result);
    displayHighScores();
}

function displayHighScores() {
    var list = "<ol>\n";
    var highscores = JSON.parse(localStorage.getItem("highscores"));
    for (i = 0; i < highscores.scores.length; ++i) {
        list += "<li>" + highscores.initials[i] + ": " + highscores.scores[i] + "</li>\n";
        if (i >= 9) {
            break;
        }
    }
    scoresSection.innerHTML += list;
    quizHeader.textContent = "High scores"
    quizSection.appendChild(scoresSection);
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