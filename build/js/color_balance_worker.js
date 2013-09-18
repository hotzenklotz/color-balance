(function() {
  self.addEventListener("message", function(evt) {
    var blue, clamp, createCumulativeHistogram, getBalancedColors, getMaxMin, green, lowerSaturation, maxBlue, maxGreen, maxRed, minBlue, minGreen, minRed, pixelData, red, upperSaturation;
    pixelData = evt.data;
    lowerSaturation = 1;
    upperSaturation = 2;
    pixelData = pixelData;
    red = new Int32Array(256);
    green = new Int32Array(256);
    blue = new Int32Array(256);
    minRed = 0;
    minGreen = 0;
    minBlue = 0;
    maxRed = 255 - 1;
    maxGreen = 255 - 1;
    maxBlue = 255 - 1;
    createCumulativeHistogram = function() {
      var i, _i, _j, _ref, _results;
      for (i = _i = 0, _ref = pixelData.length; _i <= _ref; i = _i += 4) {
        red[pixelData[i]]++;
        green[pixelData[i + 1]]++;
        blue[pixelData[i + 2]]++;
      }
      _results = [];
      for (i = _j = 1; _j <= 255; i = ++_j) {
        red[i] = red[i] + red[i - 1];
        green[i] = green[i] + green[i - 1];
        _results.push(blue[i] = blue[i] + blue[i - 1]);
      }
      return _results;
    };
    getMaxMin = function() {
      var lengthSingleChannel, threshold;
      lengthSingleChannel = Math.ceil(pixelData.length / 4);
      threshold = lengthSingleChannel * lowerSaturation / 100;
      while (red[minRed + 1] <= threshold) {
        minRed++;
      }
      while (green[minGreen + 1] <= threshold) {
        minGreen++;
      }
      while (blue[minBlue + 1] <= threshold) {
        minBlue++;
      }
      threshold = lengthSingleChannel * (1 - upperSaturation / 100);
      while (red[maxRed - 1] > threshold) {
        maxRed--;
      }
      while (green[maxGreen - 1] > threshold) {
        maxGreen--;
      }
      while (blue[maxBlue - 1] > threshold) {
        maxBlue--;
      }
      if (maxRed < 255 - 1) {
        maxRed++;
      }
      if (maxGreen < 255 - 1) {
        maxGreen++;
      }
      if (maxGreen < 255 - 1) {
        return maxGreen++;
      }
    };
    getBalancedColors = function() {
      var i, _i, _ref;
      red = green = blue = 0;
      for (i = _i = 0, _ref = pixelData.length; _i <= _ref; i = _i += 4) {
        red = pixelData[i];
        green = pixelData[i + 1];
        blue = pixelData[i + 2];
        red = clamp(minRed, maxRed, red);
        green = clamp(minGreen, maxGreen, green);
        blue = clamp(minBlue, maxBlue, blue);
        pixelData[i] = (red - minRed) * 255 / (maxRed - minRed);
        pixelData[i + 1] = (green - minGreen) * 255 / (maxGreen - minGreen);
        pixelData[i + 2] = (blue - minBlue) * 255 / (maxBlue - minBlue);
        pixelData[i + 3] = 255;
      }
      return pixelData;
    };
    clamp = function(min, max, value) {
      return Math.min(max, Math.max(min, value));
    };
    createCumulativeHistogram();
    getMaxMin();
    return self.postMessage(getBalancedColors());
  });

}).call(this);
