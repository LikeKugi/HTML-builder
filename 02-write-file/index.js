const fs = require("fs");
const path = require("path");
const { stdin, stdout } = require("process");
const readline = require("readline");

const filePath = path.resolve(__dirname, "text.txt");

const writeStream = fs.createWriteStream(filePath, {
  flags: "a",
});

const dialogue = readline.createInterface({
  input: stdin,
  output: writeStream,
});

const greeting = "Welcome! Write smth: ";
const farewell = "Goodbye!";
const nextLine = 'Smth more or "exit" to stop: ';

const handleError = (err) => {
  if (err) stdout.write(err);
};

const onExit = () => {
  stdout.write(farewell);
  dialogue.close();
  process.exit(0);
};

fs.writeFile(filePath, "", handleError);

stdout.write(greeting);

dialogue.on("error", handleError).on("line", (data) => {
  if (data.toString().trim() === "exit") onExit();
  writeStream.write(data.toString() + "\n");
  stdout.write(nextLine);
});

process.on("SIGINT", () => onExit());
