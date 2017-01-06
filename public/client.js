$(function() {
  $('form').submit(function(event) {
    event.preventDefault();
  });

});

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

twttr.ready(function() {
  // parse the URL at launch
  var res = /^\/(\d+)$/.exec(window.location.pathname);
  if (res) {
    loadTweet(res[1]);
  }
  
  window.onpopstate = function(e) {
    loadTweet(e.state.id);
  }
  
  document.getElementById("form").addEventListener("submit", function(e) {
    var res = /(?:\/statuses\/)?(\d+)/.exec(document.getElementById("tweetID").value);
    if (res) {
      history.pushState({"id": res[1]}, "tweet" + res[1], "/" + res[1]);
      loadTweet(res[1]);
    }
  })
  
  
})

function loadTweet(id) {
  document.getElementById("tweetID").value = id;
  history.replaceState({"id": id}, "", "/" + id);
  var tgt = document.getElementById("tweet");
  tgt.innerHTML = "";
  tgt.appendChild(document.createElement("div"));
  fitW(300);
  twttr.widgets.createTweet(
    id,
    tgt.firstChild,
    {"conversation": "none", "align": "center"}
  ).then(function(el) {
    fitTweet(el)
  });
}

function fitTweet(el) {
/*      width: tweetWidth + 0px;
        height: (tweetWidth * 156px / 211);
        transform: rotate(2.6deg) scale((211/tweetWidth));
*/
  var c = document.getElementById("tweet");
  var wrap = el.parentNode;
  var w = el.offsetWidth, h = el.offsetHeight;
  wrap.style.width = w + "px";
  wrap.style.height = h + "px";
  if (1.0 * w / h > 211.0 / 156) { // tweet is wider than box
    c.style.width = w + "px";
    c.style.height = (w * 156.0 / 211) + "px";
    c.style.transform = "rotate(2.6deg) scale(" + (211.0 / w) + ")";
    console.log("fit to w = " + w);
  } else {
    c.style.height = h + "px";
    c.style.width = (h * 211.0 / 156) + "px";
    c.style.transform = "rotate(2.6deg) scale(" + (156.0 / h) + ")";
    console.log("fit to h = " + h);
  }
}

function fitW(w) {
  var c = document.getElementById("tweet");
  c.style.width = w + "px";
  c.style.height = (w * 156.0 / 211) + "px";
  c.style.transform = "rotate(2.6deg) scale(" + (211.0 / w) + ")";
}