var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('This is my Facebook Messenger Bot - Bollywood Songs Download Bot Server!');
});

app.get('/webhook', function (req, res) {
	if (req.query['hub.verify_token'] === 'bsdb_verify_token') {
		res.status(200).send(req.query['hub.challenge']);
	} else {
		res.status(403).send('Invalid verify token');
	}
});

app.listen((process.env.PORT || 8080));