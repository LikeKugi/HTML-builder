const fs = require("fs");
const path = require("path");

const sourcePath = path.resolve(__dirname, "styles");
const targetPath = path.resolve(__dirname, "project-dist", "bundle.css");

fs.unlink(targetPath, () => {});

const writeStream = fs.createWriteStream(targetPath, {
  flags: "a",
});

fs.readdir(sourcePath, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  else {
    for (let i = 0; i < files.length; i++) {
      const file = path.resolve(sourcePath, files[i].name);
      fs.stat(file, (err, stats) => {
        if (err) console.log(err);
        if (stats.isFile() && path.parse(file).ext === ".css") {
          console.log(file);
          const sourceFileStream = fs.createReadStream(file);
          sourceFileStream.pipe(writeStream);
        }
      });
    }
  }
});
