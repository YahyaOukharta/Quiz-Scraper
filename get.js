//https://www.britannica.com/quiz/european-history


let questions = []; document.querySelectorAll(".md-question-view .quiz-content div.md-quiz-answer").forEach(function(e){questions.push(e.innerText + (e.className.split(" ").includes("true") ? " - RIGHT" : "" ))});return questions;
return document.querySelector(".md-question-view .quiz-content span").innerText;