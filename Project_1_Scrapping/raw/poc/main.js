// request module-> npm -> install
let req = require("request");
// cheerio -> pass html -> read -> parse-> tool
let ch = require("cheerio");
// to do crud
const fs = require("fs");
// program bottleNeck 
// expose -> async function
console.log("Before");
// request -> to make request to server -> and get html file
req('https://www.espncricinfo.com/series/ipl-2020-21-1210595/royal-challengers-bangalore-vs-sunrisers-hyderabad-eliminator-1237178/full-scorecard', cb);
console.log("After");
console.log("Req send");

function cb(error, response, data) {
    // resoure not  found
    if (response.statusCode == 404) {
        console.log("Page not found");
        // resource found
    } else if (response.statusCode == 200) {
        console.log(data);
        // parseHTML(data);
    } else {
        console.log(err);
    }
}

function parseHTML(data) {
    // parse 
    let fTool = ch.load(data);
    // let venueElem = fTool(".match-info.match-info-MATCH .description");
    // console.log("venue", venueElem.text());
    // search in whole html
    let elems = fTool(".Collapsible");
    // text -> concatenates the text of all matching elmments
    // html -> first element html provide 
    // console.log(elems.length);

    // let fullPageHTML = "";
    for (let i = 0; i < elems.length; i++) {
        // index -> wrap -> ch
        // let html = ch(elems[i]).html();
        // console.log(html)
        // fullPageHTML += html + "</br>"
        let InningElement = ch(elems[i]);
        // element -> 
        let teamName = InningElement.find("h5").text();
        let stringArr = teamName.split("INNINGS");
        teamName = stringArr[0];
        let playerRows = InningElement.find(".table.batsman tbody tr");

        for (let j = 0; j < playerRows.length; j++) {
            let colLength = ch(playerRows[j]).find("td").length;
            if (colLength > 1) {
                console.log("valid row");
                console.log(ch(playerRows[j]).text());
            }
        }
        console.log("``````````````````````````````````````````");
        // console.log(playerRows.length);
        // console.log("Team ", i + 1, teamName);
        // teamName
        // Data
        // Opponent  name
        // venue
    }
    // fs.writeFileSync("table.html", fullPageHTML);
    // console.log("obj",venueElem.html());
    // fs.writeFileSync("file.html", data);
    // console.log("File saved");

}