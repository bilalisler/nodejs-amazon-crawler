const amqp = require('amqplib/callback_api')
const cheerio = require('cheerio')
const axiosRetry = require('axios-retry')
const axios = require('axios')
const config = require('../config')

amqp.connect(config.rabbit.server, function (error0, connection) {
    if (error0) throw error0

    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1
        }

        channel.assertQueue(config.rabbit.queue, {
            durable: false
        });

        axios.get('https://www.amazon.com.tr/gp/browse.html', {
            params: {
                node: 13546844031,
                ref_: 'nav_em_ms_sneaker_0_2_2_10'
            }
        })
            .then(result => {
                if(result.status !== 200){
                    return false;
                }

                const $ = cheerio.load(result.data);

                console.log('result: ', $('div.fst-h1-st').first().text());
            })
            .catch(function (error) {
                console.log(error);
            });

        channel.sendToQueue(queue, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);
    });

    setTimeout(function () {
        connection.close();
        process.exit(0)
    }, 500);
})