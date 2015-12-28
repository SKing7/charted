/*jshint node:true */

var request = require('request')
var express = require('express')
var app = express()

app.get('/get', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var url = req.query.url;
  var baseUrl = 'http://127.0.0.1:3000/reports/'; 
  if (!req.query.url) {
    res.status(400).send('Bad Request: no url provided')
    return
  }

  if (!/^(http|https)/.test(url)) {
    url = baseUrl + (req.query.url).replace(/\//g, '_') + '.csv'; 
  }
  request(decodeURIComponent(url), function (err, resp, body) {
    if (err) {
      res.status(400).send('Bad Request: ' + err)
      return
    }

    if (resp.statusCode != 200) {
      res.status(400).send('Bad Request: response status code was not 200')
      return
    }

    res.status(200).send(body)
  })
})

app.use(express.static('pub'))

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Running at http://%s:%s', host, port)
})
