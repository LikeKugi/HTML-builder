const fs = require("fs");
const path = require("path");

const dirPath = path.resolve(__dirname, "files");
const targetPath = path.resolve(__dirname, "files-copy");

if (fs.existsSync(targetPath)) {
  fs.rmdir(targetPath, () => {});
}
fs.mkdir(targetPath, () => {});

function reading(directory, target) {
  fs.readdir(directory, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);
    else {
      for (let i = 0; i < files.length; i++) {
        const sourceFile = path.resolve(directory, files[i].name);
        const targetFile = path.resolve(target, files[i].name);
        fs.stat(sourceFile, (err, stats) => {
          if (err) console.log(err);
          if (stats.isFile()) {
            const readStream = fs.createReadStream(sourceFile);
            const writeStream = fs.createWriteStream(targetFile);
            readStream.pipe(writeStream);
          } else {
            fs.mkdir(targetFile, () => {});
            reading(sourceFile, targetFile);
          }
        });
      }
    }
  });
}

reading(dirPath, targetPath);
