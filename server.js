
// server.js
// where your node app starts

// init project
var express = require('express');
var stylish = require('stylish')
var exphbs  = require('express-handlebars');
var Twitter = require('twitter');
var OAuth = require('oauth');
var bearerToken;
var twitter;

var oauth2 = new OAuth.OAuth2(process.env.TWITTER_KEY,
  process.env.TWITTER_SECRET,
  'https://api.twitter.com/', 
  null,
  'oauth2/token', 
  null);
oauth2.getOAuthAccessToken(
  '',
  {'grant_type':'client_credentials'},
function (e, access_token, refresh_token, results){
  bearerToken = access_token;
  twitter = new Twitter({
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    bearer_token: bearerToken
  });
});

var app = express();

app.use(express.static('public'));
app.use(stylish('public'))

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get("/", function (request, response) {
  response.render('home');
});

app.get("/:id(\\d+)", function (request, response) {
  twitter.get("statuses/show", {"id": request.params.id}, function(error, tweet, twitterResponse) {
    if(error) {
      response.render('home');
    } else {
      response.render('home', {
        "valID": "value=\"" + request.params.id + "\"",
        "tweet": tweet
      });
    }
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
