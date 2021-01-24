// alert("Hello");
// cheerio -> element select , jquery based -> dom change
$(document).ready(function () {
    // elements represtenation
    $(".grid .row .cell").on("click", function () {
        // console.log("cell was clicked");
        let clickedCell = this;
        let rid = $(clickedCell).attr("rid");
        let cid = $(clickedCell).attr("cid");
        let col = String.fromCharCode(Number(cid) + 65)

        let row = Number(rid) + 1;
        let address = col + row
        // console.log("")
        // value 
        $("#address").val(address);

        console.log("cell with address", address, "was clicked");
    });
    // events


})