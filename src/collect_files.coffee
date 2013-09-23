fs = require("fs")
path = require("path")

rootDir = process.cwd()
imageDir = path.join(rootDir, "images")

fs.exists imageDir, (exists) ->

  unless exists
    consol.log("Unable to find images directory. Please run this script from the project root!")
    return

  fs.readdir imageDir, (err, files) ->

    if err
      return

    fileObject = {}

    images = files
      .filter (file) ->
         (/.*\.(jpg|png|gif)/).test(file)
      .map (file) ->
          return path.join(".", "images", file)

    fs.writeFile path.join(imageDir, "images.json"), JSON.stringify(images), (err) ->
      if err
        throw err
