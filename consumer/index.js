const amqp = require('amqplib/callback_api')
const cheerio = require('cheerio')
const config = require('../config')

amqp.connect(config.rabbit.server, function (error0, connection) {
    if (error0) throw error0

    connection.createChannel(function (error1, channel) {
        if (error1){
            throw error1
        }
        channel.consume(config.rabbit.queue, function (msg) {
            var parsedMsg = JSON.parse(msg.content.toString())
            let crawledUrl = parsedMsg.url

            setTimeout(function () {


                channel.ack(msg)
            }, 1000)
        })

    })
})
