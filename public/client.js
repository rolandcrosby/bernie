$(function() {
  $('form').submit(function(event) {
    event.preventDefault();
  });
  fetch('/config.json')
    .then(function(r) {return r.json()})
    .then(setupWithConfig);
});

function parseStateFromURL() {
  var out = {"page": "bernie", "id": ""};
  var res = /^\/(?:(\w+)\/)?(\d+)$/.exec(window.location.pathname);
  if (res) {
    out.id = res[2];
    if (res[1]) {
      out.page = res[1];
    }
  }
  return out;
}

function setupWithConfig(config) {
  window.config = config;
  if (!window.state) {
    window.state = parseStateFromURL();
  }
  window.twttr = (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
      t = window.twttr || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);
    t._e = [];
    t.ready = function(f) {
      t._e.push(f);
    };
    return t;
  }(document, "script", "twitter-wjs"));
  window.twttr.ready(function() {
    refreshFromState();
    window.onpopstate = function(e) {
      loadState(e.state);
    };
    document.getElementById("form").addEventListener("submit", function(e) {
      var res = /(\d+)\/?$/.exec(document.getElementById("tweetID").value);
      if (res) {
        setTweet(res[1]);
      }
    });
  });
}

function setTweet(id) {
  if (id !== window.state.id) {
    window.state.id = id;
    commitState();
  }
}

function setPage(page) {
  if (page !== window.state.page) {
    window.state.page = page;
    commitState();
  }
}

function loadState(state) {
  window.state = state;
  refreshFromState();
}
  
function commitState() {
  history.pushState(window.state, window.state.page + '/' + window.state.id, urlForState(window.state));
  refreshFromState();
}

function urlForState(state) {
  var out = '/' + state.page + '/';
  if (state.id !== '') {
    out = out + state.id;
  }
  return out;
}

function refreshFromState() {
  updateImageVariant(window.state.page);
  loadTweet(window.state.id);
}

function updateImageVariant(variant) {
  document.querySelector('.image').className = 'image image--' + variant;
  document.title = window.config[variant].title;
}
  
function loadTweet(id) {
  document.getElementById("tweetID").value = id;
  // history.replaceState({"id": id}, "", prefix() + id);
  var tgt = document.getElementById("tweet");
  tgt.innerHTML = "";
  tgt.appendChild(document.createElement("div"));
  scaleToWidth(300, tgt);
  window.twttr.widgets.createTweet(
    id,
    tgt.firstChild,
    {"conversation": "none", "align": "center"}
  ).then(function(el) {
    fitTweet(el);
  });
}

function fitTweet(twitterWidget) {
  var wrap = twitterWidget.parentNode; // single div wrapper around tweet
  var tweetContainer = wrap.parentNode;
  var w = twitterWidget.offsetWidth, h = twitterWidget.offsetHeight;
  var conf = currentConfig();
  wrap.style.width = w + "px";
  wrap.style.height = h + "px";
  tweetContainer.style.transform = "rotate(" + conf.tweet.rotation + "deg) ";
  if (1.0 * w / h > conf.tweet.width / conf.tweet.height) { // tweet is wider than box
    tweetContainer.style.width = w + "px";
    tweetContainer.style.height = (w * conf.tweet.height / conf.tweet.width) + "px";
    tweetContainer.style.transform += "scale(" + (conf.tweet.width / w) + ")";
  } else {
    tweetContainer.style.height = h + "px";
    tweetContainer.style.width = (h * conf.tweet.width / conf.tweet.height) + "px";
    tweetContainer.style.transform += "scale(" + (conf.tweet.height / h) + ")";
  }
}

function scaleToWidth(w, tweetContainer) {
  var conf = currentConfig();
  tweetContainer.style.width = w + "px";
  tweetContainer.style.height = (w * conf.tweet.height / conf.tweet.width) + "px";
  tweetContainer.style.transform = "rotate(" + conf.tweet.rotation + "deg)"
    + "scale(" + (conf.tweet.width / w) + ")";
}
  
function currentConfig() {
  return window.config[window.state.page];
}