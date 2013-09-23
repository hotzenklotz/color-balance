(function() {
  var fs, imageDir, path, rootDir;

  fs = require("fs");

  path = require("path");

  rootDir = process.cwd();

  imageDir = path.join(rootDir, "images");

  fs.exists(imageDir, function(exists) {
    if (!exists) {
      consol.log("Unable to find images directory. Please run this script from the project root!");
      return;
    }
    return fs.readdir(imageDir, function(err, files) {
      var fileObject, images;
      if (err) {
        return;
      }
      fileObject = {};
      images = files.filter(function(file) {
        return /.*\.(jpg|png|gif)/.test(file);
      }).map(function(file) {
        return path.join(".", "images", file);
      });
      return fs.writeFile(path.join(imageDir, "images.json"), JSON.stringify(images), function(err) {
        if (err) {
          throw err;
        }
      });
    });
  });

}).call(this);
