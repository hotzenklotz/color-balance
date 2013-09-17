(function() {
  require(["./build/js/histogram", "./build/js/cumulative_histogram"], function(Histogram, CumulativeHistogram) {
    var canvas, ctx, cumulativeHistogram, height, histogram, imageData, modifiedHistogram, modifiedHistogramElement, modifiedImage, modifiedPixels, originalHistogramElement, originalImage, pixelData, width;
    originalImage = document.getElementById("original-image");
    originalHistogramElement = document.getElementById("original-histogram");
    modifiedHistogramElement = document.getElementById("modified-histogram");
    modifiedImage = document.getElementById("modified-image");
    width = originalImage.width;
    height = originalImage.height;
    canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d");
    ctx.drawImage(originalImage, 0, 0, width, height);
    imageData = ctx.getImageData(0, 0, width, height);
    pixelData = imageData.data;
    histogram = new Histogram(pixelData);
    histogram.draw(originalHistogramElement);
    cumulativeHistogram = new CumulativeHistogram(pixelData);
    modifiedPixels = cumulativeHistogram.getBalancedColors();
    modifiedHistogram = new Histogram(modifiedPixels);
    modifiedHistogram.draw(modifiedHistogramElement);
    ctx.putImageData(imageData, 0, 0);
    modifiedImage.src = canvas.toDataURL();
    return modifiedImage.width = "500";
  });

}).call(this);
