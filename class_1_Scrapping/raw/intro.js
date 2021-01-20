// var declare
// default value -> undefined
// top -> bottom ,left->right
console.log("Hello IP");
/* primitve types-> undefined,numbers,string,boolean,null,symbol;*/
// dynamically typed
// statically typed 
// int a;
// let a;
// a = 10;
// a = 10.1;
// a = "string";
// a = 'single quote string';
// a = true;
// console.log(a);
// Non primitives-> types that are made of primitives
// function ,arrays, objects
function fn(varName) {
    console.log("Hello from fn", varName);
    // return "returned from fn";
}
// fn("Hello");
// fn(10);
// fn(["Hello", "How"])
// let rVal=fn(10);
// console.log(rVal);


// array is a collection of homogeneous data types
// array is a collection of anything
// js -> syntax -> java 
let arr = [
    1,
    1.1,
    true,
    null,
    "string",
    [1, 2, 3, 4, 5, 6],
    function fn() {
        console.log("Line 41", "Hello from arr");
        return "Hi from Arr";
    },
    {
        name: "Hello"
    }
];
// multipradigm-> oops,functional programming, procedural programming
// console.log(arr)
// console.log("arr [4]: ",arr[4]);
// console.log("arr [5][2]: ",arr[5][2]);
// console.log(arr.length);
// console.log(arr[6]);
// console.log("Line 53",arr[6]());
// console.log("out of bound", arr[95]);
// arr[14] = "updatedVal";
// console.log(arr)

// addLast-> push,removeLast-> pop
// addFirst -> unshift,removeFirst-> shift

// for (let i = 0; i < arr.length; i++) {
//     console.log(i, " : ", arr[i]);
// }
// it is  collection of key : value pair
let object = {
    name: "Steve",
    lastName: "Rogers",
    movies: ["Civil War", "Avengers"],
    isAvenger: true,
    address: {
        city: "Manhatten",
        state: "NewYork"
    }
}
// // get
// console.log(object);
// literally 
console.log(object.isAvenger);
// console.log(object.movies);
// console.log(object.movies[1]);
// console.log(object.address.state);
let prop = "lastName";
console.log(object[prop]);
// // get -> keyX-> undefined
// // set/update
// console.log("``````````````````````````````````");
object.isAvenger = false;
// object.movies.push("First Avenger");
object.friends = ["tony", "bruce", "peter"];
// // delete 
delete object.lastName;
// console.log(object);
for (let key in object) {
    console.log("Key :", key, " ", "value :", object[key]);
}
// console.log([{name:"Jasbir"}+""]);

function returnTrueIFNotArr(val) {
    if (Array.isArray(val)) {
        return val;
    } else {
        return true;
    }
}
