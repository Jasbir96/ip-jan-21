let private = "You can get My value but can't change it";
function getPrivate() {
    console.log("private", private);
}
function getPublic() {
    console.log("public", public);
}
const public = ["Hi i am public","Hello"];
console.log("hello");
module.exports = {
    fnprivate: getPrivate,
    pb: public,
    fnpublic: getPublic
}
