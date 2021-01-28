// request module-> npm -> install
let req = require("request");
// cheerio -> pass html -> read -> parse-> tool
let ch = require("cheerio");
let obj = require("./match.js");
let Allmatch = require("./AllMatch");
// io -> xlsx
// npm 
// to do crud
// program bottleNeck 
// expose -> async function
console.log("Before");
// request -> to make request to server -> and get html file
let url = 'https://www.espncricinfo.com/series/ipl-2020-21-1210595';
req(url, cb);
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
    // 
    let AllMatchPageUrlElem = fTool('a[data-hover="View All Results"]');
    let url = AllMatchPageUrlElem.attr("href");
    let fullUrl = "https://www.espncricinfo.com" + url;
    Allmatch.getScoreCardUrl(fullUrl);
    // console.log(AllScorecardElem.length);
}
console.log("After");
console.log("Req send");


// callback -> async architecture expose dev
// Object promises-> async architecture expose dev
// syntax sugar -> async await   