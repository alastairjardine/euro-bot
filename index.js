var express = require("express")
var bodyParser = require("body-parser")
var request = require("request")
var app = express()

const VERIFY_TOKEN = process.env.VERIFY_TOKEN
const ACCESS_TOKEN = process.env.ACCESS_TOKEN

app.set("port", 5000)

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

app.get("/", function (req, res) {
  res.send("hello world")
})

// Verification GET
app.get("/webhook/", function (req, res) {
  if (req.query["hub.verify_token"] === VERIFY_TOKEN) {
    console.log("verified!")
    res.send(req.query["hub.challenge"])
  } else {
    console.log("not verified")
    res.send("Error, wrong token")
  }
})

app.post("/webhook/", function (req, res) {
  events = req.body.entry[0].messaging
  console.log("Received: "+ JSON.stringify(events))
  for (i = 0; i < events.length; i++) {
    event = events[i]
    sender = event.sender.id
    if (event.message && event.message.text) {
      text = event.message.text
      console.log("received message: "+ text)
      sendTextMessage(sender, "Received: "+ text)
    }
  }
  res.sendStatus(200)
})

function sendTextMessage(sender, text) {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: { access_token: ACCESS_TOKEN },
    method: 'POST',
    json: {
      recipient: { id:sender },
      message: { text: text }
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  })
}

app.listen((process.env.PORT || 5000), function() {
  console.log("running on port", app.get("port"))
})

