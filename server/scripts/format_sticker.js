const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const STICKERS_PATH = path.join(path.resolve(), "/resources/stickers");

fs.readdir(STICKERS_PATH, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    fs.rename(
      path.join(STICKERS_PATH, file),
      path.join(STICKERS_PATH, `${uuidv4()}.webp`),
      (err) => {
        if (err) throw err;
      }
    );
  });
});
