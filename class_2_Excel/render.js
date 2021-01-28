// alert("Hello");
// cheerio -> element select , jquery based -> dom change
const dialog = require('electron').remote.dialog;
const $ = require("jquery");
const fs = require("fs");
$(document).ready(function () {
    // elements represtenation
    // scroll,mousedown
    window.db = [];
    init();

    $(".grid .row .cell").on("click", function () {
        // console.log("cell was clicked");
        let clickedCell = this;

        let { rid, cid } = getRCIDFromCell(clickedCell);
        let col = String.fromCharCode(Number(cid) + 65)
        let row = Number(rid) + 1;
        let address = col + row;
        // console.log("")
        // value 
        // input -> val get value , set
        // change  
        $("#address").val(address);
        // formula bar formula change
        let cellObject = db[rid][cid];
        let isEmpty = cellObject.isEmpty;
        let formula = cellObject.formula;
        let val = cellObject.val;
        $("#formula").val(formula);
        // $(`.cell[rid=${rid}][cid=${cid}]`).text(isEmpty ? val : "");
        // value change`
        console.log("cell with address", address, "was clicked");
    });
    $("#formula").on("blur", function () {
        let formulaElem = $(this);
        if (formulaElem.val() == "") {
            return;
        }
        // formula set
    })
    // 

    // update UI ->Update db 
    $(".grid .row .cell").on("blur", function () {
        // console.log("cell was clicked");
        let clickedCell = this;
        let { rid, cid } = getRCIDFromCell(clickedCell);
        let col = String.fromCharCode(Number(cid) + 65)
        let row = Number(rid) + 1;
        let address = col + row;
        db[rid][cid].val = $(this).text();
        db[rid][cid].isEmpty = false;


        // console.log("cell with address", address, "was blurred");
    });
    $("#new").on("click", init);
    $("#save").on("click", function () {
        // dialog box new file option 
        let sfilepath = dialog.showSaveDialogSync()
        // console.log(sdg.filePath)
        let data = JSON.stringify(db);
        fs.writeFileSync(sfilepath, data);

    })
    $("#open").on("click", function () {
        // open dialogBox
        let fileArr = dialog.showOpenDialogSync();
        console.log("FileArr", fileArr)
        // file data read 
        let bContent = fs.readFileSync(fileArr[0]);
        db = JSON.parse(bContent);
        console.log(db);
        // /Set data on the ui
        setUI(db);

    })
    // events
    // initially work 

    function getRCIDFromCell(clickedCell) {
        let rid = $(clickedCell).attr("rid");
        let cid = $(clickedCell).attr("cid");
        return { rid: rid, cid: cid }

    }
    function init() {
        let Allrows = $(".grid .row");
        for (let i = 0; i < Allrows.length; i++) {
            let cols = $(Allrows[i]).find(".cell");
            let colsArr = [];
            for (let j = 0; j < cols.length; j++) {
                let cellObject = {
                    val: 0,
                    formula: "",
                    isEmpty: true
                }
                $(`.cell[rid=${i}][cid=${j}]`).text("");
                colsArr.push(cellObject);
            }
            db.push(colsArr);
        }
        console.log(db);
    }
    function setUI(db) {
        let Allrows = $(".grid .row");
        for (let i = 0; i < Allrows.length; i++) {
            let cols = $(Allrows[i]).find(".cell");
            for (let j = 0; j < cols.length; j++) {
                let val = db[i][j].val;
                let isEmpty = db[i][j].isEmpty;
                $(`.cell[rid=${i}][cid=${j}]`).text(isEmpty ? val : "");

            }
        }
    }



})