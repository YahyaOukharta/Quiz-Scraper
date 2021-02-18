from selenium import webdriver

DRIVER_PATH = './chromedriver'
driver = webdriver.Chrome(executable_path=DRIVER_PATH)
driver.get('https://www.britannica.com/quiz/browse/World-History')