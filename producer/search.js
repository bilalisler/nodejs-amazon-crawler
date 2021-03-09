const amqp = require('amqplib/callback_api')
const cheerio = require('cheerio')
const axiosRetry = require('axios-retry')
const axios = require('axios')
const config = require('../config')


// amqp.connect(config.rabbit.server, function (error0, connection) {
//     if (error0) throw error0
//
//     connection.createChannel(function (error1, channel) {
//         if (error1) {
//             throw error1
//         }
//
//         channel.assertQueue(config.rabbit.queue, {
//             durable: false
//         });
//
//         // axios
//
//         channel.sendToQueue(queue, Buffer.from(msg));
//         console.log(" [x] Sent %s", msg);
//     });
//
//     setTimeout(function () {
//         connection.close();
//         process.exit(0)
//     }, 500);
// })


axiosRetry(axios, {retries: 2, retryDelay: 1000});
axios.get('https://www.amazon.com.tr/s', {
    params: {
        k: 'onitsuka tiger',
        page: 1
    }
})
    .then(result => {
        if (result.status !== 200) {
            return false;
        }

        const $ = cheerio.load(result.data);

        // console.log('result: ',result.config);
        // console.log('result: ',result.request);
        // console.log('result: ',result._header);
        // console.log('result: ',result.agent);
        // console.log('result: ',result.path);
        // console.log('result: ',result.host);

        $('div.s-main-slot.s-result-list.s-search-results.sg-row div.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.sg-col.sg-col-4-of-20').each(function (index, productElement) {
            const productBrand = $(productElement)
                .find('div.a-section.a-spacing-none.a-spacing-top-small').first()
                .find('div.a-row.a-size-base.a-color-secondary')
                .find('h5.s-line-clamp-1')
                .find('span')
                .text();

            const productTitle = $(productElement)
                .find('div.a-section.a-spacing-none.a-spacing-top-small').first()
                .find('h2.a-size-mini.a-spacing-none.a-color-base.s-line-clamp-2')
                .find('span')
                .text();

            const productLink = $(productElement)
                .find('div.a-section.a-spacing-none.a-spacing-top-small').first()
                .find('h2.a-size-mini.a-spacing-none.a-color-base.s-line-clamp-2')
                .find('a')
                .attr('href');

            const productPrice = $(productElement)
                .find('div.a-section.a-spacing-none.a-spacing-top-small').eq(1)
                .find('div.a-row.a-size-base.a-color-base')
                .find('span.a-price')
                .find('span.a-price-whole')
                .text()
                .replace(',', '');

            const productPenny = $(productElement)
                .find('div.a-section.a-spacing-none.a-spacing-top-small').eq(1)
                .find('div.a-row.a-size-base.a-color-base')
                .find('span.a-price')
                .find('span.a-price-fraction')
                .text();

            const productPriceCurrency = $(productElement)
                .find('div.a-section.a-spacing-none.a-spacing-top-small').eq(1)
                .find('div.a-row.a-size-base.a-color-base')
                .find('span.a-price')
                .find('span.a-price-symbol')
                .text();

            const product = {
                brand: productBrand,
                title: productTitle,
                link: productLink,
                total: parseFloat(productPrice) + parseFloat(productPenny / Math.pow(10, productPenny.length)),
                currency: productPriceCurrency,
            }

            console.log(product);
        });
    })
    .catch(function (error) {
        console.log(error);
    });