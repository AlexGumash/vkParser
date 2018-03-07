const { Builder, By, Key, until } = require("selenium-webdriver");
const { login, password } = require("./secret.json");
const feedTemplate = require("./feed-template.json");

const parsedFeeds = [];

function createDriver() {
  return new Builder().forBrowser("chrome").build();
}

async function getFeedText(feed, driver) {
  feed.findElements(By.className("wall_post_more")).then(v => {
    if (v.length > 0) {
      v[0].click();
    }
  });
  return Promise.all([
    feed.findElement(By.className("post_author")).getText(),
    feed.findElement(By.className("post_date")).getText(),
    feed.findElement(By.className("wall_text")).getText()
  ]);
}

async function vkParse() {
  const driver = await createDriver();
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
    driver
      .wait(
        until.elementsLocated(By.className("feed_row ")),
        10000,
        "Timeout error"
      )
      .then(function(feeds, reject) {
        feeds.map(async feed => {
          if (await feed.isDisplayed()) {
            Promise.all([getFeedText(feed, driver)]).then(v => {
              console.log(v);
            });
          }
        });
      });
  } catch (err) {
    console.log(err);
  }
}

vkParse();
