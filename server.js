var config = {
  "bernieURL": "https://cdn.gomix.com/f919105f-03fb-4e49-9855-732bbdf9a0f1%2Fbernie.jpg",
  "bernieWidth": 710,
  "bernieHeight": 473
};

var express = require('express');
var stylish = require('stylish');
var exphbs  = require('express-handlebars');
var Twitter = require('twitter');
var OAuth = require('oauth');
var request = require('request');

var twitter;

var oauth2 = new OAuth.OAuth2(
  process.env.TWITTER_KEY,
  process.env.TWITTER_SECRET,
  'https://api.twitter.com/', 
  null,
  'oauth2/token', 
  null);

oauth2.getOAuthAccessToken(
  '',
  {'grant_type':'client_credentials'},
  function (e, access_token, refresh_token, results){
    twitter = new Twitter({
      consumer_key: process.env.TWITTER_KEY,
      consumer_secret: process.env.TWITTER_SECRET,
      bearer_token: access_token
    });
  });


var app = express();

app.use(express.static('public'));
app.use(stylish('public'));

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
