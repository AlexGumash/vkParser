const { Builder, By, Key, until } = require("selenium-webdriver");

async function example() {
  const driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("https://vk.com");
    driver.wait(
      driver.findElement(By.id("index_email")).isDisplayed().then(
        function() {
          driver.findElement(By.id("index_email")).sendKeys("89299263510");
        },
        function(error) {
          throw error;
        }
      )
    );
    await driver.findElement(By.id("index_pass")).sendKeys("Alex1998");
    await driver.findElement(By.id("index_login_button")).click();
  } catch (err) {
    console.log(err);
  }
}

example();
