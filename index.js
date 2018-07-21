'use strict';

//imports dependencies and sets up http server
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
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
      //get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);
      //check whether the event is a message or postback
      //pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } /*else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }*/
    });
    //returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    //returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

//handles message events
function handleMessage(sender_psid, received_message) {
  let response;
  //check whether the message contains text
  if (received_message.text) {
    //create the payload for a basic text message
    response = {
      "text": "${received_message.text}"
    }
  }
  //sends the response message
  callSendAPI(sender_psid, response);
}

//sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  //construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }
  //send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": "EAAclctZANcaQBAHhWxldZCUE0Qut9dXkZC2e1V4FxzFK1b1dDuuB72Dc1IFv6WUNJUtZBSDRYZB8PCfNfLCoPpDaodIpwziijPJOCn7vylZBZBqVapdmZAlgUqWl7m9mn66AZCvMTba4YKo2E7XvgvPaPZApqfwAW3IukZA8Bos3UpbSgZDZD" },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!');
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}

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
