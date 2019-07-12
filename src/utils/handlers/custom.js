const fs = require("file-system");
const Jimp = require("jimp");
const path = require("path");

Object.prototype.reply = function(code, message) {
  if (!this.status) throw new Error("This function is only for express!");
  this.status(code)
    .json({ status: code, err: message })
    .end();
};

Object.prototype.file = function(name, query) {
  if (!res.status) throw new Error("This function is only for express!"); // stop other object use

  const res = this; //Grab the result

  const location = path.resolve(__dirname + "/../../public/files/" + name); //Get the path

  fs.exists(location, function(exists) {
    if (!exists) return res.reply(404, "File not found!"); //Check for file

    const format = name.split(".")[1]; // Get the file type

    if (!/(gif|jpg|jpeg|tiff|png)$/i.test(format))
      return res.sendFile(location); // if its not an image just send it

    Jimp.read(location, (err, process) => {
      // get the width in query or use original file dimensions
      const width = parseInt(query.w) || process.bitmap.width;
      const height = parseInt(query.h) || process.bitmap.height;
      const quality = parseInt(query.q) || 100;
      try {
        process.quality(quality).resize(width, height);
        process.getBuffer(Jimp.MIME_JPEG, function(err, buffer) {
          res.set("Content-Type", Jimp.MIME_JPEG);
          res.send(buffer);
        });
      } catch (err) {
        res.reply(500, err.message);
      }
    });
  });
};
