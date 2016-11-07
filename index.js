let schedule = require('node-schedule')
let logic = require('./app/logic')

let postRule = new schedule.RecurrenceRule()
postRule.minute = 15

schedule.scheduleJob(postRule, function () {
  logic.post(() => {
    console.log('posted at ' + Date.now())
  })
})

logic.saveArray()
logic.generate((tweet) => {
  console.log(tweet)
})
