// request module-> npm -> install
let req = require("request");
// cheerio -> pass html -> read -> parse-> tool
let ch = require("cheerio");
let obj = require("./match.js");
const { processMatch } = require("./match.js");
// io -> xlsx
// npm 
// to do crud
// program bottleNeck 
// expose -> async function
console.log("Before");
// request -> to make request to server -> and get html file
// let url = 'https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results';
function getScoreCardUrl(url) {

    req(url, cb);
}
function cb(error, response, data) {
    // resoure not  found
    if (response.statusCode == 404) {
        console.log("Page not found");
        // resource found
    } else if (response.statusCode == 200) {
        // console.log(data);
        parseHTML(data);
    } else {
        console.log(err);
    }
}
function parseHTML(data) {
    let fTool = ch.load(data);
    let AllScorecardElem = fTool('a[data-hover="Scorecard"]');
    for (let i = 0; i < AllScorecardElem.length; i++) {
        let url = ch(AllScorecardElem[i]).attr("href");
        let fullUrl = "https://www.espncricinfo.com" + url;
        obj.pm(fullUrl);
    }
    // console.log(AllScorecardElem.length);
}

console.log("After");
console.log("Req send");
module.exports = {
    getScoreCardUrl: getScoreCardUrl
}