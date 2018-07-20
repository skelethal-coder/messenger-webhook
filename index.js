var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function (req, res) {
	res.send('<b>This is my Facebook Messenger Bot - Bollywood Songs Download Bot Server!</b>');
});

app.get('/webhook', function (req, res) {
	if (req.query['hub.verify_token'] === 'bsdb_verify_token') {
		res.status(200).send(req.query['hub.challenge']);
	} else {
		res.status(403).send('Invalid verify token');
	}
});

app.listen((process.env.PORT || 8080));

app.post('/webhook', function (req, res) {
	var events = req.body.entry[0].messaging;
		for (i = 0; i < events.length; i++) {
			var event = events[i];
			if (event.message && event.message.text) {
				sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
			}
		}
		res.sendStatus(200);
});

function sendMessage(recipientId, message) {
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token: EAAclctZANcaQBALvJixZBXLFwO8R7Un8XtvtfDZAH6QKGEGlrNJeX3XXmK9YLbaQpnidV5E9uGk3HyfS77WuUPFZCryHkkFu1En4ZCSQ5b8nnMqCuA1J527JKs1f3vVeMkIMTDc1q6tawJF9QPlOKhS4vItsqz0S35Oq5Dto9QAZDZD},
		method: 'POST',
		json: {
			recipient: {id: recipientId},
			message: message,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending message: ', error);
		} else if (response.body.error) {
			console.log('Error: ', response.body.error);
		}
	});
};
