var path = require('path')
var read = require('fs').readFileSync
// Our Twitter library
var Twit = require('twit');

var T = new Twit(require('./config.js'));

var book = read(path.resolve(__dirname, 'books/01-Wizard-of-Oz.txt'), 'utf8').split('\n')

function pickOne(array) {
  return array[Math.floor(array.length * Math.random())]
}

// setInterval(function() {
  while(true) {
    var line = pickOne(book)
    var sentences = line
      .split('.')
      .map(sentence => sentence.trim())
      .filter(sentence => sentence)

    var tweet = pickOne(sentences)
    if(tweet.length > 0 && tweet.length <= 140) {
      console.log("Tweeting: " + tweet)
      T.post('statuses/update', { status: tweet }, function(err, data, response) {
        console.log(data)
      })
      break;
    }
  }
// }, 30 * 60 * 1000)
