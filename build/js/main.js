(function() {
  require(["./build/js/histogram", "./build/js/job_queue", "./build/js/bower_components/promise/promise"], function(Histogram, JobQueue, Promise) {
    var ajax, appendImageAndCanvasGroup, jobQueue, processImage;
    jobQueue = new JobQueue();
    ajax = new XMLHttpRequest();
    ajax.open("GET", "./images/images.json", true);
    ajax.responseType = "json";
    ajax.addEventListener("load", function(evt) {
      var imageSrc, images, _i, _len, _results;
      images = ajax.response;
      _results = [];
      for (_i = 0, _len = images.length; _i < _len; _i++) {
        imageSrc = images[_i];
        _results.push(jobQueue.enqueue(processImage, imageSrc));
      }
      return _results;
    });
    ajax.send();
    processImage = function(imageSrc) {
      var image, promise;
      promise = new window.Promise();
      image = new Image();
      image.src = imageSrc;
      image.addEventListener("load", function() {
        var ColorBalanceWorker, canvas, ctx, elements, height, histogram, imageData, pixelData, width,
          _this = this;
        width = image.width;
        height = image.height;
        elements = appendImageAndCanvasGroup(width, height);
        elements.originalImage.src = image.src;
        canvas = elements.modifiedImage;
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, width, height);
        imageData = ctx.getImageData(0, 0, width, height);
        pixelData = imageData.data;
        histogram = new Histogram(pixelData);
        histogram.draw(elements.originalHistogram);
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
    return appendImageAndCanvasGroup = function(width, height) {
      var body, div, histogram, image, modifiedHistogram, modifiedImage;
      body = document.body;
      div = document.createElement("div");
      body.appendChild(div);
      image = document.createElement("img");
      histogram = document.createElement("canvas");
      histogram.id = "histogram";
      histogram.width = width;
      histogram.height = height;
      div.appendChild(image);
      div.appendChild(histogram);
      div = document.createElement("div");
      body.appendChild(div);
      modifiedImage = document.createElement("canvas");
      modifiedHistogram = document.createElement("canvas");
      modifiedHistogram.id = "histogram";
      modifiedHistogram.width = width;
      modifiedHistogram.height = height;
      div.appendChild(modifiedImage);
      div.appendChild(modifiedHistogram);
      return {
        "originalImage": image,
        "originalHistogram": histogram,
        "modifiedImage": modifiedImage,
        "modifiedHistogram": modifiedHistogram
      };
    };
  });

}).call(this);
