// function statement;
// function a() {
//     console.log("I am A");
// }
// function a() {
//     console.log("I am Fake A");
// }
// a();
// a();
// functions are treated as first class cititzens
// function are treated as a variables
// function pass as a parameter
// function a(varName) {
//     console.log("Hello", varName());
// }
// a(function inner() {
//     console.log(" I am inner fn");
//     return 10;
// });
// // hositing -> mark variable-> undefined, function-> memory allocate
// // reference
// // let obj =a(10);
// // a(true);
// // a([1, 2, 3, 4]);
// // a({ name: "Jasbir" });

// function fn() {
//     while (true);
// }
// let a = 10 + fn();
// console.log(a);


// let a = [10,20,30];
// let b = a;
// console.log(b);
// fn expression
// // const fnRef = function () {
// //     console.log("I am fn expression");
// // }
// // fnRef();
// a();
let a = function () {
    console.log("I am A");
}
let a = function () {
    console.log("I am Fake A");
}
// IIFEE-> immediately invoked function expression

// (function iWillBeInvoked() {
//     console.log("I am IIFEE");
// })();