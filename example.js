const { Builder, By, Key, until } = require("selenium-webdriver");
const { login, password } = require("./secret.json");
const feedTemplate = require("./feed-template.json");

const parsedFeeds = [];

function createDriver() {
  return new Builder().forBrowser("chrome").build();
}

async function getSimpleImg(feed) {
  return feed
    .findElements(By.className("page_post_thumb_wrap"))
    .then(async images => {
      return await Promise.all(
        images.map(async image => {
          return await image.getCssValue("background-image");
        })
      );
    });
}

async function getLinkImg(feed) {
  return feed
    .findElements(By.className("page_media_link_img"))
    .then(async images => {
      return await Promise.all(
        images.map(async image => {
          return await image.getAttribute("src");
        })
      );
    });
}

async function getAuthorImg(feed) {
  return feed.findElement(By.className("post_img")).getAttribute("src");
}

async function getFeedImg(feed) {
  return Promise.all([
    getSimpleImg(feed),
    getAuthorImg(feed),
    getLinkImg(feed)
  ]);
}

async function getFeedLinks(feed) {
  return Promise.all([
    feed
      .findElement(By.className("post_header"))
      .findElements(By.css("a"))
      .then(async links => {
        return await Promise.all(
          links.map(async feedLink => {
            return await feedLink.getAttribute("href");
          })
        );
      }),
    feed
      .findElement(By.className("wall_text"))
      .findElements(By.css("a"))
      .then(async links => {
        return await Promise.all(
          links.map(async feedLink => {
            return await feedLink.getAttribute("href");
          })
        );
      })
  ]);
}

async function getFeedText(feed) {
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
            await Promise.all([
              getFeedText(feed),
              getFeedImg(feed),
              getFeedLinks(feed)
            ]).then(feedArray => {
              let feedObj = {};
              feedArray.map(parsedFeed => {
                feedObj.text = {};
                feedObj.text.publicName = parsedFeed[0][0][0];
                feedObj.text.time = parsedFeed[0][0][1];
                feedObj.text.content = parsedFeed[0][0][2];
                parsedFeeds.push(feedObj);
              });
              console.log(feedObj);
            });
          }
        });
      });
  } catch (err) {
    console.log(err);
  }
}

vkParse();
