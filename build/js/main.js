(function() {
  require(["./build/js/histogram"], function(Histogram) {
    var ColorBalanceWorker, canvas, ctx, height, histogram, imageData, modifiedHistogramElement, modifiedImage, originalHistogramElement, originalImage, pixelData, width;
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
    ColorBalanceWorker = new Worker("./build/js/color_balance_worker.js");
    ColorBalanceWorker.addEventListener("message", function(evt) {
      var modifiedHistogram, modifiedPixels;
      modifiedPixels = evt.data;
      modifiedHistogram = new Histogram(modifiedPixels);
      modifiedHistogram.draw(modifiedHistogramElement);
      imageData.data = modifiedPixels;
      ctx.putImageData(imageData, 0, 0);
      modifiedImage.src = canvas.toDataURL();
      return modifiedImage.width = "500";
    });
    return ColorBalanceWorker.postMessage(pixelData);
  });

}).call(this);
