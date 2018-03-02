const { Builder, By, Key, until } = require("selenium-webdriver");
const { login, password } = require("./secret.json");

async function example() {
  const driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("https://vk.com");
    driver.wait(
      driver.findElement(By.id("index_email")).isDisplayed().then(
        function() {
          driver.findElement(By.id("index_email")).sendKeys(login);
        },
        function(error) {
          throw error;
        }
      )
    );
    await driver.findElement(By.id("index_pass")).sendKeys(password);
    await driver.findElement(By.id("index_login_button")).click();
  } catch (err) {
    console.log(err);
  }
}

example();
