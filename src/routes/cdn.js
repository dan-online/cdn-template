const express = require("express");
const router = express.Router();
const fs = require("file-system");

router.get("/", (req, res) => {
  fs.readdir(__dirname + "/../public/files", function(err, files) {
    res.reply(200, files.length + " files");
  });
});

router.get("/:filename", (req, res) => {
  res.file(req.params.filename, req.query);
});

module.exports = router;
