// alert("Hello");
// cheerio -> element select , jquery based -> dom change
const dialog = require('electron').remote.dialog;
const $ = require("jquery");
const fs = require("fs");
$(document).ready(function () {
    // elements representation
    // scroll,mousedown
    window.db = [];
    init();
    let elem;

    $("#font-family").on("change", function () {
        let fontFamily = $(this).val();
        let address = $("#address").val();
        let { rid, cid } = getRCidFromAddress(address);
        db[rid][cid].fontFamily = fontFamily;
        $(`.cell[rid=${rid}][cid=${cid}]`).css("font-family", fontFamily);
    })
    $("#font-size").on("change", function () {
        let fontSize = $(this).val();
        let address = $("#address").val();
        let { rid, cid } = getRCidFromAddress(address);
        db[rid][cid].fontSize = fontSize;
        $(`.cell[rid=${rid}][cid=${cid}]`).css("font-size", fontSize + "px");
    })

    $('#underline').on("click", function () {
        $(this).toggleClass('selected');
        let underline = $(this).hasClass('selected');
        let address = $("#address").val();

        let { rid, cid } = getRCidFromAddress(address);
        db[rid][cid].underline = underline;
        $(`.cell[rid=${rid}][cid=${cid}]`).css("text-decoration", underline ? "underline" : "none");
    })
    $('#italic').on("click", function () {
        $(this).toggleClass('selected');
        let address = $("#address").val();
        let italic = $(this).hasClass('selected');
        let { rid, cid } = getRCidFromAddress(address);
        db[rid][cid].italic = italic
        $(`.cell[rid=${rid}][cid=${cid}]`).css("font-style", italic ? "italic" : "normal");
    })
    $('#bold').on("click", function () {
        $(this).toggleClass('selected');
        let address = $("#address").val();
        let { rid, cid } = getRCidFromAddress(address);
        let bold = $(this).hasClass('selected');
        $(`.cell[rid=${rid}][cid=${cid}]`).css("font-weight", bold ? "bolder" : "normal");
        db[rid][cid].bold = bold;
    })
    $("#bg-color").on("change", function () {
        let bgColor = $(this).val();
        let address = $("#address").val();
        let { rid, cid } = getRCidFromAddress(address);
        db[rid][cid].bgColor = bgColor;
        $(`.cell[rid=${rid}][cid=${cid}]`).css("background-color", bgColor);
    })
    $("#text-color").on("change", function () {
        let color = $(this).val();
        let address = $("#address").val();
        let { rid, cid } = getRCidFromAddress(address);
        db[rid][cid].color = color;
        $(`.cell[rid=${rid}][cid=${cid}]`).css("color", color);
    })
    $('[halign]').on('click', function () {
        $('[halign]').removeClass('selected');
        $(this).addClass('selected');
        let address = $("#address").val();
        let { rid, cid } = getRCidFromAddress(address);
        let halign = $(this).attr('halign');
        db[rid][cid].halign = halign;
        $(`.cell[rid=${rid}][cid=${cid}]`).css("text-align", halign);
    })
    // **********to set excel state with the ui****************
    $(".grid .row .cell").on("click", function () {
        // console.log("cell was clicked");
        let clickedCell = this;
        let { rid, cid } = getRCIDFromCell(clickedCell);
        let address = getAddrFromRCid(rid, cid);
        $("#address").val(address);
        // formula bar formula change
        let cell = db[rid][cid];
        let formula = cell.formula;
        $("#formula").val(formula);
        $('#font-family').val(cell.fontFamily);
        $('#font-size').val(cell.fontSize);
        if (cell.bold) {
            $('#bold').addClass('selected');
        } else {
            $('#bold').removeClass('selected');
        }

        if (cell.underline) {
            $('#underline').addClass('selected');
        } else {
            $('#underline').removeClass('selected');
        }

        if (cell.italic) {
            $('#italic').addClass('selected');
        } else {
            $('#italic').removeClass('selected');
        }

        $('#bg-color').val(cell.bgColor);
        $('#text-color').val(cell.textColor);
        $('[halign]').removeClass('selected');
        $('[halign=' + cell.halign + ']').addClass('selected');
        // console.log("cell with address", address, "was clicked");
    });
    // debouncing of scroll
    function debounce(callback, wait, immediate = false) {
        let timeout = null
        return function () {
            const callNow = immediate && !timeout
            const next = () => callback.apply(this, arguments)

            clearTimeout(timeout)
            timeout = setTimeout(next, wait)

            if (callNow) {
                next()
            }
        }
    }
    function cb() {
        let scrollX = $(elem).scrollLeft();
        let scrollY = $(elem).scrollTop();;
        $('#top-left-box, #top-row').css('top', scrollY + 'px');
        $('#top-left-box, #left-col').css('left', scrollX + 'px');
    }
    $('#main').on('scroll', function () {
        elem = this;
        const handleScroll = debounce(cb, 100, true);

        handleScroll(cb, 100, true);

    })
    //*********************Formula******************************
    $("#formula").on("blur", function () {
        let formulaElem = $(this);
        if (formulaElem.val() == "") {
            return;
        }
        let formula = $("#formula").val();
        let address = $("#address").val();
        let { rid, cid } = getRCidFromAddress(address);
        // update formula 

        // if (isFormulaValid(rid, cid, address, formula) == false) {
        //     return;
        // }
        // if (db[rid][cid].formula && isFormulaValid(rid, cid, address, formula)) {
        //     deleteFormula(db[rid][cid].formula, rid, cid);
        // }
        if (db[rid][cid].formula ) {
            deleteFormula(db[rid][cid].formula, rid, cid);
        }
        // formula set
        // db update formula
        setFormulaInDB(rid, cid, formula, address);
        // formula evaluate
        // -> formula -> value get 
        let value = evaluateFormula(formula)
        // console.log(value);
        // UI update
        updateUI(value, rid, cid);
    })
    // update UI ->Update db 
    $(".grid .row .cell").on("blur", function () {
        // console.log("cell was clicked");
        let clickedCell = this;
        let { rid, cid } = getRCIDFromCell(clickedCell);
        if (db[rid][cid].val == $(clickedCell).text()) {
            return;
        }
        if (db[rid][cid].formula) {
            deleteFormula(db[rid][cid].formula, rid, cid);
        }
        let value = $(clickedCell).text();
        updateUI(value, rid, cid);
        // console.log("cell with address", address, "was blurred");
    });
    // helper fns
    function setFormulaInDB(rid, cid, formula, address) {
        // set code
        db[rid][cid].formula = formula;
        // dependency add/update-> go to parent then get added yourself to there children array
        let formulaArr = formula.split(" ");

        for (let i = 0; i < formulaArr.length; i++) {
            let fComp = formulaArr[i];
            if (isGridCell(fComp)) {
                //get yourself added 
                let pObj = getRCidFromAddress(fComp);
                db[pObj.rid][pObj.cid].children.push(address);
                db[rid][cid].parent.push(fComp);
            }
        }
    }
    // XSS
    function evaluateFormula(formula) {
        // 10 ,20=> 30
        // ( A1 + A2 )
        let formulaArr = formula.split(" ");
        // [(, A1, +, A2,)]
        // 
        for (let i = 0; i < formulaArr.length; i++) {
            let fComp = formulaArr[i];
            if (isGridCell(fComp)) {
                // replace logic
                // console.log(fComp);
                let { rid, cid } = getRCidFromAddress(fComp);
                let value = db[rid][cid].val;
                formula = formula.replace(fComp, value);
                // console.log(formula);
            }
        }
        // ( 10 + 20 )
        // stack infix evaluation
        return eval(formula);
    }
    function isGridCell(comp) {
        let ascii = comp.charCodeAt(0);

        return (ascii >= 65 && ascii <= 90);
    }
    function updateUI(value, rid, cid) {
        // ui change 
        $(`.cell[rid=${rid}][cid=${cid}]`).text(value);
        // db value update 
        db[rid][cid].val = value;
        db[rid][cid].isEmpty = false;
        // dependency use -> loop
        let childrens = db[rid][cid].children;
        for (let i = 0; i < childrens.length; i++) {
            let childAdd = childrens[i];
            let childRC = getRCidFromAddress(childAdd);
            let child = db[childRC.rid][childRC.cid];
            let nval = evaluateFormula(child.formula);
            updateUI(nval, childRC.rid, childRC.cid);
        }


    }
    function deleteFormula(formula, rid, cid) {
        let formulaArr = formula.split(" ");
        let address = getAddrFromRCid(rid, cid);
        // get yourself removed your parent children 
        for (let i = 0; i < formulaArr.length; i++) {
            let fComp = formulaArr[i];
            if (isGridCell(fComp)) {
                //get yourself added 
                let pObj = getRCidFromAddress(fComp);
                let pChildrenArr = db[pObj.rid][pObj.cid].children;
                let filteredPChildArr = pChildrenArr.filter(test);
                function test(elem) {
                    return elem !== address;
                }
                db[pObj.rid][pObj.cid].children = filteredPChildArr;
            }
        }

    }
    function getAddrFromRCid(rid, cid) {
        let col = String.fromCharCode(Number(cid) + 65)
        let row = Number(rid) + 1;
        let address = col + row;
        return address;
    }
    function getRCidFromAddress(address) {
        // "B2"-> [1][1]
        console.log("Address", address)
        let cid = Number(address.charCodeAt(0)) - 65;
        let rid = Number(address.slice(1)) - 1;
        return {
            cid,
            rid
        }


    }
    function getRCIDFromCell(clickedCell) {
        let rid = $(clickedCell).attr("rid");
        let cid = $(clickedCell).attr("cid");
        return { rid: rid, cid: cid }

    }
    // ***************New Open Save*****************
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
    //helper functions 
    function init() {
        let Allrows = $(".grid .row");
        for (let i = 0; i < Allrows.length; i++) {
            let cols = $(Allrows[i]).find(".cell");
            let colsArr = [];
            for (let j = 0; j < cols.length; j++) {
                let cellObject = {
                    val: 0,
                    formula: "",
                    isEmpty: true,
                    children: [],
                    parent: [],
                    fontFamily: 'Arial',
                    fontSize: 12,
                    bold: false,
                    underline: false,
                    italic: false,
                    bgColor: '#FFFFFF',
                    textColor: '#000000',
                    halign: 'left'
                }
                let cell = $(`.cell[rid=${i}][cid=${j}]`)
                cell.text("");
                cell.css('font-family', cellObject.fontFamily);
                cell.css("font-size", cellObject.fontSize + 'px');
                cell.css("font-weight", cellObject.bold ? "bolder" : "normal");
                cell.css("text-decoration", cellObject.underline ? "underline" : "none");
                cell.css("font-style", cellObject.italic ? "italic" : "normal");
                cell.css("background-color", cellObject.bgColor);
                cell.css("color", cellObject.textColor);
                cell.css("text-align", cellObject.halign);


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
                let cell = $(`.cell[rid=${i}][cid=${j}]`)
                cell.text(isEmpty ? val : "");
                cell.css('font-family', cellObject.fontFamily);
                cell.css("font-size", cellObject.fontSize + 'px');
                cell.css("font-weight", cellObject.bold ? "bolder" : "normal");
                cell.css("text-decoration", cellObject.underline ? "underline" : "none");
                cell.css("font-style", cellObject.italic ? "italic" : "normal");
                cell.css("background-color", cellObject.bgColor);
                cell.css("color", cellObject.textColor);
                cell.css("text-align", cellObject.halign);

            }
        }
    }
})