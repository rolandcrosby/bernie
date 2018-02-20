exports.cssForConfig = function(obj) {
  var rules = "";
  var keys = Object.keys(obj);
  for (var key of keys) {
    rules += cssForKey(key, obj[key]);
  }
  return rules;
}


function cssForKey(key, properties) {
  var rules = "";
  var baseSelector = '.image--' + key;
  rules += rule(baseSelector, bgProps(properties.background));
  rules += rule(baseSelector + " .tweet-container", tweetProps(properties.tweet));
  if (properties.overlay) {
    rules += rule(baseSelector + ":after", overlayProps(properties.overlay));
  }
  return rules;
}

function bgProps(background) {
  return [
    prop("width", background.width, "px"),
    prop("height", background.height, "px"),
    prop("background-image", background.url, "url")
  ];
}

function tweetProps(tweet) {
  var out = [
    prop("width", tweet.width, "px"),
    prop("height", tweet.height, "px"),
    prop("left", tweet.left, "px"),
    prop("top", tweet.top, "px")
  ];
  if (tweet.rotation) {
    out.push("transform: rotate(" + tweet.rotation + "deg);");
  }
  if (tweet.style) {
    out.push(tweet.style)
  }
  return out;
}

function overlayProps(overlay) {
  return [
    prop("content", overlay.url, "url"),
    "position: absolute;",
    prop("width", overlay.width, "px"),
    prop("height", overlay.height, "px"),
    prop("left", overlay.left, "px"),
    prop("top", overlay.top, "px")
  ];
}

function rule(selector, rules) {
  return selector + " {" + rules.join("") + "}"
}

function prop(propName, value, unit) {
  switch(unit) {
    case "px":
      return propName + ": " + value + unit + ";"
    case "url":
      return propName + ": url(" + value + ");"
    default:
      throw "unsupported unit!";
  }
}

/*
.image--baby {
  width: 1200px;
  height: 799px;
  background-image: url(https://cdn.glitch.com/f919105f-03fb-4e49-9855-732bbdf9a0f1%2Fbabyblank.jpg?1518749537075);
}

.image--baby:after {
  content: url(https://cdn.glitch.com/f919105f-03fb-4e49-9855-732bbdf9a0f1%2Fbabyfingers.png?1518749722932);
  position: absolute;
  left: 396px;
  top: 464px;
  width: 394px;
  height: 189px;
}

.image--baby .tweet-container {
  width: 370px;
  height: 275px;
  top: 478px;
  left: 406px;
  transform: rotate(0.8deg);
}
*/