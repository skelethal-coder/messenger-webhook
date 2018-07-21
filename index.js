/*
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
*/

'use strict';

//imports dependencies and sets up http server
const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json()); //creates express http server

//sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

//creates the endpoint for our webhook
app.post('/webhook', (req, res) => {
  let body = req.body;
  //checks whether this is an event from a page subscription
  if (body.object === 'page') {
    //iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry){
      //gets the message
      //entry.messaging is an array,
      //but will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
    });
    //returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    //returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

//adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {
  //your verify token
  //should be a random string
  let VERIFY_TOKEN = "bsdb_verify_token";
  //parse the query parameters
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  //checks whether a token and mode is in the query string of the request
  if (mode && token) {
    //checks whether the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      //responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      //responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
