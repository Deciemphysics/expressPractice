const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const http = require('http');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ exended: true }));
//when a get request is coming from the root

app.use(session({
  secret: 'keyboard cat',
  cookie: {maxAge:300000}
}))

app.get('/', (req, res) => {
  // let user_id = req.param('id');
  // res.send('Hello ' + user_id);
  fs.readFile('./appGetPostForm.html', function (err, html) {
    if (err) throw err;    
    res.writeHeader(200, {"Content-Type": "text/html"});  
    res.write(html);  
    res.end();
  })  
});

app.post('/', (req, res) => {
  let user_id = req.body.first;
  let message = req.body.message;
  let timestamp = new Date();
  fs.appendFile('log.txt', `${timestamp} ${user_id}:\n${message}\n\n`, (err) => {
    if (err) throw err;
    console.log('The "data to append" was appended to file!');
  });
  if (req.session.tweets) {
    req.session.tweets++;
  } else {
    req.session.tweets = 1;
  }
  res.send('Hello POST request ' + user_id); 
});

app.get('/tweets', (req, res) => {
  fs.readFile('log.txt', (err, data) => {
    res.setHeader('Content-Type', 'text/html');
    if (!req.session.tweets) {
      req.session.tweets = 0;
    }
    res.write(`<p>Total Tweets: ${req.session.tweets}`);
    res.write('<p>Recent Tweets:</p>');
    res.write(`<p>${data}</p>`);
    res.end();
  })
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke');
})


app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});