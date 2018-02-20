var config = require('./config.json');
var css = require('./css.js');
var express = require('express');
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

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

var variants = Object.keys(config);
app.get('/:template(' + variants.join('|') + ')?/:id(\\d+)?', function (request, response) {
  if (typeof request.params.template == 'undefined') {
    request.params.template = "bernie";
  }
  var templateVars = config[request.params.template];
  templateVars["template"] = request.params.template;
  templateVars["variants"] = variants;
  if (typeof request.params.id != 'undefined') {
  twitter.get("statuses/show", {"id": request.params.id}, function(error, tweet, twitterResponse) {
    if (error) {
      response.render('home', templateVars);
    } else {
      templateVars["desc"] = templateVars.desc.replace("{{tweet.user.name}}", tweet.user.name)
      templateVars["tweetDetails"] = tweet;
      response.render('home', templateVars);
      }
    });
  } else {
    response.render('home', templateVars);
  }
});

var computedStyles = css.cssForConfig(config);
app.get('/computed.css', function(request, response) {
  response.setHeader('content-type', 'text/css');
  response.send(computedStyles);
});

app.get('/config.json', function(request, response) {
  response.send(config);
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
