(function() {
  require(["./build/js/histogram"], function(Histogram) {
    var image, modifiedHistogramElement, modifiedImage, originalHistogramElement, originalImage;
    originalImage = document.getElementById("original-image");
    modifiedImage = document.getElementById("modified-image");
    originalHistogramElement = document.getElementById("original-histogram");
    modifiedHistogramElement = document.getElementById("modified-histogram");
    image = new Image();
    image.src = originalImage.src;
    return image.addEventListener("load", function() {
      var ColorBalanceWorker, canvas, ctx, height, histogram, imageData, pixelData, width,
        _this = this;
      width = image.width;
      height = image.height;
      canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, width, height);
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
        imageData.data.set(modifiedPixels);
        ctx.putImageData(imageData, 0, 0);
        return modifiedImage.src = canvas.toDataURL();
      });
      return ColorBalanceWorker.postMessage(pixelData);
    });
  });

}).call(this);
