from selenium import webdriver
from time import sleep

driver = webdriver.Firefox(executable_path="./geckodriver")
driver.get('https://www.britannica.com/quiz/capital-cities-by-continent-quiz-easier-edition')
sleep(2)
driver.find_element_by_css_selector('.start-button').click()
while 1:
    sleep(3)

    driver.find_element_by_css_selector('.md-quiz-answer').click()

    answers = driver.execute_script('let questions = []; document.querySelectorAll(".md-question-view .quiz-content div.md-quiz-answer").forEach(function(e){questions.push(e.innerText + (e.className.split(" ").includes("true") ? " - RIGHT" : "" ))});return questions;')
    question = driver.execute_script('return document.querySelector(".md-question-view .quiz-content span").innerText;')
    print(question, answers)
    sleep(2)
    driver.find_element_by_css_selector('.md-next-question').click()
