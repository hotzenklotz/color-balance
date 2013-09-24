(function() {
  require(["./build/js/histogram", "./build/js/job_queue", "./build/js/bower_components/promise/promise"], function(Histogram, JobQueue, Promise) {
    var appendImageAndCanvasGroup, processImage;
    processImage = function(imageSrc, width) {
      var image, promise;
      promise = new window.Promise();
      image = new Image();
      image.src = imageSrc;
      image.addEventListener("load", function() {
        var ColorBalanceWorker, aspectRatio, canvas, ctx, elements, height, histogram, imageData, originalImage, pixelData, preview_pixelData,
          _this = this;
        aspectRatio = image.width / image.height;
        height = width / aspectRatio;
        elements = appendImageAndCanvasGroup(image.width, image.height, width + " x " + height);
        originalImage = elements.originalImage;
        originalImage.width = width;
        originalImage.height = height;
        ctx = originalImage.getContext("2d");
        ctx.drawImage(image, 0, 0, width, height);
        preview_pixelData = ctx.getImageData(0, 0, width, height).data;
        histogram = new Histogram(preview_pixelData);
        histogram.draw(elements.originalHistogram);
        canvas = elements.modifiedImage;
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, width, height);
        imageData = ctx.getImageData(0, 0, width, height);
        pixelData = imageData.data;
        ColorBalanceWorker = new Worker("./build/js/color_balance_worker.js");
        ColorBalanceWorker.addEventListener("message", function(evt) {
          var modifiedHistogram, modifiedPixels;
          modifiedPixels = evt.data;
          modifiedHistogram = new Histogram(modifiedPixels);
          modifiedHistogram.draw(elements.modifiedHistogram);
          imageData.data.set(modifiedPixels);
          ctx.putImageData(imageData, 0, 0, 0, 0, width, height);
          return promise.fulfil(true);
        });
        return ColorBalanceWorker.postMessage(pixelData);
      });
      return promise;
    };
    appendImageAndCanvasGroup = function(width, height, text) {
      var container, div, histogram, image, modifiedHistogram, modifiedImage, span;
      container = document.getElementById("container");
      div = document.createElement("div");
      container.appendChild(div);
      div.textContent = text;
      div = document.createElement("div");
      container.appendChild(div);
      span = document.createElement("span");
      image = document.createElement("canvas");
      span.appendChild(image);
      div.appendChild(span);
      modifiedImage = document.createElement("canvas");
      div.appendChild(modifiedImage);
      div = document.createElement("div");
      container.appendChild(div);
      histogram = document.createElement("canvas");
      histogram.id = "histogram";
      histogram.width = width;
      histogram.height = height;
      div.appendChild(histogram);
      modifiedHistogram = document.createElement("canvas");
      modifiedHistogram.id = "histogram";
      modifiedHistogram.width = width;
      modifiedHistogram.height = height;
      div.appendChild(modifiedHistogram);
      return {
        "originalImage": image,
        "originalHistogram": histogram,
        "modifiedImage": modifiedImage,
        "modifiedHistogram": modifiedHistogram
      };
    };
    processImage("images/IMG_0002.jpg", 100);
    processImage("images/IMG_0002.jpg", 200);
    processImage("images/IMG_0002.jpg", 300);
    processImage("images/IMG_0002.jpg", 400);
    return processImage("images/IMG_0002.jpg", 500);
  });

}).call(this);
