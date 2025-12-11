const fs = require("fs");

const a = 100;

setTimeout(() => console.log("Timer expired"), 0);

fs.readFile("./small.txt", "utf8", () => {
  console.log("File Reading CB");
});

setImmediate(() => console.log("setImmediate"));

console.log("Start");
