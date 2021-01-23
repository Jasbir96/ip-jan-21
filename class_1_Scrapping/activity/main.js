// request module-> npm -> install
let req = require("request");
// cheerio -> pass html -> read -> parse-> tool
let ch = require("cheerio");
let path = require("path");
// io -> xlsx
let xlsx = require("xlsx");
// npm 
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
        // console.log(data);
        parseHTML(data);
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
    // elem>1? arrelem:elem;
    // text -> concatenates the text of all matching elmments
    // html -> first element html provide 
    // console.log(elems.length);
    // let fullPageHTML = "";
    // inning
    for (let i = 0; i < elems.length; i++) {
        // index -> wrap -> ch
        // let html = ch(elems[i]).html();
        // console.log(html)
        // fullPageHTML += html + "</br>"
        let InningElement = ch(elems[i]);
        // element -> 
        // text -> html -> string
        let teamName = InningElement.find("h5").text();
        // [Royal Challengers Bangalore , (20 overs maximum)]
        let stringArr = teamName.split("INNINGS")
        teamName = stringArr[0].trim();
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log("TeamName: ", teamName);
        // player deatils
        let playerRows = InningElement.find(".table.batsman tbody tr");
        // player
        for (let j = 0; j < playerRows.length; j++) {
            // some rows -> commentry 
            let cols = ch(playerRows[j]).find("td");
            let isAllowed = ch(cols[0]).hasClass("batsman-cell");
            if (isAllowed) {
                // console.log("valid row");
                let playerName = ch(cols[0]).text().trim();
                let runs = ch(cols[2]).text().trim();
                let balls = ch(cols[3]).text().trim();
                let fours = ch(cols[5]).text().trim();
                let sixes = ch(cols[6]).text().trim();
                let sr = ch(cols[7]).text().trim();
                console.log(`${playerName} played for ${teamName} and scored ${runs} runs in ${balls} balls with SR : ${sr}`)
                // data -> required folder ,required file data add 
                processPlayer(playerName, runs, balls, sixes, fours, sr, teamName);
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
function processPlayer(playerName, runs, balls, sixes, fours, sr, teamName) {
    // data -> 
    let playerObject = {
        playerName: playerName,
        runs: runs,
        balls: balls, sixes,
        fours: fours,
        sr: sr, teamName
    }
    // check -> task 
    // check -> folder exist ? (check file ? data append: file create data add):create folder -> create file data enter 
    let dirExist = checkExistence(teamName);
    if (dirExist) {

    } else {
        createFolder(teamName);
    }
    // file check 
    let playerFileName = path.join(__dirname, teamName, playerName + ".xlsx");
    // data exist 
    let fileExist = checkExistence(playerFileName);
    let playerEntries = [];
    if (fileExist) {
        // append
        // nodejs.dev
        // file system
        // let binarydata = fs.readFileSync(playerFileName);
        let JSONdata = excelReader(playerFileName, playerName)
        // console.log(binary)
        // parse -> JSON
        // playerEntries = JSON.parse(binarydata);
        playerEntries = JSONdata;
        playerEntries.push(playerObject);
        excelWriter(playerFileName, playerEntries, playerName);
        // /override
        // fs.writeFileSync(playerFileName, JSON.stringify(playerEntries));
    } else {
        // file create data add
        playerEntries.push(playerObject);
        excelWriter(playerFileName, playerEntries, playerName);
        // file exist -> content -> override -> 
        // fs.writeFileSync(playerFileName, JSON.stringify(playerEntries));
    }
}
function checkExistence(teamName) {
    return fs.existsSync(teamName);
}
function createFolder(teamName) {
    fs.mkdirSync(teamName);
}

function excelReader(filePath, name) {
    if (!fs.existsSync(filePath)) {
        return null;
    } else {
        // workbook => excel
        let wt = xlsx.readFile(filePath);
        // csk -> msd
        // get data from workbook
        let excelData = wt.Sheets[name];
        // convert excel format to json => array of obj
        let ans = xlsx.utils.sheet_to_json(excelData);
        // console.log(ans);
        return ans;
    }
}

function excelWriter(filePath, json, name) {
    // console.log(xlsx.readFile(filePath));
    let newWB = xlsx.utils.book_new();
    // console.log(json);
    let newWS = xlsx.utils.json_to_sheet(json);
    // msd.xlsx-> msd
    xlsx.utils.book_append_sheet(newWB, newWS, name);  //workbook name as param
    //   file => create , replace
    xlsx.writeFile(newWB, filePath);
}