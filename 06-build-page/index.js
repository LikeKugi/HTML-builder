const fs = require("fs");
const path = require("path");

const sourceAssets = path.resolve(__dirname, "assets");
const sourceStyles = path.resolve(__dirname, "styles");
const sourceTemplate = path.resolve(__dirname, "template.html");
const sourceComponents = path.resolve(__dirname, "components");

const projectDist = path.resolve(__dirname, "project-dist");

const projectAssets = path.resolve(projectDist, "assets");
const projectStyles = path.resolve(projectDist, "style.css");
const projectIndex = path.resolve(projectDist, "index.html");

function clearTarget(targetPath) {
  if (fs.existsSync(targetPath)) {
    fs.rmdir(targetPath, () => {});
  }
  fs.mkdir(targetPath, () => {});
}

function removeFile(targetPath) {
  fs.unlink(targetPath, () => {});
}

function copyFolder(sourcePath, targetPath) {
  clearTarget(targetPath);
  fs.readdir(sourcePath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err);
      return;
    }
    for (let i = 0; i < files.length; i++) {
      const sourceFile = path.resolve(sourcePath, files[i].name);
      const targetFile = path.resolve(targetPath, files[i].name);
      fs.stat(sourceFile, (err, stats) => {
        if (err) {
          console.log(err);
          return;
        }
        if (stats.isFile()) {
          const readStream = fs.createReadStream(sourceFile);
          const writeStream = fs.createWriteStream(targetFile);
          readStream.pipe(writeStream);
        } else {
          copyFolder(sourceFile, targetFile);
        }
      });
    }
  });
}

function mergeStyles(sourcePath, targetPath) {
  removeFile(targetPath);
  const writeStream = fs.createWriteStream(targetPath, {
    flags: "a",
  });
  fs.readdir(sourcePath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err);
      return;
    }
    for (let i = 0; i < files.length; i++) {
      const file = path.resolve(sourcePath, files[i].name);
      fs.stat(file, (err, stats) => {
        if (err) {
          console.log(err);
          return;
        }
        if (stats.isFile() && path.parse(file).ext === ".css") {
          const sourceFileStream = fs.createReadStream(file);
          sourceFileStream.pipe(writeStream);
        }
      });
    }
  });
}

function createMapOfFolder(directory) {
  const filesMap = new Map();
  fs.readdir(directory, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err);
      return filesMap;
    }
    for (let i = 0; i < files.length; i++) {
      const file = path.resolve(directory, files[i].name);
      fs.stat(file, (err, stats) => {
        if (err) {
          console.log(err);
          return filesMap;
        }
        if (stats.isFile() && path.parse(file).ext === ".html") {
          filesMap.set(path.parse(file).name, file);
          console.log(path.parse(file).name, file);
          console.log(filesMap);
        }
      });
    }
    console.log("end for loop");
  });
  console.log("files map in map function: ");
  console.log(filesMap);
  return filesMap;
}

async function readFile(filePath) {
  const data = await fs.promises.readFile(filePath, "binary");
  return data;
}

async function createIndexPage(sourceTemplate, sourceComponents, targetPath) {
  let contentTemplate = await readFile(sourceTemplate);
  const patternTemplate = /{{\s*([a-z0-9\-_]+)\s*}}/i;
  let templates = contentTemplate.match(patternTemplate);
  while (templates && templates[0]) {
    const templateSource = path.resolve(
      sourceComponents,
      `${templates[1]}.html`
    );
    const templateData = await readFile(templateSource);
    contentTemplate = contentTemplate.replace(templates[0], templateData);
    templates = contentTemplate.match(patternTemplate);
  }
  const writeStream = fs.createWriteStream(targetPath);
  writeStream.write(contentTemplate);
}

function main() {
  clearTarget(projectDist);
  copyFolder(sourceAssets, projectAssets);
  mergeStyles(sourceStyles, projectStyles);
  createIndexPage(sourceTemplate, sourceComponents, projectIndex);
}

main();
