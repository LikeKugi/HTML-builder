const fs = require("fs");
const path = require("path");
const { stdout } = require("process");

const dirPath = path.resolve(__dirname, "secret-folder");

function reading(directory) {
  fs.readdir(directory, { withFileTypes: true }, (err, files) => {
    stdout.write(`\n${directory} files:\n`);
    if (err) console.log(err);
    else {
      for (let i = 0; i < files.length; i++) {
        const file = path.resolve(directory, files[i].name);
        fs.stat(file, (err, stats) => {
          if (err) console.log(err);
          if (stats.isFile()) {
            stdout.write(
              path.parse(file).name +
                "-" +
                path.parse(file).ext +
                "-" +
                stats.size.toString() +
                "\n"
            );
          }
        });
      }
    }
  });
}

reading(dirPath);
