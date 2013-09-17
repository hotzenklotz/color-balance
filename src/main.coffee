# require
#   baseUrl : "build/js"

require ["/build/js/histogram", "/build/js/cumulative_histogram"], (Histogram, CumulativeHistogram) ->

  originalImage = document.getElementById("original-image")
  originalHistogramElement = document.getElementById("original-histogram")
  modifiedHistogramElement = document.getElementById("modified-histogram")
  modifiedImage = document.getElementById("modified-image")

  width = originalImage.width
  height = originalImage.height

  canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  ctx = canvas.getContext("2d")
  ctx.drawImage(originalImage, 0, 0, width, height)
  # ctx.fillRect(0,0,10,10)
  # ctx.fill()
  imageData = ctx.getImageData(0, 0, width, height)
  pixelData = imageData.data

  #draw the RGB histogram for visual reference
  histogram = new Histogram(pixelData)
  histogram.draw(originalHistogramElement)

  cumulativeHistogram = new CumulativeHistogram(pixelData)
  modifiedPixels = cumulativeHistogram.getBalancedColors()

  modifiedHistogram = new Histogram(modifiedPixels)
  modifiedHistogram.draw(modifiedHistogramElement)

  # imageData.data = modifiedPixels
  ctx.putImageData(imageData, 0, 0)
  modifiedImage.src = canvas.toDataURL()
  modifiedImage.width = "500"


