const request = require('request');
const requestPromise = require('request-promise');
const Promise = require('bluebird');
const cheerio = require('cheerio');
const fs = require('fs');

const writeStream = fs.createWriteStream('data.csv');
const urls =["https://tsn.ua/","https://tsn.ua/prosport","https://tsn.ua/lady","https://tsn.ua/auto"];
let newsUrl = [];
let titles = [];



writeStream.write('Id,Title \n');

Promise.map(urls, requestPromise)
    .map((htmlOnePage, index) => {
        const $ = cheerio.load(htmlOnePage);
        $(".h-entry.c-entry").each((i,el)=>{
            let hrefVal = $(el).find('a').attr('href');
            if(hrefVal && hrefVal.match(/.html$/)) newsUrl.push(hrefVal);
        })
        }).then(()=>{})
          .catch(console.log)
    .then(()=>{
        Promise.map(newsUrl, requestPromise)
            .map((htmlOnePage, index) => {
                const $ = cheerio.load(htmlOnePage);
                const title = $('.c-post-title.u-uppercase').first().text().replace(/\s\s+/g,'');
                writeStream.write(`${index}, ${title} \n`);
                titles.push(title);
                }).then(() => {})
                  .catch(console.log)
            .then(()=>{
                console.log(titles);
            });
    })

