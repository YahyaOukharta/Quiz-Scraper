//https://www.britannica.com/quiz/european-history

document.querySelectorAll(".md-question-view .quiz-content div.md-quiz-answer").forEach(function(e){console.log(e.innerText + (e.className.split(" ").includes("true") ? " - RIGHT" : "" ))});
document.querySelector(".md-question-view .quiz-content span").innerText;