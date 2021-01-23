let fs = require("fs");
console.log("Before");
// async -> start , finish -> later
fs.readFile("f1.txt", function (err, data) {
    if (err) {
        console.log("err", err);
    } else {
        console.log("file read completed");
        console.log("Data :" + data);
        // 2 
        
    }
});
console.log("after");
for (let i = 1; i <= 10; i++) {
    console.log("number is ", i);
}
while (true);