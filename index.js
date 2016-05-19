 "use strict"

const http = require('http')
const Bot = require('messenger-bot')
//const Intelligence = require('./Intelligence')

let bot = new Bot({
  token: process.env.ACCESS_TOKEN,
  verify: process.env.VERIFY_TOKEN,
  app_secret: process.env.APP_SECRET
})

bot.on('error', (err) => {
  console.log(err.message)
})

bot.on('message', (payload, reply) => {
  
  let text = payload.message.text

  
  /* clean */
  let cleanText = text.
            replace(/please/g, '').
            replace(/.+ thanks/g, ''). // strip thanks if not on its own
            trim().
            toLowerCase()

  let resp = response(text)

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err

    reply({ text: resp }, (err) => {
      if (err) {
        console.log(`error ${err}`)
        throw err
      } 
      console.log(`Replied back to ${profile.first_name} ${profile.last_name}: ${resp}`)
    })
  })
})

let notUnderstood = "Sorry I am not able to understand to your question yet."
let notYetImplemented = "Sorry this feature has not yet be implemented. Come back soon"

function response(text) {

  if (text.match(/^(hi|hello|ola|hey|salut)\s*[!?.]*$/)) {

    //TODO greeting 
    return notYetImplemented
  } else if (text ==='help') {

    //TODO help
    return notYetImplemented
  }

  else if (text.match(/^who */)) {

    //TODO find player/team 
    return notYetImplemented

  } else if (text.match(/^when */)) {

    //TODO find when next game of a team will play
    return notYetImplemented

  } else if (text.match(/^where */)) {

    //TODO find where a game will be be played
    return notYetImplemented

  } else if (text.match(/^(follow|subscribe) */)) {

    //TODO implement follow capability and specific message
    return notYetImplemented


 } else if (text == 'latest news') {


    //TODO capi query with lastest news about euro
    return notYetImplemented
 } else {

    return notUnderstood

  }
}

function nextGame(team) {


}


let port = process.env.PORT

http.createServer(bot.middleware()).listen(port)
console.log('Echo bot server running at port ' + port)