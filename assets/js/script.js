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
        <input id="initials" maxlength="3"/>
        <button id="submit">Submit</button>
    </form>
`;

// Main: High scores
var scoresSection = document.createElement("section");
scoresSection.setAttribute("class", "scoreList");

var time = 0;
var score = 0;
var index = 0;
var isTakingQuiz = false;

// Set home page up
quizHeader.textContent = "Coding Quiz Challenge";
quizSection.appendChild(quizHeader);
quizSection.appendChild(descriptionSection);
var startButton = document.querySelector("#startQuiz");

var questions = shuffleArray([
    {
        questionText: "Commonly used data types do NOT include:",
        choice1: "Alerts",
        choice2: "Booleans",
        choice3: "Strings",
        choice4: "Numbers"
    },
    {
        questionText: "The condition in an if/else statement is enclused within:",
        choice1: "Parentheses",
        choice2: "Quotes",
        choice3: "Curly braces",
        choice4: "Square brackets"
    },
    {
        questionText: "Arrays in JavaScript can be used to store which data types?",
        choice1: "All data types",
        choice2: "Other arrays",
        choice3: "Booleans",
        choice4: "Numbers and strings"
    },
    {
        questionText: "String values must be enclosed within:",
        choice1: "Quotes",
        choice2: "Commas",
        choice3: "Curly braces",
        choice4: "Parentheses"
    },
    {
        questionText: "How do you print content to the console in Javascript?",
        choice1: "console.log",
        choice2: "console.print",
        choice3: "console.write",
        choice4: "console.toString"
    },
    {
        questionText: "A way to select an element with Javascript is:",
        choice1: "document.querySelector",
        choice2: "document.selectElement",
        choice3: "element.get",
        choice4: "element.select"
    },
    {
        questionText: "How do you save an item to local storage with Javascript?",
        choice1: "localStorage.setItem",
        choice2: "localStorage.saveItem",
        choice3: "document.getLocalStorage.setItem",
        choice4: "document.getLocalStorage.saveItem"
    }
]);

startButton.addEventListener("click", function() {
    quiz();
    timerSection.textContent = "Time: " + time;
    var timeInterval = setInterval(function () {
        if (isTakingQuiz && time > 0) {
            time--;
            timerSection.textContent = "Time: " + time;
        } else if (isTakingQuiz && time <= 0) {
            isTakingQuiz = false;
            promptInitials();
        }
        if (!isTakingQuiz) {
            clearInterval(timeInterval);
        }
    }, 1000);
});

function quiz() {
    time = 75;
    score = 10;
    index = 0;
    isTakingQuiz = true;
    highscoresLink.innerHTML = "";
    result.innerHTML = "";
    quizSection.removeChild(descriptionSection);
    quizSection.appendChild(choices);
    quizSection.appendChild(result);
    generateQuestion();
}

function generateQuestion() {
    currentQuestion = questions[index];
    quizHeader.textContent = currentQuestion.questionText;
    var answers = shuffleArray([currentQuestion.choice1, currentQuestion.choice2, currentQuestion.choice3, currentQuestion.choice4])

    choice1.innerHTML = '<button class="answerChoice">' + answers[0] + '</button>';
    choice2.innerHTML = '<button class="answerChoice">' + answers[1] + '</button>';
    choice3.innerHTML = '<button class="answerChoice">' + answers[2] + '</button>';
    choice4.innerHTML = '<button class="answerChoice">' + answers[3] + '</button>';
    choices.appendChild(choice1);
    choices.appendChild(choice2);
    choices.appendChild(choice3);
    choices.appendChild(choice4);
    choices.setAttribute("style", "display:block");
}

highscoresLink.addEventListener("click", function(event) {
    quizSection.removeChild(descriptionSection);
    displayHighScores();
});

quizSection.addEventListener("click", function(event) {
    var element = event.target;
    if (isTakingQuiz) {
        if (element.textContent === currentQuestion.choice1) {
            result.innerHTML = "<hr>Correct!";
            score += 2;
        } else if (element.getAttribute("class") === "answerChoice") {
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
        }
    }
});

function promptInitials() {
    quizHeader.textContent = "Your final score is " + score;
    quizSection.removeChild(choices);
    quizSection.insertBefore(initialsSection, result);
    var submitButton = document.querySelector("#submit");
    submitButton.addEventListener("click", saveScore);
}

function saveScore(event) {
    event.preventDefault();

    var initials = document.querySelector("#initials").value.toUpperCase();
    if (initials === "") {
        initials = "X";
    }
    var highscores = localStorage.getItem("highscores");
    if (highscores == null) {
        highscores = {initials: [], scores: []}
    } else {
        highscores = JSON.parse(highscores);
    }

    for (i = highscores.scores.length; i >= 0 ; --i) {
        if (i === 0 || score <= highscores.scores[i-1]) {
            highscores.scores.splice(i, 0, score);
            highscores.initials.splice(i, 0, initials);
            break;
        }
    }
    localStorage.setItem("highscores", JSON.stringify(highscores));

    quizSection.removeChild(initialsSection);
    quizSection.removeChild(result);
    displayHighScores();
}

function displayHighScores() {
    scoresSection.innerHTML = "";
    highscoresLink.innerHTML = "";
    var list = document.createElement("ol");
    var highscores = JSON.parse(localStorage.getItem("highscores"));
    if (highscores != null) {
        for (i = 0; i < highscores.scores.length; ++i) {
            var listItem = document.createElement("li");
            listItem.textContent = highscores.initials[i] + " - " + highscores.scores[i];
            list.appendChild(listItem);
            if (i >= 9) {
                break;
            }
        }
        scoresSection.appendChild(list);
    }
    var buttonSection = document.createElement("section");
    buttonSection.innerHTML = '<button id="back">Go Back</button> <button id="clear">Clear High Scores</button>';
    scoresSection.appendChild(buttonSection);
    quizHeader.textContent = "High scores";
    quizSection.appendChild(scoresSection);

    var backButton = document.querySelector("#back");
    backButton.addEventListener("click", goBack);

    var clearButton = document.querySelector("#clear");
    clearButton.addEventListener("click", clearHighScores);
}

function goBack(event) {
    console.log("going back...");
    quizSection.removeChild(scoresSection);
    quizHeader.textContent = "Coding Quiz Challenge";
    quizSection.appendChild(descriptionSection);
    highscoresLink.innerHTML = '<a href="#">High scores</a>';
}

function clearHighScores(event) {
    localStorage.clear();
    if (scoresSection.childNodes.length >= 2) {
        scoresSection.removeChild(scoresSection.firstChild);
    }
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