const fs = require("fs");
const path = require("path");
const process = require("node:process");

const filePath = path.resolve(__dirname, "text.txt");

const readStream = fs.createReadStream(filePath);

const handleError = () => {
  process.stdout.write("Error");
  readStream.destroy();
};

readStream.on("error", handleError).on("data", (chunck) => {
  process.stdout.write(chunck.toString());
});

module.exports = readStream;
