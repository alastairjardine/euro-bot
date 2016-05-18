var express = require("express")
var bodyParser = require("body-parser")
var app = express()

const VERIFY_TOKEN = "mytoken"

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
  for (i = 0; i < events.length; i++) {
    event = events[i]
    sender = event.sender.id
    if (event.message && event.message.text) {
      text = event.message.text
      res.send(text)
    } else {
      res.send("ummm...")
    }
  }
  res.sendStatus(200)
})

app.listen(app.get("port"), function() {
  console.log("running on port", app.get("port"))
})

