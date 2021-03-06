const express = require('express');
const Twit = require('twit');
const fetch = require('node-fetch');
const randomWord = require('random-word');
const fs = require('fs');

// TWITTER API KEY
const KEY = JSON.parse(fs.readFileSync('apikey.json'));

const T = new Twit({
  consumer_key: KEY.key,
  consumer_secret: KEY.secret,
  access_token: KEY.token,
  access_token_secret: KEY.token_secret,
});

const app = express();

app.listen(5000, () => {
  console.log('Server running on localhost:5000');
});

app.use(express.static('public'));

app.use(express.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api', (req, res) => {
  let tweet;

  T.get('search/tweets', { q: randomWord(), count: 1 }, (err, data, response) => {
      
    try {
      const r = Math.random();
      //console.log(r);
      if (r < 0.7) {

        let authorVar = "";
        try {
            authorVar = data.statuses[0].entities.user_mentions[0].name + " (@" + data.statuses[0].entities.user_mentions[0].screen_name + ")";
        }catch (err){
            authorVar = "Undefined!"
        }

        tweet = {
          quote: data.statuses[0].text,
          author: authorVar,
          src: 'Twitter',
        };
        res.json(tweet);
      } else {
        fetch('https://talaikis.com/api/quotes/random')
          .then(response => response.json())
          .then((content) => {
            tweet = {
              quote: content.quote,
              author: content.author,
              src: 'Talaikis API',
            };
            res.json(tweet);
          });
      }
    } catch (err) {
      console.log(err);
      fetch('https://talaikis.com/api/quotes/random/')
        .then(response => response.json())
        .then((content) => {
          tweet = {
            quote: content.quote,
            author: content.author,
            src: 'Talaikis API',
          };
          res.json(tweet);
        });
    }
    
  });
  res.status(200);
});
}
