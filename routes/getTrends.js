var Twit = require('twit'),
config = require('../config'),
T = new Twit(config);

exports.trends = function(req, res) {
  var woeid = req.params.woeid;
  T.get('trends/place', {id: woeid}, function(err, data) {
    if (typeof data === "undefined") {
      res.json({status: false});
    } else {
      res.json({trends: data, status: true});
    }
  });
};

exports.trendinfo = function(req, res) {
  var trend = req.params.trend;
  var trendinfoSet = [];
  console.log(trend);
  T.get('search/tweets', { q: trend, count: 100 }, function(err, data, response) {
    var statuses = data.statuses;
    console.log(statuses.length);
    for (idx in statuses) {
      tweet = statuses[idx];
      if ("entities" in tweet) {
        if ("media" in tweet.entities) {
          if (tweet.entities.media.length > 0) {
            var text = tweet.text;
            var urlIdx = text.lastIndexOf("http");
            var tweetUrl = text.substr(urlIdx);
            text = text.substring(0, urlIdx);
            trendinfoSet.push({tweetText: text, imageURL: tweet.entities.media[0].media_url, tweetUrl: tweetUrl});
            console.log(tweetUrl);
          }
        }
      }
    }
    console.log(trendinfoSet.length);
    res.json({trendinfo: trendinfoSet, status: true});
  });
};